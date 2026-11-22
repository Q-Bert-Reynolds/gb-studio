const l10n = require("../helpers/l10n").default;
const { getKeyboardKeyOptionsJSON } = require("./helpers");

const keyOptions = JSON.parse(getKeyboardKeyOptionsJSON());
const keyLabels = Object.fromEntries(keyOptions);

const id = "EVENT_SET_KEYBOARD_SCRIPT";
const groups = ["EVENT_GROUP_KEYBOARD"];

const autoLabel = (_, input) => {
  return l10n("EVENT_SET_KEYBOARD_SCRIPT_LABEL", {
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
  {
    key: "__scriptTabs",
    type: "tabs",
    defaultValue: "press",
    values: {
      press: l10n("FIELD_ON_PRESS"),
    },
  },
  {
    key: "true",
    label: l10n("FIELD_ON_PRESS"),
    description: l10n("FIELD_ON_PRESS_DESC"),
    type: "events",
    allowedContexts: ["global", "entity", "prefab"],
    conditions: [
      {
        key: "__scriptTabs",
        in: [undefined, "press"],
      },
    ],
  },
];

const compile = (input, helpers) => {
  const { keyboardScriptSet, event } = helpers;
  keyboardScriptSet(Number(input.keyCode ?? 28), input.true, event.symbol);
};

module.exports = {
  id,
  description: l10n("EVENT_SET_KEYBOARD_SCRIPT_DESC"),
  autoLabel,
  groups,
  fields,
  compile,
  editableSymbol: true,
  allowChildrenBeforeInitFade: true,
};
