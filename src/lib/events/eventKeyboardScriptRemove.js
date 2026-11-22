const l10n = require("../helpers/l10n").default;
const { getKeyboardKeyOptionsJSON } = require("./helpers");

const keyOptions = JSON.parse(getKeyboardKeyOptionsJSON());
const keyLabels = Object.fromEntries(keyOptions);

const id = "EVENT_REMOVE_KEYBOARD_SCRIPT";
const groups = ["EVENT_GROUP_KEYBOARD"];

const autoLabel = (_, input) => {
  return l10n("EVENT_REMOVE_KEYBOARD_LABEL", {
    key: keyLabels[input.keyCode ?? 28],
  });
};

const fields = [
  {
    key: "keyCode",
    label: l10n("FIELD_KEYBOARD_KEY"),
    description: l10n("FIELD_KEYBOARD_KEY_DESC"),
    type: "select",
    options: keyOptions,
    defaultValue: 28,
  },
];

const compile = (input, helpers) => {
  const { keyboardScriptRemove } = helpers;
  keyboardScriptRemove(Number(input.keyCode ?? 28));
};

module.exports = {
  id,
  description: l10n("EVENT_REMOVE_KEYBOARD_SCRIPT_DESC"),
  autoLabel,
  groups,
  fields,
  compile,
};
