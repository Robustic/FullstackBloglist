const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('POST operation for users when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('idonttell', 10)
        const user = new User({ username: 'rootti', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'jokunimi',
            name: 'Joku Nimi',
            password: 'top_secret',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'rootti',
            name: 'Toinen Nimi',
            password: 'enpakerro',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

describe('POST operation for users', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash0 = await bcrypt.hash(helper.initialUsers[0].password, 10)
        const user0 = new User(
            {
                username: helper.initialUsers[0].username,
                name: helper.initialUsers[0].name,
                passwordHash: passwordHash0
            })
        await user0.save()

        const passwordHash1 = await bcrypt.hash(helper.initialUsers[1].password, 10)
        const user1 = new User(
            {
                username: helper.initialUsers[1].username,
                name: helper.initialUsers[1].name,
                passwordHash: passwordHash1
            })
        await user1.save()
    })

    test('user saved', async () => {
        const newUser = {
            username: 'testinimitoinen',
            name: 'Tenttu Testaaja',
            password: 'enpakerro',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)

        const usersInDB = await helper.usersInDb()
        expect(usersInDB).toHaveLength(helper.initialUsers.length + 1)

        const usernames = usersInDB.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('user not saved if username is missing', async () => {
        const newUser = {
            name: 'Tenttu Testaaja',
            password: 'enpakerro'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        expect(response.body.message).toContain('username or password not provided')

        const usersInDB = await helper.usersInDb()
        expect(usersInDB).toHaveLength(helper.initialUsers.length)
    })

    test('user not saved if password is missing', async () => {
        const newUser = {
            username: 'testinimi',
            name: 'Tenttu Testaaja',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        expect(response.body.message).toContain('username or password not provided')

        const usersInDB = await helper.usersInDb()
        expect(usersInDB).toHaveLength(helper.initialUsers.length)
    })

    test('user not saved if username is too short', async () => {
        const newUser = {
            username: 'te',
            name: 'Tenttu Testaaja',
            password: 'enpakerro'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        expect(response.body.message).toContain('username and password must be at least 3 characters long')

        const usersInDB = await helper.usersInDb()
        expect(usersInDB).toHaveLength(helper.initialUsers.length)
    })

    test('user not saved if password is too short', async () => {
        const newUser = {
            username: 'testinimi',
            name: 'Tenttu Testaaja',
            password: 'en'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        expect(response.body.message).toContain('username and password must be at least 3 characters long')

        const usersInDB = await helper.usersInDb()
        expect(usersInDB).toHaveLength(helper.initialUsers.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})