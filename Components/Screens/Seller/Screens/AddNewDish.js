import React, { useContext, useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View, ToastAndroid } from "react-native";
import { Appbar, IconButton } from "react-native-paper";
import { StoreData } from "../../../../App";
import { Video, AVPlaybackStatus } from "expo-av";
import { BottomSheet } from "react-native-btr";
import InputFieldComp from "../../../ReuseAbleComponents/InputFieldComp";
import ButtonComp from "../../../ReuseAbleComponents/ButtonComp";
import DropdownComp from "../../../ReuseAbleComponents/DropdownComp";
import * as ImagePicker from "expo-image-picker";
import { v4 } from "uuid";
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
  addDoc,
} from "../../../../Firebase/FirebaseConfig";
const { width, height } = Dimensions.get("window");
const AddNewDish = () => {
  const { userLoginData } = useContext(StoreData);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [visible, setVisible] = useState(false);
  const [uri, setImage] = useState("");
  const [foodType, setfoodType] = useState("");
  // const [dishPrice, setdishPrice] = useState("");
  const [dishPrice, setdishPrice] = useState("");
  const [DishName, setDishName] = useState(false);
  const [docId, setdocId] = useState("");
  const [loginUserData, setloginUserData] = useState("");

  const [btnloading, setbtnloading] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  console.log(userLoginData);

  console.log(DishName);
  console.log(dishPrice);
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
      setbtnloading(false);
      setImage(result.uri);
      ToastAndroid.show("Image Uploaded", ToastAndroid.SHORT);
    }
  };

  const uploadImagePath = async () => {
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

      await addDoc(collection(db, "Dishes"), {
        fname: loginUserData.fname,
        lname: loginUserData.lname,
        email: loginUserData.email,
        dishImage: url,
        registerUserId: loginUserData.registerUserId,
        registrationType: "seller",
        registrationCompleted: true,
        foodType: foodType,
        DishName: DishName,
        dishPrice: dishPrice,
      });
      setbtnloading(false);
      setVisible(!visible);
      ToastAndroid.show("YOUR DISH HAS BEEN ADDED", ToastAndroid.SHORT);
      console.log("done ho gya ga gorm");
    });
  };

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Appbar.Header
        statusBarHeight={40}
        style={{
          backgroundColor: "#028002",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Appbar.Content
          title={userLoginData.resturantName.toUpperCase()}
          subtitle={userLoginData.resturantArea.toUpperCase()}
          style={{ justifyContent: "center", alignItems: "center" }}
          // titleStyle={{ textAlign: "center",fontSize:"20" }}
          titleStyle={{ fontSize: 30 }}
          subtitleStyle={{ fontSize: 20, marginBottom: 10 }}
        />
      </Appbar.Header>
      <View
        style={{
          // width: "100%",
          height: "100%",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        <Video
          ref={video}
          style={styles.video}
          source={require("../../../../Asset/addDish.mp4")}
          // useNativeControls
          resizeMode="cover"
          isLooping={true}
          isMuted={true}
          shouldPlay
        />
        <Text style={{ fontSize: 40, fontWeight: "bold", color: "#028002" }}>
          ADD YOUR Info...!
        </Text>
        <IconButton
          size={80}
          color="#028002"
          style={{
            zIndex: 999999,
            backgroundColor: "white",
          }}
          icon="plus-circle"
          onPress={toggleBottomNavigationView}
        />
      </View>

      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}
        <View style={styles.bottomNavigationView}>
          <View style={{ width: "70%" }}>
            <InputFieldComp
              label="Dish Name"
              text={DishName}
              onChangeTextFunction={(text) => {
                setDishName(text);
              }}
              mode="outlined"
              outlineClr="black"
              borderColor="#028002"
              style={{ marginVertical: 5, height: 45 }}
            />
            {/* <InputFieldComp
              label="Price"
              text={dishPrice}
              onChangeTextFunction={(text) => {
                setdishPrice(text);
              }}
              mode="outlined"
              outlineClr="black"
              borderColor="#028002"
              style={{ marginVertical: 5, height: 45 }}
              keyboardType="numeric"
            /> */}
          </View>
          <DropdownComp
            pickDropdownvalue={(itemValue, itemIndex) => {
              setfoodType(itemValue);
              console.log(itemValue);
            }}
            selectedLanguage={foodType}
            valueA="Desi"
            valueB="Chinese"
          />
          <ButtonComp
            btnValue="Upload Image"
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
              width: "70%",
            }}
            loadingBoleanValue={btnloading}
          />
          <ButtonComp
            btnValue="ADD"
            // btnIcon="upload"
            btnStructure="contained"
            onPressAction={uploadImagePath}
            btnColr="#028002"
            btnStyle={{
              width: width / 2,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              marginVertical: 6,
              marginBottom: 10,
              fontWeight: "bold",
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default AddNewDish;

const styles = StyleSheet.create({
  video: {
    width: width,
    height: height,
    opacity: 0.4,
    position: "absolute",
    top: 0,
    left: 0,
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});
