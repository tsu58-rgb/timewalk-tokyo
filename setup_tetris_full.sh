#!/bin/bash
set -e

cd ~/timewalk-tokyo
mkdir -p app/tetris

cat > app/tetris/page.tsx <<'EOT'
'use client';

import { useEffect, useRef, useState } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL = 28;

type Cell = string;
type Board = Cell[][];
type Piece = {
  x: number;
  y: number;
  shape: number[][];
  color: string;
};

const BLOCKS = [
  { color: '#22d3ee', shape: [[1, 1, 1, 1]] },
  { color: '#facc15', shape: [[1, 1], [1, 1]] },
  { color: '#a78bfa', shape: [[0, 1, 0], [1, 1, 1]] },
  { color: '#fb923c', shape: [[1, 0, 0], [1, 1, 1]] },
  { color: '#60a5fa', shape: [[0, 0, 1], [1, 1, 1]] },
  { color: '#4ade80', shape: [[1, 1, 0], [0, 1, 1]] },
  { color: '#f87171', shape: [[0, 1, 1], [1, 1, 0]] },
];

function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

function createPiece(): Piece {
  const block = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  return {
    x: Math.floor((COLS - block.shape[0].length) / 2),
    y: 0,
    shape: block.shape.map(row => [...row]),
    color: block.color,
  };
}

function rotateShape(shape: number[][]): number[][] {
  return shape[0].map((_, col) => shape.map(row => row[col]).reverse());
}

function canMove(board: Board, piece: Piece, dx = 0, dy = 0, shape = piece.shape): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;

      const nx = piece.x + x + dx;
      const ny = piece.y + y + dy;

      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function mergePiece(board: Board, piece: Piece): Board {
  const next = board.map(row => [...row]);

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return;
      const by = piece.y + y;
      const bx = piece.x + x;
      if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
        next[by][bx] = piece.color;
      }
    });
  });

  return next;
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const remaining = board.filter(row => row.some(cell => !cell));
  const cleared = ROWS - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(''));
  return { board: [...empty, ...remaining], cleared };
}

export default function TetrisPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [board, setBoard] = useState<Board>(() => createBoard());
  const [piece, setPiece] = useState<Piece>(() => createPiece());
  const [nextPiece, setNextPiece] = useState<Piece>(() => createPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  const nextPieceRef = useRef(nextPiece);
  const gameOverRef = useRef(gameOver);
  const pausedRef = useRef(paused);

  useEffect(() => {
    boardRef.current = board;
    pieceRef.current = piece;
    nextPieceRef.current = nextPiece;
    gameOverRef.current = gameOver;
    pausedRef.current = paused;
  }, [board, piece, nextPiece, gameOver, paused]);

  function resetGame() {
    setBoard(createBoard());
    setPiece(createPiece());
    setNextPiece(createPiece());
    setScore(0);
    setLines(0);
    setGameOver(false);
    setPaused(false);
  }

  function lockPiece() {
    const merged = mergePiece(boardRef.current, pieceRef.current);
    const result = clearLines(merged);

    setBoard(result.board);
    setScore(prev => prev + result.cleared * result.cleared * 100);
    setLines(prev => prev + result.cleared);

    const next = nextPieceRef.current;
    const afterNext = createPiece();

    if (!canMove(result.board, next)) {
      setGameOver(true);
      return;
    }

    setPiece(next);
    setNextPiece(afterNext);
  }

  function move(dx: number, dy: number) {
    if (gameOverRef.current || pausedRef.current) return;

    const currentPiece = pieceRef.current;
    if (canMove(boardRef.current, currentPiece, dx, dy)) {
      setPiece({ ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy });
    } else if (dy === 1) {
      lockPiece();
    }
  }

  function rotatePiece() {
    if (gameOverRef.current || pausedRef.current) return;

    const currentPiece = pieceRef.current;
    const rotated = rotateShape(currentPiece.shape);

    if (canMove(boardRef.current, currentPiece, 0, 0, rotated)) {
      setPiece({ ...currentPiece, shape: rotated });
      return;
    }

    if (canMove(boardRef.current, currentPiece, -1, 0, rotated)) {
      setPiece({ ...currentPiece, x: currentPiece.x - 1, shape: rotated });
      return;
    }

    if (canMove(boardRef.current, currentPiece, 1, 0, rotated)) {
      setPiece({ ...currentPiece, x: currentPiece.x + 1, shape: rotated });
    }
  }

  function hardDrop() {
    if (gameOverRef.current || pausedRef.current) return;

    let dropped = { ...pieceRef.current };
    while (canMove(boardRef.current, dropped, 0, 1)) {
      dropped = { ...dropped, y: dropped.y + 1 };
    }

    pieceRef.current = dropped;
    setPiece(dropped);
    lockPiece();
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') move(-1, 0);
      if (event.key === 'ArrowRight') move(1, 0);
      if (event.key === 'ArrowDown') move(0, 1);
      if (event.key === 'ArrowUp') rotatePiece();
      if (event.code === 'Space') {
        event.preventDefault();
        hardDrop();
      }
      if (event.key.toLowerCase() === 'p') setPaused(prev => !prev);
      if (event.key.toLowerCase() === 'r') resetGame();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const speed = Math.max(120, 700 - Math.floor(lines / 10) * 80);

    const timer = window.setInterval(() => {
      if (!gameOverRef.current && !pausedRef.current) {
        move(0, 1);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [lines]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    const drawCell = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(x * CELL + 3, y * CELL + 3, CELL - 8, 4);
    };

    ctx.strokeStyle = '#243244';
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(COLS * CELL, y * CELL);
      ctx.stroke();
    }

    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) drawCell(x, y, cell);
      });
    });

    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) drawCell(piece.x + x, piece.y + y, piece.color);
      });
    });

    if (paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSE', (COLS * CELL) / 2, (ROWS * CELL) / 2);
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', (COLS * CELL) / 2, (ROWS * CELL) / 2);
    }
  }, [board, piece, paused, gameOver]);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#020617',
      color: 'white',
      padding: 24,
      fontFamily: 'sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>
        <section>
          <h1 style={{ fontSize: 32, margin: '0 0 12px' }}>テトリス</h1>
          <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            style={{ border: '3px solid #475569', borderRadius: 12, background: '#111827' }}
          />
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: 8 }}>
            <button onClick={() => move(-1, 0)}>←</button>
            <button onClick={rotatePiece}>回転</button>
            <button onClick={() => move(1, 0)}>→</button>
            <button onClick={() => move(0, 1)}>下</button>
            <button onClick={hardDrop}>落下</button>
            <button onClick={() => setPaused(prev => !prev)}>停止</button>
          </div>
        </section>

        <aside style={{ width: 240, background: '#0f172a', padding: 20, borderRadius: 16, border: '1px solid #334155' }}>
          <h2 style={{ marginTop: 0 }}>情報</h2>
          <p>スコア：{score}</p>
          <p>ライン：{lines}</p>
          <p>レベル：{Math.floor(lines / 10) + 1}</p>
          {paused && <p style={{ color: '#facc15', fontWeight: 'bold' }}>一時停止中</p>}
          {gameOver && <p style={{ color: '#f87171', fontWeight: 'bold' }}>ゲームオーバー</p>}
          <button
            onClick={resetGame}
            style={{ width: '100%', padding: 12, borderRadius: 10, border: 0, background: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            リスタート
          </button>
          <p style={{ marginTop: 20, color: '#cbd5e1', lineHeight: 1.8 }}>
            ← →：移動<br />
            ↓：早く落とす<br />
            ↑：回転<br />
            Space：一気に落下<br />
            P：一時停止<br />
            R：リスタート
          </p>
        </aside>
      </div>
    </main>
  );
}
EOT

echo "完成版テトリスを app/tetris/page.tsx に作成しました。"
