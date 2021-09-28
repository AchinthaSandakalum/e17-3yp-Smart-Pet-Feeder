import { POST_FEEDBACK_REPLY, SET_FEEDBACKS } from "../actions/admin_feedbacks";

const initialState = {
  admin_feedbacks: [],
};

const AdminFeedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FEEDBACKS:
      return {
        admin_feedbacks: action.feedbacks,
      };

    case POST_FEEDBACK_REPLY:
      const current_feedbacks = [...state.admin_feedbacks];
      // const index = current_feedbacks.findIndex((feedback) => feedback.userId === )
      return {
        admin_feedbacks: action.feedbacks,
      };
  }
  return state;
};

export default AdminFeedbackReducer;
