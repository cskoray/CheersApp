import React from "react";
import {
  View,
  Modal,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import MyButton from "./Button";
import { AntDesign } from "@expo/vector-icons";

const Profile = ({
  visible,
  onClose,
  onEdit,
  user,
  userTopics,
  userInterests,
  extraData,
}) => {
  const getAge = (seconds) => {
    let myBirthday = new Date(seconds * 1000);
    let currentDate = new Date().toJSON().slice(0, 10) + " 01:00:00";
    return ~~((Date.now(currentDate) - myBirthday) / 31557600000);
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <ScrollView
                directionalLockEnabled={true}
                style={{ backgroundColor: "white", borderRadius: 20, flex: 1 }}
              >
                <Image
                  source={{ uri: user?.avatar?.toString() }}
                  style={{
                    width: "100%",
                    height: 350,
                    borderRadius: 20,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                  }}
                />
                <Text
                  style={{
                    fontSize: 36,
                    fontFamily: "Palanquin_700Bold",
                    top: 290,
                    position: "absolute",
                    left: 10,
                    color: "white",
                  }}
                >
                  {user?.name}, {getAge(user?.dob?.seconds)}
                </Text>
                <View style={{ padding: 15 }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat_500Medium",
                      fontSize: 22,
                      color: "gray",
                    }}
                  >
                    About me
                  </Text>
                  <Text
                    style={{
                      flexWrap: "wrap",
                      fontFamily: "Montserrat_500Medium",
                      fontSize: 17,
                      color: "#0f172a",
                      padding: 10,
                    }}
                  >
                    {user?.about ? user?.about : "Add a bio to your profile"}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      top: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        fontSize: 22,
                        color: "gray",
                      }}
                    >
                      My topics
                    </Text>
                    <FlatList
                      horizontal={true}
                      style={{ top: 10 }}
                      data={userTopics}
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
                            {item.topicName}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  <View
                    style={{
                      width: "100%",
                      top: 30,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        fontSize: 22,
                        color: "gray",
                      }}
                    >
                      My interests
                    </Text>
                    <FlatList
                      horizontal={true}
                      style={{ top: 10 }}
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
                  <View style={{ height: 100 }}></View>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
          <MyButton
            title="Edit Profile"
            customStyle={{
              top: "15%",
              width: "92%",
              borderRadius: 20,
              backgroundColor: "#fcd34d",
              paddingVertical: 3,
            }}
            customTextStyle={{
              color: "#0f172a",
              fontFamily: "Montserrat_600SemiBold",
              fontSize: 22,
              lineHeight: 0,
              padding: 10,
            }}
            onPress={onEdit}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    top: "13%",
    width: "92%",
    height: "74%",
    backgroundColor: "white",
    borderRadius: 20,
  },
});

export default Profile;
