import React, { useState, useEffect } from "react";
import { View, Text, TextInput, SafeAreaView } from "react-native";
import Button from "../../components/Button";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import {
  updateDoc,
  getDoc,
  getDocs,
  and,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, db, doc } from "../../firebase";
import useAuth from "../../auth/useAuth";

const VerifyEmail = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [btnColor, setBtnColor] = useState("#3b82f6");
  const [title, setTitle] = useState("Resend code");
  const [code, setCode] = useState();
  const id = auth?.currentUser?.uid;
  const { authUser, setAuthUser } = useAuth();
  const usAuth = useAuth();

  useEffect(() => {
    if (authUser.step === "email_verified") {
      console.log("VERIFIED");
    }
  }, [authUser.step, submitted]);

  const verify = async () => {
    setSubmitted(true);
    if (!code || code.length < 6) {
      alert("Invalid code");
      return;
    }
    const a = query(
      collection(db, "users"),
      and(
        where("uid", "==", id),
        where("verificationCode", "==", code),
        where("step", "==", "email_sent")
      )
    );
    let docSnap = await getDocs(a);
    if (docSnap.empty) {
      alert("Invalid code");
      return;
    }
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      step: "email_verified",
    }).catch((err) => {
      console.log(err);
    });
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      usAuth.logIn("user", docSnap.data());
      setAuthUser(docSnap.data());
    }
  };

  const forgot = () => {
    if (isPlaying) {
      return;
    }
    setSubmitted(false);
    setIsPlaying(true);
    setTitle("Please wait to resend code");
    setBtnColor("#9ca3af");
  };
  const timerComplete = () => {
    setIsPlaying(false);
    setTitle("Send me code");
    setBtnColor("#3b82f6");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          backgroundColor: "#fff",
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontFamily: "OpenSans_700Bold",
            alignSelf: "flex-start",
            padding: 10,
          }}
        >
          Verify email
        </Text>
        <View
          style={{
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontFamily: "Montserrat_400Regular",
              lineHeight: 30,
            }}
          >
            Please enter the verification code sent to your email address
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TextInput
            maxLength={6}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 6,
              width: "30%",
              height: 48,
              margin: 10,
              padding: 10,
              fontFamily: "Montserrat_500Medium",
              fontSize: 21,
            }}
            onChangeText={(code) => setCode(code)}
          />
          <Button
            enabled={!isPlaying && !submitted}
            title="verify"
            customStyle={{
              backgroundColor: `${submitted ? "gray" : "#000"}`,
              paddingVertical: 1,
              width: "30%",
              height: 48,
              alignSelf: "center",
            }}
            customTextStyle={{
              fontFamily: "Montserrat_600SemiBold",
            }}
            onPress={verify}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            top: "20%",
          }}
        >
          <Text
            style={{
              color: "#6b7280",
              top: "2%",
              fontFamily: "Montserrat_600SemiBold",
              fontSize: 16,
            }}
          >
            Didn't receive code?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              top: "5%",
            }}
          >
            <Button
              enabled={!isPlaying}
              title={title}
              customStyle={{
                backgroundColor: btnColor,
                paddingVertical: 19,
                width: "70%",
              }}
              customTextStyle={{
                fontFamily: "Montserrat_600SemiBold",
              }}
              onPress={forgot}
            />
            {isPlaying && (
              <CountdownCircleTimer
                strokeWidth={5}
                size={50}
                isPlaying={isPlaying}
                duration={9}
                colors={["#000"]}
                onComplete={timerComplete}
              >
                {({ remainingTime, color }) => (
                  <Text
                    style={{
                      color,
                      fontSize: 20,
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                  >
                    {remainingTime}
                  </Text>
                )}
              </CountdownCircleTimer>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;
