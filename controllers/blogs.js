const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.title === undefined || body.url === undefined) {
        response.status(400).end()
    } else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes,
        })

        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }

})

blogsRouter.put('/:id', async (request, response) => {
    const oldBlog = await Blog.findById(request.params.id)
    const body = request.body
    const blog = {
        title: body.title === undefined ? oldBlog.title : body.title,
        author: body.author === undefined ? oldBlog.author : body.author,
        url: body.url === undefined ? oldBlog.url : body.url,
        likes: body.likes === undefined ? oldBlog.likes : body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
