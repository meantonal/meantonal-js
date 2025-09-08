// src/pitch.ts
var Pitch = class _Pitch {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  static fromSPN(spn) {
    const regex = /^([A-Ga-g])([#bxw]+)?(-?\d+)$/;
    const match = spn.match(regex);
    if (!match) {
      throw new Error(`Invalid SPN: ${spn}`);
    }
    const [, letter, accidentalStr = "", octaveStr] = match;
    const octave = parseInt(octaveStr, 10) + 1;
    let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter)];
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
    return new _Pitch(w, h);
  }
  static fromChroma(chroma, octave) {
    let [w, h] = [chroma * 3, chroma];
    ++octave;
    while ((w + h) / 7 > octave) {
      w -= 5;
      h -= 2;
    }
    while ((w + h) / 7 < octave) {
      w += 5;
      h += 2;
    }
    return new _Pitch(w, h);
  }
  get midi() {
    return 2 * this.w + this.h;
  }
  get chroma() {
    return this.w * 2 - this.h * 5;
  }
  get pc7() {
    return ((this.w + this.h) % 7 + 7) % 7;
  }
  get pc12() {
    return (this.midi % 12 + 12) % 12;
  }
  get letter() {
    return "CDEFGAB".charAt(this.pc7);
  }
  get accidental() {
    return Math.floor((this.chroma + 1) / 7);
  }
  get octave() {
    return Math.floor((this.w + this.h) / 7 - 1);
  }
  isEqual(p) {
    return this.w === p.w && this.h === p.h;
  }
  isEnharmonic(p, edo = 12) {
    return (this.chroma % edo + edo) % edo === (p.chroma % edo + edo) % edo;
  }
  transposeReal(m) {
    return new _Pitch(this.w + m.w, this.h + m.h);
  }
  invert(axis) {
    return new _Pitch(axis.w - this.w, axis.h - this.h);
  }
  degreeIn(context) {
    return context.degreeNumber(this);
  }
  alterationIn(context) {
    return context.degreeAlteration(this);
  }
  snapTo(context) {
    return context.snapDiatonic(this);
  }
  transposeDiatonic(steps, context) {
    return this.transposeReal(new Interval(steps, 0)).snapTo(context);
  }
};
var Axis = class _Axis {
  constructor(p, q) {
    this.w = p.w + q.w;
    this.h = p.h + q.h;
  }
  static fromSPN(ps, qs) {
    return new _Axis(Pitch.fromSPN(ps), Pitch.fromSPN(qs));
  }
};

// src/interval.ts
var Interval = class _Interval {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  static fromName(name) {
    const majorInts = [
      { w: 0, h: 0 },
      { w: 1, h: 0 },
      { w: 2, h: 0 },
      { w: 2, h: 1 },
      { w: 3, h: 1 },
      { w: 4, h: 1 },
      { w: 5, h: 1 }
    ];
    const sign = name[0] === "-" ? -1 : 1;
    const regex = /^-?([PpMmAaDd#b]+)?(\d+)$/;
    const match = name.match(regex);
    if (!match) {
      throw new Error(`Invalid interval name: ${name}`);
    }
    const [, accidentalStr = "", sizeStr] = match;
    const genericSize = parseInt(sizeStr, 10);
    const simple = (genericSize - 1) % 7;
    let { w, h } = majorInts[simple];
    const octave = Math.floor((genericSize - 1) / 7);
    w += 5 * octave;
    h += 2 * octave;
    let qualityAdjustment = 0;
    accidentalStr.split("").forEach((x) => {
      switch (x) {
        case "A":
        case "a":
        case "#":
          qualityAdjustment++;
          break;
        case "m":
        case "b":
          qualityAdjustment--;
          break;
        case "D":
        case "d":
          if (simple === 0 || simple === 3 || simple === 4) qualityAdjustment--;
          else qualityAdjustment -= 2;
          break;
      }
    });
    w += qualityAdjustment;
    h -= qualityAdjustment;
    return new _Interval(sign * w, sign * h);
  }
  static fromSPN(ps, qs) {
    return _Interval.between(Pitch.fromSPN(ps), Pitch.fromSPN(qs));
  }
  static between(p, q) {
    return new _Interval(q.w - p.w, q.h - p.h);
  }
  get chroma() {
    return this.w * 2 - this.h * 5;
  }
  get quality() {
    if (Math.abs(this.chroma) <= 1) return 0;
    if (this.chroma > 0 && this.chroma <= 5)
      return Math.floor((this.chroma + 5) / 7);
    if (this.chroma < 0 && this.chroma >= -5)
      return Math.ceil((this.chroma - 5) / 7);
    if (this.chroma > 5) return Math.floor((this.chroma + 8) / 7);
    return Math.ceil((this.chroma - 8) / 7);
  }
  get stepspan() {
    return this.w + this.h;
  }
  get pc7() {
    return (this.stepspan % 7 + 7) % 7;
  }
  get pc12() {
    return ((this.w * 2 + this.h) % 12 + 12) % 12;
  }
  equal(m) {
    return this.w === m.w && this.h === m.h;
  }
  enharmonic(m, edo = 12) {
    return (this.chroma % edo + edo) % edo === (m.chroma % edo + edo) % edo;
  }
  get negative() {
    return new _Interval(-this.w, -this.h);
  }
  add(m) {
    return new _Interval(this.w + m.w, this.h + m.h);
  }
  subtract(m) {
    return new _Interval(this.w - m.w, this.h - m.h);
  }
  get simple() {
    const octave = Math.trunc((this.w + this.h) / 7);
    return new _Interval(this.w - octave * 5, this.h - octave * 2);
  }
};

// src/map.ts
var MapVec = class {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  toPitch() {
    return new Pitch(this.w, this.h);
  }
  toInterval() {
    return new Interval(this.w, this.h);
  }
};
var Map1d = class {
  constructor(m0, m1) {
    this.m0 = m0;
    this.m1 = m1;
  }
  map(v) {
    return this.m0 * v.w + this.m1 * v.h;
  }
};
var Map2d = class {
  constructor(m00, m01, m10, m11) {
    this.m00 = m00;
    this.m01 = m01;
    this.m10 = m10;
    this.m11 = m11;
  }
  map(v) {
    return new MapVec(
      this.m00 * v.w + this.m01 * v.h,
      this.m10 * v.w + this.m11 * v.h
    );
  }
};

// src/constants.ts
var MODES = {
  LYDIAN: 0,
  IONIAN: 1,
  MIXOLYDIAN: 2,
  DORIAN: 3,
  AEOLIAN: 4,
  PHRYGIAN: 5,
  LOCRIAN: 6,
  MAJOR: 1,
  MINOR: 4
};
var LETTER_COORDS = [
  { w: 0, h: 0 },
  // C
  { w: 1, h: 0 },
  // D
  { w: 2, h: 0 },
  // E
  { w: 2, h: 1 },
  // F
  { w: 3, h: 1 },
  // G
  { w: 4, h: 1 },
  // A
  { w: 5, h: 1 }
  // B
];
var ET7 = new Map1d(1, 1);
var ET12 = new Map1d(2, 1);
var ET19 = new Map1d(3, 2);
var ET31 = new Map1d(5, 3);
var ET50 = new Map1d(8, 5);
var ET55 = new Map1d(9, 5);
var WICKI_TO = new Map2d(1, -3, 0, 1);
var WICKI_FROM = new Map2d(1, 3, 0, 1);
var GENERATORS_TO = new Map2d(2, -5, -1, 3);
var GENERATORS_FROM = new Map2d(3, 5, 1, 2);

// src/chroma.ts
var Chroma = class {
  static toLetter(chroma) {
    return "CDEFGAB"[(chroma * 4 % 7 + 7) % 7];
  }
  static toAccidental(chroma) {
    return Math.floor((chroma + 1) / 7);
  }
};

// src/tonality.ts
var _TonalContext = class _TonalContext {
  constructor(chroma, mode) {
    this.tonic = {
      letter: Chroma.toLetter(chroma),
      accidental: Chroma.toAccidental(chroma),
      chroma
    };
    this.mode = mode;
    this.chromaOffset = mode - chroma;
  }
  static fromStrings(tonic, mode) {
    const regex = /^([A-Ga-g])([#bxw]+)?$/;
    const match = tonic.match(regex);
    if (!match) {
      throw new Error(`Invalid tonic string: ${tonic}`);
    }
    const modeNumber = MODES[mode.toUpperCase()];
    if (modeNumber === void 0) {
      throw new Error(`Invalid mode string: ${mode}`);
    }
    const [, letter, accidentalStr = ""] = match;
    let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];
    for (const char of accidentalStr) {
      w += _TonalContext.ACCIDENTAL_MAP[char] ?? 0;
      h -= _TonalContext.ACCIDENTAL_MAP[char] ?? 0;
    }
    const chroma = 2 * w - 5 * h;
    return new _TonalContext(chroma, modeNumber);
  }
  degreeNumber(p) {
    return ((p.w + p.h - "CDEFGAB".indexOf(this.tonic.letter)) % 7 + 7) % 7;
  }
  degreeAlteration(p) {
    let x = p.chroma + this.chromaOffset;
    if (0 <= x && x < 7) return 0;
    if (7 <= x && x < 12) return 1;
    if (-5 <= x && x < 0) return -1;
    if (x < -5) return -2;
    return 2;
  }
  degreeChroma(degree) {
    return (degree * 2 + this.mode) % 7 - this.chromaOffset;
  }
  snapDiatonic(p) {
    let result = new Pitch(p.w, p.h);
    while (result.alterationIn(this) > 0) {
      result.w--;
      result.h++;
    }
    while (result.alterationIn(this) < 0) {
      result.w++;
      result.h--;
    }
    return result;
  }
};
_TonalContext.ACCIDENTAL_MAP = {
  "#": 1,
  x: 2,
  b: -1,
  w: -2
};
var TonalContext = _TonalContext;
export {
  Axis,
  Chroma,
  ET12,
  ET19,
  ET31,
  ET50,
  ET55,
  ET7,
  GENERATORS_FROM,
  GENERATORS_TO,
  Interval,
  LETTER_COORDS,
  MODES,
  Map1d,
  Map2d,
  MapVec,
  Pitch,
  TonalContext,
  WICKI_FROM,
  WICKI_TO
};
