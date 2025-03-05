import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputForm from "./InputForm";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setLogin] = useState(!!localStorage.getItem("token")); // ✅ Fix Initial State
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // ✅ Detect token changes & sync state properly
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setLogin(!!token);
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const checkLogin = () => {
    if (isLogin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLogin(false);
      setUser(null);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <header>
        <h2>Food Recipe Hub</h2>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li onClick={() => !isLogin && setIsOpen(true)}>
            <NavLink to={isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
          </li>
          <li onClick={() => !isLogin && setIsOpen(true)}>
            <NavLink to={isLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
          </li>
          <li onClick={checkLogin}>
            <p className="login">
              {isLogin ? "Logout" : "Login"} {user?.email ? `(${user.email})` : ""}
            </p>
          </li>
        </ul>
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
