import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Main from './Components/Main';
import axios from 'axios';
import AddFoodRecipe from './pages/AddFoodRecipe';
import Edit from './pages/Edit';


const getAllRecipes = async () => {
  try {
    const response = await axios.get("http://localhost:5000/recipe");
    return response.data; // ✅ Return data directly
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Response("Failed to load recipes", { status: 500 }); // ✅ Throw error properly
  }
};
const getMyRecipes = async () => {
  let user=JSON.parse(localStorage.getItem("user"));
  let allRecipes=await getAllRecipes();
  return allRecipes.filter(item=>item.createdBy===user._id);
}

const getFavRecipes=()=>{
  return JSON.parse(localStorage.getItem("fav"))

}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />, // ✅ Main should be the layout component
    children: [
      {
        index: true,  // ✅ Use `index: true` instead of `path: "/"` inside children
        element: <Home />,loader:getAllRecipes
      },
      {
        path: "/myRecipe",element:<Home/>,loader:getMyRecipes
      },
      {
        path:"/favRecipe",element:<Home/>,loader:getFavRecipes
      },
      {
        path:"/addRecipe",element:<AddFoodRecipe/>
      },
      {
        path:"/editRecipe/:id",element:<Edit/>
      }

    ]
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} /> // ✅ RouterProvider should not have children
  );
}
