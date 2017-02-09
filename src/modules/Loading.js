import React, { Component } from 'react';
import Logo from '../img/logo.svg';

const Loading = (props) => {
  return (
    <div className="loading">
      <img src={Logo} alt="Laddar"></img>
    </div>
  )
}
            
export default Loading;