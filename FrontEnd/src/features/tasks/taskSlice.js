import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import taskService from '../../services/taskService';

const initialState = {
  tasks: [],
  currentTask: null,
  filteredTasks: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get all tasks
export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (_, thunkAPI) => {
    try {
      return await taskService.getTasks();
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch tasks';
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get task by ID
export const getTaskById = createAsyncThunk(
  'tasks/getById',
  async (id, thunkAPI) => {
    try {
      return await taskService.getTask(id);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch task';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      const response = await taskService.createTask(taskData);
      toast.success('Task created successfully');
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to create task';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, taskData }, thunkAPI) => {
    try {
      const response = await taskService.updateTask(taskId, taskData);
      toast.success('Task updated successfully');
      return response;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to update task';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, thunkAPI) => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      return id;
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to delete task';
      
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get tasks by status
export const getTasksByStatus = createAsyncThunk(
  'tasks/getByStatus',
  async (status, thunkAPI) => {
    try {
      return await taskService.getTasksByStatus(status);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch tasks';
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    filterTasks: (state, action) => {
      const { searchTerm, status } = action.payload;
      let result = [...state.tasks];
      
      // Filter by status if provided
      if (status && status !== 'all') {
        result = result.filter(task => task.status === status);
      }
      
      // Filter by search term if provided
      if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        result = result.filter(task => 
          task.title.toLowerCase().includes(lowercasedTerm) || 
          (task.description && task.description.toLowerCase().includes(lowercasedTerm)) ||
          (task.assignedTo?.name && task.assignedTo.name.toLowerCase().includes(lowercasedTerm))
        );
      }
      
      state.filteredTasks = result;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all tasks cases
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload.data;
        state.filteredTasks = action.payload.data;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get task by ID cases
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTask = action.payload.data;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create task cases
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload.data); // Add to beginning of array
        state.filteredTasks.unshift(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update task cases
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const updatedTask = action.payload.data;
        
        // Update in tasks array
        state.tasks = state.tasks.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        );
        
        // Update in filtered tasks array
        state.filteredTasks = state.filteredTasks.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        );
        
        // Update current task if it's the one being edited
        if (state.currentTask?._id === updatedTask._id) {
          state.currentTask = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete task cases
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        const deletedId = action.payload;
        
        // Remove from tasks array
        state.tasks = state.tasks.filter(task => task._id !== deletedId);
        
        // Remove from filtered tasks array
        state.filteredTasks = state.filteredTasks.filter(task => task._id !== deletedId);
        
        // Clear current task if it's the one being deleted
        if (state.currentTask?._id === deletedId) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get tasks by status cases
      .addCase(getTasksByStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasksByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.filteredTasks = action.payload.data;
      })
      .addCase(getTasksByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  }
});

export const { reset, setCurrentTask, clearCurrentTask, filterTasks } = taskSlice.actions;
export default taskSlice.reducer;
