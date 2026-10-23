import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../Utils/helpers";
import { useCartEntries } from "./useCartEntries"
import { useUser } from "../Authentication/useUser";
import { useSelectedAddress } from "../../context/SelectAddressContextApi";
import Button from "../ui/Button";
import OrderPriceBox from "./OrderPriceBox";
import { PLATFORM_FEE, SHIPPING_FEE } from "../../Utils/Constants";
import { useSelector } from "react-redux";
import { memo, useEffect, useMemo } from "react";

const CartPriceBox = memo(function CartPriceBox({type, setTotalCartPrice}) {
    const navigate = useNavigate();
    const {selectedAddress, user} = useSelector((store) => store.cartStates)
    const {cartEntries, isEntriesLoading} = useCartEntries();
    
    const currentUserEntries = useMemo(() => cartEntries?.filter((entry) => entry.userId === user?.id), [cartEntries, user?.id]);

    const priceWithoutDiscount = useMemo(() => currentUserEntries?.reduce((acc, curr) => acc + (curr.products?.price * curr.quantity || 0), 0), [currentUserEntries]);
    const priceWithDiscount = useMemo(() => currentUserEntries?.reduce((acc, curr) => acc + (curr.products?.discountPrice * curr.quantity || 0), 0), [currentUserEntries]);

    const totalDiscount = priceWithoutDiscount - priceWithDiscount;
    
    const totalCartAmount = priceWithDiscount + PLATFORM_FEE + SHIPPING_FEE;

    useEffect(() => {
        type === "order" && setTotalCartPrice(totalCartAmount)
    }, [type, setTotalCartPrice, totalCartAmount])

    if(isEntriesLoading) return null;
    return (
        <div className="priceBlock-box">
            <div className="cart-totalPrice-sec">
                <OrderPriceBox priceWithoutDiscount={priceWithoutDiscount} totalDiscount={totalDiscount}/>
                <div>
                    <div className="cart-price-row cart-totalAmmount">
                        <span className="price-text">Total Amount</span>
                        <span className="price-amount">{formatCurrency(totalCartAmount)}</span>
                    </div>
                    {type !== "order" &&
                    <Button
                        onClick={() => navigate(`/${type}`)} type="cart" disabled={type !== "address" && !selectedAddress}>
                        {type === "address" ? "Place order" : "Continue"}
                    </Button>}
                </div>
            </div>
        </div>
    )
})

export default CartPriceBox
