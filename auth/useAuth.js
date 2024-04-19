import { useContext } from "react";
import AuthContext from "./context";
import * as SecureStore from "expo-secure-store";

export default useAuth = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);

  const getValueFor = async (key) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("🔑", result);
      return result;
    } else {
      console.log("No values stored under that key.");
    }
  };

  const save = async (key, value) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  };

  const removeValue = async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.log("Error removing the auth token", error);
    }
  };

  const logIn = (key, val) => {
    save(key, val);
  };
  const logOut = () => {
    removeValue("user");
  };

  return {
    authUser,
    setAuthUser,
    logIn,
    logOut,
    getValueFor,
    save,
  };
};
