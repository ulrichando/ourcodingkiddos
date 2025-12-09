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

// Game info - shared between components
const GAME_INFO: Record<GameMode, { label: string; hint: string; color: string }> = {
  snake: { label: '🐍 Snake', hint: 'Use arrow keys or WASD to move!', color: '#22c55e' },
  pong: { label: '🏓 Pong', hint: 'Move mouse up/down to control paddle!', color: '#3b82f6' },
  tetris: { label: '🧱 Tetris', hint: 'Arrow keys to move, Up to rotate, Down to drop!', color: '#eab308' },
  spaceInvaders: { label: '👾 Space Invaders', hint: 'Arrow keys to move, Space to shoot!', color: '#8b5cf6' },
  brickBreaker: { label: '🧱 Brick Breaker', hint: 'Move mouse to control paddle!', color: '#ec4899' },
};

// Classic Arcade Games Background Component
function LivingGameBackground({ gameMode = 'snake', onScoreUpdate }: { gameMode?: GameMode; onScoreUpdate?: (score: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
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

  // Responsive scale factor helper
  const getResponsiveScale = useCallback((width: number, height: number) => {
    return Math.min(width, height) / 800;
  }, []);

  // Initialize game when mode changes
  const initGame = useCallback((mode: GameMode, width: number, height: number) => {
    scoreRef.current = 0;
    setScore(0);
    gameOverRef.current = false;
    setGameOver(false);

    // Responsive scale factor
    const scale = getResponsiveScale(width, height);
    const gridSize = Math.max(12, Math.round(20 * scale));

    switch (mode) {
      case 'snake': {
        // Initialize Snake with responsive grid
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

      case 'pong': {
        // Initialize Pong with responsive sizes
        const paddleH = Math.max(50, Math.round(80 * scale));
        const ballR = Math.max(5, Math.round(8 * scale));
        const ballSpeed = Math.max(2, 4 * scale);
        paddleRef.current = { y: height / 2 - paddleH / 2, h: paddleH };
        aiPaddleRef.current = { y: height / 2 - paddleH / 2, h: paddleH };
        ballRef.current = { x: width / 2, y: height / 2, vx: ballSpeed, vy: ballSpeed / 2, r: ballR };
        break;
      }

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

      case 'spaceInvaders': {
        // Initialize Space Invaders with responsive sizes
        const shipW = Math.max(25, Math.round(40 * scale));
        const shipH = Math.max(15, Math.round(20 * scale));
        const alienSpacingX = Math.max(35, Math.round(50 * scale));
        const alienSpacingY = Math.max(30, Math.round(40 * scale));
        const alienStartX = Math.max(40, Math.round(60 * scale));
        const alienStartY = Math.max(40, Math.round(60 * scale));
        // Calculate how many columns fit
        const alienCols = Math.min(8, Math.max(4, Math.floor((width - alienStartX * 2) / alienSpacingX)));

        // Position ship with guaranteed visibility - at least 50px from bottom, responsive offset
        const shipBottomOffset = Math.max(50, Math.min(80, height * 0.12));
        shipRef.current = { x: width / 2 - shipW / 2, y: height - shipH - shipBottomOffset, w: shipW, h: shipH };
        bulletsRef.current = [];
        aliensRef.current = [];
        alienDirRef.current = 1;
        // Create alien grid - responsive number of columns
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < alienCols; col++) {
            aliensRef.current.push({
              x: alienStartX + col * alienSpacingX,
              y: alienStartY + row * alienSpacingY,
              alive: true,
            });
          }
        }
        break;
      }

      case 'brickBreaker': {
        // Initialize Brick Breaker with responsive sizes
        const paddleW = Math.max(60, Math.round(100 * scale));
        const paddleH = Math.max(10, Math.round(15 * scale));
        const ballR = Math.max(5, Math.round(8 * scale));
        const ballSpeed = Math.max(2, 3 * scale);

        paddleBBRef.current = { x: width / 2 - paddleW / 2, w: paddleW, h: paddleH };
        ballBBRef.current = { x: width / 2, y: height - 100, vx: ballSpeed, vy: -ballSpeed, r: ballR };
        bricksRef.current = [];
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
        const brickW = Math.max(40, Math.round(60 * scale));
        const brickH = Math.max(15, Math.round(20 * scale));
        const brickGap = Math.max(3, Math.round(5 * scale));
        const brickPadding = Math.max(15, Math.round(20 * scale));
        const cols = Math.max(4, Math.floor((width - brickPadding * 2) / (brickW + brickGap)));
        const rows = Math.min(5, Math.max(3, Math.floor((height * 0.3) / (brickH + brickGap))));
        const startX = (width - cols * (brickW + brickGap) + brickGap) / 2;
        const startY = Math.max(40, Math.round(60 * scale));

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            bricksRef.current.push({
              x: startX + col * (brickW + brickGap),
              y: startY + row * (brickH + brickGap),
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
  }, [getResponsiveScale]);

  // Handle game mode changes
  useEffect(() => {
    setCurrentGame(gameMode);
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

      // Tetris immediate input - reset move timer to allow responsive controls
      if (currentGame === 'tetris') {
        const key = e.key.toLowerCase();
        if (key === 'arrowleft' || key === 'a' || key === 'arrowright' || key === 'd' || key === 'arrowup' || key === 'w') {
          tetrisLastMoveRef.current = 0; // Allow immediate movement
        }
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

    // Calculate responsive scale factor (reference: 800px)
    const getScale = () => Math.min(canvas.width, canvas.height) / 800;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      // Responsive scale factor
      const scale = getScale();
      const gridSize = Math.max(12, Math.round(20 * scale));

      // Clear canvas to transparent - allows background to show through
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gameInfo = GAME_INFO[currentGame];

      if (gameOverRef.current) {
        // Game Over Screen - responsive text sizes
        const titleSize = Math.max(24, Math.round(48 * scale));
        const scoreSize = Math.max(14, Math.round(24 * scale));
        const hintSize = Math.max(12, Math.round(18 * scale));

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${titleSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - titleSize * 0.6);
        ctx.font = `${scoreSize}px sans-serif`;
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + scoreSize * 0.8);
        ctx.fillStyle = gameInfo.color;
        ctx.font = `${hintSize}px sans-serif`;
        ctx.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + scoreSize * 0.8 + hintSize * 2);
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
          // Responsive paddle width
          const paddleW = Math.max(10, Math.round(15 * scale));

          // Player paddle follows mouse
          paddle.y = Math.max(0, Math.min(canvas.height - paddle.h, mouseRef.current.y - paddle.h / 2));

          // AI paddle - responsive speed
          const aiSpeed = Math.max(2, 3 * scale);
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

          // Ball out of bounds - responsive ball reset speed
          const resetSpeed = Math.max(2, 4 * scale);
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
            ball.vx = resetSpeed * (Math.random() > 0.5 ? 1 : -1);
            ball.vy = (resetSpeed / 2) * (Math.random() - 0.5);
          }

          // Draw paddles
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(0, paddle.y, paddleW, paddle.h);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(canvas.width - paddleW, aiPaddle.y, paddleW, aiPaddle.h);

          // Draw ball - theme aware color
          const isDarkPong = document.documentElement.classList.contains('dark');
          ctx.fillStyle = isDarkPong ? '#fff' : '#1e293b';
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
          ctx.fill();

          // Draw center line - responsive dash
          const dashSize = Math.max(5, Math.round(10 * scale));
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.setLineDash([dashSize, dashSize]);
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

          // Handle input - reduced debounce for responsive controls
          const now = Date.now();
          if (now - tetrisLastMoveRef.current > 80) {
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

          // Responsive sizes
          const shipSpeed = Math.max(3, 5 * scale);
          const alienSpeed = Math.max(0.3, 0.5 * scale);
          const alienW = Math.max(20, Math.round(30 * scale));
          const alienH = Math.max(15, Math.round(25 * scale));
          const alienDropDist = Math.max(12, Math.round(20 * scale));
          const bulletW = Math.max(3, Math.round(4 * scale));
          const bulletH = Math.max(6, Math.round(10 * scale));
          const eyeSize = Math.max(4, Math.round(6 * scale));

          // Ship movement
          if (keysRef.current.has('arrowleft') || keysRef.current.has('a')) ship.x -= shipSpeed * dt;
          if (keysRef.current.has('arrowright') || keysRef.current.has('d')) ship.x += shipSpeed * dt;
          ship.x = Math.max(0, Math.min(canvas.width - ship.w, ship.x));

          // Update bullets
          for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y += bullets[i].vy * dt;
            if (bullets[i].y < 0) bullets.splice(i, 1);
          }

          // Update aliens
          let moveDown = false;
          const edgePadding = Math.max(15, Math.round(20 * scale));
          aliens.forEach(alien => {
            if (alien.alive) {
              alien.x += alienDirRef.current * alienSpeed * dt;
              if (alien.x < edgePadding || alien.x > canvas.width - alienW - edgePadding) moveDown = true;
            }
          });
          if (moveDown) {
            alienDirRef.current *= -1;
            aliens.forEach(a => { if (a.alive) a.y += alienDropDist; });
          }

          // Bullet-alien collision
          bullets.forEach((bullet, bi) => {
            aliens.forEach(alien => {
              if (alien.alive && bullet.x > alien.x && bullet.x < alien.x + alienW && bullet.y > alien.y && bullet.y < alien.y + alienH) {
                alien.alive = false;
                bullets.splice(bi, 1);
                scoreRef.current += 10;
                setScore(scoreRef.current);
              }
            });
          });

          // Check game over - responsive bottom threshold
          const bottomThreshold = Math.max(60, Math.round(100 * scale));
          if (aliens.some(a => a.alive && a.y > canvas.height - bottomThreshold)) {
            gameOverRef.current = true;
            setGameOver(true);
          }

          // Check win - reset with responsive positioning
          if (!aliens.some(a => a.alive)) {
            scoreRef.current += 100;
            setScore(scoreRef.current);
            // Reset aliens with responsive spacing
            const alienSpacingX = Math.max(35, Math.round(50 * scale));
            const alienSpacingY = Math.max(30, Math.round(40 * scale));
            const alienStartX = Math.max(40, Math.round(60 * scale));
            const alienStartY = Math.max(40, Math.round(60 * scale));
            const alienCols = Math.min(8, Math.max(4, Math.floor((canvas.width - alienStartX * 2) / alienSpacingX)));
            aliens.length = 0;
            for (let row = 0; row < 4; row++) {
              for (let col = 0; col < alienCols; col++) {
                aliens.push({ x: alienStartX + col * alienSpacingX, y: alienStartY + row * alienSpacingY, alive: true });
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

          // Draw bullets - responsive size
          ctx.fillStyle = '#eab308';
          bullets.forEach(b => ctx.fillRect(b.x - bulletW / 2, b.y, bulletW, bulletH));

          // Draw aliens - responsive size
          aliens.forEach(alien => {
            if (alien.alive) {
              ctx.fillStyle = '#8b5cf6';
              ctx.fillRect(alien.x, alien.y, alienW, alienH);
              // Eyes - responsive
              ctx.fillStyle = '#fff';
              const eyeOffset = Math.round(alienW * 0.17);
              const eyeY = Math.round(alienH * 0.32);
              ctx.fillRect(alien.x + eyeOffset, alien.y + eyeY, eyeSize, eyeSize);
              ctx.fillRect(alien.x + alienW - eyeOffset - eyeSize, alien.y + eyeY, eyeSize, eyeSize);
            }
          });
        }

        // ===== BRICK BREAKER =====
        if (currentGame === 'brickBreaker') {
          const paddle = paddleBBRef.current;
          const ball = ballBBRef.current;
          const bricks = bricksRef.current;

          // Responsive paddle position
          const paddleY = canvas.height - Math.max(20, Math.round(30 * scale));
          const paddleCollisionTop = canvas.height - Math.max(30, Math.round(40 * scale));
          const paddleCollisionBottom = canvas.height - Math.max(15, Math.round(25 * scale));

          // Paddle follows mouse
          paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, mouseRef.current.x - paddle.w / 2));

          // Ball movement
          ball.x += ball.vx * dt;
          ball.y += ball.vy * dt;

          // Ball collision with walls
          if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.vx *= -1;
          if (ball.y < ball.r) ball.vy *= -1;

          // Ball collision with paddle - responsive collision zone
          if (ball.y > paddleCollisionTop && ball.y < paddleCollisionBottom &&
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

          // Draw paddle - responsive position
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(paddle.x, paddleY, paddle.w, paddle.h);

          // Draw ball - theme aware color
          const isDarkBB = document.documentElement.classList.contains('dark');
          ctx.fillStyle = isDarkBB ? '#fff' : '#1e293b';
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
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Container - Clean Terminal Style with fixed minimum height */}
      <div className="relative rounded-2xl bg-slate-900/95 border border-white/10 overflow-hidden backdrop-blur-sm shadow-2xl min-h-[400px]">
        {/* Editor Header - Fixed height to prevent layout shift */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-800/80 border-b border-white/10 h-[52px]">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-sm text-white/60 font-mono min-w-[100px]">{currentExample.title}.py</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Example Selector Pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {CODE_EXAMPLES.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setCurrentExampleIndex(idx);
                    setDisplayedCode('');
                    setShowOutput(false);
                    setParticles([]);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    idx === currentExampleIndex
                      ? 'bg-violet-500 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {ex.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Area */}
        <div className="relative">
          {/* Code Editor */}
          <div className="p-6 h-[200px]">
            {/* Line Numbers */}
            <div className="flex h-full">
              <div className="text-right pr-6 select-none border-r border-white/10 mr-6">
                {/* Always show 6 line numbers for consistent height */}
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="text-sm text-white/30 font-mono leading-7">
                    {num}
                  </div>
                ))}
              </div>
              {/* Code Content */}
              <div className="flex-1 font-mono text-base overflow-hidden">
                <pre className="text-emerald-400 leading-7 whitespace-pre-wrap">
                  {displayedCode || <span className="text-white/40">Click "Run" to see the magic...</span>}
                  {isTyping && <span className="inline-block w-2 h-5 bg-emerald-400 animate-pulse ml-0.5" />}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Output Area - Fixed height to prevent layout shift */}
        <div
          ref={outputRef}
          className="relative border-t border-white/10 bg-slate-950/50 h-[72px] overflow-hidden"
        >
          <div className={`p-5 transition-opacity duration-300 ${showOutput ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-2 text-xs text-white/50 mb-2 font-mono">
              <span className={`w-2 h-2 rounded-full bg-green-500 ${showOutput ? 'animate-pulse' : ''}`} />
              Output:
            </div>
            <div className="font-mono text-xl text-white font-bold">
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

        {/* Action Bar - Fixed height to prevent layout shift */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-800/50 border-t border-white/10 h-[60px]">
          <div className="flex items-center gap-3">
            <button
              onClick={runCodeDemo}
              disabled={isTyping}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Next
            </button>
          </div>
          <div className="text-sm text-white/50">
            Your kids will build this!
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

// Age groups for course selector (matches database: AGES_7_10, AGES_11_14, AGES_15_18, AGES_18_PLUS)
const ageGroups = [
  { id: "kids", label: "Ages 7-10", icon: "🎨", color: "from-pink-500 to-rose-500" },
  { id: "tweens", label: "Ages 11-14", icon: "🎮", color: "from-violet-500 to-purple-600" },
  { id: "teens", label: "Ages 15-18", icon: "💻", color: "from-blue-500 to-cyan-600" },
  { id: "young-adults", label: "Ages 18+", icon: "🎓", color: "from-emerald-500 to-teal-600" },
];

const features = [
  {
    icon: Gamepad2,
    title: "Learn by Playing",
    description: "Every lesson feels like a game with points, badges, and rewards.",
    image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&h=300&fit=crop", // Kids playing with technology
  },
  {
    icon: Users,
    title: "Live 1:1 Mentors",
    description: "Real instructors who know each student by name.",
    image: "https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", // Black male teacher
  },
  {
    icon: Rocket,
    title: "Build Real Projects",
    description: "Create games, websites, and apps that actually work.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop", // Kids learning technology
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "Kid-friendly platform with parent dashboards.",
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=300&fit=crop", // Happy diverse children
  },
];

const testimonials = [
  {
    quote: "My son went from playing games all day to building his own. The transformation is incredible!",
    name: "Amara J.",
    role: "Parent of Kwame, 12",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop", // African woman portrait
  },
  {
    quote: "I built a website for my mom's bakery! She was so proud. Now I want to make apps too.",
    name: "Sofia R.",
    role: "Student, Age 14",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", // Young girl portrait
  },
  {
    quote: "The instructors are patient and make coding fun. My daughter actually looks forward to lessons.",
    name: "Wei Chen",
    role: "Parent of Mei, 9",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", // Asian man portrait
  },
];

const stats = [
  { value: "500+", label: "Active Students", icon: Users },
  { value: "98%", label: "Parent Satisfaction", icon: Heart },
  { value: "4.9", label: "Star Rating", icon: Star },
  { value: "50+", label: "Expert Instructors", icon: GraduationCap },
];

export default function HomePage() {
  const [selectedAge, setSelectedAge] = useState("kids");
  const [showVideo, setShowVideo] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('snake');

  // Auto-scale hero content to fit any screen
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [heroScale, setHeroScale] = useState(1);

  // Calculate optimal scale for hero content to fit viewport
  const calculateHeroScale = useCallback(() => {
    if (!heroContentRef.current) return;

    const headerHeight = 56; // h-14 = 3.5rem = 56px
    const paddingY = 48; // pb-6 + some margin = ~48px
    const availableHeight = window.innerHeight - headerHeight - paddingY;
    const contentHeight = heroContentRef.current.scrollHeight;

    // Only scale down if content is too tall, never scale up beyond 1
    if (contentHeight > availableHeight) {
      const scale = Math.max(0.65, availableHeight / contentHeight); // Min scale 0.65
      setHeroScale(scale);
    } else {
      setHeroScale(1);
    }
  }, []);

  // Listen for resize events and recalculate scale
  useEffect(() => {
    calculateHeroScale();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateHeroScale, 100);
    };

    window.addEventListener('resize', handleResize);

    // Also recalculate on orientation change (mobile)
    window.addEventListener('orientationchange', () => {
      setTimeout(calculateHeroScale, 200);
    });

    // Initial calculation after fonts/images load
    if (document.readyState === 'complete') {
      calculateHeroScale();
    } else {
      window.addEventListener('load', calculateHeroScale);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', calculateHeroScale);
      clearTimeout(resizeTimeout);
    };
  }, [calculateHeroScale]);


  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
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

      {/* Hero Section - Modern 2025 Design with Light/Dark Theme Support */}
      {/* Using h-[100dvh] for exact viewport height - dvh handles mobile browser chrome */}
      <section className="relative h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Theme-Adaptive Background */}
        <div className="absolute inset-0 z-0">
          {/* Light mode - Clean gradient */}
          <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/50 to-slate-100" />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
            {/* Gradient orbs for light mode */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/40 to-pink-200/30 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/20 blur-[80px]" />
          </div>

          {/* Dark mode - Gaming aesthetic */}
          <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-slate-950 to-slate-950" />

            {/* Retro Grid Floor - Perspective effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 h-[70%]"
                style={{
                  background: `
                    linear-gradient(to bottom, transparent 0%, rgba(139, 92, 246, 0.15) 100%),
                    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(139, 92, 246, 0.2) 39px, rgba(139, 92, 246, 0.2) 40px),
                    repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(139, 92, 246, 0.15) 39px, rgba(139, 92, 246, 0.15) 40px)
                  `,
                  transform: 'perspective(400px) rotateX(65deg)',
                  transformOrigin: 'bottom',
                }}
              />
            </div>

          {/* Animated Neon Lines - Horizontal scanlines - MORE VISIBLE */}
          <div className="absolute inset-0 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`scanline-${i}`}
                className="absolute left-0 right-0 h-[3px]"
                style={{
                  top: `${15 + i * 22}%`,
                  background: 'linear-gradient(90deg, transparent 0%, #22d3ee 20%, #a855f7 50%, #22d3ee 80%, transparent 100%)',
                  boxShadow: '0 0 20px #22d3ee, 0 0 40px #a855f7',
                  animation: `scanline ${4 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.8}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          {/* Floating Neon Orbs - MUCH MORE VIBRANT */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[5%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-500/60 to-fuchsia-500/30 blur-[80px] animate-float-slow" />
            <div className="absolute top-[15%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan-400/50 to-blue-500/30 blur-[70px] animate-float-medium" />
            <div className="absolute bottom-[15%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-500/50 to-rose-500/30 blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-[25%] right-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-400/40 to-teal-500/20 blur-[60px] animate-float-medium" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-[50px] animate-float-medium" style={{ animationDelay: '3s' }} />
          </div>

          {/* Pixel/Game-themed floating elements - MUCH LARGER */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Pixels - Bigger and brighter */}
            {[
              { x: 5, y: 12, size: 20, color: '#22c55e', delay: 0 },
              { x: 92, y: 20, size: 16, color: '#3b82f6', delay: 1 },
              { x: 12, y: 65, size: 24, color: '#eab308', delay: 2 },
              { x: 88, y: 55, size: 18, color: '#ec4899', delay: 0.5 },
              { x: 48, y: 8, size: 14, color: '#8b5cf6', delay: 1.5 },
              { x: 22, y: 38, size: 22, color: '#06b6d4', delay: 2.5 },
              { x: 78, y: 75, size: 16, color: '#f97316', delay: 0.8 },
              { x: 35, y: 82, size: 20, color: '#a855f7', delay: 1.8 },
              { x: 65, y: 30, size: 12, color: '#10b981', delay: 3 },
              { x: 8, y: 45, size: 15, color: '#f43f5e', delay: 2.2 },
              { x: 95, y: 85, size: 18, color: '#6366f1', delay: 0.3 },
              { x: 55, y: 92, size: 14, color: '#14b8a6', delay: 1.2 },
            ].map((pixel, i) => (
              <div
                key={`pixel-${i}`}
                className="absolute animate-float-pixel rounded-sm"
                style={{
                  left: `${pixel.x}%`,
                  top: `${pixel.y}%`,
                  width: `${pixel.size}px`,
                  height: `${pixel.size}px`,
                  backgroundColor: pixel.color,
                  boxShadow: `0 0 ${pixel.size}px ${pixel.color}, 0 0 ${pixel.size * 2}px ${pixel.color}, 0 0 ${pixel.size * 3}px ${pixel.color}80`,
                  animationDelay: `${pixel.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Arcade-style corner decorations - MORE VISIBLE */}
          <svg className="absolute top-0 left-0 w-48 h-48 opacity-40" viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z" fill="url(#cornerGrad)" />
            <defs>
              <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <svg className="absolute top-0 right-0 w-48 h-48 opacity-40 rotate-90" viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z" fill="url(#cornerGrad2)" />
            <defs>
              <linearGradient id="cornerGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Stars with glow effect */}
          <div className="absolute inset-0">
            {[
              { x: 5, y: 12, s: 2, o: 0.6, d: 2.5, dl: 0 },
              { x: 15, y: 8, s: 3, o: 0.7, d: 3, dl: 1 },
              { x: 25, y: 20, s: 2, o: 0.5, d: 4, dl: 2 },
              { x: 35, y: 5, s: 2.5, o: 0.6, d: 2.8, dl: 0.5 },
              { x: 55, y: 10, s: 3, o: 0.8, d: 2.2, dl: 2.5 },
              { x: 75, y: 8, s: 2, o: 0.5, d: 3.2, dl: 1.8 },
              { x: 85, y: 18, s: 3.5, o: 0.9, d: 2.7, dl: 3 },
              { x: 95, y: 12, s: 2, o: 0.4, d: 4.2, dl: 0.3 },
              { x: 10, y: 35, s: 2.5, o: 0.6, d: 3.8, dl: 1.2 },
              { x: 30, y: 38, s: 2, o: 0.5, d: 4.8, dl: 0.7 },
              { x: 50, y: 32, s: 2, o: 0.5, d: 3.6, dl: 2.8 },
              { x: 70, y: 40, s: 2, o: 0.4, d: 4.4, dl: 1.4 },
              { x: 90, y: 42, s: 3, o: 0.7, d: 2.6, dl: 3.5 },
            ].map((star, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${star.s}px`,
                  height: `${star.s}px`,
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  backgroundColor: '#fff',
                  boxShadow: '0 0 4px #fff, 0 0 8px #8b5cf6',
                  opacity: star.o,
                  animation: `twinkle ${star.d}s ease-in-out infinite`,
                  animationDelay: `${star.dl}s`,
                }}
              />
            ))}
          </div>

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
          </div>
        </div>

        {/* Living Game Background - Interactive floating elements */}
        <div className="absolute inset-0 z-10">
          <LivingGameBackground gameMode={gameMode} />
        </div>

        {/* Main Content - Responsive Hero with Auto-Scale */}
        <div className="relative z-20 h-full flex flex-col pointer-events-none">
          {/* Enable pointer events only on interactive elements */}
          {/* Hero Content - Two Column Layout with auto-scaling */}
          {/* Padding top accounts for sticky header (h-14 = 3.5rem) */}
          <div
            ref={heroContentRef}
            className="flex-1 flex items-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 origin-top transition-transform duration-300 ease-out"
            style={{ transform: `scale(${heroScale})` }}
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid tablet:grid-cols-2 items-center gap-6 tablet:gap-8 lg:gap-12">
                {/* Left Column - Text Content */}
                <div className="text-center tablet:text-left flex flex-col gap-3 sm:gap-4">
                  {/* Small Badge - Theme adaptive */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/10 dark:bg-white/10 border border-slate-900/20 dark:border-white/20 backdrop-blur-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 dark:bg-emerald-400" />
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-white/90">Live classes • Ages 7+</span>
                  </div>

                  {/* Main Headline - BIGGER for 2025 */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
                    Turn your child into a{' '}
                    <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 dark:from-violet-400 dark:via-pink-400 dark:to-amber-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(167,139,250,0.3)] dark:drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">
                      future creator
                    </span>
                  </h1>

                  {/* Subheadline - Slightly larger */}
                  <p className="text-base sm:text-lg tablet:text-lg lg:text-xl xl:text-2xl text-slate-600 dark:text-white/80 max-w-xl mx-auto tablet:mx-0 leading-relaxed font-medium">
                    Expert-led 1:1 coding classes with game-based learning.
                    Kids build real projects while having fun.
                  </p>

                  {/* CTA Row - Bigger buttons */}
                  <div className="flex flex-col sm:flex-row items-center tablet:items-start gap-4 pt-4 pointer-events-auto">
                    <Link
                      href="/free-trial"
                      className="group relative inline-flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-violet-600 dark:bg-white text-white dark:text-slate-900 font-bold text-base sm:text-lg shadow-2xl shadow-violet-600/25 dark:shadow-white/25 hover:shadow-violet-600/50 dark:hover:shadow-white/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 w-full sm:w-auto justify-center overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-700 to-pink-600 dark:from-violet-100 dark:to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2">
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                    <button
                      onClick={() => setShowVideo(true)}
                      aria-label="Watch video"
                      className="inline-flex items-center gap-2.5 px-5 py-3.5 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white text-base font-semibold transition-colors hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-full"
                    >
                      <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                      Watch demo
                    </button>
                  </div>

                  {/* Privacy Policy Link - Always visible for Google verification */}
                  <div className="flex justify-center tablet:justify-start pt-3 pointer-events-auto">
                    <Link
                      href="/privacy"
                      className="text-xs text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/70 underline"
                    >
                      Privacy Policy
                    </Link>
                  </div>

                  {/* Compact Trust Row - Hidden on very small screens */}
                  <div className="hidden sm:flex flex-wrap items-center justify-center tablet:justify-start gap-4 text-xs text-slate-500 dark:text-white/50 pt-2 pointer-events-auto">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      No credit card
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                      4.9 rating
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                      2,000+ students
                    </span>
                    <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-white/70 underline">
                      Privacy Policy
                    </Link>
                  </div>
                </div>

                {/* Right Column - Interactive Code Playground (visible on tablet and up) */}
                <div className="hidden tablet:block pointer-events-auto">
                  <div className="tablet:scale-[0.85] lg:scale-100 origin-top-right">
                    <InteractiveCodePlayground onGameChange={setGameMode} />
                  </div>
                  {/* Game Controls Hint - Under the terminal, same row as Free Trial */}
                  <div className="flex justify-center mt-20">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                      <Gamepad2
                        className="flex-shrink-0 w-5 h-5"
                        style={{
                          color: GAME_INFO[gameMode].color,
                          filter: `drop-shadow(0 0 4px ${GAME_INFO[gameMode].color}60)`,
                        }}
                      />
                      <span className="text-white/80 font-medium text-sm">
                        {GAME_INFO[gameMode].hint}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Code Playground - Viewport-responsive (hidden on tablet and up) */}
              <div className="tablet:hidden pointer-events-auto mt-4 sm:mt-6">
                <div className="origin-top scale-[0.72] sm:scale-[0.82] -mb-16 sm:-mb-12">
                  <InteractiveCodePlayground onGameChange={setGameMode} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator - Absolutely positioned at bottom of hero */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-30 flex justify-center pointer-events-auto">
          <a
            href="#courses"
            aria-label="Scroll down to explore courses"
            className="group flex flex-col items-center gap-1.5 transition-all duration-300 hover:scale-105"
          >
            <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-slate-600 dark:text-white/80 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
              Explore
            </span>
            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
              {/* Outer ring with pulse */}
              <div className="absolute inset-0 rounded-full border-2 border-slate-400/40 dark:border-white/40 opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-[pulse-ring_2s_ease-out_infinite]" />
              {/* Inner circle */}
              <div className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/10 dark:bg-white/15 group-hover:bg-slate-900/20 dark:group-hover:bg-white/25 border border-slate-400/30 dark:border-white/30 backdrop-blur-sm transition-all duration-300" />
              <ChevronDown
                className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white transition-all duration-300 animate-[float-down_1.5s_ease-in-out_infinite]"
                aria-hidden="true"
              />
            </div>
          </a>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.5); }
          }
          @keyframes scanline {
            0%, 100% { transform: translateX(-100%); opacity: 0; }
            50% { transform: translateX(100%); opacity: 0.5; }
          }
          :global(.animate-float-slow) {
            animation: floatSlow 8s ease-in-out infinite;
          }
          :global(.animate-float-medium) {
            animation: floatMedium 6s ease-in-out infinite;
          }
          :global(.animate-float-pixel) {
            animation: floatPixel 4s ease-in-out infinite;
          }
          @keyframes floatSlow {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(20px, -20px) scale(1.05); }
            66% { transform: translate(-10px, 10px) scale(0.95); }
          }
          @keyframes floatMedium {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(15px, -25px) rotate(5deg); }
          }
          @keyframes floatPixel {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
            25% { transform: translateY(-10px) rotate(45deg); opacity: 1; }
            50% { transform: translateY(-5px) rotate(90deg); opacity: 0.9; }
            75% { transform: translateY(-15px) rotate(135deg); opacity: 1; }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          :global(.animate-gradient-x) {
            animation: gradient-x 3s ease infinite;
          }
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.15); opacity: 0.2; }
            100% { transform: scale(1.3); opacity: 0; }
          }
          @keyframes float-down {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
          }
          :global(.animate-fade-in-up) {
            animation: fade-in-up 0.4s ease-out forwards;
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translate(-50%, 10px); }
            100% { opacity: 1; transform: translate(-50%, 0); }
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

      {/* Tech Industry Skills Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Learn Skills Used At
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
                  { name: "Google", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )},
                  { name: "Amazon", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#FF9900" d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/>
                    </svg>
                  )},
                  { name: "Meta", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#0081FB" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  )},
                  { name: "Microsoft", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#F25022" d="M1 1h10v10H1z"/>
                      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                      <path fill="#FFB900" d="M13 13h10v10H13z"/>
                    </svg>
                  )},
                  { name: "Apple", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  )},
                  { name: "Netflix", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#E50914" d="M5.398 0l8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z"/>
                    </svg>
                  )},
                  { name: "Epic Games", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M3.537 0C2.165 0 1.66.506 1.66 1.879V18.44c0 .255.02.37.088.478.067.108.108.128.206.184l8.37 4.736c.168.095.282.16.453.16.17 0 .284-.065.453-.16l8.369-4.736c.099-.056.14-.076.207-.184.067-.108.088-.223.088-.478V1.879C19.894.506 19.389 0 18.017 0H3.537zm4.141 5.033h4.78c.157 0 .283.127.283.283v1.603c0 .156-.126.283-.283.283H9.28v1.57h2.963c.156 0 .283.127.283.284v1.603c0 .156-.127.283-.283.283H9.28v1.57h3.178c.157 0 .283.126.283.283v1.602c0 .157-.126.284-.283.284H7.678a.283.283 0 0 1-.283-.284V5.316c0-.156.127-.283.283-.283z"/>
                    </svg>
                  )},
                  { name: "Nintendo", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#E60012" d="M0 .6h7.1v22.8H0zm8.4 0h7.1v22.8H8.4zm8.5 0H24v22.8h-7.1zm-12 4.4c1.5 0 2.7 1.2 2.7 2.7S6.4 10.4 4.9 10.4 2.2 9.2 2.2 7.7s1.2-2.7 2.7-2.7zm0 1.3c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4z"/>
                    </svg>
                  )},
                  { name: "Spotify", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  )},
                  { name: "Tesla", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#CC0000" d="M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-.146-1.439-1.154-1.79-4.354-1.79L12 24 8.619 5.038c-3.18 0-4.188.351-4.333 1.79 0 0-2.15-.802-3.232-2.438 4.227-1.964 8.472-2.054 8.472-2.054L12 5.362zM12 5.362v.028-.028z"/>
                    </svg>
                  )},
                  { name: "Roblox", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M18.926 23.998L0 18.892 5.075.002 24 5.108l-5.074 18.89zM10.982 9.1l-1.456 5.422 5.472 1.469 1.456-5.423-5.472-1.468z"/>
                    </svg>
                  )},
                  { name: "Unity", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M10.4 12l6.1-6.1L18.6 12l-2.1 6.1-6.1-6.1zM0 12l10.4-6.1V0L0 6v6zm10.4 6.1L0 12v6l10.4 6v-5.9zm3.2-12.2V0L24 6l-6.1 3.5-4.3-3.6zm3.9 6.1l6.4 3.9-10.3 6.1v-6.1l3.9-3.9z"/>
                    </svg>
                  )},
                ].map((company, i) => (
                  <div
                    key={`${company.name}-${i}`}
                    className="flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow shrink-0"
                  >
                    {company.icon}
                    <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                      {company.name}
                    </span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  { name: "Google", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )},
                  { name: "Amazon", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#FF9900" d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/>
                    </svg>
                  )},
                  { name: "Meta", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#0081FB" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  )},
                  { name: "Microsoft", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#F25022" d="M1 1h10v10H1z"/>
                      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                      <path fill="#FFB900" d="M13 13h10v10H13z"/>
                    </svg>
                  )},
                  { name: "Apple", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  )},
                  { name: "Netflix", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#E50914" d="M5.398 0l8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z"/>
                    </svg>
                  )},
                  { name: "Epic Games", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M3.537 0C2.165 0 1.66.506 1.66 1.879V18.44c0 .255.02.37.088.478.067.108.108.128.206.184l8.37 4.736c.168.095.282.16.453.16.17 0 .284-.065.453-.16l8.369-4.736c.099-.056.14-.076.207-.184.067-.108.088-.223.088-.478V1.879C19.894.506 19.389 0 18.017 0H3.537zm4.141 5.033h4.78c.157 0 .283.127.283.283v1.603c0 .156-.126.283-.283.283H9.28v1.57h2.963c.156 0 .283.127.283.284v1.603c0 .156-.127.283-.283.283H9.28v1.57h3.178c.157 0 .283.126.283.283v1.602c0 .157-.126.284-.283.284H7.678a.283.283 0 0 1-.283-.284V5.316c0-.156.127-.283.283-.283z"/>
                    </svg>
                  )},
                  { name: "Nintendo", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#E60012" d="M0 .6h7.1v22.8H0zm8.4 0h7.1v22.8H8.4zm8.5 0H24v22.8h-7.1zm-12 4.4c1.5 0 2.7 1.2 2.7 2.7S6.4 10.4 4.9 10.4 2.2 9.2 2.2 7.7s1.2-2.7 2.7-2.7zm0 1.3c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4z"/>
                    </svg>
                  )},
                  { name: "Spotify", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  )},
                  { name: "Tesla", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#CC0000" d="M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-.146-1.439-1.154-1.79-4.354-1.79L12 24 8.619 5.038c-3.18 0-4.188.351-4.333 1.79 0 0-2.15-.802-3.232-2.438 4.227-1.964 8.472-2.054 8.472-2.054L12 5.362zM12 5.362v.028-.028z"/>
                    </svg>
                  )},
                  { name: "Roblox", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M18.926 23.998L0 18.892 5.075.002 24 5.108l-5.074 18.89zM10.982 9.1l-1.456 5.422 5.472 1.469 1.456-5.423-5.472-1.468z"/>
                    </svg>
                  )},
                  { name: "Unity", icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-800 dark:text-white" fill="currentColor">
                      <path d="M10.4 12l6.1-6.1L18.6 12l-2.1 6.1-6.1-6.1zM0 12l10.4-6.1V0L0 6v6zm10.4 6.1L0 12v6l10.4 6v-5.9zm3.2-12.2V0L24 6l-6.1 3.5-4.3-3.6zm3.9 6.1l6.4 3.9-10.3 6.1v-6.1l3.9-3.9z"/>
                    </svg>
                  )},
                ].map((company, i) => (
                  <div
                    key={`${company.name}-dup-${i}`}
                    className="flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow shrink-0"
                  >
                    {company.icon}
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

      {/* Placement Test Section */}
      <section id="placement-test" className="py-20 px-4 bg-gradient-to-b from-violet-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-4">
              <Brain className="w-4 h-4" /> Skill Assessment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Discover Your Child&apos;s <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Coding Level</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Take our fun placement test to find the perfect starting point. Get personalized course recommendations in just 5 minutes!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Multiple Choice Card */}
            <Link
              href="/placement-exam"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 p-1 hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:-translate-y-2"
            >
              <div className="h-full rounded-[22px] bg-white dark:bg-slate-900 p-6 sm:p-8">
                <div className="w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Quick Quiz</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm sm:text-base">
                  15 questions covering programming basics, web development, and logic. Timed challenges with streak bonuses!
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    <Zap className="w-3 h-3" /> 5 min
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    <Star className="w-3 h-3" /> Instant Results
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  Start Quiz <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>

            {/* Gamified Challenge Card */}
            <Link
              href="/placement-exam"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-1 hover:shadow-2xl hover:shadow-violet-500/25 transition-all hover:-translate-y-2"
            >
              <div className="h-full rounded-[22px] bg-white dark:bg-slate-900 p-6 sm:p-8">
                <div className="w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Fun Challenges</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm sm:text-base">
                  Interactive puzzles, code debugging, drag-and-drop activities, and sequence challenges. Learn while playing!
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium">
                    <Sparkles className="w-3 h-3" /> 9 Challenges
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium">
                    <Trophy className="w-3 h-3" /> Earn Points
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold group-hover:gap-3 transition-all">
                  Start Challenge <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Free certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>No account required</span>
            </div>
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
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80"
                      alt="Diverse group of happy kids learning together in classroom"
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

      {/* Trust & Legal Section */}
      <section className="py-8 px-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>COPPA Compliant</span>
            </div>
            <Link
              href="/privacy"
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/safety"
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
            >
              Child Safety
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
