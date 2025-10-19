import React, { useCallback, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { HiHeart, HiShoppingBag, HiUser } from "react-icons/hi2"

import SearchBox from "./SearchBox"
import UserProfile from "../ui/UserProfile"
import useCartCount from "../../Hooks/useCartCount";
import { useLogout } from "../Authentication/useLogout";
import Logo from "./Logo";

const DesktopNav = React.memo(function DesktopNav() {
  const [isDrpDwnOpen, setIsDrpDwnOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {cartCount} = useCartCount();
  const user = useSelector((store) => store.cartStates.user, shallowEqual);
  const {logout, userLoggingOut} = useLogout();

  const isSearchAllowed = location.pathname === "/address" || location.pathname === "/payment";
  const handleDrpDwnToggle = useCallback(() => {
    setIsDrpDwnOpen(prev => !prev)
  }, [])

  return (
    <nav className="nav">
      <Logo />
        {!isSearchAllowed && 
        <>
        <ul className="nav__list">
            <li className="nav__item">
              <button className="nav__btn nav__btn--add-recipe" onClick={() => navigate("/men")}>
                <span>Men</span>
              </button>
            </li>
            <li className="nav__item">
              <button className="nav__btn nav__btn--bookmarks" onClick={() => navigate("/women")}>
                <span>Women</span>
              </button>
            </li>
            <li className="nav__item">
              <button className="nav__btn nav__btn--bookmarks">
                <span>Kids</span>
              </button>
            </li>
        </ul>
        <SearchBox />
        <ul className="nav__list">
            <li className="nav__item" onMouseEnter={handleDrpDwnToggle} onMouseLeave={handleDrpDwnToggle}>
              <button className="nav__btn nav__btn--add-recipe">
                <HiUser />
                <span>Profile</span>
              </button>
              {(isDrpDwnOpen && user) && <UserProfile onLogout={logout} userLoggingOut={userLoggingOut}/>}
              {(isDrpDwnOpen && !user) && <div className="profile-elements">
                <div className="logindrpden-heading">
                  <span className="welcome-text">Welcome</span>
                  <span>To place the order, Please</span>
                </div>
                <NavLink className="drpdwn-link login" to="login">Login/SignUp</NavLink>
              </div>}
            </li>
            <li className="nav__item">
              <button className="nav__btn nav__btn--bookmarks">
                <HiHeart />
                <span>Wishlist</span>
              </button>
            </li>
            <li className="nav__item">
              <button className="nav__btn nav__btn--bookmarks" onClick={() => navigate("/cart")}>
                <HiShoppingBag />
                <span>Cart</span>
                {cartCount ? <p className="cartCount">{cartCount}</p> : ""}
              </button>
            </li>
        </ul>
        </>
        }
    </nav>
  )
})

export default DesktopNav
