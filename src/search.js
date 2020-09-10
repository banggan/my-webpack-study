'use strict'
 import React from 'react';
 import ReactDOM from 'react';
 import  "./search.css";
 import icon from './images/icon.png';
 class Search extends React.Component{
     render(){
         return <div className="search-text"> 
         search text123<img src='https://common.cnblogs.com/images/wechat.png' />
         </div>;
     }
 }
 ReactDOM.render(
     <Search />,
     document.getElementById('root')
 )