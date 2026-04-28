#!/bin/bash

cd ~/timewalk-tokyo
mkdir -p app/tetris

cat > app/tetris/page.tsx <<'EOT'
'use client';

export default function TetrisPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#020617',
      color: 'white',
      padding: 24,
      fontFamily: 'sans-serif'
    }}>
      <h1>テトリス完成版（ここに本体入れる）</h1>
    </main>
  );
}
EOT

npm run dev
