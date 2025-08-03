// controllers/userController.js
import User from "../models/User.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, password, role } = req.body;

    // Check if username already exists

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "User not created",
        error: "Username already taken. Please choose another.",
      });
    }

    // Hash password using schema method

    const hashedPassword = await User.hashPassword(password);

    // Create and save new user
    
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "User not created",
      error: err.message,
    });
  }
};
