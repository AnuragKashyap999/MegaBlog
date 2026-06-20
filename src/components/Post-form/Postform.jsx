import React ,{useCallback} from 'react'
import {useForm} from 'react-hook-form'
import {Button,Input,Select , RTE} from '../index'
import appwriteService from '../../appwrite/conf'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'


function Postform({post}) {
  const {register,handleSubmit,watch,setValue,control,getValues} = useForm({
    defaultValues:{
      title:post?.title || '',
      slug:post?.slug || '',
      content:post?.content || '',
      status:post?.status || 'active',
    }
  })

  const navigate = useNavigate()
  const userData = useSelector(state=> state.user.userData)
  
  const submit = async (data)=>{
    if(post){
      const file =data.image[0] ? appwriteService.uploadFile(data.image[0]) : null

      if(file){
        appwriteService.deleteFile(post.featuredImage)
      }

      const dbPost =await appwriteService.updatePost(post.$id,{
        ...data,
        featuredImage:file? file.$id :undefined,
      })
      if(dbPost){
        navigate(`/post${dbPost.$id}`)

      }
    }else{
      const file = await appwriteService.uploadFile(data.image[0]);

      if(file){
        const fileId = file.$id
        data.featuredImage = field 
        const dbPost=await appwriteService.createPost({
          ...data,
          userID:userData.$id,
        })
        if(dbPost){
          navigate(`/post${dbPost.$id}`)
        }
      }
    }
  }

  const slugTransform = useCallback((value)=>{
    if(value && typeof value === 'string')

      // method 1
      // const slug = value.toLowerCase().replace(/./g,'_')
      // setValue('slug',slug)
      // return slug

      // method 2
      return value.trim()
      .toLowerCase()
      .replace(/^[a-zA-Z\d\s]+/g,'_')
      .replace(/\s/g,'_')
    
      
  },[])
  return (
    <div>
      
    </div>
  )
}

export default Postform
