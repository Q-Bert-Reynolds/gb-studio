import fs from "fs-extra";
import Path from "path";
import { defaultEngineRoot } from "consts";
import {
  readFileToIndexedImage,
  indexedImageToTilesDataArray,
} from "lib/tiles/readFileToTiles";
import { tileDataIndexFn } from "shared/lib/tiles/tileData";

export type KeyboardLayout = {
  unshifted: number[];
  shifted: number[];
  cursorOffsetMin: number;
  cursorOffsetMax: number;
  cursorDelay: number;
};

export const compileKeyboardTiles = async (
  projectRoot: string,
): Promise<string> => {
  const custom = Path.join(projectRoot, "assets/ui/keyboard.png");
  const filename = (await fs.pathExists(custom))
    ? custom
    : Path.join(defaultEngineRoot, "assets/ui/keyboard.png");
  const image = await readFileToIndexedImage(filename, tileDataIndexFn);
  if (image.width !== 72 || image.height !== 8) {
    throw new Error(
      `${filename}: keyboard texture must be 72x8 pixels (nine tiles)`,
    );
  }
  const tiles = indexedImageToTilesDataArray(image);
  return (
    "// Keyboard icons, generated from assets/ui/keyboard.png.\n" +
    "// Selection corner, Return, Shift off/on/lock, space-bar left/middle/right, Backspace.\n" +
    "static const UBYTE keyboard_icon_tiles[] = {\n" +
    tiles.map((tile) => `    ${Array.from(tile).join(", ")}`).join(",\n") +
    "\n};\n"
  );
};

const decodeString = (literal: string): number[] => {
  const bytes: number[] = [];
  for (let i = 1; i < literal.length - 1; i++) {
    if (literal[i] !== "\\") {
      bytes.push(literal.charCodeAt(i));
      continue;
    }
    const rest = literal.slice(++i);
    const decimal = rest.match(/^\d{1,3}/)?.[0];
    const hex = rest.match(/^x([\da-fA-F]{2})/)?.[1];
    if (decimal) {
      bytes.push(Number(decimal));
      i += decimal.length - 1;
    } else if (hex) {
      bytes.push(parseInt(hex, 16));
      i += 2;
    } else if (literal[i] === "\\" || literal[i] === '"') {
      bytes.push(literal.charCodeAt(i));
    } else {
      throw new Error(`Unsupported keyboard escape: \\${literal[i]}`);
    }
  }
  return bytes;
};

const decodeCharacter = (literal: string): number => {
  const body = literal.slice(1, -1);
  if (body.length === 1 && body !== "\\") return body.charCodeAt(0);
  const escapes: Record<string, number> = {
    "\\0": 0,
    "\\b": 8,
    "\\t": 9,
    "\\v": 11,
    "\\r": 13,
    "\\n": 10,
    "\\f": 12,
    "\\a": 7,
    "\\\\": 92,
    "\\'": 39,
    '\\"': 34,
    "\\?": 63,
  };
  if (body in escapes) return escapes[body];
  if (/^\\x[\da-fA-F]+$/.test(body)) return parseInt(body.slice(2), 16);
  if (/^\\[0-7]{1,3}$/.test(body)) return parseInt(body.slice(1), 8);
  throw new Error(
    `Keyboard character ${literal} must contain exactly one character or a C escape`,
  );
};

export const parseKeyboard = (source: string): KeyboardLayout => {
  // Tokenize literals before comments so '/', quotes and comment-like strings
  // remain data. This deliberately accepts data initializers, not C expressions.
  const tokens = (
    source.match(
      /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\/\/[^\n]*|\/\*[\s\S]*?\*\/|\s+|0[xX][\da-fA-F]+|\d+|[A-Za-z_]\w*|./g,
    ) ?? []
  ).filter(
    (token) =>
      !/^\s+$/.test(token) &&
      !token.startsWith("//") &&
      !token.startsWith("/*"),
  );
  const readArray = (name: string) => {
    const declarations = tokens.flatMap((token, index) =>
      token === name && tokens[index + 1] === "[" ? [index] : [],
    );
    if (declarations.length !== 1)
      throw new Error(`Keyboard must declare ${name}[] exactly once`);
    let index = declarations[0] + 2;
    const expect = (token: string) => {
      if (tokens[index++] !== token)
        throw new Error(`Expected '${token}' in keyboard array ${name}`);
    };
    expect("]");
    expect("=");
    const bytes: number[] = [];
    if (tokens[index]?.startsWith('"')) {
      while (tokens[index]?.startsWith('"'))
        bytes.push(...decodeString(tokens[index++]));
    } else {
      expect("{");
      while (tokens[index] !== "}") {
        const token = tokens[index++];
        if (token?.startsWith("'")) bytes.push(decodeCharacter(token));
        else if (/^(?:0[xX][\da-fA-F]+|\d+)$/.test(token ?? ""))
          bytes.push(Number(token));
        else
          throw new Error(
            `Keyboard array ${name} requires character literals or numeric bytes; received ${token ?? "end of file"}`,
          );
        if (tokens[index] === "}") break;
        expect(",");
      }
      expect("}");
    }
    expect(";");
    if (bytes.length < 1 || bytes.length > 90)
      throw new Error(`${name} must contain between 1 and 90 entries`);
    for (const byte of bytes) {
      if (
        ![0, 8, 9, 11, 13, 14, 24, 188, 189, 190].includes(byte) &&
        !(byte >= 32 && byte <= 126)
      ) {
        throw new Error(`${name} contains unsupported key code ${byte}`);
      }
    }
    return bytes;
  };
  const unshifted = readArray("osk_unshifted");
  const shifted = readArray("osk_shifted");
  if (unshifted.length !== shifted.length)
    throw new Error(
      "Keyboard unshifted and shifted arrays must have the same length",
    );
  const readSetting = (
    name: string,
    fallback: number,
    min: number,
    max: number,
  ) => {
    const matches = tokens.flatMap((token, index) =>
      token === name ? [index] : [],
    );
    if (!matches.length) return fallback;
    const index = matches[0];
    if (
      matches.length !== 1 ||
      tokens[index + 1] !== "=" ||
      !/^(?:0[xX][\da-fA-F]+|\d+)$/.test(tokens[index + 2] ?? "") ||
      tokens[index + 3] !== ";"
    ) {
      throw new Error(`${name} must be declared once using a numeric constant`);
    }
    const value = Number(tokens[index + 2]);
    if (value < min || value > max) {
      throw new Error(`${name} must be between ${min} and ${max}`);
    }
    return value;
  };
  const cursorOffsetMin = readSetting("osk_cursor_offset_min", 1, 0, 8);
  const cursorOffsetMax = readSetting("osk_cursor_offset_max", 2, 0, 8);
  const cursorDelay = readSetting("osk_cursor_delay", 60, 1, 255);
  if (cursorOffsetMin > cursorOffsetMax) {
    throw new Error(
      "osk_cursor_offset_min must not exceed osk_cursor_offset_max",
    );
  }
  return { unshifted, shifted, cursorOffsetMin, cursorOffsetMax, cursorDelay };
};

export const keyboardHeader = ({
  unshifted,
  shifted,
  cursorOffsetMin,
  cursorOffsetMax,
  cursorDelay,
}: KeyboardLayout): string =>
  `// Generated from assets/keyboard.c.\n` +
  `static const UBYTE osk_cursor_offset_min = ${cursorOffsetMin};\n` +
  `static const UBYTE osk_cursor_offset_max = ${cursorOffsetMax};\n` +
  `static const UBYTE osk_cursor_delay = ${cursorDelay};\n` +
  `static const UBYTE osk_unshifted[] = { ${unshifted.join(", ")} };\n` +
  `static const UBYTE osk_shifted[] = { ${shifted.join(", ")} };\n`;

export const compileKeyboard = async (
  projectRoot: string,
): Promise<string | undefined> => {
  const filename = Path.join(projectRoot, "assets/keyboard.c");
  let source: string;
  try {
    source = await fs.readFile(filename, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
  try {
    return keyboardHeader(parseKeyboard(source));
  } catch (error) {
    throw new Error(`${filename}: ${(error as Error).message}`);
  }
};
