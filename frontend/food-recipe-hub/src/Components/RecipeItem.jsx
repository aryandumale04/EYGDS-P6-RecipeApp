import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { FaStopwatch } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import axios from 'axios';

export default function RecipeItem() {
  const allRecipes = useLoaderData() || []; // Ensure it's always an array
  let path = window.location.pathname === "/myRecipe";
  const [allRecipees, setAllRecipe] = useState([]);
  let favItem=JSON.parse(localStorage.getItem("fav")) ?? []
  const [isFavRecipe,setFav]=useState(false);
  useEffect(() => {
    setAllRecipe(allRecipes);
  }, [allRecipes]);

  const onDelete = async (id) => {
    try {
      // Use the deployed backend URL for the API call
      await axios.delete(`https://food-recipe-hub.onrender.com/recipe/${id}`);
  
      // Update state instantly without refreshing the page
      setAllRecipe((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== id));
  
      // Update the favItem in localStorage
      let filterItems = favItem.filter(allRecipes => allRecipes._id !== id);
      localStorage.setItem("fav", JSON.stringify(filterItems));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  

  const favRecipe=(item)=>{
    let filterItems=favItem.filter(allRecipes=>allRecipes._id!==item._id)
    favItem=favItem.filter(allRecipes=>allRecipes._id===item._id).length===0 ?[...favItem,item] : filterItems
    localStorage.setItem("fav",JSON.stringify(favItem))
    setFav(pre=>!pre);

  }

  return (
    <>
      <div className='card-container'>
        {allRecipees.length > 0 ? (
          allRecipees.map((item, index) => (
            <div key={index} className='card'>
              <img src={item.coverImage} alt="food image" width="120px" height="100px" />
              <div className='card-body'>
                <div className='title'>{item.title}</div>
                <div className='icons'>
                  <div className='timer'>
                    <FaStopwatch /> {item.time}
                  </div>
                  {!path ? <FaHeart 
                   onClick={()=>favRecipe(item)} style={{color:(favItem.some(res=>res._id===item._id))? "red" : ""}} /> :
                  <div className='action'>
                    <Link to={`/editRecipe/${item._id}`} className="editIcon"><MdEdit /></Link>
                    <AiFillDelete className='deleteIcon' onClick={() => onDelete(item._id)} />
                  </div>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
    </>
  );
}
