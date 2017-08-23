import React, { Component } from 'react';
import InputArea from './InputArea';
import FormatedArea from './FormatedArea';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <InputArea />
        <FormatedArea />
      </div>
    );
  }
}

export default App;
