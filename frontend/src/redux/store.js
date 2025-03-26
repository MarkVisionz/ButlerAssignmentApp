import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from './assignmentsSlice';

export default configureStore({
    reducer: {
        assignments: assignmentsReducer
    }
});
