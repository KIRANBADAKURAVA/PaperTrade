import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUserProfile, 
    updateUserProfile, 
    updateUserPassword, 
    deleteUserAccount, 
    refreshToken 
} from '../Controllers/User.controller.js';
import { Tokenverification } from '../Middlewares/Auth.middleware.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Logout user
router.post('/logout', Tokenverification, logoutUser); // Changed 'protect' to 'Tokenverification'

// Get user profile
router.get('/profile', Tokenverification, getUserProfile); // Changed 'protect' to 'Tokenverification'

// Update user profile
router.put('/profile', Tokenverification, updateUserProfile); // Changed 'protect' to 'Tokenverification'

// Update user password
router.put('/password', Tokenverification, updateUserPassword); // Changed 'protect' to 'Tokenverification'

// Delete user account
router.delete('/account', Tokenverification, deleteUserAccount); // Changed 'protect' to 'Tokenverification'

// Refresh token
router.post('/refresh-token', refreshToken);

export default router;
