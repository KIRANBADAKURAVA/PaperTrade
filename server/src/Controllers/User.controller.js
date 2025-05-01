import User from "../Models/User.model.js";
import { AsyncHandler } from "../Utils/Asynchandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";


// Regisister a new user

const registerUser = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return new ApiError(400, "User already exists");
    }

    const user = new User({ username, email, password });
    await user.save();

    return new ApiResponse(201, "User registered successfully", user).send(res);
});

// Login user
const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await