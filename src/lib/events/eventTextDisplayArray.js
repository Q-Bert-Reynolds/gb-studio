const l10n = require("../helpers/l10n").default;

module.exports = {
  id: "EVENT_TEXT_DISPLAY_ARRAY",
  groups: ["EVENT_GROUP_DIALOGUE", "EVENT_GROUP_KEYBOARD"],
  description: l10n("EVENT_TEXT_DISPLAY_ARRAY_DESC"),
  autoLabel: (fetchArg) =>
    l10n("EVENT_TEXT_DISPLAY_ARRAY_LABEL", { array: fetchArg("array") }),
  fields: [
    {
      label: l10n("FIELD_TEXT_IN_LOGO_WARNING"),
      labelVariant: "warning",
      flexBasis: "100%",
      conditions: [{ sceneType: ["logo"] }],
    },
    {
      key: "array",
      label: l10n("FIELD_ARRAY"),
      description: l10n("FIELD_TEXT_ARRAY_DESC"),
      type: "variable",
      variableType: "arrayReference",
      defaultValue: "LAST_VARIABLE",
    },
  ],
  compile: (input, { textDisplayArray }) => textDisplayArray(input.array),
  waitUntilAfterInitFade: true,
};
