import { API_URL } from "../../configs/Configs";

export const MARK_AS_READ = "MARK_AS_READ";

export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";

export const fetchNotification = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(API_URL + "/auth/user/get_notifications", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const resData = await response.json();
    console.log(resData);
    dispatch({ type: SET_NOTIFICATIONS, notifications: resData });
  };
};

export const markAsRead = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(API_URL + "/auth/user/post_markRead", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    console.log(id);

    const resData = await response.json();
    console.log(resData);
    dispatch({ type: MARK_AS_READ, id: id });
  };
};
