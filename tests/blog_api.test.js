const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('get operation for blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)
        expect(contents).toContain(helper.initialBlogs[1].title)
    })

    test('a blog includes field called id', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r)
        expect(contents[0].id).toBeDefined()
    })
})

describe('post operation for blogs', () => {
    test('blog can be added to the db', async () => {
        const newBlog = {
            title: 'Uusi_blogi',
            author: 'Tekijä Henkilö',
            url: 'www.uudetblogit.fi',
            likes: 23
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsInDB = await helper.blogsInDb()
        expect(blogsInDB).toHaveLength(helper.initialBlogs.length + 1)

        const contents = blogsInDB.map(blog => blog.title)
        expect(contents).toContain('Uusi_blogi')
    })
})

afterAll(() => {
    mongoose.connection.close()
})