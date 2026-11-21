import React, { useState } from "react";
import l10n from "shared/lib/lang/l10n";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getSettings } from "store/features/settings/settingsState";
import settingsActions from "store/features/settings/settingsActions";
import { Input } from "ui/form/Input";
import { Checkbox } from "ui/form/Checkbox";
import { Button } from "ui/buttons/Button";
import { CardButtons } from "ui/cards/Card";
import { SearchableSettingRow } from "ui/form/SearchableSettingRow";
import { SettingRowInput, SettingRowLabel } from "ui/form/SettingRow";
import { FormInfo } from "ui/form/FormInfo";
import {
  getEmulatorShortcutKeys,
  emulatorShortcuts,
  sdlKeyFromCode,
  sdlKeyDisplayName,
} from "shared/lib/controls/keyboard";

export const EmulatorShortcutsPicker = ({
  searchTerm,
}: {
  searchTerm: string;
}) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getSettings);
  const [unsupportedKey, setUnsupportedKey] = useState(false);
  const label = l10n("FIELD_EMULATOR_KEYS_ENABLED");
  const enabled = settings.emulatorShortcutsEnabled ?? true;
  const matches = [
    label,
    ...emulatorShortcuts.map((shortcut) => l10n(shortcut.label)),
  ];

  const onKeyDown = (
    id: string,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.repeat || event.nativeEvent.isComposing) return;
    const key = sdlKeyFromCode(event.code);
    setUnsupportedKey(!key);
    if (!key) return;
    const current = getEmulatorShortcutKeys(settings, id);
    const shortcuts = { ...settings.emulatorShortcuts };
    for (const shortcut of emulatorShortcuts) {
      shortcuts[shortcut.id] = [
        ...getEmulatorShortcutKeys(settings, shortcut.id),
      ].filter((existing) => existing !== key);
    }
    if (!current.includes(key)) shortcuts[id].push(key);
    dispatch(settingsActions.editSettings({ emulatorShortcuts: shortcuts }));
  };

  return (
    <>
      <SearchableSettingRow
        searchTerm={searchTerm}
        searchMatches={matches}
        isCheckbox
      >
        <SettingRowLabel htmlFor="emulatorShortcutsEnabled">
          {label}
        </SettingRowLabel>
        <SettingRowInput>
          <Checkbox
            id="emulatorShortcutsEnabled"
            name="emulatorShortcutsEnabled"
            checked={enabled}
            onChange={(event) => {
              setUnsupportedKey(false);
              dispatch(
                settingsActions.editSettings({
                  emulatorShortcutsEnabled: event.currentTarget.checked,
                }),
              );
            }}
          />
        </SettingRowInput>
      </SearchableSettingRow>
      {enabled && (
        <>
          {unsupportedKey && (
            <div role="alert">
              <FormInfo>{l10n("FIELD_EMULATOR_KEY_UNSUPPORTED")}</FormInfo>
            </div>
          )}
          {emulatorShortcuts.map((shortcut) => {
            const shortcutLabel = l10n(shortcut.label);
            const inputId = `ps2-shortcut-${shortcut.id}`;
            return (
              <SearchableSettingRow
                key={shortcut.id}
                searchTerm={searchTerm}
                searchMatches={[label, shortcutLabel]}
              >
                <SettingRowLabel htmlFor={inputId}>
                  {shortcutLabel}
                </SettingRowLabel>
                <SettingRowInput>
                  <Input
                    id={inputId}
                    onChange={() => undefined}
                    value={getEmulatorShortcutKeys(settings, shortcut.id)
                      .map(sdlKeyDisplayName)
                      .join(", ")}
                    onKeyDown={(event) => onKeyDown(shortcut.id, event)}
                  />
                </SettingRowInput>
              </SearchableSettingRow>
            );
          })}
        </>
      )}
      <CardButtons>
        <Button
          onClick={() => {
            setUnsupportedKey(false);
            dispatch(
              settingsActions.editSettings({
                emulatorShortcutsEnabled: true,
                emulatorShortcuts: {},
              }),
            );
          }}
        >
          {l10n("FIELD_RESTORE_DEFAULT")}
        </Button>
      </CardButtons>
    </>
  );
};
