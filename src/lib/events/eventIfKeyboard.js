const l10n = require("../helpers/l10n").default;
const { getKeyboardKeyOptionsJSON } = require("./helpers");

const keyOptions = JSON.parse(getKeyboardKeyOptionsJSON());
const keyLabels = Object.fromEntries(keyOptions);

const id = "EVENT_IF_KEYBOARD";
const groups = ["EVENT_GROUP_KEYBOARD", "EVENT_GROUP_CONTROL_FLOW"];
const subGroups = {
  EVENT_GROUP_KEYBOARD: "EVENT_GROUP_CONTROL_FLOW",
  EVENT_GROUP_CONTROL_FLOW: "EVENT_GROUP_KEYBOARD",
};

const autoLabel = (_, input) => {
  return l10n("EVENT_IF_KEYBOARD_LABEL", {
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
    key: "true",
    label: l10n("FIELD_TRUE"),
    description: l10n("FIELD_TRUE_DESC"),
    type: "events",
  },
  {
    key: "__collapseElse",
    label: l10n("FIELD_ELSE"),
    type: "collapsable",
    defaultValue: true,
    conditions: [
      {
        key: "__disableElse",
        ne: true,
      },
    ],
  },
  {
    key: "false",
    label: l10n("FIELD_FALSE"),
    description: l10n("FIELD_FALSE_DESC"),
    conditions: [
      {
        key: "__collapseElse",
        ne: true,
      },
      {
        key: "__disableElse",
        ne: true,
      },
    ],
    type: "events",
  },
];

const compile = (input, helpers) => {
  const { ifKeyboard } = helpers;
  const truePath = input.true;
  const falsePath = input.__disableElse ? [] : input.false;
  ifKeyboard(Number(input.keyCode ?? 28), truePath, falsePath);
};

module.exports = {
  id,
  description: l10n("EVENT_IF_KEYBOARD_DESC"),
  autoLabel,
  groups,
  subGroups,
  fields,
  compile,
};
