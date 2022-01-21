import {
  ADD_ACTIVE_CHAT,
  DELETE_ACTICE_CHAT,
  DELETE_ALL_ACTIVE_CHATS,
} from "../actions/activeChatsActions";

export default function activeChatsReducer(InitialState = {}, action) {
  switch (action.type) {
    case ADD_ACTIVE_CHAT: {
      return [...InitialState, action.payload];
    }
    case DELETE_ACTICE_CHAT: {
      return InitialState.filter((e) => {
        return e.clientSocketId != action.payload.clientSocketId;
      });
    }
    default: {
      return InitialState;
    }
  }
}
