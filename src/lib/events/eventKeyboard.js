const l10n = require("../helpers/l10n").default;

const { getKeyboardKeyOptionsJSON } = require("./helpers");

const keyOptions = JSON.parse(getKeyboardKeyOptionsJSON());

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
