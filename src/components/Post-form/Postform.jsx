import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/conf";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Postform({ post }) {
  // react-hook-form methods
  const {
    register,      // connect input with form
    handleSubmit,  // submit handler
    watch,         // watch input changes
    setValue,      // update field manually
    control,       // for custom component (RTE)
    getValues      // get current form values
  } = useForm({
    // Edit mode: show old data
    // Create mode: empty values
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    }
  });

  // For page navigation
  const navigate = useNavigate();

  // Get logged-in user from Redux
  const userData = useSelector(
    state => state.auth.userData
  );
  // Form submit function
  const submit = async(data)=>{
    // =========================
    // UPDATE POST
    // =========================

    if(post){
      // Upload new image if selected
      const file = data.image[0]
      ? await appwriteService.uploadFile(data.image[0])
      : null;
      // Delete old image
      if(file){
        await appwriteService.deleteFile(
          post.featuredImage
        );
      }
      // Update database
      const dbPost = await appwriteService.updatePost(
        post.$id,
        {
          ...data,
          featuredImage: file 
          ? file.$id 
          : post.featuredImage
        }
      );
      if(dbPost){
        navigate(`/post/${dbPost.$id}`);
      }
    }
    // =========================
    // CREATE POST
    // =========================
    else{
      // Upload image
      const file = await appwriteService.uploadFile(
        data.image[0]
      );
      if(file){
        // Save image id
        data.featuredImage = file.$id;
        // Create post in database
        const dbPost = await appwriteService.createPost({
          ...data,
          userID:userData.$id
        });
        if(dbPost){
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };
  // Convert title into slug
  // React Blog -> react_blog
  const slugTransform = useCallback((value)=>{
    if(value && typeof value==="string"){
      return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z\d\s]+/g,"")
      .replace(/\s/g,"_");
    }
    return "";
  },[]);
  // Automatically create slug when title changes
  useEffect(()=>{
    const subscription = watch((value,{name})=>{
      if(name==="title"){
        setValue(
          "slug",
          slugTransform(value.title),
          {
            shouldValidate:true
          }
        );
      }
    });
    return ()=>subscription.unsubscribe();
  },[watch,slugTransform,setValue]);

  return (
    <form onSubmit={handleSubmit(submit)}
      className="flex flex-wrap">
      <div className="w-2/3 px-2">
        {/* Title */}
        <Input
          label="Title :"
          placeholder="Title"
          {...register("title",{required:true})}
        />
        {/* Slug */}
        <Input
          label="Slug :"
          placeholder="Slug"
          {...register("slug",{required:true})}
          // manual slug change
          onInput={(e)=>{
            setValue(
              "slug",
              slugTransform(e.currentTarget.value),
              {
                shouldValidate:true
              }
            );
          }}
        />
        {/* Rich Text Editor */}
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        {/* Image upload */}
        <Input
          label="Featured Image :"
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          {...register(
            "image",
            {
              required:!post
            }
          )}
        />
        {/* Show old image in edit mode */}
        {
          post &&
          <img
            src={
              appwriteService.getFilePreview(
                post.featuredImage
              )
            }
            alt={post.title}
          />
        }
        {/* Status */}
        <Select
          options={[
            "active",
            "inactive"
          ]}
          label="Status"
          {...register(
            "status",
            {
              required:true
            }
          )}
        />
        <Button type="submit">
          {
            post
            ?"Update"
            :"Submit"
          }
        </Button>
      </div>
    </form>
  );
}
export default Postform;