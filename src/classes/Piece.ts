import Random from "../utils/Random";
import Board from "./Board";
import { BLOCK_SIZE, COLORS, COLS, SHAPES } from "../utils/constants";

class Piece {
    private positionX: number;
    private positionY: number;
    private shape: number[][];
    private nextShape: number[][];
    private incrementScore: Function;
    private updateGameOver: Function;

    constructor(incrementScore: Function, updateGameOver: Function) {
        this.shape = this.getRandomShape();
        this.nextShape = this.getRandomShape();

        this.positionX = 3;
        this.positionY = -this.shape.length;

        this.incrementScore = incrementScore;
        this.updateGameOver = updateGameOver;
    }

    rotate(board: Board): void {
        const updatedShape: number[][] = [];

        const backupPositionX = this.positionX;
        const backupPositionY = this.positionY;
        const backupShape = this.shape;

        const rows = this.shape.length;
        const cols = this.shape[0].length;

        for (let row = 0; row < cols; row += 1) {
            updatedShape[row] = [];

            for (let col = 0; col < rows; col += 1) {
                updatedShape[row][col] = this.shape[col][row];
            }
        }

        updatedShape.forEach((row) => row.reverse());

        this.shape = updatedShape;

        if (this.collided(board)) {
            let count = 0;

            while (this.collided(board) && count < 4) {
                this.positionX -= 1;
                count++;
            }

            if (count > 3) {
                this.positionX = backupPositionX;
                this.positionY = backupPositionY;
                this.shape = backupShape;
            }
        }
    }

    hardDrop(board: Board): void {
        while (!this.collided(board)) {
            this.positionY += 1;
            this.incrementScore(2);
        }

        this.positionY -= 1;
    }

    softDrop(board: Board): void {
        this.positionY += 1;

        if (this.collided(board)) {
            this.positionY -= 1;

            this.fixPiece(board);
            this.generatePiece();
            board.merge();
        }
    }

    moveRight(board: Board): void {
        this.positionX += 1;

        if (this.collided(board)) {
            this.positionX -= 1;
        }
    }

    moveLeft(board: Board): void {
        this.positionX -= 1;

        if (this.collided(board)) {
            this.positionX += 1;
        }
    }

    drawNext(context: CanvasRenderingContext2D): void {
        this.nextShape.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col) {
                    this.drawRect(context, x * BLOCK_SIZE, y * BLOCK_SIZE, COLORS[col - 1]);
                }
            });
        });
    }

    draw(context: CanvasRenderingContext2D): void {
        this.shape.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col) {
                    this.drawRect(
                        context,
                        (this.positionX + x) * BLOCK_SIZE,
                        (this.positionY + y) * BLOCK_SIZE,
                        COLORS[col - 1]
                    );
                }
            });
        });
    }

    private generatePiece() {
        this.shape = this.nextShape;
        this.nextShape = this.getRandomShape();
        this.positionX = 3;
        this.positionY = -this.shape.length;
    }

    private fixPiece(board: Board) {
        const { positionX, positionY, shape } = this;

        shape.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col !== 0) {
                    board.shape[positionY + y][positionX + x] = col;
                }
            });
        });
    }

    private collided(board: Board): boolean {
        const { shape, positionX, positionY } = this;

        for (let y = 0; y < shape.length; y += 1) {
            for (let x = 0; x < shape[y].length; x += 1) {
                if (positionY < 0) {
                    return positionX < 0 || positionX + x > COLS - shape[0].length;
                }

                if (
                    shape[y][x] !== 0 &&
                    (board.shape[y + positionY] == undefined ||
                        board.shape[y + positionY][x + positionX] == undefined ||
                        board.shape[y + positionY][x + positionX] !== 0)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    private getRandomShape(): number[][] {
        return SHAPES[Random.get(0, SHAPES.length - 1)];
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

        context.fillStyle = "rgba(255, 255, 255, 0.2)";
        context.fillRect(positionX, positionY, BLOCK_SIZE / 2.5, BLOCK_SIZE);

        context.strokeRect(positionX, positionY, BLOCK_SIZE, BLOCK_SIZE);
    }
}

export default Piece;
