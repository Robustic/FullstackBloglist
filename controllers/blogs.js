const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user

    if (body.title === undefined || body.url === undefined) {
        response.status(400).end()
    } else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes,
            user: user._id,
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog) {
        if (blog.user.toString() === user.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } else {
            return response.status(401).json({ error: 'not user for blog id to delete' })
        }
    } else {
        response.status(404).end()
    }

})

blogsRouter.put('/:id', async (request, response) => {
    const oldBlog = await Blog.findById(request.params.id)
    const body = request.body
    const user = request.user

    const blog = {
        title: body.title === undefined ? oldBlog.title : body.title,
        author: body.author === undefined ? oldBlog.author : body.author,
        url: body.url === undefined ? oldBlog.url : body.url,
        likes: body.likes === undefined ? oldBlog.likes : body.likes,
        user: body.user === undefined ? oldBlog.user : user._id,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
