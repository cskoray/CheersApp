import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import ActivityIndicator from "../../components/ActivityIndicator";
import useAuth from "../../auth/useAuth";
import { auth, db, doc } from "../../firebase";
import { getDoc, updateDoc } from "firebase/firestore";

function Picture() {
  const [image, setImage] = useState(null);
  const [imgURI, setImageURI] = useState(null);
  const [isUploading, setIsUploading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [remoteURL, setRemoteURL] = useState("");
  const [error, setError] = useState(null);
  const { width } = useWindowDimensions();
  const storage = getStorage();
  const { authUser, setAuthUser } = useAuth();
  const id = auth?.currentUser?.uid;
  const usAuth = useAuth();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getBlobFroUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const updateStep = async (downloadlink) => {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      avatar: downloadlink,
      step: "picture_uploaded",
    }).catch((err) => {
      console.log(err);
    });
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      usAuth.logIn("user", docSnap.data());
      setAuthUser(docSnap.data());
    }
  };

  const manageFileUpload = async (
    fileBlob,
    { onStart, onProgress, onComplete, onFail }
  ) => {
    const imgName = "img-" + new Date().getTime();
    const storageRef = ref(storage, `images/${imgName}.jpg`);

    console.log("uploading file", imgName);
    const metadata = {
      contentType: "image/jpeg",
      // metadata: {
      //   firebaseStorageDownloadTokens: Crypto.randomUUID(),
      // },
    };
    onStart && onStart();
    const uploadTask = uploadBytesResumable(storageRef, fileBlob, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(Math.fround(progress).toFixed(2));
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log("unauthorized");
            break;
          case "storage/canceled":
            // User canceled the upload
            console.log("canceled");
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            console.log("unknown");
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onComplete && onComplete(downloadURL);
          updateStep(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };
  const handleLocalImageUpload = async () => {
    if (image) {
      setImageURI(image);
    }
  };

  const onStart = () => {
    setIsUploading(true);
  };

  const onProgress = (progress) => {
    setProgress(progress);
  };
  const onComplete = (fileUrl) => {
    setRemoteURL(fileUrl);
    setIsUploading(false);
    setImageURI(null);
  };

  const onFail = (error) => {
    setError(error);
    setIsUploading(false);
  };

  const handleCloudImageUpload = async () => {
    if (!image) return;

    const blob = await getBlobFroUri(image);

    await manageFileUpload(blob, { onStart, onProgress, onComplete, onFail });
  };

  const getProfilePicture = async () => {};

  useEffect(() => {
    getProfilePicture();
    console.log("authUser", authUser);
  }, [authUser.step]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ActivityIndicator visible={isUploading} />
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          // justifyContent: "center",
          margin: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 4,
            backgroundColor: "#E5E7EB",
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <View
            style={{ width: "40%", height: 4, backgroundColor: "#0f172a" }}
          ></View>
        </View>
        <Text
          style={{
            fontSize: 30,
            fontFamily: "OpenSans_700Bold",
            top: 20,
          }}
        >
          Add your first photo
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Montserrat_500Medium",
            lineHeight: 30,
            top: 30,
          }}
        >
          You will be able to change it later
        </Text>
        <View
          style={{
            top: "50%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              // padding: 60,
              backgroundColor: "#d6d3d1",
              borderRadius: 5,
              width: 200,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={pickImage}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, borderRadius: 5 }}
              />
            ) : (
              <Entypo name="plus" size={24} color="#0f172a" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{ alignItems: "flex-end", padding: 20, flex: 1, top: "30%" }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: "#0f172a",
            borderRadius: 50,
          }}
        >
          <MaterialIcons
            name="navigate-next"
            size={28}
            color="white"
            onPress={handleCloudImageUpload}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Picture;
