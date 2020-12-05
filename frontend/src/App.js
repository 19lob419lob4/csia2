import React from 'react';
import './App.css';

import Menu from './components/Menu';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // 0 - notes, 1 - flascard
      mode: 0
    }

    this.toggleMenu = this.toggleMenu.bind(this);

  };


  toggleMenu(x){
    this.setState({mode:x})
  }

  
  
  render(){
    return(
      <div className='contentWrapper'>
        <div className='sideBar' style={this.state.mode==0?{backgroundColor: 'royalblue'}:{backgroundColor: 'red'}}>
          <button style={{alignSelf:'flex-end'}} onClick={()=>this.toggleMenu(0)}>Notes</button>
          <button onClick={()=>this.toggleMenu(1)}>Flashcards</button>   
        </div>

        {/* blank div for grid column block... */}
        <div></div> 

        <Menu mode={this.state.mode}/>
      </div>

    )
  }
}

export default App;
