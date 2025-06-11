import React from 'react';
import { FaClock, FaFire, FaUtensils } from 'react-icons/fa';
import Comments from './comments.jsx';  

function RecipeItem({ recipe, sendUpdatedPage, sendQueryFromNav }) {
    const handleSearch = (searchTerm) => {
      sendQueryFromNav(searchTerm);
      sendUpdatedPage("recipes");
    };

    const suggestedItems = [
      {
        title: "Mediterranean Salad",
        image: "/assets/salad.png",
        description: "Fresh & healthy",
        rating: 4.8,
        star: "/assets/Star Filled.png",
      },
      {
        title: "Quinoa Bowl",
        image: "/assets/salad.png",
        description: "Protein-rich",
        rating: 4.7,
        star: "/assets/Star Filled.png",
      },
      {
        title: "Greek Salad",
        image: "/assets/salad.png",
        description: "Classic Mediterranean",
        rating: 4.9,
        star: "/assets/Star Filled.png",
      },
      {
        title: "Buddha Bowl",
        image: "/assets/salad.png",
        description: "Nutrient-packed",
        rating: 4.6,
        star: "/assets/Star Filled.png",
      },
      {
        title: "Chicken Caesar",
        image: "/assets/salad.png",
        description: "Restaurant favorite",
        rating: 4.5,
        star: "/assets/Star Filled.png",
      },
      {
        title: "Cobb Salad",
        image: "/assets/salad.png",
        description: "Protein-packed",
        rating: 4.7,
        star: "/assets/Star Filled.png",
      },
      {
        title: "Tuna Niçoise",
        image: "/assets/salad.png",
        description: "French classic",
        rating: 4.8,
        star: "/assets/Star Filled.png",
      }
    ];

  return (
    <div className='RecipeItemMain flex flex-col gap-10 items-center mx-8 xl:mx-auto'>
      <div className="RecipeItemContent flex flex-col md:flex-row justify-center items-start gap-8 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Image Section */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full md:w-1/2 rounded-xl shadow-md object-cover"
        />

        {/* Content Section */}
        <div className="flex flex-col gap-6 md:w-1/2">
          {/* Title and Author */}
          <div>
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            <h4 className="text-md text-gray-500">by BBC Good Food</h4>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center gap-6 text-center">
            <div className="flex flex-col items-center">
              <FaUtensils className="text-amber-600 text-2xl" />
              <h2 className="text-xl font-semibold">{recipe.ingredients.length}</h2>
              <p className="text-sm text-gray-600">Ingredients</p>
            </div>

            <div className="h-16 border-l border-gray-300" />

            <div className="flex flex-col items-center">
              <FaClock className="text-amber-600 text-2xl" />
              <h2 className="text-xl font-semibold">{recipe.time}</h2>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>

            <div className="h-16 border-l border-gray-300" />

            <div className="flex flex-col items-center">
              <FaFire className="text-amber-600 text-2xl" />
              <h2 className="text-xl font-semibold">{Math.round(recipe.calories)}</h2>
              <p className="text-sm text-gray-600">Calories</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.dietLabels.map((tag) => (
              <span
                key={tag}
                onClick={() => handleSearch(tag)}
                className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-amber-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Ingredient List */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="reccomendedRecipes w-full max-w-6xl">
        <div className="suggestionSection flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="suggestionTitle">
              <h2 className="text-2xl font-bold">Recommended Recipes</h2>
              <h3 className="text-mainTheme">you might also like</h3>
            </div>
            <h4 
              className="text-gray-500 text-sm cursor-pointer hover:text-mainTheme transition-colors"
              onClick={() => handleSearch("healthy recipes")}
            >
              See all
            </h4>
          </div>

          {/* Cards */}
          <div className="suggestionItems flex flex-wrap gap-4 justify-between md:justify-center">
            {suggestedItems.slice(0, 8).map((item, index) => (
              <div
                key={index}
                className={`
                  suggestionCard cursor-pointer relative w-[47%] h-[250px] pt-[80px]
                  sm:w-[30%]
                  md:w-[190px]
                  ${index >= 2 ? "max-[450px]:hidden" : ""}
                  ${index >= 3 ? "max-[1600px]:hidden" : ""}
                  transform transition-transform hover:scale-105
                `}
                onClick={() => handleSearch(item.title)}
              >
                <div className="absolute top-[-30px] left-1/2 transform w-[270px] h-[250px] -translate-x-1/2 z-10">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.title} 
                    className="object-cover cursor-pointer" 
                  />
                </div>

                <div className="bg-white rounded-t-[50px] rounded-b-[30px] h-full shadow-lg flex flex-col p-4 pt-23 hover:shadow-xl transition-shadow">
                  <h3 className="font-medium text-lg text-center">{item.title}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-gray-500 text-[13px]">{item.description}</p>
                    <div className="rating bg-mainTheme flex items-center px-2 py-0.5 rounded-full text-xs">
                      <img src={item.star || "/placeholder.svg"} alt="Star" className="w-3 h-3 mr-1" />
                      <span className="font-semibold">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Comments />
    </div>
  );
}

export default RecipeItem;
