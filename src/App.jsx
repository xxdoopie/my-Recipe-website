"use client"

import { useState } from "react"
import Comments from "./Components/comments.jsx"
import Navigation from "./Components/Navigation.jsx"
import Home from "./Components/home.jsx"
import Recipes from "./Components/Recipes.jsx"
import RecipeItem from "./Components/RecipeItem.jsx"
import Footer from "./Components/Footer.jsx"  
import Favourites from "./Components/Favourites.jsx"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [recipeItem, getRecipe] = useState([]);
  const [AppQuery, setQuery] = useState('')
  const [favouriteRecipeFromPage, sendToFavourites] = useState([])

  const renderPage = () => {
  
  
    switch(currentPage){
      case "home":
        return <Home />
      case "recipes":
        return <Recipes sendUpdatedPage={setCurrentPage} sendRecipe={getRecipe} query={AppQuery} getFavourites={sendToFavourites} />
      case "favourites":
          return <Favourites sendUpdatedPage={setCurrentPage} sendRecipe={getRecipe} favouriteRecipes={favouriteRecipeFromPage} />
      case "recipeItem":
        return <RecipeItem recipe={recipeItem}
        title={recipeItem.title}
        image={recipeItem.image}
        ingredientCount={recipeItem.ingredientCount}
        minutes={recipeItem.minutes}
        calories={recipeItem.calories}
        countryCuisine={recipeItem.countryCuisine} 
        category={recipeItem.category}
        ingredientsArray={recipeItem.ingredientsArray}
        servingCount={recipeItem.servingCount} 
        />
    }
    console.log(recipeItem)
  }
  return (
    <div className="w-full  overflow-x-hidden sm:overflow-x-visible flex flex-col justify-between h-[100%] bg-gray-100">
      
    
      <Navigation sendUpdatedPage={setCurrentPage} sendQueryFromNav={setQuery} />
      {renderPage()}
      <Footer />
      </div>
  )
}

export default App;
