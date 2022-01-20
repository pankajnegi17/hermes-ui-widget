import thomas_image from "../images/user_profile_pictures/thomas.jpg";
import simon_image from "../images/user_profile_pictures/simon.jpg";
import lori_image from "../images/user_profile_pictures/lori.jpg";
import ivan_image from "../images/user_profile_pictures/ivan.jpg";
import julia_image from "../images/user_profile_pictures/julia.jpg";
import jayne_image from "../images/user_profile_pictures/jayne.jpg";
import hermes_image from "../images/user_profile_pictures/hermes.jpg";
import others_image from "../images/user_profile_pictures/other.jpg";
import bell_image from '../images/user_profile_pictures/notifier.jpg';

import robin_image from '../images/user_profile_pictures/robin.jpg';
import david_image from '../images/user_profile_pictures/david.jpg';
import mark_image from '../images/user_profile_pictures/mark.jpg';
import annonymous_image from '../images/user_profile_pictures/annonymous.png'


export default function get_Picture(username) {
    let userImage = "";
    switch (username) {
      case "mark@hermes.com": {
        userImage = mark_image;
        break;
      }


      case "david@hermes.com": {
        userImage = david_image;
        break;
      }

      case "feedback@hermes.com":{
        userImage = annonymous_image;
        break;
      }

      case "robin@hermes.com": {
        userImage = robin_image;
        break;
      }

      case "adekomariah@hermes.com": {
        userImage = thomas_image;
        break;
      }
      case "simon@hermes.com": {
        userImage = simon_image;
        break;
      }
      case "alvian@hermes.com": {
        userImage = lori_image;
        break;
      }
      case "bot@hermes": {
        userImage = hermes_image;
        break;
      }
      case "ronytan@hermes.com": {
        userImage = julia_image;
        break;
      }
      case "soparmarpaung@hermes.com": {
        userImage = jayne_image;
        break;
      }

      case "ivan@hermes.com": {
        userImage = ivan_image;
        break;
      }

      case "notifier@hermes.com": {
        userImage = bell_image;
        break;
      }

      default: {
        userImage = others_image;
        break;
      }
    } 

    return userImage
  }