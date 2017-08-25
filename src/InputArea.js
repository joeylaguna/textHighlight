import React, { Component } from 'react';
import * as utilites from './utilites.js';

class InputArea extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      text: ''
    }
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
    let updatedText = utilites.highlightText(e.target.value);
    this.props.updateText(updatedText)
  }

  render() {
    return (
      <div>
        <form>
          <textarea value={this.state.text} onChange={this.handleChange}/>
        </form>
      </div>
    )
  }
}

export default InputArea