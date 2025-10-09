import Spinner from "../ui/Spinner";
import CategoryCard from "./CategoryCard";
import { useCategory } from "./useCategory"
import "../Category/category.css";
import { useMemo } from "react";
import CategorySkeleton from "./CategorySkeleton";

function Category({genderType}) {
    const {categories} = useCategory();
    const filteredCategories = useMemo(() => 
                                genderType ? categories?.filter((category) => category.gender === genderType) : 
                                categories?.filter((category) => !category.gender)
                            , [genderType, categories])

    return (
        <div className="category-base-container">
            {(!filteredCategories || filteredCategories?.length <= 0) ? (
                <div className="row-compo">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CategorySkeleton key={i} />
                    ))}
                </div>
            ) : 
            <div className="row-compo">
                {filteredCategories?.map((category) => <CategoryCard key={category.id} category={category} />)}
            </div>}
        </div>
    )
}

export default Category
