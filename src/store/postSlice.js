import { createSlice } from "@reduxjs/toolkit";

const initialState  ={
    posts:[],
    loading:false
}
const Postslice = createSlice({
    name:'post',
    initialState,
    reducers:{
        addPost:(state,action)=>{
            state.posts.push(action.payload)
        },
        removePost:(state,action)=>{
            state.posts=state.posts.filter(
                post => post.id!==action.payload
            )
        },
    }
})



export default Postslice.reducer