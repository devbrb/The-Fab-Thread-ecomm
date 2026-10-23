import toast from "react-hot-toast";
import { useUser } from "../Authentication/useUser";
import { useOrderRating } from "../Orders/useOrderRating";
import { useSetItemRating } from "../Product/useSetItemRating";
import Rating from "./Rating";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import useInView from "../../Hooks/useInView";
import { Link } from "react-router-dom";

function OrderBox({order, linkToDetails}) {
    const [ref, hasBeenInView] = useInView({ threshold: 0.2})
    const {id: orderId, productDetails, userRating, productId} = order;
    // const {user} = useUser();
    const {user} = useSelector((store) => store.cartStates);
    const queryClient = useQueryClient();

    const {brand, itemName, size, quantity, discountPrice, itemImage} = productDetails;
    
    const {giveRatingFn, isPending} = useOrderRating();
    const {setItemRatingFn, isRating} = useSetItemRating();
    
    //pushing rating to order as well as product level
    function setUserRating(rating){
        let itemRatingData = {
            userId: user.id,
            rating: rating,
            userName: user.user_metadata.fullName,
        }
        const orderRatingData = {
            orderRating: rating,
            orderReview: userRating?.orderReview,
            date: userRating?.date
        }
        giveRatingFn({userRating: orderRatingData, id: orderId})
        setItemRatingFn({userRating: itemRatingData, id: productId})
    }
    
    function setUserReview(review){
        let itemRatingData = {
            userId: user.id,
            review: review ? review : "",
            date: new Date()
        }
        const orderRatingData = {
            orderRating: userRating?.orderRating,
            orderReview: review,
            date: new Date()
        }
        giveRatingFn({userRating: orderRatingData, id: orderId})
        setItemRatingFn({userRating: itemRatingData, id: productId}, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["orders"]
                })
                toast.success("Your review is submitted successfully")

            }
        })
    }

    // links only image + name, so Rating clicks stay on this page
    const DetailsLink = linkToDetails ? Link : "div";
    const linkProps = linkToDetails ? {to: `/orders/${order.orderid}`} : {};

    return (
        <div className={`order-box ${hasBeenInView ? "visible" : ""}`} ref={ref}>
            <DetailsLink className="item-img-box" {...linkProps}>
                <img src={itemImage ? itemImage : "imgNotFound.webp"} alt="itemImage" />
            </DetailsLink>
            <div className="item-details-box">
                <DetailsLink className="cart-itemName-info" {...linkProps}>
                    <span className="cart-brand">{brand}</span>
                    <span className="cart-name">{itemName}</span>
                </DetailsLink>
                <div className="cart-size-quantiy">
                    <div className="cart-item-size">
                        Size: {size}
                    </div>
                    <div className="cart-item-qty">
                        Qty: {quantity}
                    </div>
                </div>
                <div className="cart-item-PriceBox">
                    <span className="cart-item-price">Price: Rs.{discountPrice}</span>
                </div>
                <Rating onSetRating={setUserRating} onSetReview={setUserReview} userRating={userRating}/>
            </div>
        </div>
    )
}

export default OrderBox
