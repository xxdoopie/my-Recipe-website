"use client"

import { useState } from "react"
import Comments from "./Components/comments.jsx"
import Navigation from "./Components/Navigation.jsx"
import Home from "./Components/home.jsx"
import Recipes from "./Components/Recipes.jsx"
import RecipeItem from "./Components/RecipeItem.jsx"
import Footer from "./Components/Footer.jsx"  
import Favourites from "./Components/Favourites.jsx"
import Auth from "./Components/Auth.jsx"
import { AuthProvider, useAuth } from "./context/AuthContext"
import "./App.css"

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [recipeItem, getRecipe] = useState([]);
  const [favouriteRecipeFromPage, sendToFavourites] = useState([]);
  const [AppQuery, setQuery] = useState('');
  const [AppFilters, setFilters] = useState({});
  
  const { user } = useAuth();

  const renderPage = () => {
    // If user is not logged in and trying to access protected routes
    if (!user && (currentPage === "favourites")) {
      return <Auth />;
    }

    switch(currentPage) {
      case "home":
        return <Home sendQueryFromNav={setQuery} sendUpdatedPage={setCurrentPage} />;
      case "recipes":
        return (
          <Recipes
            sendUpdatedPage={setCurrentPage}
            sendRecipe={getRecipe}
            query={AppQuery}
            filters={AppFilters}
            sendFiltersFromAside={setFilters}
            getFavourites={sendToFavourites}
            user={user}
          />
        );
      case "favourites":
        return (
          <Favourites 
            sendUpdatedPage={setCurrentPage} 
            sendRecipe={getRecipe} 
            favouriteRecipes={favouriteRecipeFromPage}
            user={user}
          />
        );
      case "recipeItem":
        return (
          <RecipeItem 
            recipe={recipeItem}
            title={recipeItem.title}
            image={recipeItem.image}
            ingredientCount={recipeItem.ingredientCount}
            minutes={recipeItem.minutes}
            calories={recipeItem.calories}
            countryCuisine={recipeItem.countryCuisine} 
            category={recipeItem.category}
            ingredientsArray={recipeItem.ingredientsArray}
            servingCount={recipeItem.servingCount}
            sendUpdatedPage={setCurrentPage}
            sendQueryFromNav={setQuery}
            user={user}
          />
        );
      case "auth":
        return <Auth />;
      default:
        return <Home sendQueryFromNav={setQuery} sendUpdatedPage={setCurrentPage} />;
    }
  };

  return (
    <div className="w-full overflow-x-hidden sm:overflow-x-visible flex flex-col justify-between h-[100%] bg-gray-100">
      <Navigation 
        sendUpdatedPage={setCurrentPage} 
        sendQueryFromNav={setQuery}
        user={user}
      />
      {renderPage()}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
