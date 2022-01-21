import { FormatListNumberedRtlTwoTone } from "@mui/icons-material";
import {
  UPDATE_USER_DETAILS,
  DELETE_USER_DETAILS,
  VIEW_USER_DETAILS,
} from "../actions/userdetailActions";

export default function userdetailReducer(
  initialState = {},
  { type, payload }
) {
  switch (type) {
    case UPDATE_USER_DETAILS: {
      console.log(payload);
      return {
        ...initialState,
        username: payload.username,
        emaild: payload.emaild,
        fName: payload.fName,
        lName: payload.lname,
        viewProfile: payload.viewProfile
      };
      // return Object.assign({},state,{language:payload})
    }

    case DELETE_USER_DETAILS: {
      console.log("DELETE_USER_DETAILS");
      return {
        ...initialState,
        username: "",
        emaild: "",
        fName: "",
        lName: "",
        viewProfile: false,
      };
    }

    case VIEW_USER_DETAILS: {
      console.log("VIEW_USER_DETAILS");
      console.log(payload);
      return {
        ...initialState,
        viewProfile: payload.viewProfile,
      };
    }

    default: {
      return initialState;
    }
  }
}
