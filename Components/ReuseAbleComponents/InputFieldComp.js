import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const InputFieldComp = ({
  text,
  label,
  placeholder,
  onChangeTextFunction,
  mode,
  borderColor,
  outlineClr,
  inputStateDisable,
  keyboardType,
}) => {
  return (
    <TextInput
      label={label}
      value={text}
      onChangeText={onChangeTextFunction}
      placeholder={placeholder}
      mode={mode}
      activeOutlineColor={borderColor}
      outlineColor={outlineClr}
      style={{ marginVertical: 5, height: 45 }}
      editable={inputStateDisable}
      keyboardType={keyboardType}
    />
  );
};

export default InputFieldComp;

const styles = StyleSheet.create({});
