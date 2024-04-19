import * as SecureStore from "expo-secure-store";
import { create } from "apisauce";

const ONBOARDING_BASE_URI = "/api/onboarding";
const SOME_BASE_URI = "/api/some";
// const apiUrl = process.env.API_URL;

const api = create({
  baseURL: "http://192.168.0.12:3000",
});

api.addAsyncRequestTransform(async (request) => {
  const authToken = await SecureStore.getItemAsync("token");
  if (authToken) {
    request.headers["Authorization"] = JSON.parse(authToken);
    api.setHeader("Authorization", JSON.parse(authToken));
  }
});

const naviMonitor = (request, response) =>
  console.log("request=>", request, "response=> ", response);
api.addMonitor(naviMonitor);

export const sendVerificationEmail = async (id, email, name) => {
  const user = {
    id,
    email,
    name,
  };
  api.post(ONBOARDING_BASE_URI + "/user/email", user);
};

export const setTopics = async (id, userTopics) => {
  const req = {
    id,
    userTopics,
  };
  api.put(ONBOARDING_BASE_URI + "/user/topics", req);
};

export const setinterests = async (id, userInterests) => {
  const req = {
    id,
    userInterests,
  };
  api.put(ONBOARDING_BASE_URI + "/user/interests", req);
};

export const setBio = async (id, bioText) => {
  const req = {
    id,
    bioText,
  };
  api.put(ONBOARDING_BASE_URI + "/user/bio", req);
};

export const newChat = async (newChat) => {
  api.post(ONBOARDING_BASE_URI + "/user/newchat", newChat);
};

export const getNewChatMatch = async () => {
  return api.get(SOME_BASE_URI + "/user/newchat/match");
};

export const reject = async (requestUid) => {
  return api.post(SOME_BASE_URI + "/user/newchat/reject", { requestUid });
};

export const accept = async (requestUid) => {
  return api.post(SOME_BASE_URI + "/user/newchat/accept", { requestUid });
};

export default {
  sendVerificationEmail,
  setTopics,
  setinterests,
  setBio,
  newChat,
  getNewChatMatch,
  reject,
  accept,
};
