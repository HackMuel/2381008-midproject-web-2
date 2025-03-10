import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchData, createData, updateData, deleteData } from "../services/apiService";

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newName, setNewName] = useState("");
  const [newIngredients, setNewIngredients] = useState("");

  useEffect(() => {
    fetchData<{ recipes: Recipe[] }>("recipes").then((data) => setRecipes(data.recipes));
  }, []);

  const addRecipe = async () => {
    if (!newName.trim() || !newIngredients.trim()) return;

    const tempId = Date.now(); 
    const newRecipeItem: Recipe = { id: tempId, name: newName, ingredients: newIngredients };

    setRecipes((prev) => [newRecipeItem, ...prev]);
    setNewName("");
    setNewIngredients("");

    try {
      const recipeFromAPI = await createData<Recipe>("recipes/add", { name: newName, ingredients: newIngredients });
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === tempId ? { ...recipe, id: recipeFromAPI.id } : recipe))
      );
    } catch (error) {
      console.error("Gagal menambahkan recipe ke API:", error);
    }
  };

  const updateRecipe = async (id: number, name: string, ingredients: string) => {
    const updatedName = prompt("Edit name:", name);
    const updatedIngredients = prompt("Edit ingredients:", ingredients);
    if (!updatedName || !updatedIngredients) return;

    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === id ? { ...recipe, name: updatedName, ingredients: updatedIngredients } : recipe))
    );

    if (id >= 10 ** 12) return;

    try {
      await updateData<Recipe>("recipes/", id, { name: updatedName, ingredients: updatedIngredients });
    } catch (error) {
      console.error("Gagal mengupdate recipe:", error);
    }
  };

  const removeRecipe = async (id: number) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    if (id >= 10 ** 12) return;

    try {
      await deleteData(`recipes/`, id);
    } catch (error) {
      console.error("Gagal menghapus recipe:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-900 p-6 pt-24">
      <motion.h2
        className="text-4xl md:text-6xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Recipes
      </motion.h2>

      <div className="max-w-xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter recipe name"
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-2"
          />
          <textarea
            value={newIngredients}
            onChange={(e) => setNewIngredients(e.target.value)}
            placeholder="Enter ingredients"
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-2"
          />
          <motion.button
            onClick={addRecipe}
            className="w-full bg-blue-500 text-white py-2 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Recipe
          </motion.button>
        </motion.div>

        <div className="overflow-y-auto max-h-[60vh] w-full">
          <AnimatePresence>
            {recipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                className="flex flex-col bg-gray-700 text-white p-3 rounded shadow mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg">{recipe.name}</h3>
                <p className="text-gray-300">{recipe.ingredients}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <motion.button
                    onClick={() => updateRecipe(recipe.id, recipe.name, recipe.ingredients)}
                    className="text-yellow-400"
                    whileHover={{ scale: 1.2 }}
                  >
                    ✎
                  </motion.button>
                  <motion.button
                    onClick={() => removeRecipe(recipe.id)}
                    className="text-red-400"
                    whileHover={{ scale: 1.2 }}
                  >
                    ✖
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Recipes;