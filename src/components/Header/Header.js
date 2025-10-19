import NavBar from "./NavBar"
import "../Header/Header.css"
import { useSelector } from "react-redux"
import { useEffect } from "react";
import SidebarNav from "./SidebarNav";
import SearchBox from "./SearchBox";
import { useResponsiveQuery } from "../../context/MediaQueryContextApi";
import { useLocation } from "react-router-dom";

function Header() {
    const {isSidebarOpen} = useSelector((store) => store.cartStates);
    const {isMobile} = useResponsiveQuery();
    const location = useLocation();
    const isHomepage = location.pathname === "/"

    useEffect(() => {
        if(isSidebarOpen){
            document.body.classList.add("no-scroll");
        }else{
            document.body.classList.remove("no-scroll");
        }
    }, [isSidebarOpen])

    return (
        <div className={`header-container ${!isHomepage ? "notHomepage" : ""}`}>
            {isMobile && <SidebarNav />}
            <header className="header">            
                <NavBar />
            </header>
            
        </div>
    )
}

export default Header
