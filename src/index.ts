import Board from "./classes/Board";
import Piece from "./classes/Piece";

const theme = new Audio("./src/assets/audios/music.mp3");

const buttonPlay = document.querySelector(".button--play")! as HTMLButtonElement;
const container = document.querySelector(".container")! as HTMLElement;

const canvas = document.querySelector(".game-board")! as HTMLCanvasElement;
const canvasPreview = document.querySelector(".next-piece")! as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
const contextPreview = canvasPreview.getContext("2d")!;

const scoreElement = document.querySelector(".score")! as HTMLSpanElement;
const levelElement = document.querySelector(".level")! as HTMLSpanElement;

canvas.width = 300;
canvas.height = 600;

canvasPreview.width = 120;
canvasPreview.height = 90;

const linesPerLevel = 7;

let isGameOver = false;
let cleanedLines = 0;
let currentLevel = 1;

const incrementScore = (amount: number) => {
    const currentScore = getCurrentScore();
    scoreElement.textContent = `${currentScore + amount * currentLevel}`;
};

const getCurrentScore = (): number => {
    return parseInt(scoreElement.textContent || "0");
};

const incrementCleanedLines = (amount: number) => {
    cleanedLines += amount;
};

const updateLoopVelocity = (): number => {
    return Math.max(100, 1100 - currentLevel * 100);
};

const updateGameOver = (status: boolean) => {
    isGameOver = status;
};

let loop: any;

const restartLoop = () => {
    clearInterval(loop);
    loop = setInterval(() => piece.softDrop(board), updateLoopVelocity());
};

const updateLevel = () => {
    if (cleanedLines >= linesPerLevel * currentLevel) {
        return true;
    }

    return false;
};

const board = new Board(incrementScore, incrementCleanedLines);
const piece = new Piece(incrementScore, updateGameOver);

const gameLoop = () => {
    contextPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);

    board.draw(context);
    piece.draw(context);
    piece.drawNext(contextPreview);

    if (isGameOver) {
        clearInterval(loop);
    }

    if (updateLevel()) {
        currentLevel += 1;
        levelElement.textContent = currentLevel.toString();
        restartLoop();
    }

    requestAnimationFrame(gameLoop);
};

addEventListener("keydown", ({ key }) => {
    if (key === " ") {
        piece.hardDrop(board);
    }

    if (key === "ArrowDown") {
        piece.softDrop(board);
        incrementScore(1);
    }

    if (key === "ArrowRight") {
        piece.moveRight(board);
    }

    if (key === "ArrowLeft") {
        piece.moveLeft(board);
    }

    if (key === "ArrowUp") {
        piece.rotate(board);
    }
});

buttonPlay.addEventListener("click", () => {
    gameLoop();
    loop = setInterval(() => piece.softDrop(board), updateLoopVelocity());
    theme.play();
    theme.loop = true;
    container.style.display = "flex";
    buttonPlay.style.display = "none";
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", ({ touches }) => {
    touchStartX = touches[0].clientX;
    touchStartY = touches[0].clientY;
});

canvas.addEventListener("touchend", ({ changedTouches }) => {
    const deltaTouchX = touchStartX - changedTouches[0].clientX;
    const deltaTouchY = touchStartY - changedTouches[0].clientY;

    if (Math.abs(deltaTouchX) >= 30) {
        if (deltaTouchX < 0) {
            piece.moveRight(board);
        }

        if (deltaTouchX > 0) {
            piece.moveLeft(board);
        }
    }

    if (deltaTouchY <= -30 && deltaTouchY >= -150) {
        piece.softDrop(board);
    }

    if (deltaTouchY < -150) {
        piece.hardDrop(board);
    }
});

canvas.addEventListener("click", () => {
    piece.rotate(board);
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
});
