import { Link } from "react-router-dom"
import RatingWrapper from "../ui/RatingWrapper";
import useInView from "../../Hooks/useInView";

function ProductCard({item}) {
    const [ref, hasBeenInView] = useInView({ threshold: 0.2 });
    const {id, itemName, itemImage, brand, price, discountPrice, discount, itemType, userRatings} = item;

    const totalRating = userRatings?.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = Math.ceil((totalRating / userRatings?.length) * 10) / 10;
    
    const productUrl = `/${itemType}/${brand}/${itemName.replace(/ /g, '-')}/${id}`;
    
    return (
        <div className={`item-column product-card product-card${hasBeenInView ? " visible" : ""}`} data-testid="product-card" ref={ref}>
            <Link className="item-url" to={productUrl} data-testid="product-url">
                <img className="itemImg" src={itemImage ? itemImage : "imgNotFound.webp"} alt={itemName} loading="lazy"/>
                {userRatings?.length && 
                    <RatingWrapper rating={avgRating} />
                }             
                <div className="itemDetails">
                    <span className="item-brand">{brand}</span>
                    <span className="item-name">{itemName}</span>
                    <div className="itemPriceBox">
                    <span className="item-price">Rs.{discountPrice}</span>
                    <span className="item-discountPrice">Rs.{price}</span>
                    <span className="item-discount">({discount})</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard