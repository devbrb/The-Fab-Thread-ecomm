import { Link } from "react-router-dom"
import useInView from "../../Hooks/useInView"

function CategoryCard({category}) {
    const [ref, hasBeenInView] = useInView({threshold: 0.2});
    return (
        <div className={
            `column-compo 
            ${hasBeenInView ? "visible" : ""}`
            } 
            ref={ref} 
            data-testid="category-card">
            <Link className="categroy-url" to={`/category/${category.page}`}>
                <img src={category.image} alt={category.name} loading="lazy"/>
                <span className="category-base">{category.name}</span>
                <span className="discount-text">{category.discount}</span>
            </Link>
        </div>
    )
}

export default CategoryCard
