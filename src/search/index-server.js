'use strict'
 import React from 'react';
 import ReactDOM from 'react-dom';
 import  "./index.css";
 import icon from '../images/icon.png';
 import  '../../common';
 import {a} from './tree-shaking';
 class Search extends React.Component{

     constructor(){
         super(...arguments);
         this.state = {
             Text: null
         };
     }
     loadcomponent(){
         import('./text.js').then((Text)=>{
             console.log('=======loadcomponent',Text)
             this.setState({
                Text: Text.default
             })
         });

     }
     render(){
         console.log('---',a())
         const {Text} = this.state;
         return <div className="search-text"> 
         {
             Text ? <Text/>:null
         }
         search text123<img src='https://common.cnblogs.com/images/wechat.png' onClick = {this.loadcomponent.bind(this)} />
         </div>;
     }
 }
module.exports = Search;