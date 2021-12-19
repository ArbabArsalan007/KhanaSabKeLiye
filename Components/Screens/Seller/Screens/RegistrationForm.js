import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { Avatar, Button, ActivityIndicator } from "react-native-paper";
import {
  auth,
  onAuthStateChanged,
  query,
  collection,
  db,
  where,
  getDocs,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  setDoc,
  doc,
} from "../../../../Firebase/FirebaseConfig";
import ButtonComp from "../../../ReuseAbleComponents/ButtonComp";
import DropdownComp from "../../../ReuseAbleComponents/DropdownComp";
import InputFieldComp from "../../../ReuseAbleComponents/InputFieldComp";
import * as ImagePicker from "expo-image-picker";
import { v4 } from "uuid";
import { StoreData } from "../../../../App";

const RegistrationForm = ({ navigation }) => {
  const { userLoginData, getUserData } = useContext(StoreData);

  /////////////get document Id to replace old data on new
  const [docId, setdocId] = useState("");
  const [resturantName, setresturantName] = useState("");
  const [resturantArea, setresturantArea] = useState("");
  const [foodType, setfoodType] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  /////////////////// ASKING PERMISSION FOR IMAGE
  const [uri, setImage] = useState("");
  const [activityIndicate, setactivityIndicate] = useState(false);
  // console.log(Image);
  const user = auth.currentUser;

  useEffect(() => {
    if (user === null) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      navigation.navigate("ResturantLogin");
      // ...
    } else if (user && userLoginData.registrationCompleted === true) {
      // No user is signed in.
      navigation.navigate("ResturantmainScreen");
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  /////////////activity indicator
  useEffect(() => {
    if (activityIndicate) {
      <ActivityIndicator
        style={{ justifyContent: "center", alignItems: "center" }}
        animating={true}
        color="red"
      />;
      ToastAndroid.show("Waiting...", ToastAndroid.SHORT);
    }
  }, [activityIndicate]);

  //////////// get user login data
  const [loginUserData, setloginUserData] = useState("");

  ///////Uplaod Image
  const uploadImage = async () => {
    setbtnloading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setbtnloading(false);
      ToastAndroid.show("Image Uploaded", ToastAndroid.SHORT);
    }
  };

  /////////////// get user data
  useEffect(async () => {
    await onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const q = query(
          collection(db, "Registration"),
          where("registerUserId", "==", uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setloginUserData(doc.data());
          setdocId(doc.id);
        });
      } else {
        // User is signed out
        // ...
        navigation.navigate("ResturantLogin");
      }
    });
  }, []);
  // console.log("document id", docId);

  const uploadImagePath = async () => {
    setactivityIndicate(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, v4());
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef).then(async (url) => {
      console.log(url);

      await setDoc(doc(db, "Registration", docId), {
        fname: loginUserData.fname,
        lname: loginUserData.lname,
        email: loginUserData.email,
        ResturantImage: url,
        registerUserId: loginUserData.registerUserId,
        registrationType: "seller",
        registrationCompleted: true,
        resturantName: resturantName,
        resturantArea: resturantArea,
        foodType: foodType,
        docId: docId,
      })
        .then(() => {
          setbtnloading(false);
          getUserData({
            fname: loginUserData.fname,
            lname: loginUserData.lname,
            email: loginUserData.email,
            ResturantImage: url,
            registerUserId: loginUserData.registerUserId,
            registrationType: "seller",
            registrationCompleted: true,
            resturantName: resturantName,
            resturantArea: resturantArea,
            foodType: foodType,
            docId: docId,
          });
        })
        .then(() => {
          setactivityIndicate(false);
          navigation.navigate("ResturantmainScreen");
          console.log("done ho gya ga gorm");
        });
    });
  };
  // console.log();
  console.log(resturantName);
  console.log(resturantArea);
  console.log(foodType);
  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        // height: Dimensions.get("window").height,
        // width: Dimensions.get("window").width,
        paddingVertical: 50,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar.Image
          size={80}
          source={require("../../../../Asset/logo2.png")}
        />
        <Text
          style={{ textAlign: "center", fontWeight: "bold", marginVertical: 5 }}
        >
          PLEASE FILL COMPLETE FORM TO REGISTER YOUR COMPLAINT
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          //   flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20,
          width: Dimensions.get("window").width,
        }}
      >
        <View style={styles.middlePart}>
          <InputFieldComp
            //   placeholder="Enter Your First Name"
            label="First Name"
            mode="outlined"
            text={loginUserData.fname}
            // onChangeTextFunction={(text) => {
            //   setfname(text);
            // }}
            outlineClr="black"
            borderColor="#028002"
            inputStateDisable={false}
          />
          <InputFieldComp
            //   placeholder="Enter Your First Name"
            label="Last Name"
            mode="outlined"
            text={loginUserData.lname}
            // onChangeTextFunction={(text) => {
            //   setfname(text);
            // }}
            outlineClr="black"
            borderColor="#028002"
            inputStateDisable={false}
          />
          <InputFieldComp
            //   placeholder="Enter Your First Name"
            label="Email"
            mode="outlined"
            text={loginUserData.email}
            // onChangeTextFunction={(text) => {
            //   setfname(text);
            // }}
            outlineClr="black"
            borderColor="#028002"
            inputStateDisable={false}
          />

          <InputFieldComp
            //   placeholder="Enter Your First Name"
            label="Enter Your Branch Name"
            mode="outlined"
            text={resturantName}
            onChangeTextFunction={(text) => {
              setresturantName(text);
            }}
            outlineClr="black"
            borderColor="#028002"
          />

          <InputFieldComp
            //   placeholder="Enter Your First Name"
            label="Enter Your Area Name (MALIR , LANDHI , DEFENCE)"
            mode="outlined"
            text={resturantArea}
            onChangeTextFunction={(text) => {
              setresturantArea(text);
            }}
            outlineClr="black"
            borderColor="#028002"
          />
          <DropdownComp
            pickDropdownvalue={(itemValue, itemIndex) => {
              setfoodType(itemValue);
              console.log(itemValue);
            }}
            selectedLanguage={foodType}
            valueA="POOR FAIMILY"
            valueB="JOBLESS FAIMILY"
          />
          <ButtonComp
            btnValue="Upload Your Image"
            btnIcon="upload"
            btnStructure="outlined"
            onPressAction={uploadImage}
            btnColr="#028002"
            btnStyle={{
              marginVertical: 10,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
            loadingBoleanValue={btnloading}
          />
          <ButtonComp
            btnValue="GO TO DASHBOARD"
            // btnIcon="upload"
            btnStructure="contained"
            onPressAction={uploadImagePath}
            btnColr="#028002"
            btnStyle={{
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              marginVertical: 6,
              marginBottom: 10,
            }}
          />
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

export default RegistrationForm;

const styles = StyleSheet.create({
  middlePart: {
    paddingHorizontal: 30,
    // flex: 0.6,
    justifyContent: "center",
    alignContent: "center",
    width: Dimensions.get("window").width,
  },
});
