const logger = require('../utils/logger')

const dummy = (blogs) => {
    logger.info(blogs)
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

const mostBlogs = (blogs) => {
    if (typeof blogs === undefined || blogs.length === 0) {
        return null
    }
    const findMostBlogs = (list, blog) => {
        const findedAuthor = list.find(element => element.author === blog.author)
        if (findedAuthor === undefined) {
            const newList = [
                ...list,
                {
                    author: blog.author,
                    blogs: 1
                },
            ]
            return newList
        } else {
            findedAuthor.blogs += 1
            return list
        }
    }

    const favoriteList = blogs.reduce(findMostBlogs, [])

    const findLargestValue = (largest, author) => {
        if (largest === null) {
            return author
        }
        return (largest.blogs < author.blogs) ? author : largest
    }

    return favoriteList.reduce(findLargestValue, null)
}

const mostLikes = (blogs) => {
    if (typeof blogs === undefined || blogs.length === 0) {
        return null
    }
    const findMostBlogs = (list, blog) => {
        const findedAuthor = list.find(element => element.author === blog.author)
        if (findedAuthor === undefined) {
            const newList = [
                ...list,
                {
                    author: blog.author,
                    likes: blog.likes
                },
            ]
            return newList
        } else {
            findedAuthor.likes += blog.likes
            return list
        }
    }

    const favoriteList = blogs.reduce(findMostBlogs, [])

    const findLargestValue = (largest, author) => {
        if (largest === null) {
            return author
        }
        return (largest.likes < author.likes) ? author : largest
    }

    return favoriteList.reduce(findLargestValue, null)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}