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

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const user = new User({ username, email, password });
    await user.save();

    // Create a new account for the user
    const account = new Account({ 
        userId: user._id,

     });
    await account.save();


    return res.status(201).json(
        new ApiResponse(201, {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            account: {
                _id: account._id,
                balance: account.balance,
            }
        }, 'User registered successfully')
    );
});

    
// Login user

const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }
   // console.log(user);
    
    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }
    const {accessToken,refreshToken} = await AccessandRefreshTokenGenerater(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const account = await Account.findOne({ userId: user._id })
    if(!account) {
        throw new ApiError(404, "Account not found");
    }
    // Set cookie options
    const options = {
        httpOnly: true,
    };


    return res.status(200).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggedInUser,
            account: account,
            accessToken,
            refreshToken,
        }, 'User logged in successfully')
    );
}
);

// Logout user
const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    return res.status(200).clearCookie("refreshToken").json(
        new ApiResponse(200, "User logged out successfully")
    );
}
);

// Get user profile 
const getUserProfile = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        return new ApiError(404, "User not found");
    }
    const account = await Account.findOne({ userId: user._id });
    if (!account) {
        return new ApiError(404, "Account not found");
    }


    return res.status(200).json(
        new ApiResponse(200, {
            user,
            account,
        }, "User profile fetched successfully")
    );
}
);  

// get account balance
const getAccountBalance = AsyncHandler(async (req, res) => {
    console.log(req.user._id);
    const account = await Account.findOne({ userId: req.user._id });
    if (!account) {
        return new ApiError(404, "Account not found");
    }
    return res.status(200).json(
        new ApiResponse(200, account.balance, "Account balance fetched successfully")
    );
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
    return res.status(200).json(
        new ApiResponse(200, user, "User profile updated successfully")
    );
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
    return res.status(200).json(
        new ApiResponse(200, "Password updated successfully")
    );
}
);
// Delete user account

const deleteUserAccount = AsyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
        return new ApiError(404, "User not found");
    }
    return res.status(200).json(    
            
            new ApiResponse(200, "User account deleted successfully")
        );

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
    refreshToken,
    getAccountBalance
};
