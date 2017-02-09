import React, { Component } from 'react';

const NoMatch = (props) => {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <h1 className="h1">404</h1>
      </div>
      <h2>Sidan du sökte hittades inte</h2>
    </div> 
  )
}

export default NoMatch;