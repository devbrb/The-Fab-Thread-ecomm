import { HiBars3, HiShoppingBag } from "react-icons/hi2"
import Logo from "./Logo"
import useCartCount from "../../Hooks/useCartCount";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../context/CartSlice";
import SearchBox from "./SearchBox";

function MobileNav() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {cartCount} = useCartCount();
    const location = useLocation();
    const isSearchAllowed = location.pathname === "/address" || location.pathname === "/payment";

    return (
        <nav className="mobile-nav">
          <div className="mobile-header-menu-icon">
            <button type="button" className="menu-button" onClick={() => dispatch(toggleSidebar(true))}><HiBars3 /></button>
            <Logo />
          </div>
          {!isSearchAllowed &&
          <>
            <div className="mobile-search-box">
              <SearchBox />
          </div>
          <ul className="mobile-nav__list">
            <li className="nav__item">
              <button className="nav__btn nav__btn--bookmarks" onClick={() => navigate("/cart")}>
                <HiShoppingBag />
                {cartCount ? <p className="cartCount">{cartCount}</p> : ""}
              </button>
            </li>
          </ul>
          </>
          }
        </nav>
    )
}

export default MobileNav
