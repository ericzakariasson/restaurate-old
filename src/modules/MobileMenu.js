import React from 'react';

const Menu = (props) => {
  const menuClass = props.active ? "mobile-menu mobile-menu-active" : "mobile-menu";
  return(
    <div className={menuClass}>
      {props.menuItems}
    </div>
  )
}
            
export default Menu;