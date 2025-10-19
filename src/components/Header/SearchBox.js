import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useFetchSuggestions } from "../Product/useFetchSuggestions";
import { useFetchAllMatchingProducts } from "../Product/useFetchAllMatchingProducts";
import { useDispatch } from "react-redux";
import { loader, setProductsList } from "../../context/ProductsSlice";

const SearchBox = React.memo(function SearchBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const {fetchSuggestionsFn, suggestionsLoading} = useFetchSuggestions();
  const {fetchAllMAtchingProductsFn} = useFetchAllMatchingProducts();
  const dispatch = useDispatch();
  const ref = useRef(null);

  useEffect(() => {
    if(searchQuery && path !== searchQuery){
      setQuery("")
    }
  }, [path])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if(query?.trim() && !isSelected){
        fetchSuggestionsFn(query, {
          onSuccess: (data) => {
            if(data.length > 0){
              setSuggestions(data);
              setShowSuggestions(true);
            }
          }
        });
      }else{
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },500)

    return () => clearTimeout(timeout);
  }, [query])

  useEffect(() => {
    const handleClick = (e) => {
      if(ref.current && !ref.current.contains(e.target)){
        setShowSuggestions(false)
      }
    }

    document.addEventListener("click", handleClick)

    return () => document.removeEventListener("click", handleClick);
  }, [])

  useEffect(() => {
    const handleFocus = (e) => {
      if(suggestions.length > 0) setShowSuggestions(true);
    }
    const el = ref.current;
    el.addEventListener("focus", handleFocus)

    return () => el.removeEventListener("focus", handleFocus);
  }, [suggestions, showSuggestions])

  function handleSearch(e){
    e.preventDefault();
    
    const filteredQuery = query?.replace(/\bt\s?shirts\b/g, 't-shirt');     
    setSearchQuery(filteredQuery)
    if(query){
      navigate(`/${query.replace(/ /g, '-')}`)
    }
    
  }

  function handleSelectSuggestion(value){
    if(value){
      setIsSelected(true);
      setQuery(value)
      setSearchQuery(value.replace(/ /g, '-'))
      dispatch(loader())
      fetchAllMAtchingProductsFn(value, {
        onSuccess: (data) => {
          dispatch(setProductsList(data))
          navigate(`/${value.replace(/ /g, '-')}`)
          setIsSelected(false);
        },
        onSettled: () => {
          setIsSelected(false);
        }
      })
    }
  }
  return (
    <form className="search" onSubmit={handleSearch}>
      <input
        type="text"
        className="search__field"
        placeholder="Search for products"
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={ref}
      />
      {/* <button className="btn search__btn" type="submit" aria-label="Search">
        <HiMagnifyingGlass/>
      </button> */}
      {showSuggestions && <ul>
        {suggestions.map((item) => <li key={item.id} onClick={() => handleSelectSuggestion(`${item.itemType} for ${item.gender}`)}>{`${item.itemType} for ${item.gender}`}</li>)}
      </ul>}
    </form>
  )
})

export default SearchBox
