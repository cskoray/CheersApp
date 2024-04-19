import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import ConnectionsScreen from "../screens/Connections";
import ChatsScreen from "../screens/Chats";
import ChatScreen from "../screens/Chat";
import LeaderBoardScreen from "../screens/LeaderBoard";
import YouScreen from "../screens/You";
import NewChatScreen from "../screens/newConversation/NewChat";
import NewChatWaitScreen from "../screens/newConversation/NewChatWait";
import NewChatReqScreen from "../screens/newConversation/NewChatWaitRequest";
import EditProfileScreen from "../screens/EditProfile";
import WellbeingDetailScreen from "../screens/WellbeingDetail";
import SafetyDetailScreen from "../screens/SafetyDetail";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [avatar, setAvatar] = useState();

  const getUser = async () => {
    let user = await SecureStore.getItemAsync("user");
    if (user) {
      setAvatar(JSON.parse(user).avatar);
    }
  };

  useEffect(() => {
    getUser();
  }, [avatar]);
  return (
    <>
      <Tab.Navigator
        initialRouteName="Connections"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "You") {
              return (
                <Image
                  contentFit="cover"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: size,
                    borderColor: "#0f172a",
                    borderWidth: focused ? 1 : 0,
                  }}
                  source={{
                    uri: avatar?.toString(),
                  }}
                />
              );
            } else {
              if (route.name === "Chats") {
                focused
                  ? (iconName = "chatbubbles")
                  : (iconName = "chatbubbles-outline");
              } else if (route.name === "Connections") {
                focused ? (iconName = "people") : (iconName = "people-outline");
              } else if (route.name === "Champions") {
                return focused ? (
                  <MaterialCommunityIcons
                    name="star-shooting"
                    size={32}
                    color={color}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="star-shooting-outline"
                    size={32}
                    color={color}
                  />
                );
              }

              return <Ionicons name={iconName} size={32} color={color} />;
            }
          },
          tabBarActiveTintColor: "#0f172a",
          tabBarInactiveTintColor: "gray",
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 90,
            backgroundColor: "#fff",
            position: "absolute",
          },
        })}
      >
        <Tab.Screen name="Champions" component={LeaderBoardScreen} />
        <Tab.Screen name="Connections" component={ConnectionsScreen} />
        <Tab.Screen
          name="Chats"
          component={ChatsScreen}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Tab.Screen name="You" component={YouScreen} />
      </Tab.Navigator>
    </>
  );
};

const UserNavigator = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeTabs"
          component={TabNavigator}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
        <Stack.Screen name="NewChatWait" component={NewChatWaitScreen} />
        <Stack.Screen name="NewChatWaitRequest" component={NewChatReqScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="WellbeingDetail"
          component={WellbeingDetailScreen}
        />
        <Stack.Screen name="SafetyDetail" component={SafetyDetailScreen} />
      </Stack.Navigator>
    </>
  );
};

export default UserNavigator;
