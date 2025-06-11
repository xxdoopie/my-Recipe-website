import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavorites, removeFromFavorites } from '../services/favoriteService';
import { FaHeart, FaClock, FaUtensils } from 'react-icons/fa';

function Favourites({ sendUpdatedPage, sendRecipe, user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      loadFavorites();
    }
  }, [authUser]);

  const loadFavorites = async () => {
    if (!authUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userFavorites = await getFavorites(authUser.uid);
      if (userFavorites && Array.isArray(userFavorites)) {
        setFavorites(userFavorites);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites. Please try again later.');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (recipeId) => {
    if (!authUser) return;

    try {
      await removeFromFavorites(authUser.uid, recipeId);
      setFavorites(favorites.filter(recipe => recipe.recipeId !== recipeId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove from favorites. Please try again later.');
    }
  };

  const handleRecipeClick = (recipe) => {
    sendRecipe(recipe);
    sendUpdatedPage("recipeItem");
  };

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
        <p className="text-gray-600 text-center mb-6">
          You need to be logged in to view and manage your favorite recipes.
        </p>
        <button
          onClick={() => sendUpdatedPage("auth")}
          className="bg-mainTheme text-white px-6 py-2 rounded-md hover:bg-mainTheme-dark transition-colors"
        >
          Login Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainTheme"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-red-600 text-center">{error}</p>
        <button
          onClick={loadFavorites}
          className="mt-4 bg-mainTheme text-white px-6 py-2 rounded-md hover:bg-mainTheme-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Favorites Yet</h2>
        <p className="text-gray-600 text-center mb-6">
          Start exploring recipes and add them to your favorites!
        </p>
        <button
          onClick={() => sendUpdatedPage("recipes")}
          className="bg-mainTheme text-white px-6 py-2 rounded-md hover:bg-mainTheme-dark transition-colors"
        >
          Explore Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Favorite Recipes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((recipe) => (
          <div
            key={recipe.recipeId}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => handleRecipeClick(recipe)}
              />
              <button
                onClick={() => handleRemoveFromFavorites(recipe.recipeId)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <FaHeart className="text-red-500 w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <h3
                className="text-xl font-semibold mb-2 cursor-pointer hover:text-mainTheme"
                onClick={() => handleRecipeClick(recipe)}
              >
                {recipe.title}
              </h3>

              <div className="flex items-center justify-between text-gray-600 mb-4">
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{recipe.time} min</span>
                </div>
                <div className="flex items-center">
                  <FaUtensils className="mr-1" />
                  <span>{recipe.ingredients.length} ingredients</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {recipe.dietLabels.map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-mainTheme/10 text-mainTheme rounded-full text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favourites;
