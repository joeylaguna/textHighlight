import React, { Component } from 'react';
import InputArea from './InputArea';
import FormatedArea from './FormatedArea';
import * as utilites from './utilites.js';
import './App.css';

class TextArea extends Component {
  constructor() {
    super();
    this.updateText = this.updateText.bind(this);
    this.hoverText = this.hoverText.bind(this);
    this.inavtiveHoverText = this.inavtiveHoverText.bind(this);
    this.state = {
      text: 'we expect our candidates to be action-oriented aggressive and have creative ideas for our team you will deliver new technology and groundbreaking designs',
      formattedText: []
    }
  }

  updateText(text) {
    this.setState({
      formattedText: text
    })
  }

  hoverText(hoverItems, key) {
    let temp = utilites.hoverActive(this.state.formattedText, hoverItems, key);
    this.setState({
      formattedText: temp
    });
  }

  inavtiveHoverText(hoverItems, key) {
    let temp = utilites.hoverInactive(this.state.formattedText, hoverItems, key);
    this.setState({
      formattedText: temp
    });
  }

  render() {
    return (
      <div className="App">
        <InputArea updateText={this.updateText}/>
        <FormatedArea text={this.state.formattedText} hoverText={this.hoverText} inavtiveHoverText={this.inavtiveHoverText}/>
      </div>
    );
  }
}

export default TextArea;
