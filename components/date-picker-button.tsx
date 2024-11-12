import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ThemedButton from "./themed-button";
import { useTheme } from "../lib/hooks/theme";

type Props = {
  title: string;
  value: Date | null;
  onDateChange: (date: Date) => void;
  disabled: boolean;
};

export default function DatePickerButton({
  title,
  value,
  disabled,
  onDateChange,
}: Props) {
  const theme = useTheme();

  const handlePickDateOfBirth = () => {
    DateTimePickerAndroid.open({
      value: value ?? new Date(),
      mode: "date",
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          onDateChange(selectedDate);
        }
      },
      is24Hour: true,
    });
  };
  return (
    <ThemedButton
      title={value ? value.toLocaleDateString() : title}
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
