import { LETTER_COORDS } from "../constants";
import { Pitch } from "../pitch";

/**
 * Helper class to parse ABC notation into Pitch vectors or vice versa.
 */
export class ABC {
    /**
     * Create a Pitch vector from an ABC note name.
     */
    static toPitch(str: string): Pitch {
        const regex = /^([_=^]+)?([A-Ga-g])((?:'|,)*)$/;
        const match = str.match(regex);
        if (!match) {
            throw new Error(`Invalid Helmholtz string: ${str}`);
        }

        const [, accidentalStr = "", letter, octaveStr] = match;

        let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];

        let accidental = 0;
        const accidentalArray = accidentalStr.split("");
        accidental += accidentalArray.filter((x) => x === "^").length;
        accidental -= accidentalArray.filter((x) => x === "_").length;
        w += accidental;
        h -= accidental;

        let octave = 0;
        if (letter.match(/[A-G]/))
            octave = 5 - octaveStr.split("").filter((x) => x === ",").length;
        if (letter.match(/[a-g]/))
            octave = 6 + octaveStr.split("").filter((x) => x === "'").length;
        w += 5 * octave;
        h += 2 * octave;

        return new Pitch(w, h);
    }

    /**
     * Returns the ABC note name of a Pitch vector.
     */
    static fromPitch(p: Pitch): string {
        let result;
        const accNumber = p.accidental;
        let accidental = "";
        if (accNumber > 0) accidental += "^".repeat(accNumber);
        if (accNumber < 0) accidental += "_".repeat(-accNumber);

        let octave = p.octave;
        if (octave > 4)
            result = accidental + p.letter.toLowerCase() + "'".repeat(octave - 5);
        else result = accidental + p.letter.toUpperCase() + ",".repeat(4 - octave);

        return result;
    }
}
