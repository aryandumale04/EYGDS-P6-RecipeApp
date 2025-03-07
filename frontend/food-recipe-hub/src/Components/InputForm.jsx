import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InputForm({ setIsOpen, setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [isSignUp, setSignUp] = useState(false);
    const [error, setError] = useState(""); // Fixed the typo in useState
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let endpoint = isSignUp ? "signUp" : "login";

        try {
            const res = await axios.post(`https://food-recipe-hub.onrender.com/${endpoint}`, { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (typeof setIsAuthenticated === "function") {
                setIsAuthenticated(true);
            } else {
                console.error("setIsAuthenticated is undefined");
            }

            setIsOpen(false);
            navigate("/");
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form-control'>
                    <label>Email:</label>
                    <input type='email' className='input' required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='form-control'>
                    <label>Password:</label>
                    <input type='password' className='input' required onChange={(e) => setPass(e.target.value)} />
                </div>
                <button type='submit'>{isSignUp ? "Sign Up" : "Login"}</button> <br />
                {error && <h6 className='error'>{error}</h6>}
                <p className="dont-have-account" onClick={() => setSignUp(prev => !prev)}>
                    {isSignUp ? "Already have an Account?" : "Don't have an Account?"}
                </p>
            </form>
        </>
    );
}
