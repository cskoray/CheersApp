import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db, doc } from "../firebase";
import { getDoc, getDocs, collection, query, where } from "firebase/firestore";
import useAuth from "../auth/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CircularProgressBarWithImage from "../components/CircularProgressBarWithImage";
import { useIsFocused } from "@react-navigation/native";
import BlinkingButton from "../components/BlinkingButton";
import ToggleButton from "../components/ToggleButton";
import AboutMe from "../components/AboutMe";
import MyPlan from "../components/MyPlan";
import WellbeingSafety from "../components/Wellbeing";
import Profile from "../components/Profile";

const You = ({ navigation }) => {
  const authUser = useAuth();
  const [user, setUser] = useState();
  const [age, setAge] = useState();
  const [wellbeing, setWellbeing] = useState([]);
  const [userTopics, setUserTopics] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [extradata, setExtraData] = useState();
  const [progress, setProgress] = useState(0);
  const [selectedButton, setSelectedButton] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const id = auth?.currentUser?.uid;

  const [key, setKey] = useState(0); // Add a key state
  const isFocused = useIsFocused(); // useIsFocused hook

  const getUser = async () => {
    const uTopics = [];
    const uInterests = [];
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const u = docSnap.data();
      setUser(u);
      setAge(getAge(u.dob.seconds));

      u.topics?.map((topic) => {
        uTopics.push(topic);
      });
      const topicsRef = collection(db, "topics");
      const q2 = query(
        topicsRef,
        where(
          "_id",
          "in",
          uTopics.map(({ _id }) => _id)
        )
      );
      const docSnap2 = await getDocs(q2);
      if (!docSnap2.empty) {
        docSnap2.forEach((doc) => {
          setUserTopics((topics) => [...topics, doc.data()]);
        });
      }

      u.interests?.map((interest) => {
        uInterests.push(interest);
      });
      const q3 = query(collection(db, "interests"));
      const docSnap3 = await getDocs(q3);
      if (!docSnap3.empty) {
        docSnap3.forEach((doc) => {
          if (uInterests.includes(doc.data()._id)) {
            setUserInterests((interests) => [...interests, doc.data()]);
          }
        });
      }
    }
  };

  // const advices = [
  //   {
  //     title: "Stress & Anxiety",
  //     desc: "Fast-paced living, constant pressures, mental health strains.",
  //     imageUrl: "",
  //     advices: [
  //       "Prioritize self-care, incorporate relaxation techniques, and consider mindfulness practices to manage stress.",
  //       "Seek support from friends, family, or a mental health professional; talking about your feelings can make a significant difference.",
  //     ],
  //     supportLines: [
  //       "Mind Infoline: Call 0300 123 3393 for mental health information and support.",
  //       "Samaritans: Dial 116 123 for confidential emotional support, available 24/7.",
  //     ],
  //     imageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/cheer-app-7c59c.appspot.com/o/images%2Fwellbeing%2Ffinancialstrain.jpg?alt=media&token=1f8106c6-6573-4711-94cf-c4ffdca4f149",
  //   },
  //   {
  //     title: "Tech Addiction",
  //     desc: "Digital dependency, social media stress, screen-time challenges.",
  //     imageUrl: "",
  //     advices: [
  //       "Set boundaries for screen time, create tech-free zones, and establish a healthy balance between online and offline activities.",
  //       "Consider digital detox days, and be mindful of your online interactions; prioritize real-life connections.",
  //     ],
  //     supportLines: [
  //       "National Gambling Helpline: Call 0808 8020 133 for support with technology-related addictions.",
  //       "Digital Detox: Visit www.nhs.uk/live-well/healthy-body/could-you-digital-detox for NHS advice.",
  //     ],
  //     imageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/cheer-app-7c59c.appspot.com/o/images%2Fwellbeing%2Fhabit.jpg?alt=media&token=c17cc883-4f46-421d-8d85-b530def4daf7",
  //   },
  //   {
  //     title: "Work-Life Balance",
  //     desc: "Juggling job demands, personal life struggles, constant balancing act.",
  //     imageUrl: "",
  //     advices: [
  //       "Establish clear work boundaries, prioritize tasks, and schedule regular breaks to avoid burnout.",
  //       "Communicate openly with your employer about workload concerns, and strive to maintain a healthy work-life integration.",
  //     ],
  //     supportLines: [
  //       "Acas Helpline: Call 0300 123 1100 for employment advice and workplace mediation.",
  //       "Workplace Mental Health: Visit www.mind.org.uk/workplace for resources on workplace mental health.",
  //     ],
  //     imageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/cheer-app-7c59c.appspot.com/o/images%2Fwellbeing%2Fisolation.jpg?alt=media&token=13db4b46-d028-4be7-951a-b4e91acfcac7",
  //   },
  //   {
  //     title: "Financial Strain",
  //     desc: "Economic uncertainties, debt stress, financial insecurity.",
  //     imageUrl: "",
  //     advices: [
  //       "Create a budget, identify areas for cost-cutting, and seek financial advice to manage debts effectively.",
  //       "Prioritize essential expenses, explore government support programs, and consider speaking with a financial counselor.",
  //     ],
  //     supportLines: [
  //       "National Debtline: Call 0808 808 4000 for free debt advice and support.",
  //       "Citizens Advice: Visit www.citizensadvice.org.uk for comprehensive financial guidance.",
  //     ],
  //     imageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/cheer-app-7c59c.appspot.com/o/images%2Fwellbeing%2Fstress.jpg?alt=media&token=7a35ea18-706f-43f8-84b4-d6c07fc8cb3b",
  //   },
  //   {
  //     title: "Health Habits",
  //     desc: "Sedentary lifestyle, poor nutrition, health neglect.",
  //     imageUrl: "",
  //     advices: [
  //       "Adopt a balanced diet, incorporate regular exercise, and prioritize sufficient sleep for overall well-being.",
  //       "Schedule regular health check-ups, address any concerns promptly, and make small, sustainable lifestyle changes.",
  //     ],
  //     supportLines: [
  //       "NHS 111: Dial 111 for non-emergency medical advice and information.",
  //       "Change4Life: Visit www.nhs.uk/change4life for NHS guidance on healthy living.",
  //     ],
  //     imageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/cheer-app-7c59c.appspot.com/o/images%2Fwellbeing%2Ftechaddict.jpg?alt=media&token=6a65afd1-9f6e-4995-993a-a81bd1b850fe",
  //   },
  //   {
  //     title: "Social Isolation",
  //     desc: "Loneliness in a connected world, superficial online interactions.",
  //     imageUrl: "",
  //     advices: [
  //       "Actively engage in social activities, both online and offline, to foster connections with others.",
  //       "Join community groups, volunteer, and reach out to friends or family; building a support network is essential.",
  //     ],
  //     supportLines: [
  //       "Age UK Advice Line: Call 0800 678 1602 for advice and support for older people.",
  //       "The Silver Line: Dial 0800 4 70 80 90 for a helpline dedicated to combating loneliness in older adults.",
  //     ],
  //     imageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/cheer-app-7c59c.appspot.com/o/images%2Fwellbeing%2Fworklife.jpg?alt=media&token=be6f0b65-9a41-4352-a5de-ea9c7c2293f8",
  //   },
  // ];

  const getWellbeing = async () => {
    const q = query(collection(db, "wellbeing"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setWellbeing((wellbeing) => [...wellbeing, doc.data()]);
    });
  };

  // const addInterest = async () => {
  //   const interest = [{ _id: "fed27aea-7c6c-4f45-afd0-ee61c1fc855d" }];
  //   const docRef = doc(db, "users", auth?.currentUser?.uid);
  //   await updateDoc(docRef, {
  //     interests: interest,
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // };

  // const add = async () => {
  //   advices.map((advice) => {
  //     addDoc(collection(db, "wellbeing"), {
  //       _id: Crypto.randomUUID(),
  //       title: advice.title,
  //       desc: advice.desc,
  //       imageUrl: advice.imageUrl,
  //       advices: advice.advices,
  //       supportLines: advice.supportLines,
  //     });
  //   });
  // };

  useEffect(() => {
    setWellbeing([]);
    setUserTopics([]);
    setUserInterests([]);
    getUser();
    getWellbeing();

    if (isFocused) {
      setProgress(0); // Reset the progress when the screen is focused
      setKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    }

    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocused]);

  // const signOutNow = () => {
  //   authUser.logOut();
  //   signOut(auth);
  // };

  const getAge = (seconds) => {
    let myBirthday = new Date(seconds * 1000);
    let currentDate = new Date().toJSON().slice(0, 10) + " 01:00:00";
    return ~~((Date.now(currentDate) - myBirthday) / 31557600000);
  };

  const handleToggle = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const editProfile = () => {
    setModalVisible(false);
    navigation.navigate("EditProfile");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Profile
        visible={modalVisible}
        onClose={closeModal}
        user={user}
        userTopics={userTopics}
        userInterests={userInterests}
        extradata={extradata}
        onEdit={editProfile}
      />
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          height: "28%",
        }}
      >
        <TouchableOpacity
          style={{
            marginRight: 10,
            position: "absolute",
            right: 10,
          }}
          onPress={() => {}}
        >
          <Ionicons
            name="ios-settings-sharp"
            size={30}
            color="#0f172a"
            style={{
              shadowOpacity: 0,
            }}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
        style={{
          marginRight: 10,
        }}
        onPress={signOutNow}
      >
        <Text style={{ color: "#000" }}>logout</Text>
      </TouchableOpacity> */}

        <View
          style={{
            padding: 5,
          }}
        >
          <CircularProgressBarWithImage
            key={key}
            progress={progress}
            imageUrl={user?.avatar?.toString()}
          />
          <Text
            style={{
              top: 20,
              fontSize: 26,
              fontWeight: "bold",
              alignSelf: "center",
              fontFamily: "Montserrat_600SemiBold",
            }}
          >
            {user?.name}, {age}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            top: 20,
          }}
        >
          <View
            style={{ flexDirection: "column", justifyContent: "space-around" }}
          >
            <BlinkingButton key={key} onPress={openModal} />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          backgroundColor: "white",
          paddingHorizontal: 5,
        }}
      >
        <ToggleButton
          title="My pay plan"
          customStyle={{
            backgroundColor: selectedButton === 1 ? "#0f172a" : "white",
          }}
          customTextStyle={{
            color: selectedButton === 1 ? "white" : "#0f172a",
          }}
          onPress={() => handleToggle(1)}
        />
        <ToggleButton
          title="About me"
          customStyle={{
            backgroundColor: selectedButton === 2 ? "#0f172a" : "white",
          }}
          customTextStyle={{
            color: selectedButton === 2 ? "white" : "#0f172a",
          }}
          onPress={() => handleToggle(2)}
        />
        <ToggleButton
          title="Wellbeing"
          customStyle={{
            backgroundColor: selectedButton === 3 ? "#0f172a" : "white",
          }}
          customTextStyle={{
            color: selectedButton === 3 ? "white" : "#0f172a",
          }}
          onPress={() => handleToggle(3)}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {selectedButton === 1 ? (
          <MyPlan user={user} userTopics={userTopics} extradata={extradata} />
        ) : selectedButton === 2 ? (
          <AboutMe
            user={user}
            userTopics={userTopics}
            userInterests={userInterests}
            extradata={extradata}
          />
        ) : (
          <WellbeingSafety wellbeing={wellbeing} navigation={navigation} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Other styles for your container
  },
  blinkingButton: {
    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    flexDirection: "row",
    borderRadius: 30,
    padding: 10,
    // Additional styles for the blinking button
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    color: "#475569",
    // Additional styles for the button text
  },
});

export default You;
