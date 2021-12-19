import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddNewDish from "./AddNewDish";
import CompletedOrder from "./CompletedOrder";
import NewOrders from "./NewOrders";
import PendingOrder from "./PendingOrder";
import UserComp from "./UserComp";
import { StoreData } from "../../../../App";
import {
  auth,
  onAuthStateChanged,
  collection,
  query,
  where,
  getDocs,
  db,
} from "../../../../Firebase/FirebaseConfig";
import { ActivityIndicator } from "react-native-paper";
const MainScreen = ({ navigation }) => {
  const { userLoginData, getUserData } = useContext(StoreData);
  const user = auth.currentUser;
  const [loader, setloader] = useState(true);
  const [userData, setuserData] = useState(true);

  useEffect(async () => {
    if (user) {
      console.log("use LOGin ha");
    } else {
      navigation.navigate("ResturantLogin");
    }
  }, [userLoginData]);
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="AddNewDish"
      activeColor="white"
      labeled={false}
      barStyle={{ backgroundColor: "#cf0662" }}
      tabBarStyle={{ height: 80 }}
    >
      <Tab.Screen
        name="NewOrders"
        component={NewOrders}
        options={{
          tabBarLabel: "UserProfile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="bell-circle"
              color="white"
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddNewDish"
        component={AddNewDish}
        options={{
          tabBarLabel: "Add New Dish",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color="white"
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserComp"
        children={() => {
          return <UserComp navigation={navigation} />;
        }}
        // component={() => {
        //   return <UserComp navigation={navigation} />;
        // }}
        options={{
          tabBarLabel: "UserProfile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color="white"
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
