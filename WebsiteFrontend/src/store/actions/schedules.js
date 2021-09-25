import { API_URL } from "../../configs/Configs";

export const SET_SCHEDULES = "SET_SCHEDULES";
export const DELETE_SCHEDULE = "DELETE_SCHEDULE";
export const CREATE_SCHEDULE = "CREATE_SCHEDULE";
export const UPDATE_SCHEDULE = "UPDATE_SCHEDULE";

export const fetchSchedules = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(API_URL + "/auth/user/get_schedules", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const resData = await response.json();
    dispatch({ type: SET_SCHEDULES, schedules: resData });
  };
};

export const createSchedule = (title, date_time) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(API_URL + "/auth/user/post_schedules", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        date_time: date_time,
        status: true,
      }),
    });

    const resData = await response.json();
    dispatch({
      type: CREATE_SCHEDULE,
      _id: resData.scheduleId,
      title: title,
      date_time: date_time,
      status: true,
    });
  };

  // return {
  //   type: CREATE_SCHEDULE,
  //   scheduleData: {
  //     title,
  //     date_time,
  //   },
  // };
};

export const updateSchedule = (id, title, date_time) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(API_URL + "/auth/user/post_schedules", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        _id: id,
        title: title,
        date_time: date_time,
        status: true,
      }),
    });

    const resData = await response.json();
    dispatch({
      type: UPDATE_SCHEDULE,
      _id: id,
      title: title,
      date_time: date_time,
      status: true,
    });
  };
};

export const deleteSchedule = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(API_URL + "/auth/user/delete_schedule", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const resData = await response.json();

    dispatch({ type: DELETE_SCHEDULE, _id: id });
  };
};
