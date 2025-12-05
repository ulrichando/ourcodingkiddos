"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Brain,
  Rocket,
  Heart,
  Trophy,
  Gamepad2,
  GraduationCap,
  Target,
  MousePointerClick,
  X,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

// =====================================================
// CLASSIC ARCADE GAMES BACKGROUND
// 5 Playable Games: Snake, Pong, Tetris, Space Invaders, Brick Breaker
// Connected to Code Playground - each code example launches a different game!
// =====================================================

// Game Types - Each maps to a code example
type GameMode = 'snake' | 'pong' | 'tetris' | 'spaceInvaders' | 'brickBreaker';

// Classic Arcade Games Background Component
function LivingGameBackground({ gameMode = 'snake', onScoreUpdate }: { gameMode?: GameMode; onScoreUpdate?: (score: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [currentGame, setCurrentGame] = useState<GameMode>(gameMode);

  // Shared refs
  const mouseRef = useRef({ x: 0, y: 0, clicked: false });
  const keysRef = useRef<Set<string>>(new Set());
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);

  // Snake Game State
  const snakeRef = useRef<Array<{x: number, y: number}>>([]);
  const snakeDirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 0, y: 0 });

  // Pong Game State
  const paddleRef = useRef({ y: 0, h: 80 });
  const aiPaddleRef = useRef({ y: 0, h: 80 });
  const ballRef = useRef({ x: 0, y: 0, vx: 4, vy: 2, r: 8 });

  // Tetris State
  const tetrisBoardRef = useRef<number[][]>([]);
  const tetrisPieceRef = useRef<{ shape: number[][]; x: number; y: number; color: string }>({ shape: [], x: 0, y: 0, color: '#00f0f0' });
  const tetrisNextPieceRef = useRef<{ shape: number[][]; color: string }>({ shape: [], color: '#00f0f0' });
  const tetrisDropTimeRef = useRef(0);
  const tetrisLastMoveRef = useRef(0);

  // Space Invaders State
  const shipRef = useRef({ x: 0, y: 0, w: 40, h: 20 });
  const bulletsRef = useRef<Array<{x: number, y: number, vy: number}>>([]);
  const aliensRef = useRef<Array<{x: number, y: number, alive: boolean}>>([]);
  const alienDirRef = useRef(1);

  // Brick Breaker State
  const paddleBBRef = useRef({ x: 0, w: 100, h: 15 });
  const ballBBRef = useRef({ x: 0, y: 0, vx: 3, vy: -3, r: 8 });
  const bricksRef = useRef<Array<{x: number, y: number, w: number, h: number, alive: boolean, color: string}>>([]);

  // Game labels and colors
  const GAME_INFO: Record<GameMode, { label: string; hint: string; color: string }> = {
    snake: { label: '🐍 Snake', hint: 'Use arrow keys or WASD to move!', color: '#22c55e' },
    pong: { label: '🏓 Pong', hint: 'Move mouse up/down to control paddle!', color: '#3b82f6' },
    tetris: { label: '🧱 Tetris', hint: 'Arrow keys to move, Up to rotate, Down to drop!', color: '#eab308' },
    spaceInvaders: { label: '👾 Space Invaders', hint: 'Arrow keys to move, Space to shoot!', color: '#8b5cf6' },
    brickBreaker: { label: '🧱 Brick Breaker', hint: 'Move mouse to control paddle!', color: '#ec4899' },
  };

  // Initialize game when mode changes
  const initGame = useCallback((mode: GameMode, width: number, height: number) => {
    scoreRef.current = 0;
    setScore(0);
    gameOverRef.current = false;
    setGameOver(false);

    const gridSize = 20;

    switch (mode) {
      case 'snake': {
        // Initialize Snake
        const startX = Math.floor(width / 2 / gridSize) * gridSize;
        const startY = Math.floor(height / 2 / gridSize) * gridSize;
        snakeRef.current = [
          { x: startX, y: startY },
          { x: startX - gridSize, y: startY },
          { x: startX - gridSize * 2, y: startY },
        ];
        snakeDirRef.current = { x: 1, y: 0 };
        foodRef.current = {
          x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
          y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
        };
        break;
      }

      case 'pong':
        // Initialize Pong
        paddleRef.current = { y: height / 2 - 40, h: 80 };
        aiPaddleRef.current = { y: height / 2 - 40, h: 80 };
        ballRef.current = { x: width / 2, y: height / 2, vx: 4, vy: 2, r: 8 };
        break;

      case 'tetris': {
        // Initialize Tetris
        // Create 10x20 board (standard Tetris dimensions)
        const BOARD_WIDTH = 10;
        const BOARD_HEIGHT = 20;
        tetrisBoardRef.current = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
        tetrisDropTimeRef.current = 0;
        tetrisLastMoveRef.current = Date.now();
        // Tetris pieces (tetrominoes)
        const PIECES = [
          { shape: [[1,1,1,1]], color: '#00f0f0' }, // I - Cyan
          { shape: [[1,1],[1,1]], color: '#f0f000' }, // O - Yellow
          { shape: [[0,1,0],[1,1,1]], color: '#a000f0' }, // T - Purple
          { shape: [[1,0,0],[1,1,1]], color: '#f0a000' }, // L - Orange
          { shape: [[0,0,1],[1,1,1]], color: '#0000f0' }, // J - Blue
          { shape: [[0,1,1],[1,1,0]], color: '#00f000' }, // S - Green
          { shape: [[1,1,0],[0,1,1]], color: '#f00000' }, // Z - Red
        ];
        const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
        const nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
        tetrisPieceRef.current = {
          shape: randomPiece.shape.map(row => [...row]),
          x: Math.floor((BOARD_WIDTH - randomPiece.shape[0].length) / 2),
          y: 0,
          color: randomPiece.color
        };
        tetrisNextPieceRef.current = { shape: nextPiece.shape.map(row => [...row]), color: nextPiece.color };
        break;
      }

      case 'spaceInvaders':
        // Initialize Space Invaders
        shipRef.current = { x: width / 2 - 20, y: height - 50, w: 40, h: 20 };
        bulletsRef.current = [];
        aliensRef.current = [];
        alienDirRef.current = 1;
        // Create alien grid
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 8; col++) {
            aliensRef.current.push({
              x: 60 + col * 50,
              y: 60 + row * 40,
              alive: true,
            });
          }
        }
        break;

      case 'brickBreaker': {
        // Initialize Brick Breaker
        paddleBBRef.current = { x: width / 2 - 50, w: 100, h: 15 };
        ballBBRef.current = { x: width / 2, y: height - 100, vx: 3, vy: -3, r: 8 };
        bricksRef.current = [];
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
        const brickW = 60;
        const brickH = 20;
        const cols = Math.floor((width - 40) / (brickW + 5));
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < cols; col++) {
            bricksRef.current.push({
              x: 20 + col * (brickW + 5),
              y: 60 + row * (brickH + 5),
              w: brickW,
              h: brickH,
              alive: true,
              color: colors[row % colors.length],
            });
          }
        }
        break;
      }
    }
  }, []);

  // Handle game mode changes
  useEffect(() => {
    setCurrentGame(gameMode);
    setShowHint(true);
    if (canvasRef.current) {
      initGame(gameMode, canvasRef.current.width, canvasRef.current.height);
    }
  }, [gameMode, initGame]);

  // Initialize canvas and event listeners
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    initGame(currentGame, canvas.width, canvas.height);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newRect = containerRef.current.getBoundingClientRect();
      canvas.width = newRect.width;
      canvas.height = newRect.height;
      initGame(currentGame, canvas.width, canvas.height);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scrolling for game controls
      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
      if (gameKeys.includes(e.key)) {
        e.preventDefault();
      }

      keysRef.current.add(e.key.toLowerCase());

      // Snake direction
      if (currentGame === 'snake') {
        const dir = snakeDirRef.current;
        if ((e.key === 'ArrowUp' || e.key === 'w') && dir.y === 0) snakeDirRef.current = { x: 0, y: -1 };
        if ((e.key === 'ArrowDown' || e.key === 's') && dir.y === 0) snakeDirRef.current = { x: 0, y: 1 };
        if ((e.key === 'ArrowLeft' || e.key === 'a') && dir.x === 0) snakeDirRef.current = { x: -1, y: 0 };
        if ((e.key === 'ArrowRight' || e.key === 'd') && dir.x === 0) snakeDirRef.current = { x: 1, y: 0 };
      }

      // Space Invaders shoot
      if (currentGame === 'spaceInvaders' && e.key === ' ' && bulletsRef.current.length < 5) {
        const ship = shipRef.current;
        bulletsRef.current.push({ x: ship.x + ship.w / 2, y: ship.y, vy: -10 });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (r) {
        mouseRef.current.x = e.clientX - r.left;
        mouseRef.current.y = e.clientY - r.top;
      }
    };

    const handleClick = () => {
      setShowHint(false);
      mouseRef.current.clicked = true;

      // Restart on game over
      if (gameOverRef.current && canvasRef.current) {
        initGame(currentGame, canvasRef.current.width, canvasRef.current.height);
      }

      setTimeout(() => { mouseRef.current.clicked = false; }, 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentGame, initGame]);

  // Main animation loop - renders all games
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let snakeTimer = 0;
    let pipeTimer = 0;
    const gridSize = 20;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gameInfo = GAME_INFO[currentGame];

      if (gameOverRef.current) {
        // Game Over Screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = '24px sans-serif';
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillStyle = gameInfo.color;
        ctx.font = '18px sans-serif';
        ctx.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + 60);
      } else {
        // ===== SNAKE GAME =====
        if (currentGame === 'snake') {
          snakeTimer += dt;
          if (snakeTimer > 8) { // Snake speed
            snakeTimer = 0;
            const snake = snakeRef.current;
            const dir = snakeDirRef.current;
            const food = foodRef.current;

            // Move snake
            const head = { x: snake[0].x + dir.x * gridSize, y: snake[0].y + dir.y * gridSize };

            // Wrap around edges
            if (head.x < 0) head.x = canvas.width - gridSize;
            if (head.x >= canvas.width) head.x = 0;
            if (head.y < 0) head.y = canvas.height - gridSize;
            if (head.y >= canvas.height) head.y = 0;

            // Check collision with self
            if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
              gameOverRef.current = true;
              setGameOver(true);
            } else {
              snake.unshift(head);

              // Check food collision
              if (head.x === food.x && head.y === food.y) {
                scoreRef.current += 10;
                setScore(scoreRef.current);
                foodRef.current = {
                  x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
                  y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
                };
              } else {
                snake.pop();
              }
            }
          }

          // Draw snake
          const snake = snakeRef.current;
          snake.forEach((seg, i) => {
            const alpha = 1 - (i / snake.length) * 0.5;
            ctx.fillStyle = i === 0 ? '#22c55e' : `rgba(34, 197, 94, ${alpha})`;
            ctx.fillRect(seg.x + 1, seg.y + 1, gridSize - 2, gridSize - 2);
            if (i === 0) {
              // Eyes
              ctx.fillStyle = '#fff';
              ctx.fillRect(seg.x + 4, seg.y + 4, 4, 4);
              ctx.fillRect(seg.x + gridSize - 8, seg.y + 4, 4, 4);
            }
          });

          // Draw food
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(foodRef.current.x + gridSize / 2, foodRef.current.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // ===== PONG GAME =====
        if (currentGame === 'pong') {
          const ball = ballRef.current;
          const paddle = paddleRef.current;
          const aiPaddle = aiPaddleRef.current;
          const paddleW = 15;

          // Player paddle follows mouse
          paddle.y = Math.max(0, Math.min(canvas.height - paddle.h, mouseRef.current.y - paddle.h / 2));

          // AI paddle
          const aiSpeed = 3;
          if (aiPaddle.y + aiPaddle.h / 2 < ball.y) aiPaddle.y += aiSpeed * dt;
          if (aiPaddle.y + aiPaddle.h / 2 > ball.y) aiPaddle.y -= aiSpeed * dt;

          // Ball movement
          ball.x += ball.vx * dt;
          ball.y += ball.vy * dt;

          // Ball collision with top/bottom
          if (ball.y < ball.r || ball.y > canvas.height - ball.r) ball.vy *= -1;

          // Ball collision with paddles
          if (ball.x < paddleW + ball.r && ball.y > paddle.y && ball.y < paddle.y + paddle.h) {
            ball.vx = Math.abs(ball.vx) * 1.05;
            ball.vy += (ball.y - paddle.y - paddle.h / 2) * 0.1;
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }
          if (ball.x > canvas.width - paddleW - ball.r && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.h) {
            ball.vx = -Math.abs(ball.vx) * 1.02;
          }

          // Ball out of bounds
          if (ball.x < 0 || ball.x > canvas.width) {
            if (ball.x < 0) {
              gameOverRef.current = true;
              setGameOver(true);
            } else {
              scoreRef.current += 5;
              setScore(scoreRef.current);
            }
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
            ball.vy = 2 * (Math.random() - 0.5);
          }

          // Draw paddles
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(0, paddle.y, paddleW, paddle.h);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(canvas.width - paddleW, aiPaddle.y, paddleW, aiPaddle.h);

          // Draw ball
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
          ctx.fill();

          // Draw center line
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.setLineDash([10, 10]);
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, 0);
          ctx.lineTo(canvas.width / 2, canvas.height);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // ===== TETRIS =====
        if (currentGame === 'tetris') {
          const BOARD_WIDTH = 10;
          const BOARD_HEIGHT = 20;
          const CELL_SIZE = Math.min(
            Math.floor((canvas.height - 40) / BOARD_HEIGHT),
            Math.floor((canvas.width - 100) / BOARD_WIDTH)
          );
          const BOARD_OFFSET_X = (canvas.width - BOARD_WIDTH * CELL_SIZE) / 2;
          const BOARD_OFFSET_Y = (canvas.height - BOARD_HEIGHT * CELL_SIZE) / 2;

          const board = tetrisBoardRef.current;
          const piece = tetrisPieceRef.current;

          // Tetris piece definitions
          const PIECES = [
            { shape: [[1,1,1,1]], color: '#00f0f0' },
            { shape: [[1,1],[1,1]], color: '#f0f000' },
            { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },
            { shape: [[1,0,0],[1,1,1]], color: '#f0a000' },
            { shape: [[0,0,1],[1,1,1]], color: '#0000f0' },
            { shape: [[0,1,1],[1,1,0]], color: '#00f000' },
            { shape: [[1,1,0],[0,1,1]], color: '#f00000' },
          ];

          // Check collision helper
          const checkCollision = (shape: number[][], px: number, py: number): boolean => {
            for (let y = 0; y < shape.length; y++) {
              for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                  const newX = px + x;
                  const newY = py + y;
                  if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
                  if (newY >= 0 && board[newY] && board[newY][newX]) return true;
                }
              }
            }
            return false;
          };

          // Rotate piece helper
          const rotatePiece = (shape: number[][]): number[][] => {
            const rows = shape.length;
            const cols = shape[0].length;
            const rotated: number[][] = [];
            for (let x = 0; x < cols; x++) {
              rotated.push([]);
              for (let y = rows - 1; y >= 0; y--) {
                rotated[x].push(shape[y][x]);
              }
            }
            return rotated;
          };

          // Lock piece to board
          const lockPiece = () => {
            for (let y = 0; y < piece.shape.length; y++) {
              for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                  const boardY = piece.y + y;
                  const boardX = piece.x + x;
                  if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                    board[boardY][boardX] = 1;
                  }
                }
              }
            }

            // Clear completed lines
            let linesCleared = 0;
            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
              if (board[y].every(cell => cell === 1)) {
                board.splice(y, 1);
                board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // Check same row again
              }
            }
            if (linesCleared > 0) {
              const points = [0, 100, 300, 500, 800][linesCleared] || 0;
              scoreRef.current += points;
              setScore(scoreRef.current);
            }

            // Spawn new piece
            const nextPiece = tetrisNextPieceRef.current;
            piece.shape = nextPiece.shape.map(row => [...row]);
            piece.color = nextPiece.color;
            piece.x = Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2);
            piece.y = 0;

            const newNext = PIECES[Math.floor(Math.random() * PIECES.length)];
            tetrisNextPieceRef.current = { shape: newNext.shape.map(row => [...row]), color: newNext.color };

            // Check game over
            if (checkCollision(piece.shape, piece.x, piece.y)) {
              gameOverRef.current = true;
              setGameOver(true);
            }
          };

          // Handle input
          const now = Date.now();
          if (now - tetrisLastMoveRef.current > 100) {
            if (keysRef.current.has('arrowleft') || keysRef.current.has('a')) {
              if (!checkCollision(piece.shape, piece.x - 1, piece.y)) piece.x--;
              tetrisLastMoveRef.current = now;
            }
            if (keysRef.current.has('arrowright') || keysRef.current.has('d')) {
              if (!checkCollision(piece.shape, piece.x + 1, piece.y)) piece.x++;
              tetrisLastMoveRef.current = now;
            }
            if (keysRef.current.has('arrowup') || keysRef.current.has('w')) {
              const rotated = rotatePiece(piece.shape);
              if (!checkCollision(rotated, piece.x, piece.y)) {
                piece.shape = rotated;
              }
              tetrisLastMoveRef.current = now;
            }
          }

          // Soft drop
          const dropSpeed = keysRef.current.has('arrowdown') || keysRef.current.has('s') ? 50 : 500;
          tetrisDropTimeRef.current += dt * 16;
          if (tetrisDropTimeRef.current > dropSpeed) {
            tetrisDropTimeRef.current = 0;
            if (!checkCollision(piece.shape, piece.x, piece.y + 1)) {
              piece.y++;
            } else {
              lockPiece();
            }
          }

          // Hard drop with space
          if (keysRef.current.has(' ')) {
            while (!checkCollision(piece.shape, piece.x, piece.y + 1)) {
              piece.y++;
            }
            lockPiece();
            keysRef.current.delete(' ');
          }

          // Draw board background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(BOARD_OFFSET_X - 2, BOARD_OFFSET_Y - 2, BOARD_WIDTH * CELL_SIZE + 4, BOARD_HEIGHT * CELL_SIZE + 4);

          // Draw grid
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          for (let x = 0; x <= BOARD_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(BOARD_OFFSET_X + x * CELL_SIZE, BOARD_OFFSET_Y);
            ctx.lineTo(BOARD_OFFSET_X + x * CELL_SIZE, BOARD_OFFSET_Y + BOARD_HEIGHT * CELL_SIZE);
            ctx.stroke();
          }
          for (let y = 0; y <= BOARD_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(BOARD_OFFSET_X, BOARD_OFFSET_Y + y * CELL_SIZE);
            ctx.lineTo(BOARD_OFFSET_X + BOARD_WIDTH * CELL_SIZE, BOARD_OFFSET_Y + y * CELL_SIZE);
            ctx.stroke();
          }

          // Draw locked pieces
          const pieceColors = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];
          for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
              if (board[y][x]) {
                ctx.fillStyle = pieceColors[Math.floor(Math.random() * pieceColors.length)];
                ctx.fillStyle = '#888';
                ctx.fillRect(
                  BOARD_OFFSET_X + x * CELL_SIZE + 1,
                  BOARD_OFFSET_Y + y * CELL_SIZE + 1,
                  CELL_SIZE - 2,
                  CELL_SIZE - 2
                );
              }
            }
          }

          // Draw current piece
          ctx.fillStyle = piece.color;
          for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
              if (piece.shape[y][x]) {
                ctx.fillRect(
                  BOARD_OFFSET_X + (piece.x + x) * CELL_SIZE + 1,
                  BOARD_OFFSET_Y + (piece.y + y) * CELL_SIZE + 1,
                  CELL_SIZE - 2,
                  CELL_SIZE - 2
                );
              }
            }
          }

          // Draw ghost piece (preview where it will land)
          let ghostY = piece.y;
          while (!checkCollision(piece.shape, piece.x, ghostY + 1)) {
            ghostY++;
          }
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
              if (piece.shape[y][x]) {
                ctx.fillRect(
                  BOARD_OFFSET_X + (piece.x + x) * CELL_SIZE + 1,
                  BOARD_OFFSET_Y + (ghostY + y) * CELL_SIZE + 1,
                  CELL_SIZE - 2,
                  CELL_SIZE - 2
                );
              }
            }
          }
        }

        // ===== SPACE INVADERS =====
        if (currentGame === 'spaceInvaders') {
          const ship = shipRef.current;
          const bullets = bulletsRef.current;
          const aliens = aliensRef.current;

          // Ship movement
          if (keysRef.current.has('arrowleft') || keysRef.current.has('a')) ship.x -= 5 * dt;
          if (keysRef.current.has('arrowright') || keysRef.current.has('d')) ship.x += 5 * dt;
          ship.x = Math.max(0, Math.min(canvas.width - ship.w, ship.x));

          // Update bullets
          for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y += bullets[i].vy * dt;
            if (bullets[i].y < 0) bullets.splice(i, 1);
          }

          // Update aliens
          let moveDown = false;
          aliens.forEach(alien => {
            if (alien.alive) {
              alien.x += alienDirRef.current * 0.5 * dt;
              if (alien.x < 20 || alien.x > canvas.width - 50) moveDown = true;
            }
          });
          if (moveDown) {
            alienDirRef.current *= -1;
            aliens.forEach(a => { if (a.alive) a.y += 20; });
          }

          // Bullet-alien collision
          bullets.forEach((bullet, bi) => {
            aliens.forEach(alien => {
              if (alien.alive && bullet.x > alien.x && bullet.x < alien.x + 30 && bullet.y > alien.y && bullet.y < alien.y + 25) {
                alien.alive = false;
                bullets.splice(bi, 1);
                scoreRef.current += 10;
                setScore(scoreRef.current);
              }
            });
          });

          // Check game over
          if (aliens.some(a => a.alive && a.y > canvas.height - 100)) {
            gameOverRef.current = true;
            setGameOver(true);
          }

          // Check win
          if (!aliens.some(a => a.alive)) {
            scoreRef.current += 100;
            setScore(scoreRef.current);
            // Reset aliens
            aliens.length = 0;
            for (let row = 0; row < 4; row++) {
              for (let col = 0; col < 8; col++) {
                aliens.push({ x: 60 + col * 50, y: 60 + row * 40, alive: true });
              }
            }
          }

          // Draw ship
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.moveTo(ship.x + ship.w / 2, ship.y);
          ctx.lineTo(ship.x + ship.w, ship.y + ship.h);
          ctx.lineTo(ship.x, ship.y + ship.h);
          ctx.closePath();
          ctx.fill();

          // Draw bullets
          ctx.fillStyle = '#eab308';
          bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 10));

          // Draw aliens
          aliens.forEach(alien => {
            if (alien.alive) {
              ctx.fillStyle = '#8b5cf6';
              ctx.fillRect(alien.x, alien.y, 30, 25);
              // Eyes
              ctx.fillStyle = '#fff';
              ctx.fillRect(alien.x + 5, alien.y + 8, 6, 6);
              ctx.fillRect(alien.x + 19, alien.y + 8, 6, 6);
            }
          });
        }

        // ===== BRICK BREAKER =====
        if (currentGame === 'brickBreaker') {
          const paddle = paddleBBRef.current;
          const ball = ballBBRef.current;
          const bricks = bricksRef.current;

          // Paddle follows mouse
          paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, mouseRef.current.x - paddle.w / 2));

          // Ball movement
          ball.x += ball.vx * dt;
          ball.y += ball.vy * dt;

          // Ball collision with walls
          if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.vx *= -1;
          if (ball.y < ball.r) ball.vy *= -1;

          // Ball collision with paddle
          if (ball.y > canvas.height - 40 && ball.y < canvas.height - 25 &&
              ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            ball.vy = -Math.abs(ball.vy);
            ball.vx += (ball.x - paddle.x - paddle.w / 2) * 0.1;
          }

          // Ball out of bounds
          if (ball.y > canvas.height) {
            gameOverRef.current = true;
            setGameOver(true);
          }

          // Ball collision with bricks
          bricks.forEach(brick => {
            if (brick.alive &&
                ball.x > brick.x && ball.x < brick.x + brick.w &&
                ball.y > brick.y && ball.y < brick.y + brick.h) {
              brick.alive = false;
              ball.vy *= -1;
              scoreRef.current += 10;
              setScore(scoreRef.current);
            }
          });

          // Check win
          if (!bricks.some(b => b.alive)) {
            scoreRef.current += 100;
            initGame('brickBreaker', canvas.width, canvas.height);
          }

          // Draw paddle
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(paddle.x, canvas.height - 30, paddle.w, paddle.h);

          // Draw ball
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
          ctx.fill();

          // Draw bricks
          bricks.forEach(brick => {
            if (brick.alive) {
              ctx.fillStyle = brick.color;
              ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
              ctx.strokeStyle = 'rgba(255,255,255,0.3)';
              ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
            }
          });
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [currentGame, initGame]);

  const gameInfo = GAME_INFO[currentGame];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      style={{ cursor: 'default' }}
    >
      {/* Canvas for all games */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Score Display */}
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
          <div className="text-xs text-white/50 uppercase tracking-wider">{gameInfo.label}</div>
          <div className="text-2xl font-bold tabular-nums" style={{ color: gameInfo.color }}>{score}</div>
        </div>
      </div>

      {/* Game Controls Legend */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 hidden lg:block">
        <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Controls</div>
        <div className="text-xs text-white/70 space-y-1">
          {currentGame === 'snake' && (
            <>
              <div>Arrow Keys / WASD</div>
              <div>to move</div>
            </>
          )}
          {currentGame === 'pong' && (
            <>
              <div>Mouse Up/Down</div>
              <div>to move paddle</div>
            </>
          )}
          {currentGame === 'tetris' && (
            <>
              <div>← → to move</div>
              <div>↑ rotate, ↓ drop</div>
            </>
          )}
          {currentGame === 'spaceInvaders' && (
            <>
              <div>← → to move</div>
              <div>Space to shoot</div>
            </>
          )}
          {currentGame === 'brickBreaker' && (
            <>
              <div>Mouse Left/Right</div>
              <div>to move paddle</div>
            </>
          )}
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">GAME OVER</div>
            <div className="text-xl mb-4" style={{ color: gameInfo.color }}>Score: {score}</div>
            <div className="text-white/60 text-sm">Click to restart</div>
          </div>
        </div>
      )}

      {/* Interactive Hint - Fluid sizing with CSS clamp() for any screen */}
      {showHint && !gameOver && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 bg-black/70 backdrop-blur-md rounded-full border border-white/40 flex items-center shadow-lg"
          style={{
            bottom: 'clamp(4rem, 12vh, 7rem)',
            padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
            gap: 'clamp(0.25rem, 0.8vw, 0.5rem)',
          }}
        >
          <Gamepad2
            className="flex-shrink-0"
            style={{
              color: gameInfo.color,
              width: 'clamp(0.75rem, 2vw, 1rem)',
              height: 'clamp(0.75rem, 2vw, 1rem)',
            }}
          />
          <span
            className="text-white font-medium whitespace-nowrap"
            style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.875rem)' }}
          >
            {gameInfo.hint}
          </span>
        </div>
      )}
    </div>
  );
}

// Interactive Code Playground Types - Connected to Games!
type CodeExample = {
  id: string;
  title: string;
  code: string;
  output: string;
  gameMode: GameMode;
  mascotMood: 'excited' | 'thinking' | 'celebrating' | 'waving';
};

const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 'snake',
    title: '🐍 Snake',
    code: 'snake = Snake()\nwhile snake.alive:\n    snake.move(direction)\n    if snake.eats(food):\n        snake.grow()',
    output: '🐍 Snake game started!',
    gameMode: 'snake',
    mascotMood: 'excited',
  },
  {
    id: 'pong',
    title: '🏓 Pong',
    code: 'game = Pong()\npaddle.y = mouse.y\nball.bounce(paddle)\nprint("Score:", score)',
    output: '🏓 Pong game started!',
    gameMode: 'pong',
    mascotMood: 'waving',
  },
  {
    id: 'tetris',
    title: '🧱 Tetris',
    code: 'piece = Tetromino()\nwhile playing:\n    piece.fall()\n    if key("left"):\n        piece.move_left()\n    if line_complete():\n        clear_line()',
    output: '🧱 Tetris started!',
    gameMode: 'tetris',
    mascotMood: 'celebrating',
  },
  {
    id: 'invaders',
    title: '👾 Invaders',
    code: 'ship = Spaceship()\nif key_pressed("space"):\n    ship.shoot()\nfor alien in aliens:\n    if bullet.hits(alien):\n        score += 10',
    output: '👾 Space Invaders started!',
    gameMode: 'spaceInvaders',
    mascotMood: 'excited',
  },
  {
    id: 'brickBreaker',
    title: '🧱 Breaker',
    code: 'paddle.x = mouse.x\nball.move()\nfor brick in bricks:\n    if ball.hits(brick):\n        brick.destroy()\n        score += 10',
    output: '🧱 Brick Breaker started!',
    gameMode: 'brickBreaker',
    mascotMood: 'celebrating',
  },
];

// Interactive Code Playground - Connected to Background Games!
function InteractiveCodePlayground({ onGameChange }: { onGameChange?: (mode: GameMode) => void }) {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);
  const [mascotBlink, setMascotBlink] = useState(false);

  const currentExample = CODE_EXAMPLES[currentExampleIndex];
  const outputRef = useRef<HTMLDivElement>(null);

  // Mascot blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setMascotBlink(true);
      setTimeout(() => setMascotBlink(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Games only change when user manually selects a different example
  // No auto-cycling - users control when to switch games

  // Type out code character by character
  const runCodeDemo = useCallback(() => {
    setShowOutput(false);
    setDisplayedCode('');
    setIsTyping(true);
    setParticles([]);

    const code = currentExample.code;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < code.length) {
        setDisplayedCode(code.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Show output after typing completes
        setTimeout(() => {
          setShowOutput(true);
          spawnVisualEffect(currentExample.gameMode);

          // Trigger background game change!
          if (onGameChange) {
            onGameChange(currentExample.gameMode);
          }
          // Game stays active until user manually selects another
        }, 500);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentExample, onGameChange]);

  // Spawn visual effects based on game type
  const spawnVisualEffect = (gameMode: GameMode) => {
    const newParticles: Array<{ id: number; x: number; y: number; emoji: string; delay: number }> = [];
    const emojis: Record<GameMode, string[]> = {
      snake: ['🐍', '🍎', '✨', '💚'],
      pong: ['🏓', '⚪', '💙', '✨'],
      tetris: ['🧱', '💛', '🟦', '🟩'],
      spaceInvaders: ['👾', '🚀', '💜', '⭐'],
      brickBreaker: ['🧱', '🔴', '🟠', '💖'],
    };

    const selectedEmojis = emojis[gameMode] || emojis.snake;

    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        emoji: selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)],
        delay: i * 0.1,
      });
    }

    setParticles(newParticles);
  };

  // Get mascot expression based on mood
  const getMascotFace = () => {
    const mood = currentExample.mascotMood;
    if (mascotBlink) return '😊';
    switch (mood) {
      case 'excited': return '🤩';
      case 'thinking': return '🤔';
      case 'celebrating': return '🥳';
      case 'waving': return '😄';
      default: return '😊';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Container - Code Editor Style */}
      <div className="relative rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden backdrop-blur-sm shadow-2xl">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-white/50 ml-2 font-mono">my_first_code.py</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Example Selector Pills */}
            <div className="hidden sm:flex items-center gap-1">
              {CODE_EXAMPLES.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setCurrentExampleIndex(idx);
                    setDisplayedCode('');
                    setShowOutput(false);
                    setParticles([]);
                  }}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                    idx === currentExampleIndex
                      ? 'bg-violet-500 text-white'
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                >
                  {ex.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Area with Mascot */}
        <div className="relative flex">
          {/* Mascot Character */}
          <div className="absolute -left-2 -top-2 z-20 hidden sm:block">
            <div className="relative">
              {/* Mascot Body */}
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white/20 transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer"
                style={{ animation: 'mascotBounce 2s ease-in-out infinite' }}
              >
                <span className="text-2xl">{getMascotFace()}</span>
              </div>
              {/* Speech Bubble */}
              <div className="absolute -right-2 top-0 transform translate-x-full">
                <div className="relative bg-white rounded-lg px-2 py-1 shadow-md">
                  <span className="text-xs font-medium text-slate-700">
                    {isTyping ? 'Typing...' : showOutput ? 'It works!' : 'Watch this!'}
                  </span>
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white transform rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4 sm:pl-20 min-h-[140px]">
            {/* Line Numbers */}
            <div className="flex">
              <div className="text-right pr-4 select-none">
                {(displayedCode || currentExample.code).split('\n').map((_, i) => (
                  <div key={i} className="text-xs text-white/30 font-mono leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code Content */}
              <div className="flex-1 font-mono text-sm">
                <pre className="text-emerald-400 leading-6 whitespace-pre-wrap">
                  {displayedCode || <span className="text-white/30">Click &quot;Run&quot; to see the magic...</span>}
                  {isTyping && <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div
          ref={outputRef}
          className={`relative border-t border-white/10 bg-slate-950/50 overflow-hidden transition-all duration-500 ${
            showOutput ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Output:
            </div>
            <div className="font-mono text-lg text-white font-bold">
              {currentExample.output}
            </div>
          </div>

          {/* Floating Particle Effects */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute text-2xl pointer-events-none"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animation: `floatUp 2s ease-out ${particle.delay}s forwards`,
                opacity: 0,
              }}
            >
              {particle.emoji}
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={runCodeDemo}
              disabled={isTyping}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              <Play className="w-4 h-4" />
              Run Code
            </button>
            <button
              onClick={() => {
                setCurrentExampleIndex((prev) => (prev + 1) % CODE_EXAMPLES.length);
                setDisplayedCode('');
                setShowOutput(false);
                setParticles([]);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-sm transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              Next
            </button>
          </div>
          <div className="text-xs text-white/40">
            ✨ Your kids will build this!
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-sm text-white/50 mt-4 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-xs">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Interactive Demo
        </span>
        See what your child will learn to create
      </p>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% {
            transform: translateY(-60px) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes mascotBounce {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-5px) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}
import UpcomingClassesSection from "../components/home/UpcomingClassesSection";

// Age groups for course selector
const ageGroups = [
  { id: "young", label: "Ages 5-8", icon: "🎨", color: "from-pink-500 to-rose-500" },
  { id: "kids", label: "Ages 9-12", icon: "🎮", color: "from-violet-500 to-purple-600" },
  { id: "teens", label: "Ages 13-16", icon: "💻", color: "from-blue-500 to-cyan-600" },
  { id: "advanced", label: "Ages 16+", icon: "🚀", color: "from-emerald-500 to-green-600" },
];

const features = [
  {
    icon: Gamepad2,
    title: "Learn by Playing",
    description: "Every lesson feels like a game with points, badges, and rewards.",
    image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=400&h=300&fit=crop",
  },
  {
    icon: Users,
    title: "Live 1:1 Mentors",
    description: "Real instructors who know each student by name.",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop",
  },
  {
    icon: Rocket,
    title: "Build Real Projects",
    description: "Create games, websites, and apps that actually work.",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "Kid-friendly platform with parent dashboards.",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop",
  },
];

const testimonials = [
  {
    quote: "My son went from playing games all day to building his own. The transformation is incredible!",
    name: "Sarah M.",
    role: "Parent of Marcus, 12",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote: "I built a website for my mom's bakery! She was so proud. Now I want to make apps too.",
    name: "Emma T.",
    role: "Student, Age 14",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
  },
  {
    quote: "The instructors are patient and make coding fun. My daughter actually looks forward to lessons.",
    name: "David K.",
    role: "Parent of Lily, 9",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

const studentProjects = [
  {
    name: "Space Shooter",
    creator: "Alex, Age 11",
    description: "A thrilling arcade game where you defend Earth from alien invaders",
    icon: Rocket,
    color: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=250&fit=crop",
  },
  {
    name: "Weather App",
    creator: "Maya, Age 13",
    description: "Real-time weather forecasts with beautiful animations",
    icon: Globe,
    color: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=250&fit=crop",
  },
  {
    name: "Pet Care Bot",
    creator: "Sam, Age 10",
    description: "An AI chatbot that helps kids learn how to care for pets",
    icon: Brain,
    color: "from-emerald-500 to-green-600",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop",
  },
  {
    name: "Music Mixer",
    creator: "Jordan, Age 14",
    description: "Create your own beats and melodies with this interactive app",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=250&fit=crop",
  },
];

const stats = [
  { value: "500+", label: "Active Students", icon: Users },
  { value: "98%", label: "Parent Satisfaction", icon: Heart },
  { value: "4.9", label: "Star Rating", icon: Star },
  { value: "50+", label: "Expert Instructors", icon: GraduationCap },
];

// Section navigation items
const sectionNavItems = [
  { id: "courses", label: "Courses", icon: Target },
  { id: "features", label: "Why Us", icon: Zap },
  { id: "showcase", label: "Showcase", icon: Rocket },
  { id: "testimonials", label: "Reviews", icon: Heart },
];

// Smooth scroll to section
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export default function HomePage() {
  const [selectedAge, setSelectedAge] = useState("kids");
  const [showVideo, setShowVideo] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showScrollNav, setShowScrollNav] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('snake');

  // Scroll spy - detect which section is in view
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 150;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Show navigation after scrolling past hero
    setShowScrollNav(window.scrollY > 400);

    // Check if near bottom
    if (window.scrollY + windowHeight >= documentHeight - 100) {
      setActiveSection("testimonials");
      return;
    }

    // Find active section
    for (const item of sectionNavItems) {
      const element = document.getElementById(item.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(item.id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-violet-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 text-violet-400" />
                  <p className="text-lg">Video demo would play here</p>
                  <p className="text-sm text-slate-400 mt-2">Add your YouTube/Vimeo embed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Interactive Storytelling with Diverse Kids */}
      <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-indigo-950 via-violet-950 to-slate-950">
        {/* Animated World Map Background */}
        <div className="absolute inset-0 z-0">
          {/* Base gradient with cultural warmth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-indigo-950 to-slate-950" />

          {/* Animated connection lines representing global community */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Connection paths between "kids around the world" */}
            <path d="M100,300 Q300,100 500,300 T900,300" stroke="url(#lineGrad)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDuration: '4s' }} />
            <path d="M50,400 Q250,200 450,350 T850,250" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
            <path d="M150,200 Q350,400 550,250 T950,350" stroke="url(#lineGrad)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          </svg>

          {/* Floating gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/30 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-500/20 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
            <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-amber-500/15 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
          </div>

          {/* Stars/sparkles background - using deterministic positions */}
          <div className="absolute inset-0">
            {[
              { x: 5, y: 12, s: 1.5, o: 0.3, d: 2.5, dl: 0 },
              { x: 15, y: 8, s: 2, o: 0.4, d: 3, dl: 1 },
              { x: 25, y: 20, s: 1.2, o: 0.2, d: 4, dl: 2 },
              { x: 35, y: 5, s: 1.8, o: 0.35, d: 2.8, dl: 0.5 },
              { x: 45, y: 15, s: 1.3, o: 0.25, d: 3.5, dl: 1.5 },
              { x: 55, y: 10, s: 2.2, o: 0.45, d: 2.2, dl: 2.5 },
              { x: 65, y: 22, s: 1.6, o: 0.3, d: 4.5, dl: 0.8 },
              { x: 75, y: 8, s: 1.4, o: 0.2, d: 3.2, dl: 1.8 },
              { x: 85, y: 18, s: 2.5, o: 0.5, d: 2.7, dl: 3 },
              { x: 95, y: 12, s: 1.1, o: 0.15, d: 4.2, dl: 0.3 },
              { x: 10, y: 35, s: 1.7, o: 0.35, d: 3.8, dl: 1.2 },
              { x: 20, y: 42, s: 2.1, o: 0.4, d: 2.3, dl: 2.2 },
              { x: 30, y: 38, s: 1.3, o: 0.25, d: 4.8, dl: 0.7 },
              { x: 40, y: 45, s: 1.9, o: 0.45, d: 2.9, dl: 1.7 },
              { x: 50, y: 32, s: 1.5, o: 0.3, d: 3.6, dl: 2.8 },
              { x: 60, y: 48, s: 2.3, o: 0.5, d: 2.1, dl: 0.4 },
              { x: 70, y: 40, s: 1.2, o: 0.2, d: 4.4, dl: 1.4 },
              { x: 80, y: 35, s: 1.8, o: 0.35, d: 3.1, dl: 2.4 },
              { x: 90, y: 42, s: 2.6, o: 0.45, d: 2.6, dl: 3.5 },
              { x: 8, y: 55, s: 1.4, o: 0.25, d: 4.1, dl: 0.9 },
              { x: 18, y: 62, s: 2, o: 0.4, d: 2.4, dl: 1.9 },
              { x: 28, y: 58, s: 1.6, o: 0.3, d: 3.9, dl: 2.9 },
              { x: 38, y: 65, s: 1.1, o: 0.15, d: 4.6, dl: 0.2 },
              { x: 48, y: 52, s: 2.4, o: 0.5, d: 2, dl: 1.1 },
              { x: 58, y: 68, s: 1.7, o: 0.35, d: 3.4, dl: 2.1 },
              { x: 68, y: 55, s: 1.3, o: 0.25, d: 4.3, dl: 3.1 },
              { x: 78, y: 62, s: 2.2, o: 0.45, d: 2.5, dl: 0.6 },
              { x: 88, y: 58, s: 1.5, o: 0.3, d: 3.7, dl: 1.6 },
              { x: 12, y: 75, s: 1.9, o: 0.4, d: 2.8, dl: 2.6 },
              { x: 22, y: 82, s: 1.2, o: 0.2, d: 4.7, dl: 3.6 },
              { x: 32, y: 78, s: 2.5, o: 0.5, d: 2.2, dl: 0.1 },
              { x: 42, y: 85, s: 1.4, o: 0.25, d: 3.3, dl: 1.3 },
              { x: 52, y: 72, s: 1.8, o: 0.35, d: 4, dl: 2.3 },
              { x: 62, y: 88, s: 2.1, o: 0.45, d: 2.3, dl: 3.3 },
              { x: 72, y: 75, s: 1.6, o: 0.3, d: 3.5, dl: 0.5 },
              { x: 82, y: 82, s: 1.1, o: 0.15, d: 4.9, dl: 1.5 },
              { x: 92, y: 78, s: 2.3, o: 0.4, d: 2.1, dl: 2.5 },
              { x: 3, y: 92, s: 1.7, o: 0.35, d: 3.6, dl: 3.8 },
              { x: 97, y: 95, s: 1.3, o: 0.25, d: 4.2, dl: 0.8 },
              { x: 50, y: 90, s: 2, o: 0.4, d: 2.7, dl: 1.8 },
            ].map((star, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${star.s}px`,
                  height: `${star.s}px`,
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  opacity: star.o,
                  animation: `twinkle ${star.d}s ease-in-out infinite`,
                  animationDelay: `${star.dl}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Living Game Background - Interactive floating elements */}
        <div className="absolute inset-0 z-10">
          <LivingGameBackground gameMode={gameMode} />
        </div>

        {/* Main Content - Responsive Hero */}
        <div className="relative z-20 min-h-screen flex flex-col pointer-events-none py-4">
          {/* Enable pointer events only on interactive elements */}
          {/* Hero Content - Two Column Layout */}
          <div className="flex-1 flex items-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-20">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="text-center lg:text-left space-y-3 sm:space-y-5 lg:space-y-6">
                  {/* Small Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-xs font-medium text-white/80">Live classes • Ages 5-18</span>
                  </div>

                  {/* Main Headline - Compact but Bold */}
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                    Turn your child into a{' '}
                    <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                      future creator
                    </span>
                  </h1>

                  {/* Subheadline - Concise */}
                  <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    Expert-led 1:1 coding classes with game-based learning.
                    Kids build real projects while having fun.
                  </p>

                  {/* CTA Row */}
                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-3 pt-1 sm:pt-2 pointer-events-auto">
                    <Link
                      href="/free-trial"
                      className="group relative inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-slate-900 font-bold text-sm shadow-2xl shadow-white/20 hover:shadow-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 w-full sm:w-auto justify-center overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2">
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                    <button
                      onClick={() => setShowVideo(true)}
                      aria-label="Watch video"
                      className="inline-flex items-center gap-2 px-4 py-3 text-white/70 hover:text-white text-sm font-medium transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                      Watch demo
                    </button>
                  </div>

                  {/* Compact Trust Row - Hidden on very small screens */}
                  <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-white/50 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      No credit card
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      4.9 rating
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-violet-400" />
                      2,000+ students
                    </span>
                  </div>
                </div>

                {/* Right Column - Interactive Code Playground */}
                <div className="hidden lg:block pointer-events-auto">
                  <InteractiveCodePlayground onGameChange={setGameMode} />
                </div>
              </div>

              {/* Mobile Code Playground - Smaller version */}
              <div className="lg:hidden mt-4 sm:mt-6 pointer-events-auto">
                <div className="transform scale-[0.85] sm:scale-90 origin-top -mb-8 sm:-mb-4">
                  <InteractiveCodePlayground onGameChange={setGameMode} />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator - Fluid sizing with CSS clamp() for any screen */}
          <div
            className="flex justify-center pointer-events-auto"
            style={{ padding: 'clamp(0.375rem, 2vh, 1rem) 0' }}
          >
            <button
              onClick={() => scrollToSection('courses')}
              aria-label="Scroll down to explore courses"
              className="flex flex-col items-center text-white/90 hover:text-white transition-colors group"
              style={{ gap: 'clamp(0.125rem, 0.5vh, 0.25rem)' }}
            >
              <span
                className="font-semibold uppercase tracking-wider"
                style={{ fontSize: 'clamp(0.45rem, 1.2vw, 0.75rem)' }}
              >
                Explore
              </span>
              <ChevronDown
                className="animate-bounce group-hover:scale-110 transition-transform"
                style={{
                  width: 'clamp(0.875rem, 3vw, 1.5rem)',
                  height: 'clamp(0.875rem, 3vw, 1.5rem)',
                }}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.5); }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          :global(.animate-gradient-x) {
            animation: gradient-x 3s ease infinite;
          }
          @keyframes kidFloat {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
          }
          @keyframes codeFloat {
            0%, 100% { transform: translateY(0) rotate(-3deg); opacity: 0.15; }
            50% { transform: translateY(-10px) rotate(3deg); opacity: 0.25; }
          }
          @keyframes floatCard {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
          }
          @keyframes shimmer {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
          }
          @keyframes sparkle {
            0% { transform: scale(0) translateY(0); opacity: 1; }
            100% { transform: scale(1.5) translateY(-20px); opacity: 0; }
          }
          @keyframes drawSquare {
            0% { stroke-dashoffset: 240; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes moveTurtle {
            0% { transform: translate(0, 0); }
            25% { transform: translate(0, 60px); }
            50% { transform: translate(-60px, 60px); }
            75% { transform: translate(-60px, 0); }
            100% { transform: translate(0, 0); }
          }
        `}</style>
      </section>

      {/* Floating Side Navigation - Scroll Spy */}
      <div
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 hidden md:block ${
          showScrollNav ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full py-3 px-2 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center gap-3">
            {sectionNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md scale-110"
                      : "text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  {/* Tooltip */}
                  <span className="absolute right-full mr-3 px-2 py-1 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - with integrated scroll to top */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
          showScrollNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 shadow-lg safe-area-pb">
          <div className="flex items-center justify-around py-2 px-2">
            {sectionNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                  <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -top-0.5 w-1 h-1 rounded-full bg-violet-600" />
                  )}
                </button>
              );
            })}
            {/* Scroll to Top - integrated in mobile nav */}
            <button
              onClick={scrollToTop}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
            >
              <ChevronUp className="w-5 h-5" />
              <span className="text-[10px] font-medium">Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button - Desktop only, positioned above chatbot */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg hidden md:flex items-center justify-center transition-all duration-300 ${
          showScrollNav ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="relative group">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-lg hover:-translate-y-1">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-violet-500" />
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Preparing Kids for Careers At
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">
              World-Leading Tech Companies
            </h3>
          </div>

          {/* Logo Marquee - Infinite Scroll */}
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Container */}
            <div className="flex overflow-hidden">
              <div className="flex items-center gap-8 sm:gap-12 animate-marquee">
                {[
                  { name: "Google", color: "text-blue-500", icon: "G" },
                  { name: "Amazon", color: "text-orange-500", icon: "aws" },
                  { name: "Meta", color: "text-blue-600", icon: "∞" },
                  { name: "Microsoft", color: "text-cyan-500", icon: "⊞" },
                  { name: "Apple", color: "text-slate-700 dark:text-slate-300", icon: "" },
                  { name: "Netflix", color: "text-red-600", icon: "N" },
                  { name: "Spotify", color: "text-green-500", icon: "♪" },
                  { name: "Airbnb", color: "text-pink-500", icon: "⌂" },
                  { name: "Tesla", color: "text-red-500", icon: "T" },
                  { name: "Uber", color: "text-slate-900 dark:text-white", icon: "U" },
                ].map((company, i) => (
                  <div
                    key={`${company.name}-${i}`}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow shrink-0"
                  >
                    <span className={`text-xl sm:text-2xl font-bold ${company.color}`}>
                      {company.icon}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                      {company.name}
                    </span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  { name: "Google", color: "text-blue-500", icon: "G" },
                  { name: "Amazon", color: "text-orange-500", icon: "aws" },
                  { name: "Meta", color: "text-blue-600", icon: "∞" },
                  { name: "Microsoft", color: "text-cyan-500", icon: "⊞" },
                  { name: "Apple", color: "text-slate-700 dark:text-slate-300", icon: "" },
                  { name: "Netflix", color: "text-red-600", icon: "N" },
                  { name: "Spotify", color: "text-green-500", icon: "♪" },
                  { name: "Airbnb", color: "text-pink-500", icon: "⌂" },
                  { name: "Tesla", color: "text-red-500", icon: "T" },
                  { name: "Uber", color: "text-slate-900 dark:text-white", icon: "U" },
                ].map((company, i) => (
                  <div
                    key={`${company.name}-dup-${i}`}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow shrink-0"
                  >
                    <span className={`text-xl sm:text-2xl font-bold ${company.color}`}>
                      {company.icon}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                      {company.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supporting Text */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 sm:mt-8 max-w-2xl mx-auto">
            Our curriculum teaches the same programming languages and concepts used by engineers at these companies
          </p>
        </div>

        {/* Marquee Animation */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Age-Based Course Selector - Like Tynker */}
      <section id="courses" className="py-16 px-4 bg-gradient-to-b from-white to-violet-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-4">
              <Target className="w-4 h-4" /> Find Your Perfect Course
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              How Old Is Your Child?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We&apos;ll recommend the perfect learning path
            </p>
          </div>

          {/* Age Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {ageGroups.map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedAge === age.id
                    ? `bg-gradient-to-br ${age.color} border-transparent text-white shadow-xl scale-105`
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg"
                }`}
              >
                <div className="text-4xl mb-2">{age.icon}</div>
                <div className={`font-bold ${selectedAge === age.id ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {age.label}
                </div>
              </button>
            ))}
          </div>

          {/* CTA for selected age */}
          <div className="text-center">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <MousePointerClick className="w-5 h-5" />
              See Recommended Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" /> Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Not Just Lessons. <span className="text-violet-600 dark:text-violet-400">Adventures.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We built something different - a place where kids actually want to learn.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Classes */}
      <UpcomingClassesSection />

      {/* Student Projects Showcase */}
      <section id="showcase" className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" /> Student Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Built by Kids Like You
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Check out these amazing projects created by our talented students
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentProjects.map((project) => (
              <div
                key={project.name}
                className="group h-full overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all hover:shadow-xl hover:-translate-y-2"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image src={project.image} alt={project.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-60`} />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {project.creator}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg`}>
                      <project.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{project.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-semibold hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" /> Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Loved by Families
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-serif">
                  &ldquo;
                </div>
                <div className="flex gap-1 mb-4 pt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-violet-200 dark:border-violet-800">
                    <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-violet-100 dark:from-slate-900 dark:to-violet-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-1">
            <div className="relative rounded-[2.25rem] bg-white dark:bg-slate-900 p-8 sm:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200/50 to-pink-200/50 dark:from-violet-900/30 dark:to-pink-900/30 rounded-full blur-3xl" />

              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-6">
                    <Sparkles className="w-4 h-4" />
                    Now Enrolling for 2025
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                    Start Learning Today!
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Join 500+ kids already building games, websites, and apps. Your child&apos;s coding adventure starts here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/free-trial"
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg shadow-xl shadow-violet-500/30 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      <Sparkles className="w-5 h-5" />
                      Try a Free Class
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/programs"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Rocket className="w-5 h-5" />
                      Browse Programs
                    </Link>
                  </div>
                  <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    Each child gets <span className="text-violet-600 dark:text-violet-400 font-semibold">1 free class</span> to experience our teaching style!
                  </p>
                </div>

                <div className="relative hidden lg:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop&q=80"
                      alt="Diverse group of happy kids celebrating together"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Achievement Unlocked!</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">First Line of Code</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
