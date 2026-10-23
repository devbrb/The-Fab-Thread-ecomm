import { memo } from "react";
import { formatCurrency } from "../../Utils/helpers"
import { useResponsiveQuery } from "../../context/MediaQueryContextApi";

const PriceBox = memo(({price, discountPrice, discount, type}) => {
    const {isMobile} = useResponsiveQuery();
    let priceStyle;
    let discountStyle;

    if(type === "pdp"){
        priceStyle = {
            fontSize : isMobile ? "18px" : "22px",
        }
        discountStyle = {
            fontSize: isMobile ? "16px" : "20px"
        }
    }else{
        priceStyle = {
            fontSize : "14px",
        }
        discountStyle = {
            fontSize: "12px"
        }
    }
    return(
        <div className="item-PriceBox">
            <span style={priceStyle} className="item-price">{formatCurrency(discountPrice)}</span>
            <span style={discountStyle} className="item-discountPrice">{formatCurrency(price)}</span>
            <span style={discountStyle} className="item-discount">({discount})</span>
        </div>
    )
})

export default PriceBox;