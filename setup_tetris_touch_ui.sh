#!/bin/bash
set -e

cd ~/timewalk-tokyo
mkdir -p app/tetris

cat > app/tetris/page.tsx <<'EOT'
'use client';

import { useEffect, useRef, useState } from 'react';

const W = 10;
const H = 20;
const SIZE = 28;
const SWIPE = 24;

const BLOCKS = [
  { c: '#22d3ee', s: [[1, 1, 1, 1]] },
  { c: '#facc15', s: [[1, 1], [1, 1]] },
  { c: '#a78bfa', s: [[0, 1, 0], [1, 1, 1]] },
  { c: '#fb923c', s: [[1, 0, 0], [1, 1, 1]] },
  { c: '#60a5fa', s: [[0, 0, 1], [1, 1, 1]] },
  { c: '#4ade80', s: [[1, 1, 0], [0, 1, 1]] },
  { c: '#f87171', s: [[0, 1, 1], [1, 1, 0]] },
];

type Piece = { x: number; y: number; s: number[][]; c: string };

type Board = string[][];

function emptyBoard(): Board {
  return Array.from({ length: H }, () => Array(W).fill(''));
}

function newPiece(): Piece {
  const b = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  return { x: 3, y: 0, s: b.s.map(r => [...r]), c: b.c };
}

function rotateRight(s: number[][]) {
  return s[0].map((_, i) => s.map(r => r[i]).reverse());
}

function rotateLeft(s: number[][]) {
  return rotateRight(rotateRight(rotateRight(s)));
}

function can(board: Board, p: Piece, dx = 0, dy = 0, ns = p.s) {
  for (let y = 0; y < ns.length; y++) {
    for (let x = 0; x < ns[y].length; x++) {
      if (!ns[y][x]) continue;
      const nx = p.x + x + dx;
      const ny = p.y + y + dy;
      if (nx < 0 || nx >= W || ny >= H) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function merge(board: Board, p: Piece) {
  const b = board.map(r => [...r]);
  p.s.forEach((row, y) => {
    row.forEach((v, x) => {
      if (v && p.y + y >= 0) b[p.y + y][p.x + x] = p.c;
    });
  });
  return b;
}

export default function TetrisPage() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const touch = useRef({ x: 0, y: 0, moved: false });

  const [board, setBoard] = useState<Board>(emptyBoard);
  const [piece, setPiece] = useState<Piece>(newPiece);
  const [next, setNext] = useState<Piece>(newPiece);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [over, setOver] = useState(false);
  const [pause, setPause] = useState(false);
  const [message, setMessage] = useState('タップで回転 / スワイプで移動');

  const br = useRef(board);
  const pr = useRef(piece);
  const nr = useRef(next);
  const overRef = useRef(over);
  const pauseRef = useRef(pause);

  useEffect(() => {
    br.current = board;
    pr.current = piece;
    nr.current = next;
    overRef.current = over;
    pauseRef.current = pause;
  }, [board, piece, next, over, pause]);

  function buzz(ms = 18) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
  }

  function reset() {
    setBoard(emptyBoard());
    setPiece(newPiece());
    setNext(newPiece());
    setScore(0);
    setLines(0);
    setOver(false);
    setPause(false);
    setMessage('タップで回転 / スワイプで移動');
  }

  function lock() {
    const merged = merge(br.current, pr.current);
    const remain = merged.filter(r => r.some(v => !v));
    const cleared = H - remain.length;
    const fresh = [...Array.from({ length: cleared }, () => Array(W).fill('')), ...remain];

    setBoard(fresh);
    if (cleared > 0) {
      setScore(v => v + cleared * cleared * 100);
      setLines(v => v + cleared);
      setMessage(`${cleared}ライン消去！`);
      buzz(35);
    }

    const p = nr.current;
    if (!can(fresh, p)) {
      setOver(true);
      setMessage('ゲームオーバー');
      buzz(120);
      return;
    }

    setPiece(p);
    setNext(newPiece());
  }

  function move(dx: number, dy: number) {
    if (overRef.current || pauseRef.current) return;
    const p = pr.current;
    if (can(br.current, p, dx, dy)) {
      setPiece({ ...p, x: p.x + dx, y: p.y + dy });
    } else if (dy === 1) {
      lock();
    }
  }

  function spinLeft() {
    if (overRef.current || pauseRef.current) return;
    const p = pr.current;
    const r = rotateLeft(p.s);
    if (can(br.current, p, 0, 0, r)) {
      setPiece({ ...p, s: r });
      setMessage('左回転');
    }
  }

  function spinRight() {
    if (overRef.current || pauseRef.current) return;
    const p = pr.current;
    const r = rotateRight(p.s);
    if (can(br.current, p, 0, 0, r)) {
      setPiece({ ...p, s: r });
      setMessage('右回転');
    }
  }

  function hardDrop() {
    if (overRef.current || pauseRef.current) return;
    let p = { ...pr.current };
    while (can(br.current, p, 0, 1)) p = { ...p, y: p.y + 1 };
    pr.current = p;
    setPiece(p);
    lock();
    setScore(v => v + 10);
  }

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') spinRight();
      if (e.key.toLowerCase() === 'z') spinLeft();
      if (e.code === 'Space') hardDrop();
      if (e.key.toLowerCase() === 'p') setPause(v => !v);
      if (e.key.toLowerCase() === 'r') reset();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  useEffect(() => {
    const speed = Math.max(120, 700 - Math.floor(lines / 10) * 80);
    const t = setInterval(() => {
      if (!overRef.current && !pauseRef.current) move(0, 1);
    }, speed);
    return () => clearInterval(t);
  }, [lines]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, W * SIZE, H * SIZE);

    const cell = (x: number, y: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(x * SIZE + 1, y * SIZE + 1, SIZE - 2, SIZE - 2);
    };

    board.forEach((r, y) => r.forEach((v, x) => v && cell(x, y, v)));
    piece.s.forEach((r, y) => r.forEach((v, x) => v && cell(piece.x + x, piece.y + y, piece.c)));

    ctx.strokeStyle = '#334155';
    for (let x = 0; x <= W; x++) {
      ctx.beginPath();
      ctx.moveTo(x * SIZE, 0);
      ctx.lineTo(x * SIZE, H * SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * SIZE);
      ctx.lineTo(W * SIZE, y * SIZE);
      ctx.stroke();
    }
  }, [board, piece]);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, moved: false };
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE) {
      move(dx > 0 ? 1 : -1, 0);
      setMessage(dx > 0 ? '右へ移動' : '左へ移動');
      touch.current = { x: t.clientX, y: t.clientY, moved: true };
      buzz(8);
    } else if (dy > SWIPE) {
      move(0, 1);
      setMessage('下へ加速');
      touch.current = { x: t.clientX, y: t.clientY, moved: true };
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touch.current.moved) return;
    const x = e.changedTouches[0].clientX;
    if (x < window.innerWidth / 2) spinLeft();
    else spinRight();
    buzz(12);
  }

  const level = Math.floor(lines / 10) + 1;

  return (
    <main
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
        color: 'white',
        padding: 12,
        fontFamily: 'sans-serif',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0 }}>テトリス</h1>
            <p style={{ color: '#cbd5e1', margin: '4px 0 0', fontSize: 13 }}>{message}</p>
          </div>
          <button onClick={reset} style={{ padding: '9px 12px', borderRadius: 999, border: '1px solid #475569', background: '#1e293b', color: 'white', fontWeight: 'bold' }}>
            リスタート
          </button>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 116px', gap: 10, alignItems: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <canvas
              ref={canvas}
              width={W * SIZE}
              height={H * SIZE}
              style={{ width: 'min(70vw, 280px)', height: 'min(140vw, 560px)', border: '3px solid #475569', borderRadius: 14, background: '#111827', boxShadow: '0 18px 40px rgba(0,0,0,.35)' }}
            />
          </div>

          <aside style={{ background: 'rgba(15,23,42,.9)', padding: 12, borderRadius: 14, border: '1px solid #334155', fontSize: 13 }}>
            <div style={{ color: '#94a3b8' }}>SCORE</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>{score}</div>
            <div style={{ color: '#94a3b8' }}>LINE</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{lines}</div>
            <div style={{ color: '#94a3b8' }}>LEVEL</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{level}</div>
            {pause && <div style={{ color: '#facc15', fontWeight: 'bold' }}>停止中</div>}
            {over && <div style={{ color: '#f87171', fontWeight: 'bold' }}>GAME OVER</div>}
          </aside>
        </section>

        <section style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <button onClick={spinLeft} style={btn}>左回転</button>
          <button onClick={spinRight} style={btn}>右回転</button>
          <button onClick={hardDrop} style={btn}>一気に落下</button>
          <button onClick={() => setPause(v => !v)} style={btn}>{pause ? '再開' : '停止'}</button>
        </section>

        <p style={{ marginTop: 10, color: '#cbd5e1', fontSize: 12, lineHeight: 1.6, textAlign: 'center' }}>
          左右スワイプ：移動 / 下スワイプ：加速 / 左半分タップ：左回転 / 右半分タップ：右回転
        </p>
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: '12px 6px',
  borderRadius: 12,
  border: '1px solid #475569',
  background: '#1e293b',
  color: 'white',
  fontWeight: 'bold',
  fontSize: 13,
};
EOT

echo "スマホUI対応テトリスを app/tetris/page.tsx に作成しました。"
