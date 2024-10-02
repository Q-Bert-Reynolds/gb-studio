import React, { useCallback } from "react";
import {useAppSelector } from "store/hooks";
import { FormRow, FormField } from "ui/form/layout/FormLayout";
import { NumberInput } from "ui/form/NumberInput";
import { castEventToInt } from "renderer/lib/helpers/castEventValue";

type DMGPalettePickerProps = {
  name: string
  palette: [number, number, number, number]
  isSpritePalette: boolean
  onChange: (palette: [number, number, number, number]) => void;
};

export const DMGPalettePicker = ({
  name,
  palette,
  isSpritePalette,
  onChange
}: DMGPalettePickerProps) => {

  const settings = useAppSelector((state) => state.project.present.settings);
  const dmgColors = [settings.customColorsWhite, settings.customColorsLight, settings.customColorsDark, settings.customColorsBlack];
  const fields = isSpritePalette ? [1, 2, 3] : [0, 1, 2, 3];
  const onEdit = useCallback(
    (index: number, e: number) => {
      palette[index] = e;
      onChange(palette);
    },
    [palette]
  );

  function getRows() {
    return fields.map((index) =>
      <FormField name={`${name}_${index}`}>
        <NumberInput
          style={{backgroundColor:`#${dmgColors[palette[index]]}`, color:`#${dmgColors[(palette[index]+2)%4]}`}}
          id={`${name}_${index}`}
          name={`${name}_${index}`}
          min={0}
          max={3}
          value={palette[index]}
          onChange={(e) => onEdit(index, castEventToInt(e, index))}
        />
      </FormField>
    );
  }

  return (<FormRow>{getRows()}</FormRow>);
};
