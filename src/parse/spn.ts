import { LETTER_COORDS } from "../constants";
import { Pitch } from "../pitch";

export class SPN {
    /**
     * Create a Pitch vector from a Scientific Pitch Notation string.
     */
    static toPitch(spn: string): Pitch {
        const regex = /^([A-Ga-g])([#bxw]+)?(-?\d+)$/;
        const match = spn.match(regex);
        if (!match) {
            throw new Error(`Invalid SPN: ${spn}`);
        }

        const [, letter, accidentalStr = "", octaveStr] = match;
        const octave = parseInt(octaveStr, 10) + 1;

        let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];

        let accidental = 0;
        const accidentalArray = accidentalStr.split("");
        accidental += accidentalArray.filter((x) => x === "#").length;
        accidental += 2 * accidentalArray.filter((x) => x === "x").length;
        accidental -= accidentalArray.filter((x) => x === "b").length;
        accidental -= 2 * accidentalArray.filter((x) => x === "w").length;

        w += accidental;
        h -= accidental;
        w += 5 * octave;
        h += 2 * octave;

        return new Pitch(w, h);
    }

    /**
     * Returns the SPN name of a Pitch.
     */
    static fromPitch(p: Pitch): string {
        let result = p.letter;

        const accidental = p.accidental;
        if (accidental == 2) result += "x";
        else if (accidental > 0) result += "#".repeat(accidental);
        if (accidental < 0) result += "b".repeat(-accidental);

        result += p.octave.toString();

        return result;
    }
}
