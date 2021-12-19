import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Text } from "react-native-paper";
import InputFieldComp from "../../../ReuseAbleComponents/InputFieldComp";
import ButtonComp from "../../../ReuseAbleComponents/ButtonComp";
import {
  auth,
  createUserWithEmailAndPassword,
  addDoc,
  collection,
  db,
} from "../../../../Firebase/FirebaseConfig";
import { ActivityIndicator } from "react-native-paper";

const SignupComp = ({ navigation }) => {
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [BtnLoader, setBtnLoader] = useState(false);

  async function signup() {
    await createUserWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        setBtnLoader(true);
        // Signed in

        const user = userCredential.user;
        // console.log(user.uid);
        let uid = user.uid;
        try {
          const docRef = addDoc(collection(db, "Registration"), {
            fname: fname,
            lname: lname,
            email: Email,
            registerUserId: user.uid,
            registrationCompleted: false,
            registrationType: "seller",
          });
          ToastAndroid.show(
            "Your Account Has Been Registerd",
            ToastAndroid.SHORT
          );
          console.log("Document written with ID: ", docRef.id);
          setfname(" ");
          setlname(" ");
          setEmail(" ");
          setPassword(" ");
          setBtnLoader(false);
        } catch (e) {
          console.error("Error adding document: ", e);
          setBtnLoader(false);
        }
      })
      .then(() => {
        navigation.navigate("ResturantRegistrationForm");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setBtnLoader(false);
        // ..
      });
  }

  useEffect(() => {
    if (BtnLoader) {
      <ActivityIndicator
        style={{ justifyContent: "center", alignItems: "center" }}
        animating={true}
        color="red"
      />;
    }
  }, [BtnLoader]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
      }}
    >
      <View style={styles.upperPart}>
        <Image
          source={require("../../../../Asset/logo2.png")}
          style={styles.logo}
        />
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
          SIGN UP FOR REGISTER YOUR ACCOUNT
        </Text>
      </View>
      <View style={styles.middlePart}>
        <InputFieldComp
          //   placeholder="Enter Your First Name"
          label="First Name"
          mode="outlined"
          text={fname}
          onChangeTextFunction={(text) => {
            setfname(text);
          }}
          outlineClr="black"
          borderColor="#028002"
        />
        <InputFieldComp
          //   placeholder="Enter Your Email"
          label="Last Name"
          mode="outlined"
          text={lname}
          onChangeTextFunction={(text) => {
            setlname(text);
          }}
          outlineClr="black"
          borderColor="#028002"
        />
        <InputFieldComp
          //   placeholder="Enter Your Email"
          label="Email"
          mode="outlined"
          text={Email}
          onChangeTextFunction={(text) => {
            setEmail(text);
          }}
          borderColor="#028002"
          outlineClr="black"
        />
        <InputFieldComp
          //   placeholder="Enter Your Password"
          label="Password"
          mode="outlined"
          text={Password}
          onChangeTextFunction={(text) => {
            setPassword(text);
          }}
          borderColor="#028002"
          outlineClr="black"
        />
      </View>
      <View
        style={{
          width: Dimensions.get("window").width,
          paddingHorizontal: Dimensions.get("window").width / 10,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <ButtonComp
          btnValue="REGISTER YOUR ACCOUNT"
          onPressAction={signup}
          btnStructure="contained"
          loadingBoleanValue={BtnLoader}
          btnColr="#028002"
          btnStyle={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }}
        />
        <ButtonComp
          btnValue="Already Have An Account...??"
          onPressAction={() => {
            navigation.navigate("ResturantLogin");
          }}
          btnStructure="text"
          loadingBoleanValue={false}
          btnColr="#028002"
          btnStyle={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }}
        />
      </View>
    </ScrollView>
  );
};

export default SignupComp;

const styles = StyleSheet.create({
  upperPart: {
    // flex: 0.4,
    // alignItems: 'center',
    justifyContent: "flex-end",
    alignContent: "center",
    width: Dimensions.get("window").width,
    paddingVertical: 10,
  },
  middlePart: {
    paddingHorizontal: 20,
    // flex: 0.6,
    justifyContent: "center",
    alignContent: "center",
    width: Dimensions.get("window").width,
  },

  logo: {
    height: 300,
    width: 300,
    borderRadius: 100,
    width: Dimensions.get("screen").width,
  },
});
