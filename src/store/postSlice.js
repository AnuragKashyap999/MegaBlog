import { createSlice } from "@reduxjs/toolkit";

const initialState  ={
    posts:[],
    loading:false
}
const Postslice = createSlice({
    name:'post',
    initialState,
    reducers:{
        
        updatePost:(state,action)=>{
            state.posts= state.posts.map((post)=>
                post.id===action.payload.ids ? action.payload:post
            )
        }
    }
})


export const {addPost,updatePost,removePost} = Postslice.actions;
export default Postslice.reducer