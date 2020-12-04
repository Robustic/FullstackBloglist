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

const favoriteBlog = (blogs) => {
    const findLargestValue = (largest, blog) => {
        if (largest === null) {
            return blog
        }
        return (largest.likes < blog.likes) ? blog : largest
    }

    const favorite = blogs.reduce(findLargestValue, null)

    if (favorite === null) {
        return null
    }

    const returnBlog = {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }

    return returnBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}