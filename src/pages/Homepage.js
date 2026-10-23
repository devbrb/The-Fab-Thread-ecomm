import { useRef } from "react"
import Category from "../components/Category/Category"
import OfferBanner from "../components/ui/OfferBanner"

function Homepage() {
    const categorySectionRef = useRef(null)

    const handleShopCollectionClick = () => {
        if (!categorySectionRef.current) return

        categorySectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    return (
        <div className="homepage mobile-mainContent">
            <div className="top-canvas-container">
                <div className="hero-accent hero-accent-left" />
                <div className="hero-accent hero-accent-right" />
                <div className="homepage-welcome-note">
                    <span className="homepage-badge">Elevated Everyday Style</span>
                    <span className="homepage-welcome-text">
                        Stay ahead of the trends with <span className="fab-text">Fab</span>Thread!
                    </span>
                    <span className="text-home firstLine">Your One-Stop Destination for Trendy & Timeless Fashion!</span>
                    <span className="text-home secondLine">Shop the latest styles with ease and elegance.</span>
                    <div className="homepage-cta-row">
                        <button className="homepage-cta primary" onClick={handleShopCollectionClick}>Shop Collection</button>
                    </div>
                </div>
            </div>
            <OfferBanner />
            <div ref={categorySectionRef} className="homepage-category-anchor">
                <div className="category-text">Shop By Category</div>
                <Category />
            </div>
        </div>
    )
}

export default Homepage
