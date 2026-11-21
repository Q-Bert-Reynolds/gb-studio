import { defaultJoypadControls as defaultValues } from "shared/lib/controls/keyboard";
import React, { useCallback, useMemo } from "react";
import l10n from "shared/lib/lang/l10n";
import { Button } from "ui/buttons/Button";
import settingsActions from "store/features/settings/settingsActions";
import { Checkbox } from "ui/form/Checkbox";
import { Input } from "ui/form/Input";
import { SearchableSettingRow } from "ui/form/SearchableSettingRow";
import { CardButtons } from "ui/cards/Card";
import { SettingRowInput, SettingRowLabel } from "ui/form/SettingRow";
import {
  SettingsState,
  getSettings,
} from "store/features/settings/settingsState";
import { useAppDispatch, useAppSelector } from "store/hooks";

interface CustomControlsPickerProps {
  searchTerm: string;
}

const buttons = [
  { key: "a", label: "A" },
  { key: "b", label: "B" },
  {
    key: "start",
    label: "Start",
  },
  {
    key: "select",
    label: "Select",
  },
] as const;

const keyMap = {
  up: "customControlsUp",
  down: "customControlsDown",
  left: "customControlsLeft",
  right: "customControlsRight",
  a: "customControlsA",
  b: "customControlsB",
  start: "customControlsStart",
  select: "customControlsSelect",
} as const;

interface DirectionOption {
  key: "up" | "down" | "left" | "right";
  label: string;
}

const CustomControlsPicker = ({ searchTerm }: CustomControlsPickerProps) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getSettings);

  const directions: DirectionOption[] = useMemo(
    () => [
      {
        key: "up",
        label: l10n("FIELD_DIRECTION_UP"),
      },
      {
        key: "down",
        label: l10n("FIELD_DIRECTION_DOWN"),
      },
      {
        key: "left",
        label: l10n("FIELD_DIRECTION_LEFT"),
      },
      {
        key: "right",
        label: l10n("FIELD_DIRECTION_RIGHT"),
      },
    ],
    [],
  );

  const noop = useCallback(() => {}, []);

  const onKeyDown =
    (input: keyof typeof keyMap) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const inputKey = keyMap[input];
      const currentValue: readonly string[] = Array.isArray(settings[inputKey])
        ? settings[inputKey]
        : defaultValues[inputKey];
      e.currentTarget.blur();

      if (e.key === "Backspace" || e.key === "Delete") {
        dispatch(
          settingsActions.editSettings({
            [inputKey]: [],
          }),
        );
      } else {
        const patch = Object.values(keyMap).reduce((memo, otherInputKey) => {
          if (inputKey !== otherInputKey) {
            // Remove if this key has already been assigned to another input
            const otherValue: readonly string[] = Array.isArray(
              settings[otherInputKey],
            )
              ? settings[otherInputKey]
              : defaultValues[otherInputKey];

            if (otherValue.indexOf(e.key) > -1) {
              return {
                ...memo,
                [otherInputKey]: otherValue.filter((k) => k !== e.key),
              };
            }
            return memo;
          }
          if (currentValue.indexOf(e.key) > -1) {
            // Remove if this key has already been assigned to this input
            return {
              ...memo,
              [inputKey]: currentValue.filter((k) => k !== e.key),
            };
          }
          // Assign key to this input
          return {
            ...memo,
            [inputKey]: ([] as string[]).concat(currentValue, e.key),
          };
        }, {} as Partial<SettingsState>);
        dispatch(settingsActions.editSettings(patch));
      }
    };

  const onRestoreDefault = useCallback(() => {
    dispatch(
      settingsActions.editSettings(
        Object.keys(defaultValues).reduce(
          (memo, key) => {
            return {
              ...memo,
              [key]: undefined,
            };
          },
          { ps2KeyboardSupported: false },
        ),
      ),
    );
  }, [dispatch]);

  return (
    <>
      {directions.map((direction) => (
        <SearchableSettingRow
          key={direction.key}
          searchTerm={searchTerm}
          searchMatches={[direction.label]}
        >
          <SettingRowLabel>{direction.label}</SettingRowLabel>

          <SettingRowInput>
            <Input
              id="directionUp"
              value={
                settings[keyMap[direction.key]] ||
                defaultValues[keyMap[direction.key]] ||
                [].join(", ")
              }
              onChange={noop}
              placeholder=""
              onKeyDown={onKeyDown(direction.key)}
            />
          </SettingRowInput>
        </SearchableSettingRow>
      ))}
      {buttons.map((button) => (
        <SearchableSettingRow
          key={button.key}
          searchTerm={searchTerm}
          searchMatches={[button.label]}
        >
          <SettingRowLabel>{button.label}</SettingRowLabel>
          <SettingRowInput>
            <Input
              id="buttonUp"
              value={(
                settings[keyMap[button.key]] ||
                defaultValues[keyMap[button.key]] ||
                []
              ).join(", ")}
              onChange={noop}
              placeholder=""
              onKeyDown={onKeyDown(button.key)}
            />
          </SettingRowInput>
        </SearchableSettingRow>
      ))}
      <SearchableSettingRow
        searchTerm={searchTerm}
        searchMatches={[l10n("FIELD_PS2_KEYBOARD_SUPPORTED")]}
        isCheckbox
      >
        <SettingRowLabel htmlFor="ps2KeyboardSupported">
          {l10n("FIELD_PS2_KEYBOARD_SUPPORTED")}
        </SettingRowLabel>
        <SettingRowInput>
          <Checkbox
            id="ps2KeyboardSupported"
            name="ps2KeyboardSupported"
            checked={settings.ps2KeyboardSupported ?? false}
            onChange={(event) =>
              dispatch(
                settingsActions.editSettings({
                  ps2KeyboardSupported: event.currentTarget.checked,
                }),
              )
            }
          />
        </SettingRowInput>
      </SearchableSettingRow>
      <CardButtons>
        <Button onClick={onRestoreDefault}>
          {l10n("FIELD_RESTORE_DEFAULT")}
        </Button>
      </CardButtons>
    </>
  );
};

export default CustomControlsPicker;
