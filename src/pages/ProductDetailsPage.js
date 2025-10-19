import { useParams } from "react-router-dom"

import { useProductList } from "../components/Product/useProductList";
import Spinner from "../components/ui/Spinner";
import "../style/productDetails.css";
import "../components/Product/products.css";
import PDPAddToCart from "../components/Product/PDPAddToCart";
import PDPDetails from "../components/Product/PDPDetails";
import PDPRating from "../components/Product/PDPRating";
import PDPReview from "../components/Product/PDPReview";

function ProductDetailsPage() {
    const {productId} = useParams();
    const {productsList, isProductsListLoading} = useProductList([]);

    if(isProductsListLoading) return <Spinner />

    const productData = productsList.filter((item) => item.id === Number(productId));

    const { itemImage } = productData[0]


    return (
        <div className="productDetails-page mobile-mainContent" data-testid="Product-details-page">
            <div className="productTitle-container">
                <div className="productImg-box">
                    <img src={itemImage ? itemImage : "/imgNotFound.webp"} alt="" />
                </div>
                <PDPAddToCart productData={productData[0]}/>
            </div>
            <div className="details-rating-container">
                <div className="product-rating-box">
                    {productData[0]?.userRatings?.length &&
                    <>
                        <span className="ratings-heading">Ratings</span>
                        <PDPRating productData={productData[0]}/>
                        <PDPReview productData={productData[0]}/>
                    </>
                    }
                </div>
                <div className="product-details-box">
                    <PDPDetails productData={productData[0]}/>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage
