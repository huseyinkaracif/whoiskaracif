document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-darker/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-gray-800');
            navbar.classList.remove('bg-transparent', 'py-4');
            navbar.classList.add('py-2');
        } else {
            navbar.classList.remove('bg-darker/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-gray-800', 'py-2');
            navbar.classList.add('bg-transparent', 'py-4');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        });
    });

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            // Add active class to animate
            entry.target.classList.add('active');
            
            // Stop observing once animated
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Games Logic ---
    const gameContainer = document.getElementById('game-container');
    const gameCanvasWrapper = document.getElementById('game-canvas-wrapper');
    let currentGame = null;

    window.openGame = function(gameType) {
        if (!gameContainer || !gameCanvasWrapper) return;
        gameContainer.classList.remove('hidden');
        gameContainer.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Initialize game based on type
        switch(gameType) {
            case 'snake': initSnake(); break;
            case 'tictactoe': initTicTacToe(); break;
            case 'memory': initMemory(); break;
            case 'pong': initPong(); break;
            case 'minesweeper': initMinesweeper(); break;
        }
    };

    window.closeGame = function() {
        if (currentGame && currentGame.stop) {
            currentGame.stop();
        }
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
                <canvas id="snakeCanvas" width="400" height="400" class="bg-darker border-2 border-primary/30 rounded-lg shadow-inner w-full max-w-[400px] aspect-square"></canvas>
                <div id="snakeOverlay" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-darker/80 rounded-lg">
                    <p class="text-white text-xl font-bold mb-4">Oyun Bitti!</p>
                    <button onclick="initSnake()" class="px-6 py-2 bg-primary text-white rounded-full font-semibold">Tekrar Oyna</button>
                </div>
            </div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p>Skor: <span id="snakeScore" class="text-primary">0</span></p>
                <p class="text-xs italic">Ok tuşlarını kullanın</p>
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
            if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
            else if(event.keyCode == 38 && d != "DOWN") d = "UP";
            else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
            else if(event.keyCode == 40 && d != "UP") d = "DOWN";
        }

        document.addEventListener("keydown", direction);

        function collision(head, array) {
            for(let i = 0; i < array.length; i++) {
                if(head.x == array[i].x && head.y == array[i].y) return true;
            }
            return false;
        }

        function draw() {
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for(let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? "#6366f1" : "#4f46e5";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = "#0a0a0a";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            ctx.fillStyle = "#ec4899";
            ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if( d == "LEFT") snakeX -= box;
            if( d == "UP") snakeY -= box;

    // --- Tic-Tac-Toe Game ---
    function initTicTacToe() {
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Tic-Tac-Toe</h3>
            <div class="grid grid-cols-3 gap-3 mb-6 bg-darker p-3 rounded-xl border border-gray-800" id="tttGrid">
                ${Array(9).fill(0).map((_, i) => `<button data-index="${i}" class="ttt-cell w-16 h-16 md:w-20 md:h-20 bg-dark hover:bg-gray-800 rounded-lg text-3xl font-bold flex items-center justify-center transition-colors"></button>`).join('')}
            </div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p id="tttStatus">Sıra: <span class="text-secondary font-bold">X</span></p>
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
            clickedCell.classList.add(currentPlayer === 'X' ? 'text-secondary' : 'text-primary');

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
                statusDisplay.innerHTML = `<span class="${currentPlayer === 'X' ? 'text-secondary' : 'text-primary'} font-bold">${currentPlayer}</span> Kazandı!`;
                gameActive = false;
                return;
            }

            let roundDraw = !gameState.includes("");
            if (roundDraw) {
                statusDisplay.innerHTML = "Berabere!";
                gameActive = false;
                return;
            }

    // --- Memory Game ---
    function initMemory() {
        const symbols = ['fa-ghost', 'fa-fire', 'fa-bomb', 'fa-star', 'fa-moon', 'fa-sun', 'fa-heart', 'fa-bolt'];
        const deck = [...symbols, ...symbols].sort(() => 0.5 - Math.random());
        
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Hafıza Oyunu</h3>
            <div class="grid grid-cols-4 gap-3 mb-6" id="memoryGrid">
                ${deck.map((symbol, i) => `
                    <div class="memory-card w-14 h-14 md:w-16 md:h-16 bg-darker rounded-lg cursor-pointer flex items-center justify-center transition-all duration-300 relative transform hover:scale-105 border border-gray-800" data-symbol="${symbol}">
                        <i class="fas ${symbol} text-2xl text-primary opacity-0 pointer-events-none transition-opacity"></i>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p>Hamle: <span id="memoryMoves" class="text-purple-400">0</span></p>
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

            this.classList.add('bg-gray-800', 'border-primary');
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
                card.classList.replace('border-primary', 'border-green-500');
            });
            matchedCards.push(...flippedCards);
            resetBoard();
        }

        function unflipCards() {
            lockBoard = true;
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.remove('bg-gray-800', 'border-primary');
                    card.querySelector('i').classList.add('opacity-0');
                });
                resetBoard();
            }, 1000);
        }

    // --- Ping Pong Game ---
    function initPong() {
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Ping Pong</h3>
            <canvas id="pongCanvas" width="400" height="300" class="bg-darker border-2 border-primary/30 rounded-lg shadow-inner w-full max-w-[400px]"></canvas>
            <p class="text-xs italic text-gray-500 mt-4 uppercase">Mouse'u hareket ettirerek paleti kontrol et</p>
        `;

        const canvas = document.getElementById('pongCanvas');
        const ctx = canvas.getContext('2d');
        
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballDX = 2;
        let ballDY = -2;
        const ballRadius = 6;
        
        const paddleHeight = 10;
        const paddleWidth = 75;
        let paddleX = (canvas.width - paddleWidth) / 2;
        
        let gameLoop;

        function mouseMoveHandler(e) {
            const rect = canvas.getBoundingClientRect();
            const root = document.documentElement;
            const mouseX = e.clientX - rect.left - root.scrollLeft;
            
            // Adjust for canvas scaling
            const scaleX = canvas.width / rect.width;
            paddleX = (mouseX * scaleX) - paddleWidth / 2;
            
            if (paddleX < 0) paddleX = 0;
            if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
        }

        canvas.addEventListener("mousemove", mouseMoveHandler, false);

        function drawBall() {
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = "#ec4899";
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "#6366f1";
            ctx.fill();
            ctx.closePath();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawPaddle();

            if(ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) ballDX = -ballDX;
            if(ballY + ballDY < ballRadius) ballDY = -ballDY;
            else if(ballY + ballDY > canvas.height - ballRadius) {
                if(ballX > paddleX && ballX < paddleX + paddleWidth) {
                    ballDY = -ballDY;
                } else {
                    clearInterval(gameLoop);
                    // Reset game
                    setTimeout(() => initPong(), 1000);
                }
            }

            ballX += ballDX;
            ballY += ballDY;
        }

    // --- Minesweeper Game ---
    function initMinesweeper() {
        const size = 8;
        const minesCount = 10;
        let board = [];
        
        gameCanvasWrapper.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-4">Mayın Tarlası</h3>
            <div id="minesGrid" class="grid grid-cols-8 gap-1 mb-6 bg-darker p-2 rounded-lg border border-gray-800"></div>
            <div class="flex justify-between w-full text-gray-400 font-medium">
                <p>Mayınlar: <span class="text-secondary font-bold">${minesCount}</span></p>
                <button onclick="initMinesweeper()" class="text-xs hover:text-white underline uppercase">Sıfırla</button>
            </div>
        `;

        const gridElement = document.getElementById('minesGrid');
        
        // Generate board
        for(let i=0; i<size; i++) {
            board[i] = [];
            for(let j=0; j<size; j++) {
                board[i][j] = { isMine: false, revealed: false, neighborCount: 0 };
            }
        }

        // Add mines
        let minesPlaced = 0;
        while(minesPlaced < minesCount) {
            let r = Math.floor(Math.random() * size);
            let c = Math.floor(Math.random() * size);
            if(!board[r][c].isMine) {
                board[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbors
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

        // Render board
        for(let r=0; r<size; r++) {
            for(let c=0; c<size; c++) {
                const cell = document.createElement('button');
                cell.className = "w-8 h-8 md:w-10 md:h-10 bg-dark hover:bg-gray-800 rounded flex items-center justify-center text-xs font-bold transition-colors border border-gray-900";
                cell.dataset.r = r;
                cell.dataset.c = c;
                cell.addEventListener('click', () => revealCell(r, c));
                gridElement.appendChild(cell);
            }
        }

        function revealCell(r, c) {
            if(board[r][c].revealed) return;
            board[r][c].revealed = true;
            const cell = gridElement.children[r * size + c];
            cell.classList.replace('bg-dark', 'bg-gray-900');
            cell.classList.add('border-gray-800', 'cursor-default');

            if(board[r][c].isMine) {
                cell.innerHTML = '<i class="fas fa-bomb text-red-500"></i>';
                setTimeout(() => {
                    alert('GÜM! Mayına bastın.');
                    initMinesweeper();
                }, 100);
            } else {
                if(board[r][c].neighborCount > 0) {
                    cell.textContent = board[r][c].neighborCount;
                    const colors = ['', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-yellow-500', 'text-cyan-500', 'text-orange-500', 'text-gray-500'];
                    cell.classList.add(colors[board[r][c].neighborCount]);
                } else {
                    // Flood fill
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


        gameLoop = setInterval(draw, 10);
        
        currentGame = {
            stop: () => {
                clearInterval(gameLoop);
                canvas.removeEventListener("mousemove", mouseMoveHandler);
            }
        };
    }


        function resetBoard() {
            [flippedCards, lockBoard] = [[], false];
        }

        cards.forEach(card => card.addEventListener('click', flipCard));
        
        currentGame = {
            stop: () => {}
        };
    }


            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusDisplay.innerHTML = `Sıra: <span class="${currentPlayer === 'X' ? 'text-secondary' : 'text-primary'} font-bold">${currentPlayer}</span>`;
        }

        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        
        currentGame = {
            stop: () => {
                cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            }
        };
    }

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
            }

            snake.unshift(newHead);
        }

        gameLoop = setInterval(draw, 100);
        
        currentGame = {
            stop: () => {
                clearInterval(gameLoop);
                document.removeEventListener("keydown", direction);
            }
        };
    }

});
