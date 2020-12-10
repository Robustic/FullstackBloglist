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

describe('GET operation for blogs', () => {
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

describe('POST operation for blogs', () => {
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

    test('likes 0 saved to db if not defined', async () => {
        const newBlog = {
            title: 'Toinen Uusi_blogi',
            author: 'Tekijä Henkilö Eri',
            url: 'www.uudetblogit.fi/setoinen'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsInDB = await helper.blogsInDb()

        const content = blogsInDB.filter(blog => blog.title === 'Toinen Uusi_blogi')
        expect(content[0].likes).toBeDefined()

        const contentWithLikes = blogsInDB.filter(blog => blog.title === 'Outo_test')
        expect(contentWithLikes[0].likes).toBe(13)
    })

    test('blog not saved if title is missing', async () => {
        const newBlog = {
            author: 'epäonnistuja',
            url: 'www.eimene.fi',
            likes: 13
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsInDB = await helper.blogsInDb()
        expect(blogsInDB).toHaveLength(helper.initialBlogs.length)
    })

    test('blog not saved if url is missing', async () => {
        const newBlog = {
            title: 'Eipä mene',
            author: 'epäonnistuja',
            likes: 13
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsInDB = await helper.blogsInDb()
        expect(blogsInDB).toHaveLength(helper.initialBlogs.length)
    })
})

describe('DELETE operation for blogs', () => {
    test('fails if blog id does not exist', async () => {
        const nonExistingValidId = await helper.nonExistingValidId()

        await api
            .delete(`/api/blogs/${nonExistingValidId}`)
            .expect(404)
    })

    test('fails if blog id invalid', async () => {
        const invalidNonExistingId = 'k435325k32455'

        await api
            .delete(`/api/blogs/${invalidNonExistingId}`)
            .expect(400)
    })

    test('blog can be deleted if exist', async () => {
        const blogsBeforeDelete = await helper.blogsInDb()
        const blogToDelete = blogsBeforeDelete[1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAfterDelete = await helper.blogsInDb()
        expect(blogsAfterDelete.length).toBe(blogsBeforeDelete.length - 1)

        const contents = blogsAfterDelete.map(blog => blog.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})