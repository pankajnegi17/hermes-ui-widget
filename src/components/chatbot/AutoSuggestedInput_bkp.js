import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import "./autosugession.css";
import { auto_suggested_questions } from "../../data/auto-suggested-questions";
import {connect} from 'react-redux'

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = auto_suggested_questions;

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : languages.filter(
        (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion, { query, isHighlighted }) => (
  <div>
    <span>&#9754;</span>
    {suggestion.name}
  </div>
);

export class AutoSuggestedInput extends React.Component {
  constructor() {
    super();

    this.botInput = React.createRef();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: [],
    };

    //binding methods
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this)
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
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  componentDidUpdate(pp, ps) {
    let modal_is_opened = this.props.isModalOpen || this.props.isListModalOpen || this.props.isZoomModalOpen
    if (this.botInput.current && !modal_is_opened) {
      this.botInput.current.focus();
    }
  }



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
    };

    // Finally, render it!
    // suggestions={this.props.isDialog? []: suggestions} 
    return (
      <Autosuggest        
      suggestions={this.props.isDialog? []: suggestions} 
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
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
    isListModalOpen: state.listModalStatus.isOpened
  };
};


const mapDispatchToProps = (dispatch) => {  return { }};

export default connect(mapStateToProps, mapDispatchToProps)(AutoSuggestedInput);
