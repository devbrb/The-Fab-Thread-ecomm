import { PLATFORM_FEE, SHIPPING_FEE } from "../../Utils/Constants";
import { formatCurrency } from "../../Utils/helpers";
import OrderPriceBox from "../Cart/OrderPriceBox"

function OrderPriceTotal({order}) {
    const priceWithoutDiscount = order?.reduce((acc, curr) => acc + (curr.productDetails.price * curr.productDetails.quantity), 0)
    const priceWithDiscount = order?.reduce((acc, curr) => acc + (curr.productDetails.discountPrice * curr.productDetails.quantity), 0)
    const totalDiscount = priceWithoutDiscount - priceWithDiscount
    const totalCartAmount = priceWithDiscount + PLATFORM_FEE + SHIPPING_FEE;

    return (
        <div className="order-summery-price">
            <OrderPriceBox priceWithoutDiscount={priceWithoutDiscount} totalDiscount={totalDiscount}/>
            <div className="total-amount">
                <div className="cart-price-row cart-totalAmmount">
                    <span className="price-text">Total Amount</span>
                    <span className="price-amount">{formatCurrency(totalCartAmount)}</span>
                </div>
            </div>
        </div>
    )
}

export default OrderPriceTotal
