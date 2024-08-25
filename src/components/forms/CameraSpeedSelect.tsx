import React, { FC, useMemo } from "react";
import l10n from "shared/lib/lang/l10n";
import { Select } from "ui/form/Select";

interface CameraSpeedSelectProps {
  name: string;
  value?: number | null;
  allowNone?: boolean;
  allowDefault?: boolean;
  onChange?: (newValue: number | null) => void;
}

interface CameraSpeedOption {
  value: number;
  label: string;
}

export const CameraSpeedSelect: FC<CameraSpeedSelectProps> = ({
  name,
  value,
  allowNone,
  allowDefault,
  onChange,
}) => {
  const options = useMemo(
    () => [
      ...(allowDefault
        ? [{ value: -1, label: `${l10n("FIELD_DEFAULT")}` }]
        : []),
      ...(allowNone ? [{ value: 0, label: `${l10n("FIELD_INSTANT")}` }] : []),
      { value: 1, label: `${l10n("FIELD_SPEED")} 1 (${l10n("FIELD_FASTER")})` },
      { value: 2, label: `${l10n("FIELD_SPEED")} 2` },
      { value: 3, label: `${l10n("FIELD_SPEED")} 3` },
      { value: 4, label: `${l10n("FIELD_SPEED")} 4` },
      { value: 5, label: `${l10n("FIELD_SPEED")} 5 (${l10n("FIELD_SLOWER")})` },
    ],
    [allowDefault, allowNone]
  );

  const currentValue = options.find((o) => o.value === value);
  return (
    <Select
      name={name}
      value={currentValue}
      options={options}
      onChange={(newValue: CameraSpeedOption) => {
        onChange?.(newValue.value);
      }}
    />
  );
};

CameraSpeedSelect.defaultProps = {
  name: undefined,
  value: 2,
};
