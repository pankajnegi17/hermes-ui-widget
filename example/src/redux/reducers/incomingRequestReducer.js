import {
  INCOMING_REQUEST_ADD,
  INCOMING_REQUEST_DELETE,
} from "../actions/incomingRequestActions";

export default function incomingRequest(InitialState = {}, action) {
  switch (action.type) {
    case INCOMING_REQUEST_ADD: {
      return [...InitialState, action.payload];
    }
    case INCOMING_REQUEST_DELETE: {
      return InitialState.filter((e) => {
        return e.clientSocketId != action.payload;
      });
    }
    default: {
      return InitialState;
    }
  }
}
