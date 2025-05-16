// login.js (inside functions folder)

const { getUserByEmail } = require("../models/userDynamo");

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password are required!" }),
      };
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "User not found!" }),
      };
    }

    if (user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Incorrect password!" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login successful!", user }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
