import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrders } from "../components/Orders/useOrders";
import OrderedItems from "../components/Orders/OrderedItems";
import Spinner from "../components/ui/Spinner";
import "../components/Orders/OrderSummery.css";
import "../components/Cart/cart.css";
import "../style/orders.css";

function OrderDetails() {
    const {orderId} = useParams();
    const {orders, isLoading} = useOrders();
    const {user} = useSelector((store) => store.cartStates);

    if(isLoading) return <Spinner />

    const isOwnOrder = orders?.some((order) => order.orderid === orderId && order.userId === user?.id);

    return (
        <div className="orderSummery-page mobile-mainContent">
            <div className="order-heading-container">
                <Link to="/orders" className="order-back-link">&larr; Back to orders</Link>
                {isOwnOrder ? (
                    <>
                        <p className="title">Order #{orderId}</p>
                        <OrderedItems />
                    </>
                ) : (
                    <p className="order-num">Order not found. <Link to="/orders">View your orders</Link></p>
                )}
            </div>
        </div>
    )
}

export default OrderDetails
