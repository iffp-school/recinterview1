// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import postReducer from './slices/postSlice';

const store = configureStore({
    reducer: {
        posts: postReducer,
    },
});

export default store;
