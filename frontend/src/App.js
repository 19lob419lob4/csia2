import React from 'react';
import './App.css';

import Menu from './components/Menu';
import axios from 'axios';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // 0 - notes, 1 - flascard
      mode: 0,
      login: false,
      wrongPassword: false,
      password: '',

    }

    this.toggleMenu = this.toggleMenu.bind(this);
    this.login = this.login.bind(this);
    this.loginStatus = this.loginStatus.bind(this);
    this.passwordFieldChange = this.passwordFieldChange.bind(this);
  };


  toggleMenu(x){
    this.setState({mode:x})
  }

  async componentDidMount(){
    this.loginStatus();
  }


  login = async(e)=>{
    e.preventDefault();
    
    axios.post('http://localhost:3001/login',{password:this.state.password})
      .then(res => {
        this.setState({password:''})
        if(res.data.passwordCorrect){
          this.setState({login:true})
        }else{
          this.setState({wrongPassword:true})
        }


      })
      .catch(err =>{
        this.setState({password:''})
        console.log(err)
      })
  }

  loginStatus= async()=>{
    axios.get('http://localhost:3001/loggedIn')
      .then(res =>{
        if(res.data.login_status){
          this.setState({login:true})
        }else{
          this.setState({login:false})
        }
      })
      .catch(err =>{
        console.log(err)
      })
  }

  passwordFieldChange(e){
    this.setState({password:e.target.value})
  }
  
  
  render(){
    return(
      <div onLoad = {()=>this.loginStatus()}>
        {this.state.login==true?(
                <div className='contentWrapper'>
        
                <div className='sideBar' style={this.state.mode==0?{backgroundColor: 'royalblue'}:{backgroundColor: 'red'}}>
                  <button style={{alignSelf:'flex-end'}} onClick={()=>this.toggleMenu(0)}>Notes</button>
                  <button onClick={()=>this.toggleMenu(1)}>Flashcards</button>   
                </div>
        
                {/* blank div for grid column block... */}
                <div></div> 
        
                <Menu mode={this.state.mode}/>
              </div>
        ):(
          <div class="loginWrapper">
            <p style={{width:'max-content',justifySelf:'center',fontSize:'20px'}}>Welcome Back</p>
            <form onSubmit={this.login}
             style={this.state.wrongPassword?{background: 'linear-gradient(white 0%,white 50%, red 50%, red 100%)',borderColor:'red'}:{background: 'linear-gradient(white 0%,white 50%, blue 50%, blue 100%)',borderColor:'blue'}}>
              <textarea placeholder={!this.state.wrongPassword?('Enter Password'):('Incorrect Password')} value={this.state.password} onChange={this.passwordFieldChange}></textarea>
              <button type='submit'>login</button>
            </form>   

          </div>
        )}

      </div>
      


    )
  }
}

export default App;
