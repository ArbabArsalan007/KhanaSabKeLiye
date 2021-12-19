import React, { useContext, useState, useEffect } from "react";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ToastAndroid,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { StoreData } from "../../../../App";
import { Avatar, Text } from "react-native-paper";
import {
  auth,
  signOut,
  onAuthStateChanged,
  query,
  collection,
  db,
  where,
  getDocs,
  storage,
  ref,
  onSnapshot,
  uploadBytes,
  getDownloadURL,
  setDoc,
  doc,
  updateDoc,
} from "../../../../Firebase/FirebaseConfig";
import { IconButton } from "react-native-paper";
import LoginComp from "../Registration/LoginComp";
import * as ImagePicker from "expo-image-picker";
import BottomSheetContetn from "../../../ReuseAbleComponents/BottomSheetContetn";
import { v4 } from "uuid";
const UserComp = ({ navigation }) => {
  ///////////////////// BOTTOM SHEET CONTENT//////////////
  // const [bottomSheet, setbottomSheet] = useState(false);
  const sheetRef = React.useRef(null);
  ///////////////////// BOTTOM SHEET CONTENT//////////////
  const [uri, setImage] = useState("");
  const { userLoginData } = useContext(StoreData);
  console.log("check data", userLoginData);
  const [profileImage, setprofileImage] = useState("https://picsum.photos/200");
  const [checkUri, setcheckUri] = useState(false);
  useEffect(() => {
    setprofileImage("https://picsum.photos/200/300");
  }, []);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        ToastAndroid.show("Logout Successfully", ToastAndroid.SHORT);
        // Sign-out successful.
        navigation.navigate("ResturantLogin");
        // console.log("ho gya logout");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "Registration", userLoginData.docId),
      (doc) => {
        console.log("Current data: ", doc.data());
        setprofileImage(doc.data().profileImage);
      }
    );
  }, [onSnapshot]);

  // if (uri !== " ") {
  //   changeProfileImage;
  // } else {
  //   console.log("URI EMTY NAHI HA");
  // }

  // const changeProfileImage = async () => {
  //   let imageURL = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });
  //   // console.log(imageURL);

  //   if (!imageURL.cancelled) {
  //     setImage(imageURL.uri);
  //   }
  // };
  // console.log("check navigation", navigation);

  const getImageUrl = async () => {
    let imageURL = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(imageURL);

    if (!imageURL.cancelled) {
      setImage(imageURL.uri);
      // console.log("url ye ha", imageURL.uri);
      setcheckUri(true);
    }
  };

  const uploadImageToDB = async () => {
    // console.log("pressed by upload button");
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        // console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    // console.log("doubled pressed by upload button");

    const fileRef = ref(storage, v4());
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();
    console.log("3rd pressed by upload button");

    return await getDownloadURL(fileRef).then(async (url) => {
      console.log("got url", userLoginData.docId, url);
      const washingtonRef = doc(db, "Registration", userLoginData.docId);
      console.log("URL KA BAAD YE WALA CONSOLE HA", userLoginData.docId);
      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, {
        profileImage: url,
      })
        .then(() => {
          setcheckUri(false);
        })
        .catch((err) => {
          console.log("firebase error", err);
        });
    });
  };

  const canCelUploadImage = () => {
    // console.log("pressed by cancel button");
    setcheckUri(false);
  };

  let props = {
    data: () => {
      // console.log("BTN 1");
      getImageUrl();
    },
    data2: () => {
      // console.log("BTN 2");
    },
    checkUri,
    uploadImageToDB,
    canCelUploadImage,
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <View
        style={{
          backgroundColor: "#cf0662",
          height: "50%",
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <Avatar.Image size={100} source={{ uri: profileImage }} />
        <TouchableOpacity>
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              textAlign: "center",
              marginTop: 10,
            }}
            onPress={() => sheetRef.current.snapTo(0)}
          >
            Edit Your Profile Image
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold",
            color: "white",
            marginVertical: 10,
          }}
        >
          {userLoginData.resturantName}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "white",
          height: "20%",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <View
          style={{
            border: 2,
            borderColor: "#cf0662",
            width: "33.33%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <IconButton
              style={{ backgroundColor: "#cf0662", marginVertical: 10 }}
              size={25}
              icon="logout"
              color="white"
              onPress={logOut}
            />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#cf0662" }}>
            LOG OUT
          </Text>
        </View>
        <View
          style={{
            border: 2,
            borderColor: "#cf0662",
            width: "33.33%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <IconButton
              style={{ backgroundColor: "#cf0662", marginVertical: 10 }}
              size={25}
              icon="account-edit"
              color="white"
            />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#cf0662" }}>
            User Info
          </Text>
        </View>
        <View
          style={{
            border: 2,
            borderColor: "#cf0662",
            width: "33.33%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <IconButton
              style={{ backgroundColor: "#cf0662", marginVertical: 10 }}
              size={25}
              icon="information"
              color="white"
            />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#cf0662" }}>
            About
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: "grey", height: "30%" }}></View>
      {/* ////////////////////BOTTOM SHEET //////////////////// */}

      <BottomSheet
        ref={sheetRef}
        snapPoints={["30%", "30%", 0]}
        borderRadius={10}
        renderContent={() => {
          return <BottomSheetContetn props={props} />;
        }}
        enabledContentTapInteraction={false}
        enabledBottomClamp={false}
        // children={() => {
        //   return <BottomSheetContetn props={props} />;
        // }}
      />

      <StatusBar barStyle="default" />
    </SafeAreaView>
  );
};

export default UserComp;

const styles = StyleSheet.create({});
