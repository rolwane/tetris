import { BLOCK_SIZE, COLORS, COLS, ROWS } from "../utils/constants";
const clear = new Audio("./src/assets/audios/clear.wav");

class Board {
    shape: number[][] = [];
    private incrementScore: Function;
    private incrementCleanedLines: Function;

    constructor(incrementScore: Function, incrementCleanedLines: Function) {
        this.init();
        this.incrementScore = incrementScore;
        this.incrementCleanedLines = incrementCleanedLines;
    }

    merge(): void {
        const rowsPositions = this.shape.reduce((previousValue, currentValue, index) => {
            if (currentValue.every((cell) => cell !== 0)) {
                previousValue.push(index);
            }

            return previousValue;
        }, []);

        const rowsBackup = rowsPositions.map((position) => [...this.shape[position]]);

        if (rowsPositions.length > 0) {
            clear.play();
        }

        rowsPositions.forEach(async (row, index) => {
            rowsPositions.forEach((position) => {
                this.shape[position] = Array(10).fill(6);
            });

            await this.delay(100);

            rowsPositions.forEach((position, index) => {
                this.shape[position] = rowsBackup[index];
            });

            await this.delay(100);

            rowsPositions.forEach((position) => {
                this.shape[position] = Array(10).fill(6);
            });

            await this.delay(100);

            rowsPositions.forEach((position, index) => {
                this.shape[position] = rowsBackup[index];
            });

            await this.delay(100);

            this.shape.splice(row, 1);
            this.shape.unshift(Array(COLS).fill(0));

            this.incrementScore(100 + 50 * index);
            this.incrementCleanedLines(1);
        });
    }

    draw(context: CanvasRenderingContext2D): void {
        this.shape.forEach((row, positionY) => {
            row.forEach((cell, positionX) => {
                this.drawRect(
                    context,
                    positionX * BLOCK_SIZE,
                    positionY * BLOCK_SIZE,
                    cell == 0 ? "#212121" : COLORS[cell - 1]
                );
            });
        });
    }

    private async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private drawRect(
        context: CanvasRenderingContext2D,
        positionX: number,
        positionY: number,
        color: string
    ): void {
        context.fillStyle = color;
        context.strokeStyle = "#121212";

        context.fillRect(positionX, positionY, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeRect(positionX, positionY, BLOCK_SIZE, BLOCK_SIZE);
    }

    private init(): void {
        this.shape = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
}

export default Board;
