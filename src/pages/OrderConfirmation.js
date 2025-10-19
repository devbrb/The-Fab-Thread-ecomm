import { useParams } from "react-router-dom";
import OrderedItems from "../components/Orders/OrderedItems";
import "../components/Orders/OrderSummery.css";
import "../components/Cart/cart.css";
import "../style/orders.css";

function OrderConfirmation() {
    const {orderId} = useParams();

    return (
        <div className="orderSummery-page">
            <div className="order-heading-container">
                <p className="title">It's on the way!</p>
                <p className="order-num">Your order #{orderId} has shipped and will be with you soon.</p>
                <OrderedItems />
            </div>
        </div>
    )
}

export default OrderConfirmation
