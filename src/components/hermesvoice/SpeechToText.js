import React, { Component } from "react";
import MicIcon from "@material-ui/icons/Mic";
import MicIconOn from "@material-ui/icons/SettingsVoice";
import VoiceWaveOne from "../misc/VoiceWaveOne";
import MicActive from "../misc/MicActive";
import {connect} from 'react-redux'

class SpeechToText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      speechRecognizer: {},
      userStoppedSpeechRecognizer: false,
      isMicBusy:false
      
    };

    this.onMicClick = this.onMicClick.bind(this);
    this.onSpeechFinish = this.onSpeechFinish.bind(this);
    this.onActiveMicClick = this.onActiveMicClick.bind(this)
  }

  onMicClick(e) {
    window.speechSynthesis.cancel();
    this.setState({isMicBusy:true})
    this.props.setmicBusy(true)
    this.setState({ userStoppedSpeechRecognizer: false });
    this.state.speechRecognizer.toggle();
  }

  onActiveMicClick(){  
    this.setState({ userStoppedSpeechRecognizer: true });
    this.setState({isMicBusy:false})
    this.props.setmicBusy(false) 
    this.state.speechRecognizer.toggle();
    this.createSpeechRecognitionObject = this.createSpeechRecognitionObject.bind(this)  
  }

  onSpeechFinish(transcript) {
      this.setState({isMicBusy:false})
      this.props.setmicBusy(false)
  if(!this.state.userStoppedSpeechRecognizer || transcript.length > 0) this.props.send_text_to_bot(transcript);
  console.log("Finished talking...")
  }

  createSpeechRecognitionObject(lang, forceNew = false){

   let defaultparam =  {getLanguageCode: function () {
      return "en-IN";
    },
    continuous: true,
    interimResults: true,
    soundTimeout: 2000,
    beforeStart: null,
    onStart: null,
    onResult: null,
    onEnd: null,
    onError: null,
  }

    var recOptions = {
      getLanguageCode: function () {
        return lang;
      },
      continuous: false,
      interimResults: true,
      onStart: function () {
        console.log("onstaart");
      },
      onResult: function (finalTranscript, interimTranscript) {
        console.log(interimTranscript);
      },
      onEnd: function (transcript) { 
        this.onSpeechFinish(transcript); 
      }.bind(this),
      onError: function (event) {
        console.group(event.error);
      },
    };
    
    if(!forceNew){
      let speechRecognizer = window.speechRecognition.getInstance(recOptions);
      return speechRecognizer}
      else{
       let  speechRecognizer = window.speechRecognition.updateAndGetInstance(recOptions);
        return speechRecognizer 
      }
  }

  componentDidMount() {
    let speechRecognizer = this.createSpeechRecognitionObject(this.props.botLanguage)
    this.setState({ speechRecognizer: speechRecognizer });
    //Initializing the Text to Speech Engine
    let tts = window.ttsEngine.getInstance();
    this.setState({ tts: tts });
  }

 UNSAFE_componentWillReceiveProps(nextProps, b,c){   
if(nextProps.botLanguage != this.props.botLanguage){
  console.log("language Changed to ", nextProps.botLanguage)
  let speechRecognizer = this.createSpeechRecognitionObject(nextProps.botLanguage, true )
  this.setState({ speechRecognizer: speechRecognizer });
}
}

 

  render() {
    return (
      <>
        {this.state.isMicBusy ? (
          <><MicIcon style={{color:"green"}}  onClick={this.onActiveMicClick}></MicIcon></>
        ) : (
          <MicIcon onClick={this.onMicClick}></MicIcon>
        )}
      </>
    );
  }
}


const mapStateToProps = (state) => {
  return { 
    botLanguage: state.botType.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    switchLanguage: (lang) => {
      dispatch({type:"BOT_LANGUAGE_ACTION", payload: lang});
    } 
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeechToText)
