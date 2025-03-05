import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foodimage from '../assets/foodRecipe.png';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import RecipeItem from '../Components/RecipeItem';
import Modal from '../Components/Modal';
import InputForm from '../Components/InputForm';

export default function Home() {
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ✅ Listen for changes in localStorage
    useEffect(() => {
        const checkAuth = () => {
            let token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        };
    
        checkAuth(); // ✅ Check on page load
    
        window.addEventListener("storage", checkAuth); // ✅ Listen for token updates
    
        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);
    

    const addRecipe = () => {
        if (isAuthenticated) {
            navigate("/addRecipe");
        } else {
            setOpen(true);
        }
    };

    return (
        <>
            <Navbar />
            
            <section className='home'>
                <div className='left'>
                    <h1>Food Recipe Hub</h1>
                    <h5>
                        Welcome to Food Recipe Hub, your go-to destination for discovering and sharing delicious recipes! 
                        Whether you're a home cook or a seasoned chef, our platform lets you explore a variety of mouthwatering dishes, 
                        save your favorite recipes, and even contribute your own creations. From quick and easy meals to gourmet delicacies, 
                        you'll find step-by-step instructions and ingredient lists to make cooking fun and hassle-free. 
                        Start your culinary journey today and bring flavors to life with Food Recipe Hub!
                    </h5>
                    <button onClick={addRecipe}>Share your recipe</button>
                </div>
                <div className='right'>
                    <img src={foodimage} width="320px" height="300px" alt="Food Recipe" />
                </div>
            </section>

            <div className='bg'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#E91E63" fillOpacity="1" d="M0,32L21.8,26.7C43.6,21,87,11,131,48C174.5,85,218,171,262,181.3C305.5,192,349,128,393,122.7C436.4,117,480,171,524,208C567.3,245,611,267,655,272C698.2,277,742,267,785,245.3C829.1,224,873,192,916,160C960,128,1004,96,1047,106.7C1090.9,117,1135,171,1178,170.7C1221.8,171,1265,117,1309,90.7C1352.7,64,1396,64,1418,64L1440,64L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"></path>
                </svg>
            </div>

            {isOpen && (
                <Modal onClose={() => setOpen(false)}>
                    <InputForm setIsOpen={setOpen} setIsAuthenticated={setIsAuthenticated} />
                </Modal>
            )}

            <div>
                <div className='recipe'>
                    <RecipeItem />
                </div>
            </div>

            <Footer />
        </>
    );
}
