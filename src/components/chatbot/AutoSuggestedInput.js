import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import "./autosugession.css"; 
import {connect} from 'react-redux'
import {chatbot_api_host, domain, instance_type} from '../../config'
import axios from "axios/index";

export class AutoSuggestedInput extends React.Component {
  constructor(props) {
    super(props);
    this.botInput = React.createRef();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: [],
      languages :[]
    };

    //binding methods
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this)
    this.getSuggestions = this.getSuggestions.bind(this)
    this.mapESResponse = this.mapESResponse.bind(this)
  }


  mapESResponse(response) { 
    let allHits = []
    if(response.data.responses){ 
        for(let i=0; i<response.data.responses.length; i++){
          // allHits.concat(this.filterDataFromHits(response.data.responses[i].hits))
          allHits =  allHits.concat(this.filterDataFromHits(response.data.responses[i].hits))
        }
    }
    else if(response.data.hits){ 
      // allHits.concat(this.filterDataFromHits(response.data.hits))
      allHits = this.filterDataFromHits(response.data.hits)
    } 
    allHits.sort((a, b) => (a.score < b.score) ? 1 : -1)  
    // console.warn("FINAL SUGGETIONS: ",allHits)
    // return allHits.length>0 ? allHits.filter(item => item.score >= 0.1): allHits
    return allHits.length>4 ?allHits.slice(0,5): allHits
  }


  filterDataFromHits(hits){
    let suggetions = hits.hits.map(record=>{
      return {
        name:record._source.question,
        year: 2012,
        score: record._score
      }
    })
    return suggetions
  }
  // Imagine you have a list of languages that you'd like to autosuggest.
// const languages = auto_suggested_questions;

// Teach Autosuggest how to calculate suggestions for any given input value.
 getSuggestions (value) {   
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  if(inputLength === 0)
  return []

  //Make call to ElascticSearch


  let filteredSuggetions = this.state.languages.filter(
    (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
  )

  if(filteredSuggetions.length > 5){
   return filteredSuggetions.slice(0, 5)
  }

  return filteredSuggetions

  // return inputLength === 0
  //   ? []
  //   : this.state.languages.filter(
  //       (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
  //     );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
getSuggestionValue(suggestion){
  return suggestion.name;
} 

// Use your imagination to render suggestions.
 renderSuggestion (suggestion, { query, isHighlighted }) {
   return (
    <div>
      <span>&#9754;</span>
      {suggestion.name}
    </div>
  );
 }


  onInputKeyPress(e){  
    if (e.key == "Enter" ) {
      this.setState({value:""})
      this.props.onKeyPress(e)      
    }   
  }

  onChange = (event, { newValue }) => { 
    this.setState(
      {
        value: newValue,
      },
      function () {
        this.props.setUserInput(newValue);
      }.bind(this)
    );
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    //Make ElasticSearch call
    axios.get(`${chatbot_api_host}/suggetions/suggest/${value}?domain=${domain}&userType=${this.props.logInData.userType}&instanceType=${instance_type}`) 
    .then(response=>{ 
      let sgg = this.mapESResponse(response) 
      // this.setState({
      //   suggestions: this.getSuggestions(value),
      // });
      this.setState({
        suggestions:sgg,
      });
    })
    .catch(err=>{})
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  componentDidUpdate(pp, ps) {
    let modal_is_opened = this.props.isModalOpen || this.props.isListModalOpen || this.props.isZoomModalOpen
    // if (this.botInput.current && !modal_is_opened ) {
    //   this.botInput.current.focus();
    // }
  }


  // componentDidMount(){

  //   axios.get(chatbot_api_host+"/getAutoSuggetions?domain="+domain+"&userType="+this.props.logInData.userType)
  //   .then(function(res){ 
  //     this.setState({languages:res.data.questions})
  //   }.bind(this))
  //   .catch(err=>{})


  // }

  onSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) { 
    // this.props.setUserInput(suggestionValue)
    this.props.df_text_query(suggestionValue);
    // this.props._handleSendButton(suggestionValue) 
  }
  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Please write your query",
      value,
      onChange: this.onChange,
      onKeyPress: this.onInputKeyPress, 
      onKeyUp: this.props.onKeyUp,
      ref: this.botInput,
      class: "input-box",
      id:'chatbotInput'
    };

    // Finally, render it!
    // suggestions={this.props.isDialog? []: suggestions} 
    return (
      <Autosuggest        
      // suggestions={this.props.isDialog? []: suggestions} 
      suggestions={[]} 
        // onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        // onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        // getSuggestionValue={this.getSuggestionValue}
        // renderSuggestion={this.renderSuggestion}

        onSuggestionsFetchRequested={()=>{}}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}

        inputProps={inputProps}
        onSuggestionSelected={this.onSuggestionSelected} 
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isModalOpen: state.modalStatus.isOpened,
    isZoomModalOpen: state.zoomModalStatus.isOpened,
    isListModalOpen: state.listModalStatus.isOpened,
    logInData: state.logInStatus
  };
};


const mapDispatchToProps = (dispatch) => {  return { }};

export default connect(mapStateToProps, mapDispatchToProps)(AutoSuggestedInput);
