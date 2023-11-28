import { USER_DATA, USER_LOGIN_ID, SET_AUTH } from "./action";

export const setUserData = (data) => ({
  type: USER_DATA,
  payload: data,
});

export const setUserId = (data) => ({
  type: USER_LOGIN_ID,
  payload: data,
});

export const setAuth = (auth) => ({
  type: SET_AUTH,
  payload: auth,
});