import React, { Component } from 'react';
import './Format.css'

class FormatedArea extends Component {
  constructor() {
    super();
    this.handleHover = this.handleHover.bind(this);
    this.handleHoverLeave = this.handleHoverLeave.bind(this);
  }

  handleHover(data, key) {
    this.props.hoverText(data, key)
  }

  handleHoverLeave(data, key) {
    this.props.inavtiveHoverText(data, key)
  }

  render() {
    let words = this.props.text.map((word, key) => {
      return (
        <span className={word.classes.classes.join(' ')} key={key} data={word.classes.trailingWords.join(' ')} onMouseEnter={()=>{this.handleHover(word.classes.trailingWords, key)}} onMouseLeave={()=>{this.handleHoverLeave(word.classes.trailingWords, key)}}>
          {word.phrase + ' '} 
        </span>
      )
    });
    return (
      <div>
          {words}
      </div>
    )
  }
}

export default FormatedArea;