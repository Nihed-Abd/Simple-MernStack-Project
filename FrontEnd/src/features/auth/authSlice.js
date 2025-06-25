import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('teamtask_user'));

const initialState = {
  user: user || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Something went wrong';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Invalid credentials';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

// Check user session
export const checkUserSession = createAsyncThunk(
  'auth/checkSession',
  async (_, thunkAPI) => {
    try {
      // Only attempt to validate if we have a user in localStorage
      const user = JSON.parse(localStorage.getItem('teamtask_user'));
      
      if (!user) {
        return thunkAPI.rejectWithValue('No user session found');
      }
      
      return await authService.validateToken();
    } catch (error) {
      // If validation fails, log the user out silently
      authService.logout();
      return thunkAPI.rejectWithValue('Session expired');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        toast.success('Registration successful');
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        toast.success('Login successful');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        toast.info('Logged out successfully');
      })
      // Session check cases
      .addCase(checkUserSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.isLoading = false;
        // If session is valid, keep the user data
        // We don't update the user data here because the existing data has the token
      })
      .addCase(checkUserSession.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        // Silently remove user data if token validation fails
      })
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
