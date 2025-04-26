import React from 'react';

function Favourites({sendUpdatedPage, sendRecipe, favouriteRecipes}) {

  return (
    <div className="px-4 md:px-12 py-10">
      <h1 className="text-3xl font-bold text-mainTheme mb-6">Your Favourites</h1>

      {favouriteRecipes.length === 0 ? (
        <p className="text-gray-600">You haven't added any recipes to your favourites yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favouriteRecipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg cursor-pointer transition-all"
              onClick={() => {
                sendRecipe(recipe);
                sendUpdatedPage("recipeItem");
            }}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-mainTheme mb-2">
                  {recipe.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourites;
