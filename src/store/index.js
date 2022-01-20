import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import botStatusReducer from './reducers/botStatusReducer'; 
import botTypingReducer from './reducers/botTypingReducer';
import botMessagesLengthReducer from './reducers/botMessagesLengthReducer';
import modalStatusReducer from './reducers/modalStatusReducer';
import talk_to_what_reducer from './reducers/talk_to_what_reducer';
import conversationDataReducer from './reducers/conversationDataReducer';
import tableListDataReducer from './reducers/tableListDataReducer';
import ListModalStatusReducer from './reducers/listModalStatusReducer';
import LogInStatusReducer from './reducers/LogInStatusReducer';
import MenuDetailsReducer from './reducers/MenuDetailsReducer';
import zoomModalStatusReducer from './reducers/ZoomModalStatusReducer'
import sessionDetailsReducer from './reducers/sessionDetailsReducer'
import notificationReducer from './reducers/notificationReducer'
import leaveFormDataReducer from './reducers/leaveFormDataReducer'
import botTypeReducer from './reducers/botTypeReducer'
import confirmModalReducer from './reducers/ConfirmModalReducer';

const allReducers  = combineReducers({
    botStatus:botStatusReducer,
    isTyping:botTypingReducer,
    botMessagesLength:botMessagesLengthReducer,
    modalStatus:modalStatusReducer,
    talk_to_what:talk_to_what_reducer,
    conversationData:conversationDataReducer,
    tableListData:tableListDataReducer,
    listModalStatus:ListModalStatusReducer,
    logInStatus:LogInStatusReducer,
    menuDetails:MenuDetailsReducer,
    zoomModalStatus:zoomModalStatusReducer,
    sessionDetails:sessionDetailsReducer,
    notifications:notificationReducer,
    leaveFormData:leaveFormDataReducer,    
    botType: botTypeReducer,
    confirmModal:confirmModalReducer
    });

const InitialState = {
    botStatus:{isOpened:false},
    isTyping:{isTyping:false},
    botMessagesLength:{length:1},
    modalStatus:{isOpened:false,modal_url:"",modal_type:"",clickCount:0,images:""},
    zoomModalStatus:{isOpened:false,modal_url:""},
    listModalStatus:{isOpened:false},
    talk_to_what:{name:"bot"},
    conversationData:{conversation_id:"",group_id:"",from_participant_id:"",to_participant_id:"", group_type:'', group_name:''},
    tableListData:{columns:[],data:[]},
    logInStatus:{firstName:"",lastName:"",isLogIn:false,userType:"",username:"", token: ""}, 
    menuDetails:{isDesignationSelected:false,selectedDesignation:""},
    sessionDetails:{session_id:""},
    notifications:{length:0},
    leaveFormData:{fromdate:'', todate:"", leavetype:"", leavepurpose:"", noofdays:""},    
    botType:{language:"en", format:"text"},
    confirmModal:{isOpned:false}
}

const middleware = [thunk]

const store = createStore(allReducers,InitialState,compose(applyMiddleware(...middleware)));
//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
export default store;

