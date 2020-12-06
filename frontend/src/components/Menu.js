import React from 'react';
import './Menu.css';
import uniqid from 'uniqid'
import axios from 'axios';

class Menu extends React.Component {
  
  
  constructor(props){
    super(props)
    this.state = {
        loadingData: true,
        subjects:null,
        addSubject:false,
        newSubject:'',


        subjectFocus:false,
        subjectData: null,
        activeSubject: 0,
        activeTopic: 0,

        keywords: ['is','are','because'],

        editMode: false,
        editValues: [], //for editing input in react...
        editingObj: -1,
        editPos: [0,0],  
        newEdit: false,
        newEditValue: '',

        flashcardMode: false,
        flashcardDeck:[],
        activeDeck: 0,
        openDeck: false

    }
    // this.addSubject.bind = this.addSubject.bind(this);
    // this.cancelAddSubject.bind = this.cancelAddSubject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeEditValue = this.changeEditValue.bind(this);
    this.addEditObj = this.addEditObj.bind(this);
    this.loadFlashcardDeck = this.loadFlashcardDeck.bind(this);

  }

  handleChange(x,event){
    let currentValues = this.state.editValues;
    currentValues[x] = event.target.value;

    this.setState({editValues:currentValues, editingObj:x, editPos:[event.target.selectionStart,event.target.selectionEnd]})

  }

  changeEditValue(event){
   this.setState({newEditValue:event.target.value})
  }

  async componentDidMount(){
    this.getData()


    window.addEventListener("keyup",()=>{
      let editobj = document.getElementById('e' +this.state.editingObj);

      if(editobj!=null){
        editobj.focus()
        editobj.selectionStart=this.state.editPos[0];
        editobj.selectionEnd=this.state.editPos[1];
      }

    })
    
  }


  async getData(){
    axios.get('http://localhost:3001/subjects')
        .then(response =>{   
            let data = response.data;
            this.setState({subjects:data, loadingData:false});
            // console.log(data)

        })
        .catch(error =>{
            console.log(error) //return error fail to retrieve data
        })
  }

  switchTopic(x){
    this.setState({activeTopic:x})

    let values = [];
    let statementList = this.state.subjects[this.state.activeSubject].topics[x].content;
    for(let i=0; i<statementList.length; i++){
      let before = statementList[i].before;
      let keyword = statementList[i].keyword ==-1?'':this.state.keywords[statementList[i].keyword];
      let after = this.renderARE(statementList[i].after);



      values.push(before + ' ' + keyword + ' ' + after);        
    }

    this.setState({editValues:values});

  }

  renderARE(items){
    let result =''

    for(let i=0; i<items.length; i++){
      result+=items[i]
      if(i!=items.length-1){
        result+=' + '
      }
    }

    return result
  }

  saveARE(areString){
    var areArr = areString.split(' + ');
    return areArr;
  }
  
  loadSubject(x){

  

    this.setState({activeSubject:x, subjectData:this.state.subjects[x]})

    if(this.props.mode==0){
      this.setState({subjectFocus:true, flashcardMode:false})
    }else{
      this.setState({flashcardMode:true, subjectFocus:false})
    }

    //setup editable content...
    let values = [];
    let statementList = this.state.subjects[x].topics[this.state.activeTopic].content;
    for(let i=0; i<statementList.length; i++){
      let before = statementList[i].before;
      let keyword = statementList[i].keyword ==-1?'':this.state.keywords[statementList[i].keyword];
      let after = this.renderARE(statementList[i].after);



      values.push(before + ' ' + keyword + ' ' + after);        
    }

    this.setState({editValues:values});
  }

  addEditObj(){
    if(this.state.newEditValue!=''){
      this.setState({newEdit:true})
    
      let currentValues = this.state.editValues;
      currentValues.push(this.state.newEditValue);
  
      this.setState({editValues:currentValues, newEditValue:'', newEdit:false})
  
      var addEditObj = document.getElementById('addEditObj');
      addEditObj.value = ''
      addEditObj.focus();
    }

  }

  saveEdits=async(e)=>{
    e.preventDefault();
    //checking which statements contains keyword (is, are, because)

    let updatedStatements = [];

    for(let j=0; j<this.state.editValues.length; j++){
      let keywordStatement = null; 
      for(let i=0; i<this.state.keywords.length; i++){
        let keyword = this.state.keywords[i]
        let keywordIndex = this.state.editValues[j].indexOf(' '+ keyword + ' ')

        if(keywordIndex!=-1){
          //shows where to cut statements...

          let before = this.state.editValues[j].substring(0,keywordIndex);

          let after = this.state.editValues[j].substring(keywordIndex+keyword.length+2);

          let afterARR = this.saveARE(after);
          //update keywordStatements
          
          keywordStatement = {before:before, keyword:i, after:afterARR};

          break;
          }
        
      }
      if(keywordStatement!=null){
        updatedStatements.push(keywordStatement)
      }else{
        if(!(!this.state.editValues[j].replace(/\s/g, '').length)){
          updatedStatements.push({before:this.state.editValues[j], keyword:-1, after:[]})
        }
      }
    }
    //update database...
    let currentData = this.state.subjectData;
    
    currentData.topics[this.state.activeTopic].content = updatedStatements;
    
    //console.log(currentData)

    let putAddress = 'http://localhost:3001/subjects/' + this.state.subjectData._id;
    axios.put(putAddress,currentData)
      .then(response => {
        console.log(response)
      })
      .catch(error =>{
        console.log(error)
      })
    

    //return back to menu
    this.setState({editMode:false, editValues:[]})
    this.forceUpdate()
    this.switchTopic(this.state.activeTopic)
  }


  loadFlashcardDeck(x){
    this.forceUpdate()
    let deckData = this.state.subjectData.topics[x].content
    this.setState({flashcardDeck:deckData, openDeck:true})

  }

  render(){

    let renderSubjects;
    if (this.state.loadingData==false && this.state.flashcardMode==false){
      renderSubjects = this.state.subjects.map((subject,x) =>
        <a 
        className='subjectItem' 
        key={uniqid()} 
        style={this.props.mode==0?{background: 'linear-gradient(to bottom, royalblue, royalblue 60%, #d3d3d3 60%, #d3d3d3 100%)'}:{background: 'linear-gradient(to bottom, red, red 60%, #d3d3d3 60%, #d3d3d3 100%)'}}
        onClick={()=>{this.loadSubject(x)}}
        >

          
          <p>{subject.subjectName}</p>

          <p style={this.props.mode==0?{color:"royalblue"}:{color:'red'}}
          >{subject.topics.length} Topics</p>
  

        </a>
     
        );
    }



    let focusMenu;
    if(this.state.subjectFocus){
      let subtopics = this.state.subjectData.topics;
      focusMenu = subtopics.map((item,x) =>
        <a key={uniqid()} onClick={()=>this.switchTopic(x)}>{item.topicName}</a>
      );

    }




    let content;

    if(this.state.subjectFocus){
      let statementList = this.state.subjectData.topics[this.state.activeTopic].content;
      content = statementList.map((statement, x)=>
        <div className='contentObj' key={uniqid()}>
          <p>{statement.before}&nbsp;
          {statement.keyword==-1?(<span style={{display:'none'}}></span>):(<span>{this.state.keywords[statement.keyword]}</span>)}
          &nbsp;{this.renderARE(statement.after)}</p>
        </div>
      )
    }


    let editContent;
    

    //gen array of changeable 'values' in state...
    if(this.state.editMode){
      editContent = this.state.editValues.map((editvalue,x)=>
        <div className='editObj' key={uniqid()} >
          <textarea id={'e'+x} key={uniqid()} type="text" value={editvalue} onChange={(e)=>this.handleChange(x,e)}/> 

        </div>

      )

    }




    let flashcardTopicMenu;

    if(this.state.flashcardMode){
      flashcardTopicMenu = this.state.subjectData.topics.map((topic, x)=>
        <a className='flashCardTopicItem' key={uniqid()} onClick={()=>this.loadFlashcardDeck(x)}>
          <p style={{color:'white'}}>{topic.topicName}</p>
          <p style={{color:'red'}}>{topic.content.length} cards</p>
        </a>
      )
    }




    let flashcardDeck;

    if(this.state.openDeck){
      flashcardDeck = this.state.flashcardDeck.map((card, x)=>
        <div key={uniqid()} className='flashcard' style={{zIndex:x, position:'absolute',top:0, left:0}}>
          <p>{card.before}</p>
        </div>
      )
    }



// {/* mode this.props ==mode */}
    return(

      <div style={{display:'grid'}}>

        {this.state.subjectFocus==false?(

          <div className='subjectWrapper'  style={this.state.flashcardMode?{display:'none'}:{}}>
                      
          {this.state.loadingData || !this.state.subjects ?(<div></div>):(

          <div className='subjectItemWrapper'>{renderSubjects}</div>   

          )}
          </div>
        ):(

          <div className='subjectContentWrapper'>

            {this.state.editMode==false?(
            <div className='focusMenu' style={this.props.mode==0?{backgroundColor: 'royalblue'}:{backgroundColor: 'red'}}>
              <button className ='backButton' onClick={()=>this.setState({subjectFocus:false, activeTopic:0})}>Back</button>
              {focusMenu}
            </div>

            ):(
            <div className='focusMenu' style={this.props.mode==0?{backgroundColor: 'royalblue'}:{backgroundColor: 'red'}}>
              <div></div>
              <a style={{pointerEvents:'none'}}>{this.state.subjectData.topics[this.state.activeTopic].topicName}</a>
            </div>
            )}



            {this.state.editMode==false?(<div className='content'>{content}</div>):
            
            (<form className='editContent' onSubmit={this.saveEdits}>
              
              {editContent}
              
              <div className='editObj'>
                <textarea
                style={this.state.newEdit?{}:{border:'1px solid grey', borderRadius:'25px'}} 
                onBlur={this.addEditObj} id={'addEditObj'} 
                type="text"
                 value={this.newEditValue} 
                 onChange={(e)=>this.changeEditValue(e)}/> 
              </div>

              <div className='editObj' style={this.state.newEditValue==false?{pointerEvents:'none'}:{}}>
                <textarea 
                style={this.state.newEdit?{border:'1px solid grey', borderRadius:'25px'}:{}} 
                onClick={this.addEditObj} id={this.state.editValues.length-1} type="text" 
                value={this.newEditValue} 
                onChange={(e)=>this.changeEditValue(e)}/> 
              </div>

              <div className='contentButton submitButton'>
                <button type="submit" style={{alignSelf:'center'}}>Save</button>
              </div>

            </form>)}
            

            {this.state.editMode==false?(
            <div className='contentButton'>
              <button onClick={()=>{this.setState({editMode:true})}} style={{alignSelf:'flex-end'}}>Edit</button>
              <button>Cardify</button>
            </div>
            ):(<div style={{display:'none'}}></div>)}


          </div>

        )}

        {/* flashcard section.... */}

        {this.state.flashcardMode==true?(

          <div className='flashCardWrapper'>
                      
            {this.state.loadingData ?(<div></div>):(
              
              <div className='flashCardItemWrapper'>
                <div className="exitFlashcards">
                  <button onClick={()=>this.setState({flashcardMode:false})}>Back</button>
                </div>

                
                {this.state.openDeck==false?flashcardTopicMenu:(
                <div style={{position:'relative', gridColumn:'1/10'}}>
                  {flashcardDeck}
                  <div className="flashCardButtons">
                    <button>Again</button>
                    <button>OK</button>
                    <button>Good</button>

                  </div>
                </div>)}
                
                

              </div>  



            )}

          </div>):<div></div>}

          

      </div>
      

    )
  }
}

export default Menu;
