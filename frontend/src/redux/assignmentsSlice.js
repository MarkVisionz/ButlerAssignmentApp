import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAssignments = createAsyncThunk('assignments/fetch', async () => {
  const res = await axios.get('http://localhost:5000/api/assignments');
  return res.data;
});

export const updateAssignment = createAsyncThunk('assignments/update', async (data) => {
    await axios.put('http://localhost:5000/api/assignments/update-assignment', data);
    return data;
});


export const updateGuestStatus = createAsyncThunk('assignments/updateStatus', async ({ name, status }) => {
  await axios.put('http://localhost:5000/api/assignments/update-status', { name, status });
  return { name, status, checkedOutTime: status === 'checkedOut' ? new Date().toISOString() : null };
});

export const deleteAllAssignments = createAsyncThunk('assignments/deleteAll', async () => {
  await axios.delete('http://localhost:5000/api/assignments/delete-all');
  return [];
});

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: { assignments: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(a => a.roomNo === action.payload.roomNo);
        if (index !== -1) {
            state.assignments[index].assignedButler = action.payload.assignedButler;
        }
    })    
      .addCase(updateGuestStatus.fulfilled, (state, action) => {
        const { name, status, checkedOutTime } = action.payload;
        state.assignments = state.assignments.map(assignment =>
          assignment.name === name
            ? { ...assignment, status, checkedOutTime }
            : assignment
        );
      })
      .addCase(deleteAllAssignments.fulfilled, (state) => {
        state.assignments = [];
      });
  }
});

export default assignmentsSlice.reducer;
