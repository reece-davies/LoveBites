"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase.js"
import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

export default function List() {
  const [recipes, setRecipes] = useState([]);

  // Fetch Parameters data
  const searchParams = useSearchParams();
  //const dummyData = searchParams.get("dummyData");

  const currentDate = new Date().toLocaleDateString("en-GB");
  console.log("Current Date = ", currentDate);

  useEffect(() => {

    const idsParam = searchParams.get("ids");

    if(!idsParam) return;

    let selectedIds = [];
    try {
      selectedIds = JSON.parse(idsParam);
    } catch (error) {
      console.error("Failed to parse selected IDs: ", error);
      return;
    }

    console.log("SelectedId length = ", selectedIds.length);
    if (!selectedIds.length) return;

    const fetchSelectedRecipes = async () => {
      try {
        // GET recipes that match ID from URL query
        const recipesRef = collection(db, "recipes");
        const q = query(recipesRef, where(documentId(), "in", selectedIds));
        const querySnapshot = await getDocs(q);

        const recipeList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        console.log("recipeList = ", recipeList)
        setRecipes(recipeList);
      } catch (error) {
        console.log("Error fetching recipes: ", error)
      }
    };

    fetchSelectedRecipes();
  }, [searchParams]);

  return (
    // Removed styling: min-h-screen pb-18
    // border-4 border-red-500
    <div className="bg-zinc-100 min-h-screen grid grid-rows-[auto_1fr_20px] items-start justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="bg-white flex flex-col p-8 gap-8 row-start-2 items-center sm:items-start min-w-[300px] max-w-[500px]">
        <h1 className="text-xl">Shopping List - {currentDate}</h1> 

        {/* Display Params data */}
        
        {/* Recipe */}
        {recipes.map((recipe) => (
          <div key={recipe.id} className="space-y-3">
            <p className="text-gray-800">{recipe.name}</p>

            {/* Ingredient */}
            <ul className="list-disc pl-5">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={`${recipe.id}-${index}`}>{ingredient}</li>
              ))
            ) : (
              <p> No ingredients</p>
            )}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
}
