Food Recipe Hub 🍽️ : A MERN stack-based recipe-sharing platform where users can add, view, and explore different food recipes with images.

🚀 Features :
- Add Recipes with title, ingredients, preparation time, and instructions.
- Upload Recipe Images to enhance the user experience.
- Browse & Discover a variety of recipes shared by users.
- User Authentication (Login & Register) for managing personal recipes.
- MERN Stack Backend with MongoDB Atlas, Express.js, React.js, and Node.js.




🛠️ Technologies Used
Frontend: React.js, React Router, Axios
Backend: Node.js, Express.js, MongoDB Atlas
Database: MongoDB (using Mongoose)
Deployment: Vercel (Frontend) & Render (Backend)
Authentication: JWT (JSON Web Tokens)
Image Storage: Stored in the public/images folder on the backend



📂 Folder Structure
recipeapp/
│── frontend/
│   ├── food-recipe-hub/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── .env
│── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   ├── package.json




💡 How to Run Locally
1️⃣ Clone the Repository : git clone https://github.com/aryandumale04/EYGDS-P6-RecipeApp.git
2️⃣ Set Up Backend
        1.cd backend
        2.npm install
        3.Create a .env file inside the backend/ folder and add:


        MONGO_URI=your_mongodb_atlas_connection_string
        JWT_SECRET=your_secret_key
        CLOUD_NAME=your_cloudinary_name
        Start Backend Server

        npm start
3️⃣ Set Up Frontend

        cd ../frontend/food-recipe-hub
        npm install
        Run React App

        npm start



🌍 Deployment
Frontend: Vercel
Build & Deploy Frontend using Vercel
Backend: Render

Deploy backend on Render with MongoDB Atlas

Ensure CORS is configured in server.js
