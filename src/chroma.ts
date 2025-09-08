export class Chroma {
    static toLetter(chroma: number) {
        return "CDEFGAB"[(((chroma * 4) % 7) + 7) % 7];
    }
    static toAccidental(chroma: number) {
        return Math.floor((chroma + 1) / 7);
    }
}
