import {
  ENABEL_CHAT_PREVIEW,
  DISABLE_CHAT_PREVIEW,
} from "../actions/chatPreviewActions";

export const chatPreviewReducer = (initialState = {}, action) => {
  switch (action.type) {
    case ENABEL_CHAT_PREVIEW: {
      return {
        ...initialState,
        enabled: true,
        incomingRequest: action.payload,
      };
    }

    case DISABLE_CHAT_PREVIEW: {
      return { ...initialState, enabled: false, incomingRequest: {} };
    }

    default:
      return initialState;
  }
};
