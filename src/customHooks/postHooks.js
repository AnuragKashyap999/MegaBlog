import { useState, useEffect } from "react";
import appWriteService from "../appwrite/conf";

function usePosts(){
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{

        async function getPosts(){
            try {
                const res = await appWriteService.AllPosts();
                if(res){
                    setPosts(res.documents);
                }
            } catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }

        getPosts();

    },[])

    return {posts, loading};
}

export default usePosts;