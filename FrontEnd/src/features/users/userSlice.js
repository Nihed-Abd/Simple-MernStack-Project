import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import userService from '../../services/userService';

const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get all users (manager only)
export const getUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      return await userService.getUsers();
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch users';
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user by ID (manager only)
export const getUserById = createAsyncThunk(
  'users/getById',
  async (id, thunkAPI) => {
    try {
      return await userService.getUserById(id);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch user';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new user (manager only)
export const createUser = createAsyncThunk(
  'users/create',
  async (userData, thunkAPI) => {
    try {
      const response = await userService.createUser(userData);
      toast.success('User created successfully');
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to create user';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user (manager only)
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await userService.updateUser(userId, userData);
      toast.success('User updated successfully');
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to update user';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user (manager only)
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, thunkAPI) => {
    try {
      await userService.deleteUser(id);
      toast.success('User deleted successfully');
      return id;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to delete user';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all users cases
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get user by ID cases
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentUser = action.payload.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create user cases
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.push(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const updatedUser = action.payload.data;
        
        // Update in users array
        state.users = state.users.map(user => 
          user._id === updatedUser._id ? updatedUser : user
        );
        
        // Update current user if it's the one being edited
        if (state.currentUser?._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const deletedId = action.payload;
        
        // Remove from users array
        state.users = state.users.filter(user => user._id !== deletedId);
        
        // Clear current user if it's the one being deleted
        if (state.currentUser?._id === deletedId) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  }
});

export const { reset, setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
