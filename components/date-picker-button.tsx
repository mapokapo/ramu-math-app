import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ThemedButton from "./themed-button";
import { useState } from "react";
import { useTheme } from "../lib/hooks/theme";

type Props = {
  title: string;
  onDateChange: (date: Date) => void;
  disabled: boolean;
};

export default function DatePickerButton({
  title,
  disabled,
  onDateChange,
}: Props) {
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const theme = useTheme();

  const handlePickDateOfBirth = () => {
    DateTimePickerAndroid.open({
      value: dateOfBirth ?? new Date(),
      mode: "date",
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setDateOfBirth(selectedDate);
          onDateChange(selectedDate);
        }
      },
      is24Hour: true,
    });
  };
  return (
    <ThemedButton
      title={dateOfBirth ? dateOfBirth.toLocaleDateString() : title}
      onPress={handlePickDateOfBirth}
      disabled={disabled}
      textStyle={{
        color: theme.colors.primary,
      }}
      style={{
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.primary,
      }}
    />
  );
}
