import l10n from "shared/lib/lang/l10n";
import { commandIndex as cmd, JUMP } from "./scriptCommands";
import { normalizeVariableId } from "shared/lib/variables/variableIds";

export const getActorIndex = (actorId, scene) => {
  return scene.actors.findIndex((a) => a.id === actorId) + 1;
};

export const getActor = (actorId, scene) => {
  return scene.actors.find((a) => a.id === actorId);
};

export const getMusicIndex = (musicId, music) => {
  const musicIndex = music.findIndex((track) => track.id === musicId);
  return musicIndex;
};

export const getSpriteIndex = (spriteId, sprites) => {
  const spriteIndex = sprites.findIndex((sprite) => sprite.id === spriteId);
  if (spriteIndex === -1) {
    return 0;
  }
  return spriteIndex;
};

export const getSprite = (spriteId, sprites) => {
  return sprites.find((sprite) => sprite.id === spriteId);
};

export const getSpriteOffset = (spriteId, sprites, scene) => {
  const spriteIndex = getSpriteIndex(spriteId, sprites);

  let spriteOffset = 6;
  for (let i = 0; i < scene.sprites.length; i++) {
    if (scene.sprites[i] === spriteIndex) {
      break;
    }
    const sprite = sprites[scene.sprites[i]];
    spriteOffset += sprite.size / 64;
  }

  return spriteOffset;
};

export const getSpriteSceneIndex = (spriteId, sprites, scene) => {
  const spriteIndex = getSpriteIndex(spriteId, sprites);
  return scene.sprites.indexOf(spriteIndex) + 1;
};

export const getVariableIndex = (variable, variables) => {
  const normalisedVariable = normalizeVariableId(
    String(variable).replace(/\$/g, ""),
  );
  let variableIndex = variables.indexOf(normalisedVariable);
  if (variableIndex === -1) {
    variables.push(normalisedVariable);
    variableIndex = variables.length - 1;
  }
  return variableIndex;
};

export const compileConditional = (truePath, falsePath, options) => {
  const { output, compileEvents } = options;

  const truePtrIndex = output.length;
  output.push("PTR_PLACEHOLDER1");
  output.push("PTR_PLACEHOLDER2");

  if (typeof falsePath === "function") {
    falsePath();
  } else if (falsePath) {
    compileEvents(falsePath);
  }

  output.push(cmd(JUMP));
  const endPtrIndex = output.length;
  output.push("PTR_PLACEHOLDER1");
  output.push("PTR_PLACEHOLDER2");

  const truePointer = output.length;
  output[truePtrIndex] = truePointer >> 8;
  output[truePtrIndex + 1] = truePointer & 0xff;

  if (typeof truePath === "function") {
    truePath();
  } else if (truePath) {
    compileEvents(truePath);
  }

  const endIfPointer = output.length;
  output[endPtrIndex] = endIfPointer >> 8;
  output[endPtrIndex + 1] = endIfPointer & 0xff;
};

export const pushToArray = (output, data) => {
  output.push(...data);
};

// PS/2 Set 2 scan codes; bit 8 identifies E0 extended keys.
// JSON keeps option data independent of host proxies in sandboxed handlers.
export const getKeyboardKeyOptionsJSON = () =>
  JSON.stringify([
    [0x1c, "A"],
    [0x32, "B"],
    [0x21, "C"],
    [0x23, "D"],
    [0x24, "E"],
    [0x2b, "F"],
    [0x34, "G"],
    [0x33, "H"],
    [0x43, "I"],
    [0x3b, "J"],
    [0x42, "K"],
    [0x4b, "L"],
    [0x3a, "M"],
    [0x31, "N"],
    [0x44, "O"],
    [0x4d, "P"],
    [0x15, "Q"],
    [0x2d, "R"],
    [0x1b, "S"],
    [0x2c, "T"],
    [0x3c, "U"],
    [0x2a, "V"],
    [0x1d, "W"],
    [0x22, "X"],
    [0x35, "Y"],
    [0x1a, "Z"],
    [0x16, "1"],
    [0x1e, "2"],
    [0x26, "3"],
    [0x25, "4"],
    [0x2e, "5"],
    [0x36, "6"],
    [0x3d, "7"],
    [0x3e, "8"],
    [0x46, "9"],
    [0x45, "0"],
    [0x76, l10n("KEYBOARD_KEY_ESCAPE")],
    [0x0e, l10n("KEYBOARD_KEY_GRAVE")],
    [0x4e, l10n("KEYBOARD_KEY_MINUS")],
    [0x55, l10n("KEYBOARD_KEY_EQUALS")],
    [0x66, l10n("KEYBOARD_KEY_BACKSPACE")],
    [0x0d, l10n("KEYBOARD_KEY_TAB")],
    [0x54, l10n("KEYBOARD_KEY_LEFT_BRACKET")],
    [0x5b, l10n("KEYBOARD_KEY_RIGHT_BRACKET")],
    [0x5d, l10n("KEYBOARD_KEY_BACKSLASH")],
    [0x4c, l10n("KEYBOARD_KEY_SEMICOLON")],
    [0x52, l10n("KEYBOARD_KEY_APOSTROPHE")],
    [0x5a, l10n("KEYBOARD_KEY_ENTER")],
    [0x12, l10n("KEYBOARD_KEY_LEFT_SHIFT")],
    [0x59, l10n("KEYBOARD_KEY_RIGHT_SHIFT")],
    [0x14, l10n("KEYBOARD_KEY_LEFT_CTRL")],
    [0x11, l10n("KEYBOARD_KEY_LEFT_ALT")],
    [0x29, l10n("KEYBOARD_KEY_SPACE")],
    [0x41, l10n("KEYBOARD_KEY_COMMA")],
    [0x49, l10n("KEYBOARD_KEY_PERIOD")],
    [0x4a, l10n("KEYBOARD_KEY_SLASH")],
    [0x05, "F1"],
    [0x06, "F2"],
    [0x04, "F3"],
    [0x0c, "F4"],
    [0x03, "F5"],
    [0x0b, "F6"],
    [0x83, "F7"],
    [0x0a, "F8"],
    [0x01, "F9"],
    [0x09, "F10"],
    [0x78, "F11"],
    [0x07, "F12"],
    [0x58, l10n("KEYBOARD_KEY_CAPS_LOCK")],
    [0x7e, l10n("KEYBOARD_KEY_SCROLL_LOCK")],
    [0x77, l10n("KEYBOARD_KEY_NUM_LOCK")],
    [0x70, l10n("KEYBOARD_KEY_NUMPAD_0")],
    [0x69, l10n("KEYBOARD_KEY_NUMPAD_1")],
    [0x72, l10n("KEYBOARD_KEY_NUMPAD_2")],
    [0x7a, l10n("KEYBOARD_KEY_NUMPAD_3")],
    [0x6b, l10n("KEYBOARD_KEY_NUMPAD_4")],
    [0x73, l10n("KEYBOARD_KEY_NUMPAD_5")],
    [0x74, l10n("KEYBOARD_KEY_NUMPAD_6")],
    [0x6c, l10n("KEYBOARD_KEY_NUMPAD_7")],
    [0x75, l10n("KEYBOARD_KEY_NUMPAD_8")],
    [0x7d, l10n("KEYBOARD_KEY_NUMPAD_9")],
    [0x71, l10n("KEYBOARD_KEY_NUMPAD_PERIOD")],
    [0x7c, l10n("KEYBOARD_KEY_NUMPAD_MULTIPLY")],
    [0x7b, l10n("KEYBOARD_KEY_NUMPAD_MINUS")],
    [0x79, l10n("KEYBOARD_KEY_NUMPAD_PLUS")],
    [0x175, l10n("KEYBOARD_KEY_UP")],
    [0x172, l10n("KEYBOARD_KEY_DOWN")],
    [0x16b, l10n("KEYBOARD_KEY_LEFT")],
    [0x174, l10n("KEYBOARD_KEY_RIGHT")],
    [0x14a, l10n("KEYBOARD_KEY_NUMPAD_DIVIDE")],
    [0x15a, l10n("KEYBOARD_KEY_NUMPAD_ENTER")],
    [0x170, l10n("KEYBOARD_KEY_INSERT")],
    [0x171, l10n("KEYBOARD_KEY_DELETE")],
    [0x16c, l10n("KEYBOARD_KEY_HOME")],
    [0x169, l10n("KEYBOARD_KEY_END")],
    [0x17d, l10n("KEYBOARD_KEY_PAGE_UP")],
    [0x17a, l10n("KEYBOARD_KEY_PAGE_DOWN")],
    [0x114, l10n("KEYBOARD_KEY_RIGHT_CTRL")],
    [0x111, l10n("KEYBOARD_KEY_RIGHT_ALT")],
    [0x11f, l10n("KEYBOARD_KEY_LEFT_SUPER")],
    [0x127, l10n("KEYBOARD_KEY_RIGHT_SUPER")],
    [0x12f, l10n("KEYBOARD_KEY_MENU")],
  ]);
