import React, { useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignupComp from "../Components/Screens/Seller/Registration/SignupComp";
import LoginComp from "../Components/Screens/Seller/Registration/LoginComp";
import RegistrationForm from "../Components/Screens/Seller/Screens/RegistrationForm";
import { auth } from "../Firebase/FirebaseConfig";
import MainScreen from "../Components/Screens/Seller/Screens/MainScreen";
import { StoreData } from "../App";

const NavigationComp = () => {
  // const { userLoginData } = useContext(StoreData);
  // const [initialRoute, setinitialRoute] = useState("ResturantSignup");
  const user = auth.currentUser;

  // if (userLoginData.registrationCompleted === true) {
  //   setinitialRoute("ResturantmainScreen");
  //   console.log("user Online ho gya ha");
  // } else if (userLoginData.registrationCompleted === false) {
  //   setinitialRoute("ResturantRegistrationForm");
  //   console.log("user ki value false ha");
  // } else {
  //   setinitialRoute("ResturantSignup");
  // }
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="SignupComp"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ResturantLogin" component={LoginComp} />
      <Stack.Screen name="ResturantSignup" component={SignupComp} />
      <Stack.Screen
        name="ResturantRegistrationForm"
        component={RegistrationForm}
      />
      <Stack.Screen name="ResturantmainScreen" component={MainScreen} />
    </Stack.Navigator>
  );
};

export default NavigationComp;

const styles = StyleSheet.create({});
