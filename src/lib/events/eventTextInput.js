const l10n = require("../helpers/l10n").default;

const fields = [
  {
    label: l10n("FIELD_TEXT_IN_LOGO_WARNING"),
    labelVariant: "warning",
    flexBasis: "100%",
    conditions: [{ sceneType: ["logo"] }],
  },
  {
    key: "array",
    label: l10n("FIELD_ARRAY"),
    description: l10n("FIELD_TEXT_INPUT_ARRAY_DESC"),
    type: "variable",
    variableType: "arrayReference",
    defaultValue: "LAST_VARIABLE",
  },
  {
    key: "prompt",
    label: l10n("FIELD_TEXT_INPUT_PROMPT"),
    type: "textarea",
    singleLine: true,
    defaultValue: "",
  },
  {
    key: "maximum",
    label: l10n("FIELD_TEXT_INPUT_MAXIMUM"),
    description: l10n("FIELD_TEXT_INPUT_MAXIMUM_DESC"),
    type: "number",
    min: 1,
    max: 63,
    defaultValue: 16,
  },
  {
    key: "filter",
    label: l10n("FIELD_TEXT_INPUT_FILTER"),
    type: "select",
    defaultValue: "text",
    options: [
      ["text", l10n("FIELD_TEXT_INPUT_FILTER_TEXT")],
      ["numeric", l10n("FIELD_TEXT_INPUT_FILTER_NUMERIC")],
      ["alphanumeric", l10n("FIELD_TEXT_INPUT_FILTER_ALPHANUMERIC")],
    ],
  },
  {
    key: "uppercase",
    label: l10n("FIELD_TEXT_INPUT_UPPERCASE"),
    type: "checkbox",
    defaultValue: false,
  },
  {
    key: "showKeyboard",
    label: l10n("FIELD_TEXT_INPUT_OSK"),
    description: l10n("FIELD_TEXT_INPUT_OSK_DESC"),
    type: "checkbox",
    defaultValue: true,
  },
  {
    key: "textLocation",
    label: l10n("FIELD_TEXT_INPUT_TEXT_LAYER"),
    description: l10n("FIELD_TEXT_INPUT_TEXT_LAYER_DESC"),
    type: "select",
    defaultValue: "overlay",
    options: [
      ["overlay", l10n("FIELD_OVERLAY")],
      ["background", l10n("FIELD_BACKGROUND")],
    ],
    conditions: [{ key: "showKeyboard", ne: false }],
  },
  {
    key: "password",
    label: l10n("FIELD_TEXT_INPUT_PASSWORD"),
    type: "checkbox",
    defaultValue: false,
  },
  {
    key: "result",
    label: l10n("FIELD_TEXT_INPUT_RESULT"),
    description: l10n("FIELD_TEXT_INPUT_RESULT_DESC"),
    type: "variable",
    defaultValue: "LAST_VARIABLE",
  },
];

module.exports = {
  id: "EVENT_TEXT_INPUT",
  groups: ["EVENT_GROUP_KEYBOARD", "EVENT_GROUP_DIALOGUE"],
  description: l10n("EVENT_TEXT_INPUT_DESC"),
  autoLabel: (fetchArg) =>
    l10n("EVENT_TEXT_INPUT_LABEL", { array: fetchArg("array") }),
  fields,
  compile: (input, { textInput }) =>
    textInput(
      input.array,
      input.result,
      Number(input.maximum ?? 16),
      input.prompt || "",
      input.filter || "text",
      !!input.uppercase,
      !!input.password,
      input.showKeyboard !== false,
      input.textLocation || "overlay",
    ),
  waitUntilAfterInitFade: true,
};
