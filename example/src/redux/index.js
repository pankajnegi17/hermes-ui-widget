import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import appConnectiionReducer from "./reducers/appConnectionReducer";
import incomingRequest from "./reducers/incomingRequestReducer";
import userdetailReducer from "./reducers/userdetailReducer";
import activeChatsReducer from "./reducers/activeChatsReducer";
import { liveChatReducer } from "./reducers/liveChatReducer";
import { chatPreviewReducer } from "./reducers/chatPreviewReducer";

const allReducers = combineReducers({
  userDetails: userdetailReducer,
  appConnection: appConnectiionReducer,
  incomingRequest: incomingRequest,
  activeChats: activeChatsReducer,
  liveChat: liveChatReducer,
  chatPreview: chatPreviewReducer,
});

const InitialState = {
  userDetails: { username: "", emaild: "", fName: "", lName: "" },
  appConnection: { socketId: "", updateCount: 0, socket: null },
  incomingRequest: [],
  activeChats: [],
  liveChat: { version: "", messages: [], room_id: "", displayName: "" },
  chatPreview: { enabled: false, incomingRequest: {} },
  
};

const middleware = [thunk];

const store = createStore(
  allReducers,
  InitialState,
  compose(
    applyMiddleware(...middleware)
  )
);

//,
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//

export default store;
