import { useEffect, useState } from "react"
import { HiShoppingBag } from "react-icons/hi2";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAddToCart } from "../Cart/useAddToCart";
import { useCartEntries } from "../Cart/useCartEntries";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import SelectPincode from "./SelectPincode";
import { useAddreses } from "../Address/useAddreses";
import PriceBox from "../ui/PriceBox";
import LoginForm from "../Authentication/LoginForm";
import SpinnerMini from "../ui/SpinnerMini";
import Spinner from "../ui/Spinner";

function PDPAddToCart({productData}) {
    const [selectedSize, setSelectedSize] = useState();
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [productInCart, setProductInCart] = useState();
    const [selectedPin, setSelectedPin] = useState();
    const [selectedAddress, setSelectedAddress] = useState();
    const navigate = useNavigate();
    const {user, isAuthenticated} = useSelector((store) => store.cartStates);

    const {id, itemName, brand, price, discountPrice, discount, size } = productData
    const {cartEntries, isEntriesLoading} = useCartEntries();
    const currentUseradd = {field:"userId" , value: user?.id}
    const {addreses, isAddressLoading} = useAddreses(currentUseradd);
    const {addToCartFn, isAddingCart} = useAddToCart();
    useEffect(() =>{
        const entry = cartEntries?.filter((entry) => entry.productId === id && entry.productSize === selectedSize && user?.id === entry.userId);
        setProductInCart(entry);
        setIsAddedToCart(false)
    }, [selectedSize])

    // useEffect(() => {
    //     if(addreses?.length > 0){
    //         const filterAddress = addreses?.filter((curr) => curr.id === selectedPin)
    //         const value = selectedPin ? `${filterAddress?.[0].address.pincode} (${filterAddress?.[0].address.userName})` :
    //         `${addreses?.[0].address.pincode} (${addreses?.[0].address.userName})`
    //         setSelectedAddress(value);
    //         setSelectedPin(!selectedPin ? addreses?.[0].id : selectedPin);       
    //     }
    // }, [selectedPin, addreses])

    function handleAddToCart(){
        if(!selectedSize) return document.querySelector(".size-error").classList.remove("hide");
        if(!isAuthenticated) return navigate("/login");

        let cartEntry;
        if(productInCart.length > 0){
            cartEntry = {
                quantity: productInCart[0].quantity + 1
            }
        }else{
            cartEntry = {
                productId: id,
                productSize: selectedSize,
                quantity: 1,
                userId: user?.id
            }
        }
        addToCartFn({entry: cartEntry, id: productInCart[0]?.id},
                    {onSuccess: () => {
                            
                            setIsAddedToCart(!isAddedToCart)
                        }
                    })
    }
    if(isEntriesLoading) return <Spinner />

    return (
        <div className="pdp-price-info">
            <div className="pdp-itemName-info">
                <span className="pdp-brand">{brand}</span>
                <span className="pdp-name">{itemName}</span>
            </div>
            
            <PriceBox type="pdp" price={price} discountPrice={discountPrice} discount={discount}/>

            <div className="tax-text">
                Inclusive of all taxes
            </div>
            <div className="itemSize">
                <span className="size-heading">Select Size</span>
                <div className="size-container">
                    <span className="size-error hide">Please select a size</span>
                    <div className="size-buttons">
                        {Object.entries(size).map(([key, qty], index) => (
                            <button key={index} type="button" 
                                className={`sizeButton 
                                ${selectedSize === key ? "selectedSize" : ""}`} 
                                onClick={() => {
                                    document.querySelector(".size-error").classList.add("hide");
                                    setSelectedSize(key)
                                }} disabled={qty === 0}
                                data-testid="sizeButton"
                                >
                                <p>{key}</p>
                                {(qty < 5 && qty > 0) && <span className="qtyLabel">{qty} left</span>}
                                {qty === 0 && <span className="size-btn-strike"></span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="addtoCart-btn-box">
                {!isAddedToCart ? (
                    !isAuthenticated ? 
                    <Modal>
                        <Modal.Open opens="login">
                            <Button onClick={handleAddToCart} disabled={isAddingCart} data-testid="addTocart">
                                <HiShoppingBag />
                                <span>Add To Cart</span>
                            </Button> 
                        </Modal.Open>
                        <Modal.Window name="login">
                            <LoginForm isPopupSession="true"/>
                        </Modal.Window>
                    </Modal>
                    :
                    <Button onClick={handleAddToCart} disabled={isAddingCart}>
                        <HiShoppingBag />
                        <span>Add To Cart</span>
                        {isAddingCart && <SpinnerMini />}
                    </Button>
                    )
                    :
                    (
                    <Button onClick={() => navigate("/cart")}>
                        <HiShoppingBag />
                        <span>Go To Cart</span>
                    </Button>
                    )
                }
            </div>
           <Modal>
                {addreses?.length > 0 && <div className="delivery-options-box">
                    {/* <Modal.Open opens="select">
                        <Button type="pincode">
                            <span className="pincode-val">{selectedAddress}</span>
                            <span className="change-text">Change</span>
                        </Button>
                    </Modal.Open>

                    <Modal.Window name="select">
                        <SelectPincode setSelectedPin={setSelectedPin} selectedPin={selectedPin}/>
                    </Modal.Window> */}

                    <ul className="pincode-availability-list">
                        <li className="availability-row">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="delivery-icon availability-icon">
                                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.988A3.752 3.752 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z" clip-rule="evenodd" />
                            </svg>
                            <span>Pay on delivery available</span>
                        </li>
                        <li className="availability-row">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="exchange-icon availability-icon">
                                <path fill-rule="evenodd" d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                            </svg>
                            <span>Returns and exchange available</span>
                        </li>
                    </ul>
                </div>}
           </Modal>
        </div>
    )
}

export default PDPAddToCart