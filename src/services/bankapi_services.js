import axios from "axios/index";
import { nlp_gateway_host, nlp_gateway_port } from "../config";
import { base64ToJason, jsonToBase64 } from "../helpers/encryption_services";

export const validateAccountNo = async (acNo) => {
  let dummy_response;
  let dummy_valid = {
    METHOD_ID: "020",
    REQUEST_DATE_TIME: "2021-10-06T15:41:57.9232389+05:30",
    REQUEST_DIGEST:
      "B0E53C9E12F15743C51D860663911CFD2602700C8EF1901EA062934FB40365B2",
    REQUEST_ENC: "SMS Sent.",
    RESPONSE_CODE: "1",
    VENDOR_ID: "TEST_USER",
  };

  let dummy_invalid = {
    METHOD_ID: "020",
    REQUEST_DATE_TIME: "2021-10-06T15:32:53.1110411+05:30",
    REQUEST_DIGEST:
      "B0E53C9E12F15743C51D860663911CFD2602700C8EF1901EA062934FB40365B2",
    REQUEST_ENC: "Invalid Account Number.",
    RESPONSE_CODE: "0",
    VENDOR_ID: "TEST_USER",
  };

  if (acNo == "0473111033572") {
    dummy_response = dummy_valid;
  } else {
    dummy_response = dummy_invalid;
  }

//   return new Promise((resolve, reject) => resolve(dummy_response));

  return new Promise((resolve, reject) => {
    let requestBody = { ACC_NO: acNo };
     requestBody = jsonToBase64(requestBody);
    axios 
      .post(        
        "https://hermesvt.workflo.ai:18100/accountbalance/Post_Account_No",
        `"${requestBody}"`,
        { headers: { "Content-Type": "application/json" }
      }
      )
      .then((res) => {
        
        sessionStorage.setItem('ba_session', res.Session_id)
        resolve(base64ToJason(res.data));
      })
      .catch((err) =>{
         reject(err)});
  });
};

export const validateOtp = async (otp, acc_no) => {
  let dummy_response;
  let dummy_valid = {
    "Account":"0473111033572",
    "Session_id":"21112019120433",
    "Response":"Valid OTP",
    "Acc_Balance":"INR:1,000.03"
  };

  let dummy_invalid = { 
    "Response":"Invalid OTP", 
  };

  if (otp == "123456") {
    dummy_response = dummy_valid;
  } else {
    dummy_response = dummy_invalid;
  }

  return new Promise((resolve, reject) => resolve(dummy_response));

  return new Promise((resolve, reject) => {
    let requestBody = {"Account":acc_no,
    "Session_id":sessionStorage.getItem('ba_session'),
    "OTP":otp} 
       requestBody = jsonToBase64(requestBody);
    axios
      .post(
        "https://hermesvt.workflo.ai:18100/accountbalance/Post_One_Time_Password ",
        `"${requestBody}"`,
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => resolve(base64ToJason(res.data)))
      .catch((err) => reject(err));
  });
};
