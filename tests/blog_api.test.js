const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('idonttell', 10)
    const user = new User({ username: 'rootti', passwordHash })
    await user.save()

    const blogs = helper.initialBlogs.map(b => Object.assign(b, { user: user._id }))
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
})

const paraAuthorization = async () => {
    const logging = {
        username: 'rootti',
        password: 'idonttell',
    }
    const logingResponse = await api
        .post('/api/login')
        .send(logging)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = logingResponse.body.token
    return 'bearer ' + token
}

describe('GET operation needs token for authorization', () => {
    test('GET operation without token does not work', async () => {
        await api
            .get('/api/blogs')
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
})

describe('GET operation for blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', await paraAuthorization())
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', await paraAuthorization())
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', await paraAuthorization())
        const contents = response.body.map(r => r.title)
        expect(contents).toContain(helper.initialBlogs[1].title)
    })

    test('a blog includes field called id', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', await paraAuthorization())
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
            .set('Authorization', await paraAuthorization())
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
            .set('Authorization', await paraAuthorization())
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
            .set('Authorization', await paraAuthorization())
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
            .set('Authorization', await paraAuthorization())
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
            .set('Authorization', await paraAuthorization())
            .expect(404)
    })

    test('fails if blog id invalid', async () => {
        const invalidNonExistingId = 'k435325k32455'

        await api
            .delete(`/api/blogs/${invalidNonExistingId}`)
            .set('Authorization', await paraAuthorization())
            .expect(400)
    })

    test('blog can be deleted if exist', async () => {
        const blogsBeforeDelete = await helper.blogsInDb()
        const blogToDelete = blogsBeforeDelete[1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', await paraAuthorization())
            .expect(204)

        const blogsAfterDelete = await helper.blogsInDb()
        expect(blogsAfterDelete.length).toBe(blogsBeforeDelete.length - 1)

        const contents = blogsAfterDelete.map(blog => blog.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
})

describe('PUT operation for blogs', () => {
    test('blog can be update to db', async () => {
        const blogsBeforeUpdate = await helper.blogsInDb()
        const blogToUpdate = blogsBeforeUpdate[1]
        const parametersToUpdate = {
            author: 'New Author Name'
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', await paraAuthorization())
            .send(parametersToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsInDB = await helper.blogsInDb()
        expect(blogsInDB).toHaveLength(helper.initialBlogs.length)

        const contents = blogsInDB.map(blog => blog.author)
        expect(contents).toContain('New Author Name')

        const updatedBlog = await Blog.findById(blogToUpdate.id)
        expect(updatedBlog.title).toBe(blogToUpdate.title)
        expect(updatedBlog.author).toBe('New Author Name')
        expect(updatedBlog.url).toBe(blogToUpdate.url)
        expect(updatedBlog.likes).toBe(blogToUpdate.likes)
    })
})

afterAll(() => {
    mongoose.connection.close()
})