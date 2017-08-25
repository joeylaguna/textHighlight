import React, { Component } from 'react';
import InputArea from './InputArea';
import FormatedArea from './FormatedArea';
import TextArea from './TextArea';
import * as utilites from './utilites.js';
import './App.css';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="App">
        <TextArea />
      </div>
    );
  }
}

export default App;
