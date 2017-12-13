import React, { Component } from 'react'
import Item from './item/Item'

class App extends Component {
  render() {
    return (
        <div className="container body-content">            
            <h2>Minha Lista</h2>            
            <Item />
        </div>
    )
  }
}

export default App;
