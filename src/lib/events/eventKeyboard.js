const l10n = require("../helpers/l10n").default;

// PS/2 Set 2 scan codes; bit 8 identifies E0 extended keys.
const keyOptions = [
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
  [0x76, l10n("FIELD_KEYBOARD_KEY_ESCAPE")],
  [0x0e, l10n("FIELD_KEYBOARD_KEY_GRAVE")],
  [0x4e, l10n("FIELD_KEYBOARD_KEY_MINUS")],
  [0x55, l10n("FIELD_KEYBOARD_KEY_EQUALS")],
  [0x66, l10n("FIELD_KEYBOARD_KEY_BACKSPACE")],
  [0x0d, l10n("FIELD_KEYBOARD_KEY_TAB")],
  [0x54, l10n("FIELD_KEYBOARD_KEY_LEFT_BRACKET")],
  [0x5b, l10n("FIELD_KEYBOARD_KEY_RIGHT_BRACKET")],
  [0x5d, l10n("FIELD_KEYBOARD_KEY_BACKSLASH")],
  [0x4c, l10n("FIELD_KEYBOARD_KEY_SEMICOLON")],
  [0x52, l10n("FIELD_KEYBOARD_KEY_APOSTROPHE")],
  [0x5a, l10n("FIELD_KEYBOARD_KEY_ENTER")],
  [0x12, l10n("FIELD_KEYBOARD_KEY_LEFT_SHIFT")],
  [0x59, l10n("FIELD_KEYBOARD_KEY_RIGHT_SHIFT")],
  [0x14, l10n("FIELD_KEYBOARD_KEY_LEFT_CTRL")],
  [0x11, l10n("FIELD_KEYBOARD_KEY_LEFT_ALT")],
  [0x29, l10n("FIELD_KEYBOARD_KEY_SPACE")],
  [0x41, l10n("FIELD_KEYBOARD_KEY_COMMA")],
  [0x49, l10n("FIELD_KEYBOARD_KEY_PERIOD")],
  [0x4a, l10n("FIELD_KEYBOARD_KEY_SLASH")],
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
  [0x58, l10n("FIELD_KEYBOARD_KEY_CAPS_LOCK")],
  [0x7e, l10n("FIELD_KEYBOARD_KEY_SCROLL_LOCK")],
  [0x77, l10n("FIELD_KEYBOARD_KEY_NUM_LOCK")],
  [0x70, l10n("FIELD_KEYBOARD_KEY_NUMPAD_0")],
  [0x69, l10n("FIELD_KEYBOARD_KEY_NUMPAD_1")],
  [0x72, l10n("FIELD_KEYBOARD_KEY_NUMPAD_2")],
  [0x7a, l10n("FIELD_KEYBOARD_KEY_NUMPAD_3")],
  [0x6b, l10n("FIELD_KEYBOARD_KEY_NUMPAD_4")],
  [0x73, l10n("FIELD_KEYBOARD_KEY_NUMPAD_5")],
  [0x74, l10n("FIELD_KEYBOARD_KEY_NUMPAD_6")],
  [0x6c, l10n("FIELD_KEYBOARD_KEY_NUMPAD_7")],
  [0x75, l10n("FIELD_KEYBOARD_KEY_NUMPAD_8")],
  [0x7d, l10n("FIELD_KEYBOARD_KEY_NUMPAD_9")],
  [0x71, l10n("FIELD_KEYBOARD_KEY_NUMPAD_PERIOD")],
  [0x7c, l10n("FIELD_KEYBOARD_KEY_NUMPAD_MULTIPLY")],
  [0x7b, l10n("FIELD_KEYBOARD_KEY_NUMPAD_MINUS")],
  [0x79, l10n("FIELD_KEYBOARD_KEY_NUMPAD_PLUS")],
  [0x175, l10n("FIELD_KEYBOARD_KEY_UP")],
  [0x172, l10n("FIELD_KEYBOARD_KEY_DOWN")],
  [0x16b, l10n("FIELD_KEYBOARD_KEY_LEFT")],
  [0x174, l10n("FIELD_KEYBOARD_KEY_RIGHT")],
  [0x14a, l10n("FIELD_KEYBOARD_KEY_NUMPAD_DIVIDE")],
  [0x15a, l10n("FIELD_KEYBOARD_KEY_NUMPAD_ENTER")],
  [0x170, l10n("FIELD_KEYBOARD_KEY_INSERT")],
  [0x171, l10n("FIELD_KEYBOARD_KEY_DELETE")],
  [0x16c, l10n("FIELD_KEYBOARD_KEY_HOME")],
  [0x169, l10n("FIELD_KEYBOARD_KEY_END")],
  [0x17d, l10n("FIELD_KEYBOARD_KEY_PAGE_UP")],
  [0x17a, l10n("FIELD_KEYBOARD_KEY_PAGE_DOWN")],
  [0x114, l10n("FIELD_KEYBOARD_KEY_RIGHT_CTRL")],
  [0x111, l10n("FIELD_KEYBOARD_KEY_RIGHT_ALT")],
  [0x11f, l10n("FIELD_KEYBOARD_KEY_LEFT_SUPER")],
  [0x127, l10n("FIELD_KEYBOARD_KEY_RIGHT_SUPER")],
  [0x12f, l10n("FIELD_KEYBOARD_KEY_MENU")],
];

const operations = [
  ["enable", l10n("FIELD_KEYBOARD_ENABLE")],
  ["disable", l10n("FIELD_KEYBOARD_DISABLE")],
  ["clear", l10n("FIELD_KEYBOARD_CLEAR")],
  ["readKey", l10n("FIELD_KEYBOARD_READ_KEY")],
  ["readCharacter", l10n("FIELD_KEYBOARD_READ_CHARACTER")],
  ["held", l10n("FIELD_KEYBOARD_CHECK_HELD")],
  ["status", l10n("FIELD_KEYBOARD_READ_STATUS")],
];
const output = (key, label, actions) => ({
  key,
  label,
  type: "variable",
  defaultValue: "LAST_VARIABLE",
  conditions: [{ key: "operation", in: actions }],
});

const fields = [
  {
    key: "operation",
    label: l10n("FIELD_KEYBOARD_OPERATION"),
    type: "select",
    defaultValue: "readCharacter",
    options: operations,
  },
  {
    key: "keyCode",
    label: l10n("FIELD_KEYBOARD_KEY"),
    type: "select",
    options: keyOptions,
    defaultValue: 28,
    conditions: [{ key: "operation", eq: "held" }],
  },
  output("key", l10n("FIELD_KEYBOARD_KEY_CODE"), ["readKey"]),
  output("flags", l10n("FIELD_KEYBOARD_EVENT_FLAGS"), ["readKey"]),
  output("modifiers", l10n("FIELD_KEYBOARD_MODIFIERS"), ["readKey", "status"]),
  output("character", l10n("FIELD_KEYBOARD_CHARACTER"), [
    "readKey",
    "readCharacter",
  ]),
  output("result", l10n("FIELD_KEYBOARD_HELD"), ["held"]),
  output("enabled", l10n("FIELD_KEYBOARD_ENABLED"), ["status"]),
  output("errors", l10n("FIELD_KEYBOARD_ERRORS"), ["status"]),
];

const compile = (input, helpers) => {
  const {
    _stackPushConst,
    _stackPushReference,
    _stackPush,
    _isIndirectVariable,
    getVariableAlias,
    _callNative,
    _stackPop,
    _addComment,
  } = helpers;
  let args = [];
  let native;
  const op = input.operation || "readCharacter";
  _addComment(`Keyboard: ${op}`);
  switch (op) {
    case "enable":
    case "disable":
      _stackPushConst(op === "enable" ? 1 : 0);
      _callNative("keyboard_enable_native");
      _stackPop(1);
      return;
    case "clear":
      _callNative("keyboard_clear_native");
      return;
    case "readKey":
      native = "keyboard_read_event_native";
      args = ["key", "flags", "modifiers", "character"];
      break;
    case "readCharacter":
      native = "keyboard_read_character_native";
      args = ["character"];
      break;
    case "held":
      native = "keyboard_held_native";
      args = ["result"];
      break;
    case "status":
      native = "keyboard_status_native";
      args = ["enabled", "modifiers", "errors"];
      break;
    default:
      throw new Error(`Unknown keyboard operation: ${op}`);
  }
  // Reverse order makes the first argument FN_ARG0 in the native callback.
  for (const key of [...args].reverse()) {
    const variable = input[key];
    const alias = getVariableAlias(variable);
    if (_isIndirectVariable(variable)) _stackPush(alias);
    else _stackPushReference(alias);
  }
  if (op === "held") {
    const code = Number(input.keyCode ?? 28);
    if (!Number.isInteger(code) || code < 0 || code > 511)
      throw new Error("Invalid keyboard key code");
    _stackPushConst(code);
  }
  _callNative(native);
  _stackPop(args.length + (op === "held" ? 1 : 0));
};

module.exports = {
  id: "EVENT_KEYBOARD",
  name: l10n("EVENT_KEYBOARD"),
  groups: ["EVENT_GROUP_KEYBOARD"],
  description: l10n("EVENT_KEYBOARD_DESC"),
  autoLabel: (_, input) =>
    operations.find(([op]) => op === input.operation)?.[1] ||
    l10n("FIELD_KEYBOARD_READ_CHARACTER"),
  fields,
  compile,
  allowedBeforeInitFade: true,
};
