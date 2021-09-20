/*
  We can use dispatch func
    - To dispatch reducer action  (Using {} brackets)
    - To execute any function after some async operation
 */

import { AsyncStorage } from "react-native";
import { API_URL } from "../../config/Configs";

export const AUTHENTICATE = "AUTHENTICATE";

// Logout action identifier
export const LOGOUT = "LOGOUT";

let timer; // to hold timer func

export const authenticate = (userId, token) => {
  // Dispatching 2 actions here. (Can we implement this without dispatch ? )
  return (dispatch) => {
    // Dispatch setLogoutTimer with expiry time
    // dispatch(setLogoutTimer(expiryTime));
    // Dispatch AUTHENTICATE action (To store token and id in the redux store)
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (
  name,
  email,
  mobileNumber,
  password,
  confirmPassword
) => {
  return async (dispatch) => {
    // "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCpQbjXMSb_MTPw0_Y7h_A4jqwO-oyUqYg",

    const response = await fetch(API_URL + "/auth/user/signup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phoneNumber: mobileNumber,
        password: password,
        confirmPassword: confirmPassword,
        // returnSecureToken: true,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();

      const errorId = errorResData.error.message;
      let message = "Authentication failed!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.userId, resData.idToken));
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.userId, expirationDate);

    // dispatch(authenticate(resData.userId, resData.idToken));

    // // This is for saving expiry time (When auto login)
    // const expirationDate = new Date(
    //   new Date().getTime() + parseInt(resData.expiresIn) * 1000
    // );
    // saveDataToStorage(resData.idToken, resData.userId, expirationDate);
  };
};

export const login = (email, password) => {
  // "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCpQbjXMSb_MTPw0_Y7h_A4jqwO-oyUqYg",

  return async (dispatch) => {
    const response = await fetch(API_URL + "/auth/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        // returnSecureToken: true,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      let message = "Authentication failed!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.userId, resData.idToken));
    // This is for saving expiry time (When auto login)

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.userId, expirationDate);
  };
};

// Logout func
export const logout = () => {
  // clear log out timer
  // clearLogoutTimer();
  // Remove userData from mobile storage
  AsyncStorage.removeItem("userData");

  // Dispatch LOGOUT action (No async operations, so can dispatch actions directly)
  return { type: LOGOUT };
};

// const clearLogoutTimer = () => {
//   // If timer exists, clear it
//   if (timer) {
//     clearTimeout(timer);
//   }
// };

// Setting logout timer
const setLogoutTimer = (expirationTime) => {
  // This is a async operation (need dispatch callback)
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout()); // dispatch logout() func after expiration time
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
