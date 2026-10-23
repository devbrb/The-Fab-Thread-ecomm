import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { useCartEntries } from "../components/Cart/useCartEntries";
import { setCartCount } from "../context/CartSlice";

function useCartCount() {
    const cartCount = useSelector((store) => store.cartStates.cartCount, shallowEqual)
    const {cartEntries, isEntriesLoading} = useCartEntries();
    const user = useSelector((store) => store.cartStates.user, shallowEqual);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(!cartEntries) return;
        const currentUserEntries = cartEntries?.filter((entry) => entry.userId === user?.id);
        const count = currentUserEntries?.reduce((acc, curr) => acc + curr.quantity, 0)
        dispatch(setCartCount(count));
    }, [dispatch, cartEntries, user])

    return {cartCount, isEntriesLoading}
}

export default useCartCount


