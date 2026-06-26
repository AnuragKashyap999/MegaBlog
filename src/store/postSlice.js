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
        updatePost:(state,action)=>{
            state.posts= state.posts.map((post)=>
                post.id===action.payload.ids ? action.payload:post
            )
        }
        ,
        removePost:(state,action)=>{
            state.posts=state.posts.filter(
                post => post.id!==action.payload
            )
        },
    }
})


export const {addPost,updatePost,removePost} = Postslice.actions;
export default Postslice.reducer