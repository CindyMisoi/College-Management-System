import { USER_DATA, USER_LOGIN_ID, SET_AUTH } from "./action";

export const setUserData = (userData) => ({
  type: USER_DATA,
  payload: userData,
});

export const setUserId = (loginid) => ({
  type: USER_LOGIN_ID,
  payload: loginid,
});

export const setAuth = (auth) => ({
  type: SET_AUTH,
  payload: auth,
});