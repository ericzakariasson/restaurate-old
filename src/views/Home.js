import React, { Component } from 'react';
import { Link } from 'react-router';

import HomeText from '../text/HomeText1';
import HomeText2 from '../text/HomeText2';
import HomeText3 from '../text/HomeText3';

import backgroundImage from '../img/start-img.jpg';
import backgroundImageAuth from '../img/home-auth-dark.jpg';

import Logo from '../img/logo-white.svg';
import Reviews from '../modules/Reviews';

const Home = (props) => {
  const homeStyle = {
    backgroundImage: `url("${backgroundImage}")`,
  }

  const homeStyleAuth = {
    backgroundImage: `url("${backgroundImageAuth}")`,
  }

  if (!props.state.authenticated) {
    return (
      <div className="home" style={homeStyle}>
        <div className="home-container">
          <article className="article article-info">
            <h1 className="h1">Vilken är din favoritrestaurang?</h1>
            <p>{HomeText}</p>
          </article>
          <button className="button button-white"><Link to="/login">Betygsätt nu</Link></button>
          <section className="home-articles">
            <article className="article home-article">
              <h2>Hur</h2>
              <p>{HomeText2}</p>
            </article>
            <article className="article home-article">
              <h2>Varför</h2>
              <p>{HomeText3}</p>
            </article>
          </section>
          <button className="button button-white"><Link to="/register">Skapa konto</Link></button>
          <img className="logo-bottom" src={Logo} alt="Restaurate logo" />
        </div>
      </div>
    );
  } else  {
    //Visar namn
    //Visar senaste recensioner
    const firstName = props.state.user.name.split(' ')[0];

    return (
      <div className="home-auth" style={homeStyleAuth}>
        <div className="home-auth-container">
          <section className="home-welcome">
            <h1 className="h1">Välkommen, {firstName}</h1>
          </section>
          <section className="home-dashboard">
            <Reviews reviews={props.state.reviews} sortBy="date" filter="" />
            <section className="home-user">
              <div className="home-user-name">{props.state.user.name}</div>
              <article>
                <h2 className="home-user-review-count">Recensioner: {props.state.reviews.length}</h2>
              </article>
              <button className="button button-black"><Link to="/account">Mitt konto</Link></button>
            </section>          
          </section>
          <img className="logo-bottom" src={Logo} alt="Restaurate logo" />
        </div>
      </div>
    )
  }
}

export default Home