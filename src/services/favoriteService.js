import { 
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Add a recipe to favorites
export const addToFavorites = async (userId, recipe) => {
  try {
    // Generate a unique ID for the recipe if it doesn't have one
    const recipeId = recipe.uri ? recipe.uri.split('#recipe_')[1] : `${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipeId}`);
    await setDoc(favoriteRef, {
      userId,
      recipeId,
      title: recipe.title,
      image: recipe.image,
      calories: recipe.calories,
      time: recipe.time || 0,
      ingredients: recipe.ingredients || [],
      dietLabels: recipe.dietLabels || [],
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove a recipe from favorites
export const removeFromFavorites = async (userId, recipeId) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipeId}`);
    await deleteDoc(favoriteRef);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Get all favorites for a user
export const getFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push(doc.data());
    });
    
    return favorites;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

// Check if a recipe is in favorites
export const isInFavorites = async (userId, recipeId) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipeId}`);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking favorites:', error);
    throw error;
  }
}; 