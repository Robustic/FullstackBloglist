const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Outo_test',
        author: 'Olen Joku Muu_test',
        url: 'www.aaltonen.fi_test',
        likes: 13
    },
    {
        title: 'Oho_test',
        author: 'Olen Joku_test',
        url: 'www.hy.fi_test',
        likes: 43563
    },
]

const nonExistingValidId = async () => {
    const blog = new Blog(
        {
            title: 'willremovethissoon',
            author: 'something',
            url: 'www.com',
            likes: 0
        })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingValidId, blogsInDb, usersInDb
}