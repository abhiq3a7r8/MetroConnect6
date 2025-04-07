import React from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { X } from "lucide-react-native";

interface MTextProp extends TextInputProps {
  placeholder: string;
  showClearButton?: boolean;
  onClear?: () => void;
  value: string;
}

export function MTextBox({
  placeholder,
  showClearButton = false,
  onClear,
  value,
  ...rest
}: MTextProp) {
  return (
    <View className="w-[90%] h-14 relative justify-center">
      <TextInput
        className="w-full h-full bg-slate-100 stroke-slate-600 text-lg rounded-lg p-3 pr-10"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        {...rest}
      />
      {showClearButton && value !== "" && (
        <TouchableOpacity
          onPress={onClear}
          className="absolute right-3 top-[50%] -translate-y-1/2"
        >
          <X color="gray" size={18} />
        </TouchableOpacity>
      )}
    </View>
  );
}
