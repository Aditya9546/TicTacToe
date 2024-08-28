document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset-button");
    const statusText = document.getElementById("status");
    const strikeLine = document.getElementById("strike-line");
    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];

    function handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.getAttribute("data-index"));

        if (gameBoard[index] !== "" || !gameActive) {
            return;
        }

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWinner()) {
            statusText.textContent = `Player ${currentPlayer} has won!`;
            gameActive = false;
            drawStrikeLine(winningConditions.find(condition => {
                const [a, b, c] = condition;
                return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
            }));
        } else if (gameBoard.includes("")) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusText.textContent = `It's ${currentPlayer}'s turn`;
        } else {
            statusText.textContent = "It's a draw!";
            gameActive = false;
        }
    }

    function checkWinner() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return true;
            }
        }
        return false;
    }

    function drawStrikeLine(winningCondition) {
        const [a, b, c] = winningCondition;
        const firstCell = cells[a];
        const lastCell = cells[c];

        const firstCellRect = firstCell.getBoundingClientRect();
        const lastCellRect = lastCell.getBoundingClientRect();

        const boardRect = document.getElementById("game-board").getBoundingClientRect();

        const x1 = firstCellRect.left - boardRect.left + firstCellRect.width / 2;
        const y1 = firstCellRect.top - boardRect.top + firstCellRect.height / 2;
        const x2 = lastCellRect.left - boardRect.left + lastCellRect.width / 2;
        const y2 = lastCellRect.top - boardRect.top + lastCellRect.height / 2;

        const distance = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1);

        strikeLine.style.width = `${distance}px`;
        strikeLine.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}rad)`;
        strikeLine.style.transformOrigin = '0 0';
        strikeLine.style.transform += ' scaleX(1)'; // Show the line
    }

    function resetGame() {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        statusText.textContent = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = "");
        strikeLine.style.transform = 'scaleX(0)'; // Hide the line
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetGame);

    resetGame();
});
