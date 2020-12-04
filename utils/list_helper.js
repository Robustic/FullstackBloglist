const dummy = (blogs) => {
    console.log(blogs)
    return 1
}

const totalLikes = (blogs) => {
    const totalLikesForAllBlogs = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(totalLikesForAllBlogs, 0)
}

module.exports = {
    dummy,
    totalLikes
}