const { createUser, getUserByEmail } = require("../models/userDynamo");

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password required" }),
      };
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "User already exists" }),
      };
    }

    await createUser(email, password);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User registered successfully" }),
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
