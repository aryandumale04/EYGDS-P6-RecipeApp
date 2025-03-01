import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'

import { FaStopwatch } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";

export default function RecipeItem() {
  const allRecipes = useLoaderData() || []; // Ensure it's an array even if undefined
  let path=window.location.pathname==="/myRecipe" ? true:false; 

  // console.log(allRecipes)
  console.log("Fetched Recipes:", allRecipes.map(recipe => recipe.coverImage));

  return (
    <>
      <div className='card-container'>
        {allRecipes && allRecipes.length > 0 ? (
          allRecipes.map((item, index) => (
            <div key={index} className='card'>
              <img src={item.coverImage} alt="food image" width="120px" height="100px" />
              <div className='card-body'>
                <div className='title'>{item.title}</div>
                <div className='icons'>
                  <div className='timer'>
                    <FaStopwatch /> {item.time} {/* Display the time required */}
                  </div>
                  {(!path) ? <FaHeart /> :
                  <div className='action'>
                    <Link to={`/editRecipe/${item._id}`} className="editIcon"><MdEdit /></Link>
                    <AiFillDelete  className='deleteIcon'/>
                    </div>}
                  
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found</p> // Show this when data is missing
        )}
      </div>
    </>
  );
}