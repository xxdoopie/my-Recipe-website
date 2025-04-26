import React, { useState, useEffect } from 'react';
import {
  FaFilter,
  FaRegClock,
  FaUtensils,
  FaAppleAlt,
  FaFireAlt,
  FaList,
  FaGlobe,
  FaLeaf,
  FaSortDown
} from 'react-icons/fa';
import { MdOutlineHealthAndSafety } from 'react-icons/md';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function Recipes({ sendUpdatedPage, sendRecipe, query, getFavourites }) {

  const [allRecipes, setAllRecipes] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false); // Track image loading state for debounce
  const [hasError, setHasError] = useState(false); // default: no error
  const recipesPerPage = 15;
  // Debounced query to reduce excessive fetch calls
  const debouncedQuery = useDebounce(query, 500); // 500ms debounce
  
  

  const totalPages = Math.ceil(allRecipes.length / recipesPerPage);
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = allRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const [loading, setLoading] = useState(false)
  const [favouritesClicked, setFavouritesClicked] = useState([])
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const filters = [
    { key: 'cookingTime', label: 'Cooking Time', icon: <FaRegClock /> },
    { key: 'ingredients', label: 'Ingredients', icon: <FaAppleAlt /> },
    { key: 'calories', label: 'Calories', icon: <FaFireAlt /> },
    { key: 'diet', label: 'Diet', icon: <FaLeaf /> },
    { key: 'health', label: 'Health', icon: <MdOutlineHealthAndSafety /> },
    { key: 'meal', label: 'Meal', icon: <FaUtensils /> },
    { key: 'dish', label: 'Dish', icon: <FaList /> },
    { key: 'cuisine', label: 'Cuisine', icon: <FaGlobe /> },
  ];

  const API_KEY = `26a53b7ef49668fd232feb9c04c9561d`;
  const APP_ID = `4c5efded`;

  // Fetching recipe data with pagination
  
  const getLoader = () =>{
    if(loading){
      return(<div className={`loader fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100`}></div>)
    }
    else{
      return(<div className={`loader hidden`}></div>)
    }
  }
  useEffect(() => {
    
    const fetchRecipe = async () => {
      //add to local storage for faster access
      const cachedRecipes = localStorage.getItem(debouncedQuery);
      if (cachedRecipes) {
        setAllRecipes(JSON.parse(cachedRecipes));
        return;
      }
      setLoading(true)
      const offset = (currentPage - 1) * recipesPerPage;
      try {
        const response = await fetch(
          `https://api.edamam.com/api/recipes/v2?type=public&q=${debouncedQuery}&app_id=${APP_ID}&app_key=${API_KEY}&from=${offset}&to=${offset + recipesPerPage}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Edamam-Account-User': '4c5efded' }
          }
        );
        const data = await response.json();
  
        const newRecipes = data.hits.map((hit) => {
          const recipe = hit.recipe;
          return { title: recipe.label, image: recipe.image, time: recipe.totalTime, calories: recipe.calories, ingredients: recipe.ingredientLines, dietLabels: recipe.dietLabels };
        });
  
        setAllRecipes(newRecipes);
        localStorage.setItem(debouncedQuery, JSON.stringify(newRecipes)); // Cache the results
        setHasError(false); // Reset error state
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setHasError(true); // Set error state to true
      }
      setLoading(false)
    };

    if (debouncedQuery) {
      fetchRecipe(); // Fetch recipes when query changes
    }

  }, [debouncedQuery, currentPage]); // Fetch when query or page changes

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true); // Set image loaded state to true
  };
  const pushFavourite = (recipe) => {
    const isAlreadyFavourite = favouritesClicked.some((r) => r.title === recipe.title);
    if (isAlreadyFavourite) {
      setFavouritesClicked((prev) => prev.filter((r) => r.title !== recipe.title));
    } else {
      setFavouritesClicked((prev) => [...prev, recipe]);
      getFavourites((prevFavourites) => [...prevFavourites, recipe]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden sticky">
      {/* Sidebar */}
      <aside className="w-full lg:w-[300px] bg-[#ebebeb] text-gray-800 shadow-lg z-10 lg:h-screen lg:overflow-y-auto">
        {/* Mobile filter toggle */}
        <div
          className="lg:hidden flex justify-between items-center p-4 bg-[#ebebeb] cursor-pointer shadow"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FaFilter /> Filters
          </div>
          <FaSortDown className={`text-2xl transform transition-transform ${mobileFilterOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Filter content */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-y-auto px-4 lg:pt-4 pb-4 lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:h-screen`}
        >
          <div className="hidden lg:flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <FaFilter /> Filters
            </div>
            <FaSortDown />
          </div>

          <input
            type="text"
            placeholder="Search"
            className="bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none w-full mb-4"
          />

          <div className="flex flex-col gap-2">
            {filters.map(({ key, label, icon }) => (
              <div key={key}>
                <button
                  onClick={() => toggleMenu(key)}
                  className="flex justify-between items-center w-full bg-white border border-gray-300 p-3 rounded hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{label}</span>
                  </div>
                  <span>{openMenus[key] ? '▾' : '▸'}</span>
                </button>
                {openMenus[key] && (
                  <div className="bg-gray-100 mt-1 rounded p-2 text-sm text-gray-600">
                    Example content...
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300">Clear</button>
            <button className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600">Apply</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative px-5 py-6  overflow-y-auto lg:h-screen">
      {getLoader()}
        <h1 className="text-2xl font-bold mb-6">All Recipes of {debouncedQuery + "....."}</h1>
          {!hasError ? (
               <div className="recipeContainers flex flex-wrap justify-start gap-6">
               {currentRecipes.map((recipe, index) => (
                 <div
                   key={index}
                   className={`recipeCard ${loading ? 'blur-[2px]': 'blur-none'}  flex flex-col gap-2 w-full sm:w-[45%] md:w-[30%] lg:w-[270px] bg-white p-5 rounded-2xl shadow hover:bg-gray-100 transition-all`}
                  
                 >
                   {/* Image */}
                   <div className={`relative ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                     <img
                       src={recipe.image}
                       alt="Recipe"
                       loading="lazy"
                       className="bg-cover w-full h-auto rounded-2xl pb-3"
                       onLoad={handleImageLoad} // Trigger the image load event
                       onClick={() => {
                        sendRecipe(recipe);
                        sendUpdatedPage('recipeItem');
                      }}
                     />
                     {!imageLoaded && (
                       <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-2xl"></div> // Placeholder shimmer effect
                     )}
                   </div>
                   <h3 className="pb-3 font-semibold"
                    onClick={() => {
                      sendRecipe(recipe);
                      sendUpdatedPage('recipeItem');
                    }}
                   >{recipe.title}</h3>
                   <div className="flex justify-between items-center text-sm">
                     <div className="flex gap-2 items-center">
                       <FaRegClock />
                       <span>{Math.round((recipe.time / 60))} minutes</span>
                     </div>
                     <img
                      src={
                        favouritesClicked.some((r) => r.title === recipe.title)
                          ? '/assets/commentHeartFilled.svg'
                          : '/assets/commentHeart.svg'
                      }
                      alt="Heart"
                      onClick={() => pushFavourite(recipe)}
                      className="cursor-pointer"
                    />

                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div className='text-xl flex flex-col items-center'>
              <img src="/assets/983823.png" alt="" 
              className='w-1/2 h-1/2 mx-auto my-10 sm:w-[300px]'
              />
              Sorry there are no current recipies for the given query...</div>
          )}

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentPage(pageIndex + 1)}
              className={`px-4 py-2 rounded-full shadow ${currentPage === pageIndex + 1 ? 'bg-red-500 text-white' : 'bg-[#f5f5f5] text-gray-700 hover:bg-gray-200'}`}
            >
              {pageIndex + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Recipes;
