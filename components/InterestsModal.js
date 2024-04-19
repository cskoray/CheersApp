import React from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

const InterestsModal = ({
  visible,
  onClose,
  userInterests,
  allInterests,
  extraData,
  addRemoveInterest,
}) => {
  function isIdExists(id) {
    return userInterests?.some((interest) => id === interest?._id);
  }
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      extraData={extraData}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <View style={{ padding: 15, flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 22,
                    color: "gray",
                  }}
                >
                  Add more interests
                </Text>
                <FlatList
                  numColumns={2}
                  style={{ top: 10, flex: 1 }}
                  data={allInterests}
                  extraData={extraData}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        borderColor: "#E5E7EB",
                        borderWidth: `${isIdExists(item?._id) ? 0 : 1}`,
                        borderRadius: 50,
                        margin: 5,
                        paddingHorizontal: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: `${
                          isIdExists(item?._id) ? "#fcd34d" : "#d4d4d466"
                        }`,
                      }}
                      onPress={() => addRemoveInterest(item)}
                    >
                      <Text>{item.icon}</Text>
                      <Text
                        style={{
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
          </TouchableWithoutFeedback>
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
    top: "20%",
    width: "92%",
    height: "74%",
    backgroundColor: "white",
    borderRadius: 20,
  },
});

export default InterestsModal;
