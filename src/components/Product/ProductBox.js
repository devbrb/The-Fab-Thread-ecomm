import { useParams, useSearchParams } from "react-router-dom";
import Spinner from "../ui/Spinner";
import ProductCard from "./ProductCard"
import React, { useEffect, useMemo, useState } from "react";
import { useCategory } from "../Category/useCategory";
import useSEO from "../../Hooks/useSEO";
import { usePreloadImages } from "../../Hooks/usePreloadImages";
import { useSelector } from "react-redux";
import ProductSkeleton from "./ProductSkeleton";

const ProductBox = React.memo(function ProductBox() {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [searchParams] = useSearchParams();
    const {categoryName} = useParams();
    const { preloadImages } = usePreloadImages();
    const {filterSearchQuery, productsList, isProductsListLoading} = useSelector((store) => store.products);
    //Filter
    const brandParam = searchParams.get("brand")?.split("%");
    const colorParam = searchParams.get("color")?.split("%");

    const {categories} = useCategory();
    const category = useMemo(() => categories?.filter((category) => category.page === categoryName?.toLowerCase()), [categories, categoryName]);

    //SEO logic
    const seoData = useMemo(() => {
        return{
            description: category?.[0]?.description,
            title: category?.[0]?.name
        }
    }, [category]);
    useSEO(seoData);
    
    //category results
    const productData = useMemo(() => {
        const categoryFilter = productsList?.filter(item => item.categoryName === categoryName?.toLowerCase());
        let data = categoryFilter?.length > 0 ? categoryFilter : productsList;

        return data;
    }, [productsList, categoryName]);

    const paramsFilteredData = useMemo(() => {
        if(brandParam?.length > 0 && colorParam?.length > 0){
            return productsList?.filter((item) => brandParam.includes(item.brand) && colorParam.includes(item.color))
        }else if(brandParam?.length > 0){
            return productsList?.filter((item) => brandParam.includes(item.brand))
        }else if(colorParam?.length > 0){
            return productsList?.filter((item) => colorParam.includes(item.color))
        }
    }, [brandParam, colorParam, productsList])

    //search filter results
    const filteredProducts = useMemo(() => {
        let data = filterSearchQuery !== "" ?  productData?.filter((item) => {
            const queryTerms = filterSearchQuery.toLowerCase().split(" ").map(term => term.trim());

            return queryTerms.every((term) => {
                return(
                    item.gender.toLowerCase().includes(term) ||
                    item.color.toLowerCase().includes(term) ||
                    item.brand.toLowerCase().includes(term) ||
                    item.itemType.toLowerCase().includes(term) ||
                    item.categoryName.toLowerCase().split("-")[1].includes(term)
                )
            })
        }) : productData;
        return data;
    }, [filterSearchQuery, productData]);

    const filteredData = useMemo(() =>
        paramsFilteredData?.length > 0 ? 
        paramsFilteredData :
        filteredProducts?.length > 0 ? 
        filteredProducts : 
        productData?.length > 0 ? 
        productData : productsList,
        [productData, productsList, paramsFilteredData, filteredProducts]
    );

    useEffect(() => {
        if(filteredData)
            preloadImages(filteredData).then(() => setImagesLoaded(true))
    }, [filteredData, preloadImages])

    return (
        <div className="productBox">
            { (isProductsListLoading || !imagesLoaded) ? 
            <div className="items-row">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
            :
            <div className="items-row">
                {filteredData?.map((item) => <ProductCard key={item.id} item={item}/>)}
            </div>
            }
        </div>
    )
})

export default ProductBox
