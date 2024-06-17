// src/redux/slices/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    selectedPostId: null,
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        selectPost: (state, action) => {
            state.selectedPostId = action.payload;
        },
    },
});

export const { setPosts, selectPost } = postSlice.actions;
export default postSlice.reducer;
