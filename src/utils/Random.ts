abstract class Random {
    static get(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}

export default Random;
