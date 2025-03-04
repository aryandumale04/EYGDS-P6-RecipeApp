import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: "",
        time: "",
        instructions: "",
        ingredients: "",
        file: null
    });
    
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`https://food-recipe-hub.onrender.com/Recipe/${id}`);
                let res = response.data;
                setRecipeData({
                    title: res.title,
                    time: res.time,
                    instructions: res.instructions,
                    ingredients: res.ingredients.join(","),
                    file: res.coverImage
                });
            } catch (error) {
                console.error("Error fetching recipe:", error);
            }
        };
        getData();
    }, [id]);

    const onHandleChange = (e) => {
        let value =
            e.target.name === "ingredients"
                ? e.target.value.split(",") // Convert ingredients to array
                : e.target.name === "file"
                ? e.target.files[0] // Store file object
                : e.target.value;

        setRecipeData((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("instructions", recipeData.instructions);
        formData.append("ingredients", JSON.stringify(recipeData.ingredients.split(","))); // Ensure array format
        if (recipeData.file) {
            formData.append("file", recipeData.file); // Append only if a new file is selected
        }
    
        try {
            await axios.put(`https://food-recipe-hub.onrender.com/Recipe/${id}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "authorization": "bearer " + localStorage.getItem("token")
                }
            });
            navigate("/myRecipe");
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    };
    

    return (
        <>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title:</label>
                        <input type='text' className='input' name='title' onChange={onHandleChange}  
                        value={recipeData.title}/>
                    </div>
                    <div className='form-control'>
                        <label>Time:</label>
                        <input type='text' className='input' name='time' onChange={onHandleChange} 
                        value={recipeData.time}/>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients:</label>
                        <textarea type='text' className='input-textarea' name='ingredients' rows='5' onChange={onHandleChange}
                        value={recipeData.ingredients}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions:</label>
                        <textarea type='text' className='input-textarea' name='instructions' rows='5' onChange={onHandleChange}
                        value={recipeData.instructions}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image:</label>
                        <input type='file' className='input' name='file' onChange={onHandleChange} />
                    </div>
                    <button type='submit'>Edit Recipe</button>
                </form>
            </div>
        </>
    );
}
