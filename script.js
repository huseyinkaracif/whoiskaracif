document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    
    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursor.style.transform = `translate3d(${posX - 16}px, ${posY - 16}px, 0)`;
        cursorDot.style.transform = `translate3d(${posX - 2}px, ${posY - 2}px, 0)`;
    });

    const links = document.querySelectorAll('a, button, .game-btn');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('translate-x-full');
        mobileMenu.classList.toggle('active');
        
        // Burger Animation
        const spans = mobileBtn.querySelectorAll('span');
        spans[0].classList.toggle('rotate-45');
        spans[0].classList.toggle('translate-y-2');
        spans[1].classList.toggle('opacity-0');
        spans[2].classList.toggle('-rotate-45');
        spans[2].classList.toggle('-translate-y-2');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('active');
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
    // --- Games Logic ---
    const gameContainer = document.getElementById('game-container');
    const gameCanvasWrapper = document.getElementById('game-canvas-wrapper');
    let currentGame = null;

    window.openGame = function(gameType) {
        if (!gameContainer || !gameCanvasWrapper) return;
        gameContainer.classList.remove('hidden');
        gameContainer.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        switch(gameType) {
            case 'snake': initSnake(); break;
            case 'tictactoe': initTicTacToe(); break;
            case 'memory': initMemory(); break;
            case 'pong': initPong(); break;
            case 'minesweeper': initMinesweeper(); break;
        }
    };

    window.closeGame = function() {
        if (currentGame && currentGame.stop) currentGame.stop();
        gameContainer.classList.add('hidden');
        gameContainer.classList.remove('flex');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        gameCanvasWrapper.innerHTML = ''; // Clear game content
    };

    // --- Snake Game ---
    function initSnake() {
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Yılan (Snake)</h3>
            <div class="relative mb-4">
                <canvas id="snakeCanvas" width="400" height="400" class="bg-darker border-2 border-accent-primary/30 rounded-lg shadow-inner w-full max-w-[400px] aspect-square"></canvas>
                <div id="snakeOverlay" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-darker/80 rounded-lg">
                    <p class="text-white text-xl font-bold mb-4">Oyun Bitti!</p>
                    <button onclick="initSnake()" class="px-6 py-2 bg-accent-primary text-white rounded-full font-semibold">Tekrar Oyna</button>
                </div>
            </div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p>Skor: <span id="snakeScore" class="text-accent-primary">0</span></p>
                <p class="text-xs italic uppercase tracking-widest">Yön tuşlarını kullan</p>
            </div>
        `;

        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('snakeScore');
        const overlay = document.getElementById('snakeOverlay');
        
        const box = 20;
        let score = 0;
        let snake = [{x: 9 * box, y: 10 * box}];
        let food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        let d;
        let gameLoop;

        function direction(event) {
            // Sadece yön tuşları basıldığında ve sayfa kaydırılmasını önlemek için
            if([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                event.preventDefault();
            }
            if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
            else if(event.keyCode == 38 && d != "DOWN") d = "UP";
            else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
            else if(event.keyCode == 40 && d != "UP") d = "DOWN";
        }
        document.addEventListener("keydown", direction);

        function draw() {
            ctx.fillStyle = "#020202";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for(let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? "#6366f1" : "#4f46e5";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = "#020202";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            ctx.fillStyle = "#ec4899";
            ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if( d == "LEFT") snakeX -= box;
            if( d == "UP") snakeY -= box;
            if( d == "RIGHT") snakeX += box;
            if( d == "DOWN") snakeY += box;

            if(snakeX == food.x && snakeY == food.y) {
                score++;
                scoreElement.textContent = score;
                food = {
                    x: Math.floor(Math.random() * 19 + 1) * box,
                    y: Math.floor(Math.random() * 19 + 1) * box
                };
            } else {
                snake.pop();
            }

            let newHead = { x: snakeX, y: snakeY };

            if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
                clearInterval(gameLoop);
                overlay.classList.remove('hidden');
                return;
            }
            snake.unshift(newHead);
        }

        function collision(head, array) {
            for(let i = 0; i < array.length; i++) {
                if(head.x == array[i].x && head.y == array[i].y) return true;
            }
            return false;
        }

        // Set d initially to avoid unexpected behavior on the first move
        d = "RIGHT";

        gameLoop = setInterval(draw, 100);
        currentGame = { stop: () => { clearInterval(gameLoop); document.removeEventListener("keydown", direction); } };
    }

    // --- Tic-Tac-Toe Game ---
    function initTicTacToe() {
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Tic-Tac-Toe</h3>
            <div class="grid grid-cols-3 gap-3 mb-6 bg-darker p-3 rounded-xl border border-white/5" id="tttGrid">
                ${Array(9).fill(0).map((_, i) => `<button data-index="${i}" class="ttt-cell w-16 h-16 md:w-20 md:h-20 bg-surface-50 hover:bg-surface-100 rounded-lg text-3xl font-bold flex items-center justify-center transition-all duration-300"></button>`).join('')}
            </div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p id="tttStatus">Sıra: <span class="text-accent-tertiary font-bold uppercase">X</span></p>
                <button onclick="initTicTacToe()" class="text-xs hover:text-white underline uppercase">Sıfırla</button>
            </div>
        `;

        const cells = document.querySelectorAll('.ttt-cell');
        const statusDisplay = document.getElementById('tttStatus');
        let gameActive = true;
        let currentPlayer = "X";
        let gameState = ["", "", "", "", "", "", "", "", ""];

        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        function handleCellClick(e) {
            const clickedCell = e.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

            if (gameState[clickedCellIndex] !== "" || !gameActive) return;

            gameState[clickedCellIndex] = currentPlayer;
            clickedCell.textContent = currentPlayer;
            clickedCell.classList.add(currentPlayer === 'X' ? 'text-accent-tertiary' : 'text-accent-primary');

            checkResult();
        }

        function checkResult() {
            let roundWon = false;
            for (let i = 0; i < 8; i++) {
                const winCondition = winningConditions[i];
                let a = gameState[winCondition[0]];
                let b = gameState[winCondition[1]];
                let c = gameState[winCondition[2]];
                if (a === '' || b === '' || c === '') continue;
                if (a === b && b === c) {
                    roundWon = true;
                    break;
                }
            }

            if (roundWon) {
                statusDisplay.innerHTML = `<span class="${currentPlayer === 'X' ? 'text-accent-tertiary' : 'text-accent-primary'} font-bold">${currentPlayer}</span> Kazandı!`;
                gameActive = false;
                return;
            }

            let roundDraw = !gameState.includes("");
            if (roundDraw) {
                statusDisplay.innerHTML = "Berabere!";
                gameActive = false;
                return;
            }

            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusDisplay.innerHTML = `Sıra: <span class="${currentPlayer === 'X' ? 'text-accent-tertiary' : 'text-accent-primary'} font-bold">${currentPlayer}</span>`;

            if (currentPlayer === "O" && gameActive) {
                setTimeout(botMove, 500); // Küçük bir gecikme ekle, botun düşündüğünü hissettir
            }
        }

        function botMove() {
            let emptyCells = [];
            for (let i = 0; i < 9; i++) {
                if (gameState[i] === "") {
                    emptyCells.push(i);
                }
            }

            if (emptyCells.length > 0) {
                let randomIndex = Math.floor(Math.random() * emptyCells.length);
                let moveIndex = emptyCells[randomIndex];
                
                gameState[moveIndex] = currentPlayer;
                const cell = cells[moveIndex];
                cell.textContent = currentPlayer;
                cell.classList.add('text-accent-primary');
                checkResult();
            }
        }

        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        currentGame = { stop: () => { cells.forEach(cell => cell.removeEventListener('click', handleCellClick)); } };
    }

    // --- Memory Game ---
    function initMemory() {
        const symbols = ['fa-ghost', 'fa-fire', 'fa-bomb', 'fa-star', 'fa-moon', 'fa-sun', 'fa-heart', 'fa-bolt'];
        const deck = [...symbols, ...symbols].sort(() => 0.5 - Math.random());
        
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Hafıza Oyunu</h3>
            <div class="grid grid-cols-4 gap-3 mb-6" id="memoryGrid">
                ${deck.map((symbol, i) => `
                    <div class="memory-card w-14 h-14 md:w-16 md:h-16 bg-surface-50 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-300 relative transform hover:scale-105 border border-white/5" data-symbol="${symbol}">
                        <i class="fas ${symbol} text-2xl text-accent-primary opacity-0 pointer-events-none transition-opacity"></i>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p>Hamle: <span id="memoryMoves" class="text-accent-secondary">0</span></p>
                <button onclick="initMemory()" class="text-xs hover:text-white underline uppercase">Karıştır</button>
            </div>
        `;

        const cards = document.querySelectorAll('.memory-card');
        const movesElement = document.getElementById('memoryMoves');
        let flippedCards = [];
        let matchedCards = [];
        let moves = 0;
        let lockBoard = false;

        function flipCard() {
            if (lockBoard) return;
            if (this === flippedCards[0]) return;

            this.classList.add('bg-surface-100', 'border-accent-primary/50');
            this.querySelector('i').classList.remove('opacity-0');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = moves;
                checkMatch();
            }
        }

        function checkMatch() {
            const isMatch = flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol;
            isMatch ? disableCards() : unflipCards();
        }

        function disableCards() {
            flippedCards.forEach(card => {
                card.removeEventListener('click', flipCard);
                card.classList.replace('border-accent-primary/50', 'border-green-500/50');
            });
            matchedCards.push(...flippedCards);
            resetBoard();
        }

        function unflipCards() {
            lockBoard = true;
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('bg-surface-100', 'border-accent-primary/50');
                    card.querySelector('i').classList.add('opacity-0');
                });
                resetBoard();
            }, 1000);
        }

        function resetBoard() { [flippedCards, lockBoard] = [[], false]; }

        cards.forEach(card => card.addEventListener('click', flipCard));
        currentGame = { stop: () => {} };
    }

    // --- Ping Pong Game ---
    function initPong() {
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Ping Pong</h3>
            <canvas id="pongCanvas" width="400" height="300" class="bg-darker border-2 border-accent-primary/30 rounded-lg shadow-inner w-full max-w-[400px]"></canvas>
            <p class="text-xs italic text-gray-500 mt-4 uppercase">Mouse'u hareket ettirerek paleti kontrol et</p>
        `;

        const canvas = document.getElementById('pongCanvas');
        const ctx = canvas.getContext('2d');
        
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballDX = 3;
        let ballDY = -3;
        const ballRadius = 8;
        const paddleHeight = 10;
        const paddleWidth = 80;
        let paddleX = (canvas.width - paddleWidth) / 2;
        let gameLoop;

        function mouseMoveHandler(e) {
            const rect = canvas.getBoundingClientRect();
            const root = document.documentElement;
            const mouseX = e.clientX - rect.left - root.scrollLeft;
            const scaleX = canvas.width / rect.width;
            paddleX = (mouseX * scaleX) - paddleWidth / 2;
            if (paddleX < 0) paddleX = 0;
            if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
        }

        canvas.addEventListener("mousemove", mouseMoveHandler, false);

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Ball
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = "#ec4899";
            ctx.fill();
            ctx.closePath();
            // Paddle
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "#6366f1";
            ctx.fill();
            ctx.closePath();

            if(ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) ballDX = -ballDX;
            if(ballY + ballDY < ballRadius) ballDY = -ballDY;
            else if(ballY + ballDY > canvas.height - ballRadius) {
                if(ballX > paddleX && ballX < paddleX + paddleWidth) {
                    ballDY = -ballDY;
                } else {
                    clearInterval(gameLoop);
                    setTimeout(() => initPong(), 1000);
                }
            }
            ballX += ballDX;
            ballY += ballDY;
        }

        gameLoop = setInterval(draw, 15);
        currentGame = { stop: () => { clearInterval(gameLoop); canvas.removeEventListener("mousemove", mouseMoveHandler); } };
    }

    // --- Minesweeper Game ---
    function initMinesweeper() {
        const size = 8;
        const minesCount = 10;
        let board = [];
        
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Mayın Tarlası</h3>
            <div id="minesGrid" class="grid grid-cols-8 gap-1 mb-6 bg-darker p-2 rounded-lg border border-white/5"></div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p>Mayınlar: <span class="text-accent-tertiary font-bold">${minesCount}</span></p>
                <button onclick="initMinesweeper()" class="text-xs hover:text-white underline uppercase">Sıfırla</button>
            </div>
        `;

        const gridElement = document.getElementById('minesGrid');
        for(let i=0; i<size; i++) {
            board[i] = [];
            for(let j=0; j<size; j++) board[i][j] = { isMine: false, revealed: false, neighborCount: 0 };
        }

        let minesPlaced = 0;
        while(minesPlaced < minesCount) {
            let r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size);
            if(!board[r][c].isMine) { board[r][c].isMine = true; minesPlaced++; }
        }

        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                if(!board[r][c].isMine) {
                    let count = 0;
                    for(let i=-1; i<=1; i++) {
                        for(let j=-1; j<=1; j++) {
                            if(r+i >=0 && r+i < size && c+j >=0 && c+j < size && board[r+i][c+j].isMine) count++;
                        }
                    }
                    board[r][c].neighborCount = count;
                }
            }
        }

        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                const cell = document.createElement('button');
                cell.className = "w-8 h-8 md:w-10 md:h-10 bg-surface-50 hover:bg-surface-100 rounded flex items-center justify-center text-xs font-bold transition-colors border border-white/5";
                cell.addEventListener('click', () => revealCell(r, c));
                gridElement.appendChild(cell);
            }
        }

        function revealCell(r, c) {
            if(board[r][c].revealed) return;
            board[r][c].revealed = true;
            const cell = gridElement.children[r * size + c];
            cell.classList.replace('bg-surface-50', 'bg-surface-100');
            if(board[r][c].isMine) {
                cell.innerHTML = '<i class="fas fa-bomb text-red-500"></i>';
                setTimeout(() => { alert('GÜM! Mayına bastın.'); initMinesweeper(); }, 100);
            } else {
                if(board[r][c].neighborCount > 0) {
                    cell.textContent = board[r][c].neighborCount;
                    const colors = ['', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 'text-yellow-400', 'text-cyan-400', 'text-orange-400', 'text-gray-400'];
                    cell.classList.add(colors[board[r][c].neighborCount]);
                } else {
                    for(let i=-1; i<=1; i++) {
                        for(let j=-1; j<=1; j++) {
                            if(r+i >=0 && r+i < size && c+j >=0 && c+j < size) revealCell(r+i, c+j);
                        }
                    }
                }
            }
        }
        currentGame = { stop: () => {} };
    }

});

