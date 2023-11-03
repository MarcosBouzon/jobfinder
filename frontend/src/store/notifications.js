import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const Notify = createSlice({
  name: "notify",
  initialState: initialState,
  reducers: {
    /**
     * Adds a new notification to the list. Acepts an object with the following keys:
     * - title
     * - message
     *
     * The following keys are optional:
     * - jobDeleted: true | false
     * - success: true | false. This is the default value if not included
     * - warning: true | false
     * - error: true | false
     */
    createNotification(state, action) {
      let id = 0;
      if (state.notifications.length > 0) {
        id = state.notifications[state.notifications.length - 1].id + 1;
      }

      let success = true;
      if (action.payload.error || action.payload.warning) {
        success = false;
      }
      state.notifications.push({
        id: id,
        success: success,
        warning: false,
        error: false,
        jobDeleted: false,
        ...action.payload,
        visible: true,
      });
    },
    /**
     * Removes a notification from the list by it's id
     */
    hideNotification(state, action) {
      state.notifications[action.payload].visible = false;
    },
  },
});

export const { createNotification, hideNotification } = Notify.actions;

export default Notify;
