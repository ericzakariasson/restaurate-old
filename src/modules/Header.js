import React, { Component } from 'react';
import { Link } from 'react-router';

import Logo from '../img/logo.svg';
import MobileMenu from './MobileMenu';

class Header extends Component {
  constructor() {
    super()

    this.toggleMenu = this.toggleMenu.bind(this);

    this.state = {
      menuOpen: false
    }
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {

    const menuIconClass = this.state.menuOpen ? "menu-icon active" : "menu-icon";

    const menuItems = this.props.authenticated
                      ? (
                          <div onClick={this.toggleMenu}>
                            <ul>
                              <li className="menu-item">
                                <Link to="new" activeClassName="active">Ny recension</Link>
                              </li>
                              <li className="menu-item">
                                <Link to="reviews" activeClassName="active">Recensioner</Link>
                              </li>
                              <li className="menu-item account">
                                <Link to="account" activeClassName="active">{this.props.username}</Link>
                              </li>
                            </ul>
                          </div>
                        )
                      : (
                          <div onClick={this.toggleMenu}>
                            <ul>
                              <li className="menu-item">
                                <Link to="register" activeClassName="active">Registrera dig</Link>
                              </li>
                              <li className="menu-item">
                                <Link to="login" activeClassName="active">Logga in</Link>
                              </li>
                            </ul>
                          </div>
                        )

    return(
      <header>
        <nav>
          <ul>
            <li className="header-logo">
              <Link to="/"><img className="logo" src={Logo} alt="Logo" /></Link>
            </li>
              {
                //FIXA MENY NÄR MAN ÄR INLOGGAD
                menuItems
              }
            <li>
              <div onClick={this.toggleMenu} className={menuIconClass}>
                <span className="menu-icon-top"></span>
                <span className="menu-icon-bot"></span>
              </div>
            </li>
          </ul>
          <MobileMenu active={this.state.menuOpen} menuItems={menuItems} />
        </nav>
      </header>
    )
  }
}
            
export default Header;