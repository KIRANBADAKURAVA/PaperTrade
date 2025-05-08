import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUserProfile, 
    updateUserProfile, 
    updateUserPassword, 
    deleteUserAccount, 
    refreshToken ,
    getAccountBalance
} from '../Controllers/User.controller.js';
import { Tokenverification } from '../Middlewares/Auth.middleware.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Logout user
router.post('/logout', Tokenverification, logoutUser); 

// Get user profile
router.get('/profile', Tokenverification, getUserProfile); 

router.get('/balance', Tokenverification, getAccountBalance);

// Update user profile
router.put('/profile', Tokenverification, updateUserProfile); 
// Update user password
router.put('/password', Tokenverification, updateUserPassword); 

// Delete user account
router.delete('/account', Tokenverification, deleteUserAccount); 

// Refresh token
router.post('/refresh-token', refreshToken);

export default router;
