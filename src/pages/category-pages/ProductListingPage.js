import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useResponsiveQuery } from "../../context/MediaQueryContextApi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

import "../../components/Product/products.css";
import "../../components/Category/category.css";
import FilterBox from "../../components/Product/FilterBox";
import ProductBox from "../../components/Product/ProductBox";
import { loader, setProductsList } from "../../context/ProductsSlice";
import MobileFilterBox from "../../components/Product/MobileFilterBox";
import { toggleFilterSideBar } from "../../context/CartSlice";
import { useParams } from "react-router-dom";
import { useProductsByCategory } from "../../components/Product/useProductsByCategory";
import { useFetchAllMatchingProducts } from "../../components/Product/useFetchAllMatchingProducts";
import Spinner from "../../components/ui/Spinner";

function ProductListingPage() {
    const dispatch = useDispatch();
    const {isMobile} = useResponsiveQuery();
    const {categoryName} = useParams();
    const {searchQuery} = useParams();
    const {getProductsListByCategoryFn, isPending} = useProductsByCategory();
    const {fetchAllMAtchingProductsFn, productsLoading} = useFetchAllMatchingProducts();
    const {productsList, isProductsListLoading} = useSelector((store) => store.products);

    //Filter
    useEffect(() => {
        if(categoryName){
            dispatch(loader());
            getProductsListByCategoryFn(categoryName, {
                onSuccess: (data) => { 
                    dispatch(setProductsList(data));
                }
            })
        }
    }, [categoryName]);

    useEffect(() => {
        if(searchQuery && productsList.length <= 0){
            dispatch(loader());
            const val = searchQuery.replace(/-/g, ' ');
            fetchAllMAtchingProductsFn(val, {
                onSuccess: (data) => {
                    dispatch(setProductsList(data));
                }
            });
        }
    }, [])

    // if(isPending || productsLoading || isProductsListLoading) return <Spinner />

    return (
        <div className="category-page mobile-mainContent">
            {!isMobile ? <FilterBox data-testid="desktop-filter" /> : <MobileFilterBox />}
            <ProductBox />
            {isMobile && <div className="select-filter-btn">
                <button type="button" onClick={() => dispatch(toggleFilterSideBar(true))}>
                    <HiOutlineAdjustmentsHorizontal /> 
                    <span>Filter</span>
                </button>
            </div>}
        </div>
    )
}

export default ProductListingPage
