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
  FaSortDown,
  FaHeart
} from 'react-icons/fa';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { addToFavorites, removeFromFavorites, isInFavorites } from '../services/favoriteService';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favouritesClicked, setFavouritesClicked] = useState([]);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [noResults, setNoResults] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState({});

  const { user } = useAuth();

  const [filtersState, setFiltersState] = useState({
    diet: '',
    health: '',
    cuisineType: '',
    mealType: '',
    dishType: '',
    calories: '',
    time: ''
  });

  const recipesPerPage = 15;
  const debouncedQuery = useDebounce(searchQuery, 500);
  const totalPages = Math.ceil(allRecipes.length / recipesPerPage);
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = allRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const API_KEY = `26a53b7ef49668fd232feb9c04c9561d`;
  const APP_ID = `4c5efded`;

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (filtersState.diet) params.append('diet', filtersState.diet);
    if (filtersState.health) params.append('health', filtersState.health);
    if (filtersState.cuisineType) params.append('cuisineType', filtersState.cuisineType);
    if (filtersState.mealType) params.append('mealType', filtersState.mealType);
    if (filtersState.dishType) params.append('dishType', filtersState.dishType);
    
    // Handle calories range - strip 'cal' from the value
    if (filtersState.calories) {
      const range = filtersState.calories.replace(' cal', '');
      const [min, max] = range.split('-');
      if (max === '+') {
        params.append('calories', `>${min}`);
      } else {
        params.append('calories', `${min}-${max}`);
      }
    }

    // Handle time range - strip 'min' from the value
    if (filtersState.time) {
      const range = filtersState.time.replace(' min', '');
      const [min, max] = range.split('-');
      if (max === '+') {
        params.append('time', `>${min}`);
      } else {
        params.append('time', `${min}-${max}`);
      }
    }

    return params.toString();
  };

  const handleSearch = () => {
    fetchRecipe();
  };

  const handleFavoriteClick = async (recipe) => {
    if (!user) {
      // Redirect to auth or show login prompt
      sendUpdatedPage("auth");
      return;
    }

    try {
      const recipeId = recipe.uri ? recipe.uri.split('#recipe_')[1] : `${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      // Optimistically update UI
      setFavoriteStates(prev => ({
        ...prev,
        [recipeId]: !prev[recipeId]
      }));

      if (favoriteStates[recipeId]) {
        await removeFromFavorites(user.uid, recipeId);
      } else {
        await addToFavorites(user.uid, recipe);
      }
    } catch (error) {
      // Revert UI state on error
      const recipeId = recipe.uri ? recipe.uri.split('#recipe_')[1] : `${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      setFavoriteStates(prev => ({
        ...prev,
        [recipeId]: !prev[recipeId]
      }));
      console.error('Error managing favorite:', error);
    }
  };

  const fetchRecipe = async () => {
    setLoading(true);
    setNoResults(false);
    const offset = (currentPage - 1) * recipesPerPage;
    const filters = buildQueryParams();
    
    try {
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${debouncedQuery}&app_id=${APP_ID}&app_key=${API_KEY}&from=${offset}&to=${offset + recipesPerPage}&${filters}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Edamam-Account-User': APP_ID }
        }
      );
      const data = await response.json();

      if (!data.hits || data.hits.length === 0) {
        setNoResults(true);
        setAllRecipes([]);
      } else {
        const newRecipes = data.hits.map((hit) => {
          const recipe = hit.recipe;
          return {
            uri: recipe.uri,
            title: recipe.label,
            image: recipe.image,
            time: recipe.totalTime,
            calories: recipe.calories,
            ingredients: recipe.ingredientLines,
            dietLabels: recipe.dietLabels
          };
        });
        setAllRecipes(newRecipes);
      }
      setHasError(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setHasError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (debouncedQuery) {
      fetchRecipe();
    }
  }, [debouncedQuery, currentPage]);

  useEffect(() => {
    setSearchQuery(query || '');
  }, [query]);

  // Check favorite status for all recipes
  useEffect(() => {
    const checkFavorites = async () => {
      if (!user || allRecipes.length === 0) return;

      const favoriteChecks = {};
      for (const recipe of allRecipes) {
        const recipeId = recipe.uri ? recipe.uri.split('#recipe_')[1] : `${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        try {
          const isFavorite = await isInFavorites(user.uid, recipeId);
          favoriteChecks[recipeId] = isFavorite;
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
      setFavoriteStates(favoriteChecks);
    };

    checkFavorites();
  }, [user, allRecipes]);

  const filters = [
    { key: 'time', label: 'Cooking Time', icon: <FaRegClock /> },
    { key: 'calories', label: 'Calories', icon: <FaFireAlt /> },
    { key: 'diet', label: 'Diet', icon: <FaLeaf /> },
    { key: 'health', label: 'Health', icon: <MdOutlineHealthAndSafety /> },
    { key: 'mealType', label: 'Meal', icon: <FaUtensils /> },
    { key: 'dishType', label: 'Dish', icon: <FaList /> },
    { key: 'cuisineType', label: 'Cuisine', icon: <FaGlobe /> }
  ];

  const filterOptions = {
    diet: ['balanced', 'high-protein', 'low-fat', 'low-carb'],
    health: ['alcohol-free', 'vegan', 'vegetarian', 'sugar-conscious', 'peanut-free', 'tree-nut-free', 'gluten-free'],
    cuisineType: ['American', 'Asian', 'British', 'Caribbean', 'Chinese', 'French', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Middle Eastern'],
    mealType: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Teatime'],
    dishType: ['Starter', 'Main course', 'Dessert', 'Salad', 'Soup', 'Bread', 'Sandwiches', 'Drinks'],
    calories: ['100-300 cal', '301-500 cal', '501-800 cal', '801+ cal'],
    time: ['1-15 min', '16-30 min', '31-60 min', '61+ min']
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true); // Set image loaded state to true
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
          className={`transition-all duration-300 ease-in-out overflow-y-auto px-4 lg:pt-4 pb-4 lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:h-screen`}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                    <select
                      className="w-full p-2 bg-white border border-gray-300 rounded"
                      value={filtersState[key]}
                      onChange={(e) => setFiltersState({ ...filtersState, [key]: e.target.value })}
                    >
                      <option value="">--Select--</option>
                      {filterOptions[key]?.map((option) => (
                        <option key={option} value={option.toLowerCase()}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
              onClick={() => {
                setFiltersState({
                  diet: '',
                  health: '',
                  cuisineType: '',
                  mealType: '',
                  dishType: '',
                  calories: '',
                  time: ''
                });
                fetchRecipe();
              }}
            >
              Clear
            </button>
            <button 
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600" 
              onClick={handleSearch}
            >
              Apply
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative px-5 py-6 overflow-y-auto lg:h-screen">
        {loading && <div className="loader fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100"></div>}
        <h1 className="text-2xl font-bold mb-6">
          {debouncedQuery ? `Results for "${debouncedQuery}"` : "All Recipes"}
        </h1>
        
        {hasError ? (
          <div className="text-xl flex flex-col items-center">
            <img src="/assets/983823.png" alt="" className="w-1/2 h-1/2 mx-auto my-10 sm:w-[300px]" />
            <p className="text-red-500 font-semibold">Oops! Something went wrong while fetching recipes.</p>
            <p className="text-gray-600 mt-2">Please try again later or check your internet connection.</p>
          </div>
        ) : noResults ? (
          <div className="text-xl flex flex-col items-center">
            <img src="/assets/983823.png" alt="" className="w-1/2 h-1/2 mx-auto my-10 sm:w-[300px]" />
            <p className="text-gray-800 font-semibold">No recipes found for "{debouncedQuery}"</p>
            <p className="text-gray-600 mt-2">Try:</p>
            <ul className="text-gray-600 mt-1 text-center">
              <li>• Using different keywords</li>
              <li>• Checking for typos</li>
              <li>• Using more general terms</li>
              <li>• Removing some filters</li>
            </ul>
          </div>
        ) : (
          <div className="recipeContainers flex flex-wrap justify-start gap-6">
            {currentRecipes.map((recipe, index) => {
              const recipeId = recipe.uri ? recipe.uri.split('#recipe_')[1] : `${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
              return (
                <div
                  key={index}
                  className={`recipeCard ${
                    loading ? 'blur-[2px]' : 'blur-none'
                  } flex flex-col gap-2 w-full sm:w-[45%] md:w-[30%] lg:w-[270px] bg-white p-5 rounded-2xl shadow hover:bg-gray-100 transition-all`}
                >
                  <div className={`relative ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                    <img
                      src={recipe.image}
                      alt="Recipe"
                      loading="lazy"
                      className="bg-cover w-full h-auto rounded-2xl pb-3"
                      onLoad={handleImageLoad}
                      onClick={() => {
                        sendRecipe(recipe);
                        sendUpdatedPage('recipeItem');
                      }}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-2xl"></div>
                    )}
                  </div>
                  <h3
                    className="pb-3 font-semibold"
                    onClick={() => {
                      sendRecipe(recipe);
                      sendUpdatedPage('recipeItem');
                    }}
                  >
                    {recipe.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex gap-2 items-center">
                      <FaRegClock />
                      <span>{Math.round(recipe.time)} min</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaFireAlt />
                      <span>{Math.round(recipe.calories)} cal</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteClick(recipe);
                      }}
                      className="cursor-pointer"
                    >
                      <FaHeart 
                        className={`w-5 h-5 ${
                          favoriteStates[recipeId] ? 'text-red-500' : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls - Only show if we have results */}
        {!noResults && !hasError && allRecipes.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => setCurrentPage(pageIndex + 1)}
                className={`px-4 py-2 rounded-full shadow ${
                  currentPage === pageIndex + 1 ? 'bg-red-500 text-white' : 'bg-[#f5f5f5] text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pageIndex + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Recipes;
