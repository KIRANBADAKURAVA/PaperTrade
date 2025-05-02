import User from "../Models/User.model.js";
import { AsyncHandler } from "../Utils/Asynchandler.js";
import {ApiError} from "../Utils/ApiError.js";
import {ApiResponse} from "../Utils/ApiResponse.js";
import Account from "../Models/Accounts.model.js";


const AccessandRefreshTokenGenerater= async(userid)=>{
      
    const user = await User.findById(userid)
   
    
    const accessToken =  user.generateAccessToken() 
    const refreshToken =  user.generateRefreshToken()
    
    user.refreshToken= refreshToken
    await user.save({ validateBeforeSave: false })
    //console.log(refreshToken,accessToken);
    
    //console.log(await User.findById(userid));
    
    return {accessToken,refreshToken}
  }

 
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

    // Create a new account for the user
    const account = new Account({ 
        userId: user._id,

     });
    await account.save();


    return new ApiResponse(201, "User registered successfully", {
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
        },
        account: {
            _id: account._id,
            balance: account.balance,
        }
    }, );
});

// Login user
const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return new ApiError(401, "Invalid email or password");
    }
    console.log(user);
    
    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return new ApiError(401, "Invalid email or password");
    }
    const {accessToken,refreshToken} = await AccessandRefreshTokenGenerater(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };


    return res.cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options)
              .json( 
                new ApiResponse(200,
                  {
                    user : {loggedInUser, refreshToken, accessToken}
                  },
                  'User logged succesfully'
                )
              )
}
);

// Logout user
const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    return new ApiResponse(200, "User logged out successfully").send(res);
}
);

// Get user profile 
const getUserProfile = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    return new ApiResponse(200, "User profile", user).send(res);
}
);

// Update user profile
const updateUserProfile = AsyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const user = await
    User.findByIdAndUpdate(
        req.user._id,
        { username, email },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");
    return new ApiResponse(200, "User profile updated", user).send(res);
}
);
// Update user password
const updateUserPassword = AsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        return new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        return new ApiError(401, "Invalid old password");
    }
    user.password = newPassword;
    await user.save();
    return new ApiResponse(200, "User password updated").send(res);
}
);
// Delete user account

const deleteUserAccount = AsyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
        return new ApiError(404, "User not found");
    }
    return new ApiResponse(200, "User account deleted").send(res);
}
);

// Refresh token
const refreshToken = AsyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return new ApiError(401, "Refresh token not provided");
    }
    const user = await User.findOne({ refreshToken });
    if (!user) {
        return new ApiError(401, "Invalid refresh token");
    }
    const { accessToken, refreshToken: newRefreshToken } = await AccessandRefreshTokenGenerater(user._id);
    return new ApiResponse(200, "New tokens generated", { accessToken, refreshToken: newRefreshToken }).send(res);
}
);


// Export all functions
export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
    refreshToken
};
