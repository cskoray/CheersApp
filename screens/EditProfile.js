import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { auth, db, doc } from "../firebase";
import { getDoc, getDocs, collection, query } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import InterestsModal from "../components/InterestsModal";
import useAuth from "../auth/useAuth";
import server from "../api/server";

function EditProfile({ navigation }) {
  const [user, setUser] = useState();
  const [extraData, setExtraData] = useState(null);
  const [image, setImage] = useState(null);
  const [userInterests, setUserInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [bioText, setBioText] = useState("");
  const [charsLeft, setCharsLeft] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);
  const usAuth = useAuth();
  const { setAuthUser } = useAuth();
  const id = auth?.currentUser?.uid;
  const textInputRef = useRef(null);

  const getUser = async () => {
    const uTopics = [];
    const uInterests = [];

    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const u = docSnap.data();
      setUser(u);
      setBioText(u.bio);
      u.interests?.map((interest) => {
        uInterests.push(interest);
      });
      const q3 = query(collection(db, "interests"));
      const docSnap3 = await getDocs(q3);
      if (!docSnap3.empty) {
        docSnap3.forEach((doc) => {
          setAllInterests((interests) => [...interests, doc.data()]);
          if (uInterests.includes(doc.data()._id)) {
            setUserInterests((interests) => [...interests, doc.data()]);
          }
        });
      }
      setImage(u.avatar);
    }
  };

  function isInterestIdExists(id) {
    return userInterests?.some((interest) => id === interest?._id);
  }

  const addRemoveInterest = async (newInterest) => {
    if (!isInterestIdExists(newInterest._id)) {
      setUserInterests((interest) => [...interest, newInterest]);
      setExtraData(newInterest._id);
    } else {
      setUserInterests((interests) =>
        interests.filter((interes) => interes._id !== newInterest._id)
      );
      setExtraData(newInterest._id);
    }
  };

  const saveBio = async () => {
    if (user?.uid && bioText) {
      await server.setBio(user?.uid, bioText);
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        usAuth.logIn("user", docSnap.data());
        setAuthUser(docSnap.data());
      }
    }
  };

  const persistInterests = async () => {
    if (userInterests?.length === 0) {
      alert("Please select at least one interest");
      return;
    }
    await server.setinterests(user?.uid, userInterests);
    const docRef = doc(db, "users", user?.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      usAuth.logIn("user", docSnap.data());
      setAuthUser(docSnap.data());
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    persistInterests();
    setModalVisible(false);
  };

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

  useEffect(() => {
    setUserInterests([]);
    getUser();
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        saveBio();
      }
    );

    return () => {
      // Remove the listener when the component unmounts
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <InterestsModal
        visible={modalVisible}
        onClose={closeModal}
        userInterests={userInterests}
        allInterests={allInterests}
        extradata={extraData}
        addRemoveInterest={addRemoveInterest}
      />
      <View
        style={{
          padding: 10,

          backgroundColor: "#fcd34d",
          height: "15%",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            flex: 1,
          }}
        >
          <AntDesign
            name="leftcircle"
            size={30}
            color="#0f172a"
            style={{ top: 20, width: "28%" }}
            onPress={() => {
              saveBio();
              navigation.goBack();
            }}
          />
          <Text
            style={{
              fontSize: 26,
              fontFamily: "Montserrat_600SemiBold",
              color: "#0f172a",
              top: 20,
              width: "50%",
            }}
          >
            Cheerapp profile
          </Text>
        </View>
      </View>
      <ScrollView directionalLockEnabled={true} style={{ flex: 1 }}>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "OpenSans_700Bold",
            }}
          >
            Profile photo
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Montserrat_500Medium",
              lineHeight: 30,
              left: 15,
            }}
          >
            Change your photo
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#d6d3d1",
              borderRadius: 5,
              width: 200,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              top: 10,
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
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "OpenSans_700Bold",
            }}
          >
            About me
          </Text>
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderRadius: 20,
              borderColor: "#E5E7EB",
              height: 120,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <TextInput
              ref={textInputRef}
              style={{
                borderRadius: 20,
                padding: 15,
                height: 150,
                width: "100%",
                maxHeight: 150,
              }}
              multiline
              numberOfLines={4}
              placeholder="Write something about yourself"
              value={bioText}
              onChangeText={(newText) => {
                const remainingChars = 200 - newText.length;
                if (remainingChars >= 0) {
                  setBioText(newText);
                  setCharsLeft(remainingChars);
                }
              }}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace") {
                  setCharsLeft(charsLeft + 1);
                }
              }}
              onEndEditing={() => {
                saveBio();
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "OpenSans_700Bold",
              color: "gray",
              alignSelf: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            {charsLeft} charachters
          </Text>
        </View>
        <View style={{ padding: 10, top: 0 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "OpenSans_700Bold",
            }}
          >
            My interests
          </Text>
          <View
            style={{
              flexDirection: "column",
              top: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                borderWidth: 1,
                borderBottomWidth: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderColor: "#E5E7EB",
                height: 60,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: "5%",
              }}
            >
              <AntDesign name="book" size={24} color="#0f172a" />
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                  fontSize: 16,
                  color: "gray",
                }}
              >
                Add more interests
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fcd34d",
                  width: 80,
                  height: 35,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Palanquin_700Bold",
                    fontSize: 20,
                    color: "#475569",
                  }}
                  onPress={openModal}
                >
                  + Add
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderColor: "#E5E7EB",
                padding: 5,
              }}
            >
              <FlatList
                horizontal={true}
                data={userInterests}
                extraData={extraData}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      borderColor: "#E5E7EB",
                      borderWidth: 1,
                      borderRadius: 50,
                      margin: 5,
                      paddingHorizontal: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#d4d4d466",
                    }}
                  >
                    <Text>{item.icon}</Text>
                    <Text
                      style={{
                        left: 5,
                        fontFamily: "Montserrat_500Medium",
                        fontSize: 16,
                        padding: 10,
                      }}
                    >
                      {item.interestName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
        <View style={{ height: 50 }}></View>
      </ScrollView>
    </View>
  );
}

export default EditProfile;
