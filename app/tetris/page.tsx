'use client';

import { useEffect, useRef, useState } from 'react';

const W = 10;
const H = 20;
const SIZE = 28;

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

function emptyBoard() {
  return Array.from({ length: H }, () => Array(W).fill(''));
}

function newPiece(): Piece {
  const b = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  return { x: 3, y: 0, s: b.s, c: b.c };
}

function rotateRight(s: number[][]) {
  return s[0].map((_, i) => s.map(r => r[i]).reverse());
}

function rotateLeft(s: number[][]) {
  return s[0].map((_, i) => s.map(r => r[s[0].length - 1 - i]));
}

function can(board: string[][], p: Piece, dx = 0, dy = 0, ns = p.s) {
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

function merge(board: string[][], p: Piece) {
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
  const [board, setBoard] = useState(emptyBoard);
  const [piece, setPiece] = useState(newPiece);
  const [next, setNext] = useState(newPiece);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [over, setOver] = useState(false);
  const [pause, setPause] = useState(false);

  const br = useRef(board);
  const pr = useRef(piece);
  const nr = useRef(next);
  const or = useRef(over);
  const par = useRef(pause);

  useEffect(() => {
    br.current = board;
    pr.current = piece;
    nr.current = next;
    or.current = over;
    par.current = pause;
  }, [board, piece, next, over, pause]);

  function reset() {
    setBoard(emptyBoard());
    setPiece(newPiece());
    setNext(newPiece());
    setScore(0);
    setLines(0);
    setOver(false);
    setPause(false);
  }

  function lock() {
    const merged = merge(br.current, pr.current);
    const remain = merged.filter(r => r.some(v => !v));
    const cleared = H - remain.length;
    const fresh = [...Array.from({ length: cleared }, () => Array(W).fill('')), ...remain];
    setBoard(fresh);
    setScore(v => v + cleared * cleared * 100);
    setLines(v => v + cleared);
    const p = nr.current;
    if (!can(fresh, p)) {
      setOver(true);
      return;
    }
    setPiece(p);
    setNext(newPiece());
  }

  function move(dx: number, dy: number) {
    if (or.current || par.current) return;
    const p = pr.current;
    if (can(br.current, p, dx, dy)) {
      setPiece({ ...p, x: p.x + dx, y: p.y + dy });
    } else if (dy === 1) {
      lock();
    }
  }

  function spinRight() {
    if (or.current || par.current) return;
    const p = pr.current;
    const r = rotateRight(p.s);
    if (can(br.current, p, 0, 0, r)) setPiece({ ...p, s: r });
  }

  function spinLeft() {
    if (or.current || par.current) return;
    const p = pr.current;
    const r = rotateLeft(p.s);
    if (can(br.current, p, 0, 0, r)) setPiece({ ...p, s: r });
  }

  function drop() {
    if (or.current || par.current) return;
    let p = { ...pr.current };
    while (can(br.current, p, 0, 1)) p = { ...p, y: p.y + 1 };
    pr.current = p;
    setPiece(p);
    lock();
  }

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') spinRight();
      if (e.key === 'z' || e.key === 'Z') spinLeft();
      if (e.code === 'Space') drop();
      if (e.key.toLowerCase() === 'p') setPause(v => !v);
      if (e.key.toLowerCase() === 'r') reset();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  useEffect(() => {
    const speed = Math.max(120, 700 - Math.floor(lines / 10) * 80);
    const t = setInterval(() => {
      if (!or.current && !par.current) move(0, 1);
    }, speed);
    return () => clearInterval(t);
  }, [lines]);

  // 重要：スマホ操作は canvas の中だけで反応させる。下のボタンでは回転しない。
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const touchStart = (e: TouchEvent) => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const touchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = endY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < 18 && absY < 18) {
        const rect = el.getBoundingClientRect();
        const tapX = endX - rect.left;
        if (tapX < rect.width / 2) spinLeft();
        else spinRight();
        return;
      }

      if (absX > absY) {
        if (dx > 25) move(1, 0);
        if (dx < -25) move(-1, 0);
      } else {
        if (dy > 25) move(0, 1);
      }
    };

    el.addEventListener('touchstart', touchStart, { passive: false });
    el.addEventListener('touchend', touchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchstart', touchStart);
      el.removeEventListener('touchend', touchEnd);
    };
  }, []);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, W * SIZE, H * SIZE);

    const cell = (x: number, y: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
    };

    board.forEach((r, y) => r.forEach((v, x) => v && cell(x, y, v)));
    piece.s.forEach((r, y) => r.forEach((v, x) => v && cell(piece.x + x, piece.y + y, piece.c)));

    ctx.strokeStyle = '#374151';
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

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: 16, fontFamily: 'sans-serif', touchAction: 'manipulation' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, margin: 0 }}>テトリス</h1>
            <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: 13 }}>盤面内だけタップ・スワイプ操作</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: 14 }}>
            <div>Score: {score}</div>
            <div>Line: {lines}</div>
          </div>
        </header>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <canvas
            ref={canvas}
            width={W * SIZE}
            height={H * SIZE}
            style={{ border: '3px solid #475569', borderRadius: 12, background: '#111827', touchAction: 'none', maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {pause && <p style={{ color: '#facc15', fontWeight: 'bold' }}>一時停止中</p>}
        {over && <p style={{ color: '#f87171', fontWeight: 'bold' }}>ゲームオーバー</p>}

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <button onClick={drop} style={btn}>落下</button>
          <button onClick={() => setPause(v => !v)} style={btn}>{pause ? '再開' : '停止'}</button>
          <button onClick={reset} style={btn}>再始動</button>
          <button onClick={() => move(0, 1)} style={btn}>下</button>
        </div>

        <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: 13 }}>
          盤面内：左右スワイプ＝移動／下スワイプ＝加速／左タップ＝左回転／右タップ＝右回転<br />
          キーボード：←→移動、↓加速、↑右回転、Z左回転、Space落下
        </p>
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: '12px 8px',
  borderRadius: 12,
  border: '1px solid #334155',
  background: '#1e293b',
  color: 'white',
  fontWeight: 'bold',
};
