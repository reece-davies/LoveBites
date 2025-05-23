"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase.js"
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([])

  const handleCheckboxChange = (recipeId) => {
    setSelectedRecipes((prevSelected) => 
      prevSelected.includes(recipeId)
      ? prevSelected.filter((id) => id !== recipeId)
      : [...prevSelected, recipeId]
    );
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Process firestore data
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipeList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setRecipes(recipeList);
      } catch (error) {
        console.log("ERROR = ", error)
      }
    };

    fetchRecipes();
  }, []);

  return (
    // Removed styling: min-h-screen pb-18
    // border-4 border-red-500
    <div className="bg-zinc-100 min-h-screen grid grid-rows-[auto_1fr_20px] items-start justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="bg-white flex flex-col p-8 gap-4 row-start-2 items-stretch sm:items-start w-full min-w-[300px] max-w-[500px]">
        <p className="m-0 text-black"><span className="font-bold">LoveBites </span>- made using</p>
        <Image
          className="mb-6"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/*
        {recipes.map((recipe) => (
          <p key={recipe.id}>RECIPE = {recipe.name}</p>
        ))} */}
        
        
        {/*
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="w-5 h-5 accent-green-600" />
          <span className="text-gray-800">Placeholder</span>
        </label> */}
        
        {/* Recipe */}
        {recipes.map((recipe) => (
          <div key={recipe.id} className="space-y-3">
            <label className="flex items-center space-x-3 w-full">
              <input
                type="checkbox"
                className="w-5 h-5 accent-green-600" 
                checked={selectedRecipes.includes(recipe.id)}
                onChange={() => handleCheckboxChange(recipe.id)}
                />
              <span className="text-gray-800">{recipe.name}</span>
            </label>

            {/* Ingredient */}
            {/* 
            <ul>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={`${recipe.id}-${index}`}>{ingredient}</li>
              ))
            ) : (
              <p> No ingredients</p>
            )}
            </ul>
            */}
          </div>
        ))}

        <div className="flex gap-4 content-center items-center flex-col sm:flex-row justify-center w-full">
          <Link
            className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href={{
              pathname: "/list",
              query: { ids: JSON.stringify(selectedRecipes) },
              }}
          >
            Generate Shopping List
          </Link>
        </div>
      </main>
    </div>
  );
}
