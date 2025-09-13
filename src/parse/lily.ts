import { LETTER_COORDS } from "../constants";
import { Pitch } from "../pitch";

/**
 * Helper class to parse LilyPond note names into Pitch vectors or vice versa
 */
export class LilyPond {
    /**
     * Create a Pitch vector from a LilyPond note name
     */
    static toPitch(str: string): Pitch {
        const regex = /^([a-g])((?:is|es)*)((?:'|,)*)$/;
        const match = str.match(regex);
        if (!match) {
            throw new Error(`Invalid LilyPond note name: ${str}`);
        }

        const [, letter, accidentalStr, octaveStr] = match;

        let accidental = accidentalStr.split("s").reduce((a, c) => {
            if (c === "i") return a + 1;
            if (c === "e") return a - 1;
            return a;
        }, 0);

        const octave =
            4 +
            octaveStr.split("").reduce((a, c) => {
                if (c === "'") return a + 1;
                if (c === ",") return a - 1;
                return a;
            }, 0);

        let { w, h } = LETTER_COORDS["cdefgab".indexOf(letter)];
        w += accidental;
        h -= accidental;
        w += 5 * octave;
        h += 2 * octave;

        return new Pitch(w, h);
    }

    /**
     * Returns the (absolute) LilyPond name of a Pitch.
     */
    static fromPitch(p: Pitch): string {
        let result = p.letter.toLowerCase();

        const accidental = p.accidental;
        if (accidental > 0) result += "is".repeat(accidental);
        if (accidental < 0) result += "es".repeat(-accidental);

        const octave = p.octave - 3;
        if (octave > 0) result += "'".repeat(octave);
        if (octave < 0) result += ",".repeat(-octave);

        return result;
    }
}
