const gameBoardParams = { gap: 15, size: 400 };

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game2048(4);
    const boardEl = document.getElementById('game-board');
    const currScoreEl = document.getElementById('current-score');
    const bestScoreEl = document.getElementById('best-score');
    const restartBtn = document.getElementById('restart-btn');
    const retryBtn = document.getElementById('retry-btn');
    const messageEl = document.getElementById('game-message');
    const messageText = document.getElementById('message-text');
    const themeBtn = document.getElementById('theme-btn');
    const controlsBtn = document.getElementById('controls-btn');
    const gestureIndicator = document.getElementById('gesture-indicator');
    
    // Create Background Grid
    for (let i = 0; i < 16; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        boardEl.appendChild(cell);
    }
    
    let previousGrid = [];

    // Synthesize simple sounds
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    let soundEnabled = true;

    function playSound(type) {
        if (!soundEnabled) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        
        if (type === 'merge') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, actx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, actx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, actx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.1);
            osc.start(actx.currentTime);
            osc.stop(actx.currentTime + 0.1);
        } else if (type === 'over') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, actx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, actx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.3, actx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.5);
            osc.start(actx.currentTime);
            osc.stop(actx.currentTime + 0.5);
        } else if (type === 'win') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, actx.currentTime);
            osc.frequency.setValueAtTime(600, actx.currentTime + 0.1);
            osc.frequency.setValueAtTime(800, actx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.2, actx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.5);
            osc.start(actx.currentTime);
            osc.stop(actx.currentTime + 0.5);
        }
    }

    // Determine sizes
    function getTilePosition(r, c) {
        // Adjust for responsive layout
        const boardWidth = boardEl.clientWidth;
        const gap = boardWidth > 350 ? 15 : 10;
        const cellSize = (boardWidth - gap * 5) / 4;
        
        return {
            x: c * (cellSize + gap) + gap,
            y: r * (cellSize + gap) + gap,
            size: cellSize
        };
    }

    function renderBoard() {
        // Remove existing tiles
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(t => t.remove());

        // Render current state
        for (let r = 0; r < game.size; r++) {
            for (let c = 0; c < game.size; c++) {
                if (game.grid[r][c] !== 0) {
                    const val = game.grid[r][c];
                    const pos = getTilePosition(r, c);
                    
                    const tileEl = document.createElement('div');
                    tileEl.className = `tile tile-${val}`;
                    tileEl.style.width = `${pos.size}px`;
                    tileEl.style.height = `${pos.size}px`;
                    tileEl.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                    
                    const innerEl = document.createElement('div');
                    innerEl.className = 'tile-inner';
                    innerEl.textContent = val;
                    
                    // Check if it's merged or new (can be improved with ID tracking, simple animation for now)
                    
                    tileEl.appendChild(innerEl);
                    boardEl.appendChild(tileEl);
                }
            }
        }
        
        // Save state
        previousGrid = JSON.parse(JSON.stringify(game.grid));
    }

    function showIndicator(dir) {
        gestureIndicator.classList.add('gesture-active');
        const dirMap = { left: '⬅️ LEFT', right: '➡️ RIGHT', up: '⬆️ UP', down: '⬇️ DOWN' };
        gestureIndicator.innerText = dirMap[dir];
        setTimeout(() => {
            gestureIndicator.classList.remove('gesture-active');
            gestureIndicator.innerText = 'Waiting for hand...';
        }, 300);
    }

    function handleMove(direction) {
        if(game.over || game.won) return;
        let moved = game.move(direction);
        if (moved) {
            playSound('merge');
            showIndicator(direction);
            renderBoard();
        }
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (!controlsEnabled) return;
        switch (e.key) {
            case 'ArrowLeft': handleMove('left'); break;
            case 'ArrowRight': handleMove('right'); break;
            case 'ArrowUp': handleMove('up'); break;
            case 'ArrowDown': handleMove('down'); break;
        }
    });

    // Handle touch swipes (for mobile)
    let touchStartX = 0;
    let touchStartY = 0;
    boardEl.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, {passive: false});

    boardEl.addEventListener('touchend', e => {
        if(game.over) return;
        let touchEndX = e.changedTouches[0].clientX;
        let touchEndY = e.changedTouches[0].clientY;
        
        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > 30) {
                if (dx > 0) handleMove('right');
                else handleMove('left');
            }
        } else {
            if (Math.abs(dy) > 30) {
                if (dy > 0) handleMove('down');
                else handleMove('up');
            }
        }
        e.preventDefault();
    }, {passive: false});

    // Gesture callback
    onGestureDetected = (dir) => {
        if (controlsEnabled) handleMove(dir);
    };

    // Game Events
    game.onScoreUpdate = (score, best, added) => {
        currScoreEl.innerText = score;
        bestScoreEl.innerText = best;
        
        const additionEl = document.getElementById('score-addition');
        additionEl.innerText = `+${added}`;
        additionEl.style.animation = 'none';
        additionEl.offsetHeight; // trigger reflow
        additionEl.style.animation = 'move-up 600ms ease-in forwards';
    };

    game.onGameOver = () => {
        messageEl.style.display = 'flex';
        messageText.innerText = 'Game Over!';
        playSound('over');
    };

    game.onWin = () => {
        messageEl.style.display = 'flex';
        messageText.innerText = 'You Win! 🎉';
        messageText.style.color = '#edc22e';
        playSound('win');
    };

    function restart() {
        messageEl.style.display = 'none';
        messageText.style.color = '';
        currScoreEl.innerText = "0";
        game.init();
        renderBoard();
    }

    restartBtn.addEventListener('click', restart);
    retryBtn.addEventListener('click', restart);

    // Toggles
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeBtn.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    const soundBtn = document.getElementById('sound-btn');
    soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.innerText = soundEnabled ? '🔊' : '🔇';
    });

    let controlsEnabled = true;
    controlsBtn.addEventListener('click', () => {
        controlsEnabled = !controlsEnabled;
        isGestureControlEnabled = controlsEnabled;
        controlsBtn.innerText = controlsEnabled ? '⌨️' : '🚫';
        if (!controlsEnabled) {
            gestureIndicator.innerText = 'Controls Disabled';
        } else {
            gestureIndicator.innerText = 'Waiting for hand...';
        }
    });

    // Initialize particles background
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        let p = document.createElement('div');
        p.className = 'particle';
        let size = Math.random() * 50 + 20;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.animationDuration = Math.random() * 10 + 5 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(p);
    }

    window.addEventListener('resize', () => {
        renderBoard(); // re-position tiles
    });

    // First render
    currScoreEl.innerText = game.score;
    bestScoreEl.innerText = game.bestScore;
    renderBoard();
});
