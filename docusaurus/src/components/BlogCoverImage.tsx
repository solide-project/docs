const BlogCoverImage = ({ src }) => {
    return (
        <img
            className="rounded-lg w-full"
            src={src}
            alt="cover"
        />
    )
};

export default BlogCoverImage;