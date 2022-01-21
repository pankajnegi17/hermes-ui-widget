import { LOAD_LIVE_CHAT, DELETE_LIVE_CHAT } from "../actions/liveChatActions";

export const liveChatReducer = (initialState = {}, action) => {
  switch (action.type) {
    case LOAD_LIVE_CHAT: {
      return {
        ...initialState,
        version: "active_chat",
        messages: action.payload.messages,
        room_id: action.payload.room_id,
        displayName: action.payload.displayName
      };
    }

    case DELETE_LIVE_CHAT: {
      return {
        ...initialState,
        version: "",
        messages: [],
        room_id: "",
        displayName: ""
      };
    }

    default:
      return initialState;
  }
};
