import { PlaylistAddOutlined } from "@mui/icons-material";
import {
  ADD_CONNECTION,
  UPDATE_CONNECTION,
  DELETE_CONNECTION,
} from "../actions/appConnectionActions";

export default function appConnectiionReducer(
  initialState = {},
  { type, payload }
) {
  switch (type) {
    case ADD_CONNECTION: {
      return { ...initialState, socketId: payload.socketId, socket: payload };
    }

    case UPDATE_CONNECTION: {
      return {
        ...initialState,
        socketId: payload.socketId,
        updateCount: initialState.updateCount + 1,
        socket: payload,
      };
    }

    case DELETE_CONNECTION: {
      return { ...initialState, socketId: "", updateCount: 0, socket: null };
    }
    default: {
      return initialState;
    }
  }
}
