import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/conf";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    // React Hook Form setup
    // Fill old data if editing post
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });
    // Navigate pages
    const navigate = useNavigate();
    // Get logged-in user from Redux
    const userData = useSelector((state) => state.auth.userData);
    // Form submit function
    const submit = async (data) => {
        // Update existing post
        if (post) {
            // Upload new image if selected
            const file = data.image[0] 
                ? await appwriteService.uploadFile(data.image[0]) 
                : null;
            // Delete old image
            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }
            // Update post in database
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            // Create new post
            // Upload image
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
              // Save image id
                data.featuredImage = file.$id;

                // Create post with userId
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    // Convert title into slug
    // Example: My Post -> my-post
    const slugTransform = useCallback((value) => {

        if (value && typeof value === "string")

            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";

    }, []);
    // Auto update slug when title changes
    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue(
                    "slug",
                    slugTransform(value.title),
                    { shouldValidate: true }
                );
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">

                {/* Title */}
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required:true })}
                />

                {/* Slug */}
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required:true })}

                    onInput={(e)=>{

                        setValue(
                            "slug",
                            slugTransform(e.currentTarget.value),
                            {shouldValidate:true}
                        );

                    }}
                />

                {/* Content editor */}
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
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />

                {/* Show old image in edit mode */}
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}

                {/* Status */}
                <Select
                    options={["active","inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status",{required:true})}
                />

                {/* Submit button */}
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}