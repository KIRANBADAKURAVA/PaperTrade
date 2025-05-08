// Store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: localStorage.getItem('isLoggedIn') === 'true',
  accessToken: localStorage.getItem('accessToken') || '',
  data: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.accessToken = action.payload.accessToken;
      state.data = action.payload; 
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout: (state) => {
      state.status = false;
      state.accessToken = '';
      state.data = null;

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
