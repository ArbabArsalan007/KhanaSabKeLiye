import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ButtonComp from "./ButtonComp";
const BottomSheetContetn = (props) => {
  console.log("check props", props.props);

  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
        paddingTop: 20,
        justifyContent: "space-around",
        alignItems: "center",
        borderColor: "#cf0662",
        borderWidth: 2,
        borderStyle: "solid",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      {props.props.checkUri ? (
        <>
          <Text
            style={{
              textAlign: "center",
              color: "#cf0662",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            UPDATE YOUR PROFILE MAGE
          </Text>
          <ButtonComp
            btnIcon="camera"
            btnColr="white"
            btnValue="Upload Image"
            btnStructure="contained"
            btnStyle={{
              width: "80%",
              backgroundColor: "#cf0662",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            loadingBoleanValue={false}
            onPressAction={props.props.uploadImageToDB}
          />
          <ButtonComp
            btnIcon="camera"
            btnColr="white"
            btnValue="Cancel Image"
            btnStructure="contained"
            btnStyle={{
              width: "80%",
              backgroundColor: "#cf0662",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "white",
            }}
            loadingBoleanValue={false}
            onPressAction={props.props.canCelUploadImage}
          />
        </>
      ) : (
        <>
          <Text
            style={{
              textAlign: "center",
              color: "#cf0662",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            UPDATE YOUR PROFILE MAGE
          </Text>
          <ButtonComp
            btnIcon="camera"
            btnColr="white"
            btnValue="Get From Gallery "
            btnStructure="contained"
            btnStyle={{
              width: "80%",
              backgroundColor: "#cf0662",
              color: "white",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            loadingBoleanValue={false}
            onPressAction={props.props.data}
          />
          <ButtonComp
            btnIcon="camera"
            btnColr="white"
            btnValue="Take A Snap"
            btnStructure="contained"
            btnStyle={{
              width: "80%",
              backgroundColor: "#cf0662",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "white",
            }}
            loadingBoleanValue={false}
            onPressAction={props.props.data2}
          />
        </>
      )}
    </View>
  );
};

export default BottomSheetContetn;

const styles = StyleSheet.create({});
