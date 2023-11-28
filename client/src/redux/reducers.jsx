import { SET_AUTH, USER_DATA, USER_LOGIN_ID } from "./action";

let initialState = {
  auth: sessionStorage.getItem("session_token") || "",
  userData: {},
  userLoginId: sessionStorage.getItem("loginid") || null,
};


export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case USER_DATA:
      return { ...state, userData: action.payload };
    case USER_LOGIN_ID:
      return { ...state, userLoginId: action.payload };
    case SET_AUTH:
      return { ...state, auth: action.payload };
    default:
      return state;
  }
};