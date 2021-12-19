import React from "react";
import { Button } from "react-native-paper";

const ButtonComp = ({
  btnValue,
  onPressAction,
  btnStructure,
  btnIcon,
  loadingBoleanValue,
  btnColr,
  btnStyle,
}) => {
  return (
    <Button
      icon={btnIcon}
      mode={btnStructure}
      onPress={onPressAction}
      loading={loadingBoleanValue}
      color={btnColr}
      style={btnStyle}
    >
      {btnValue}
    </Button>
  );
};

export default ButtonComp;
