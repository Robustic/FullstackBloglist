const listHelper = require('../utils/list_helper')

describe('dummy', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('total likes', () => {
    test('totalLikes returns right number with empty list', () => {
        const blogs = []

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('totalLikes returns right number', () => {
        const blogs = [
            {
                title: 'Outo',
                author: 'Olen Joku Muu',
                url: 'www.aaltonen.fi',
                likes: 13
            },
            {
                title: 'Oho',
                author: 'Olen Joku',
                url: 'www.hy.fi',
                likes: 43563
            },
            {
                title: 'Olen Otsikko',
                author: 'I Am',
                url: 'www.aalto.fi',
                likes: 0
            },
            {
                title: 'En Keksi',
                author: 'Mr Nobody',
                url: 'www.turha.com',
                likes: 474
            }
        ]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(44050)
    })

    test('totalLikes returns right number with large input', () => {
        const blogs = [
            { _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7, __v: 0 },
            { _id: '5a422aa71b54a676234d17f8', title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5, __v: 0 },
            { _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0 },
            { _id: '5a422b891b54a676234d17fa', title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10, __v: 0 },
            { _id: '5a422ba71b54a676234d17fb', title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0, __v: 0 },
            { _id: '5a422bc61b54a676234d17fc', title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2, __v: 0 }
        ]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('favoriteBlog', () => {
    test('favoriteBlog returns null with empty list', () => {
        const blogs = []

        const result = listHelper.favoriteBlog(blogs)
        expect(result).toBe(null)
    })

    test('favoriteBlog returns right blog', () => {
        const blogs = [
            {
                title: 'Outo',
                author: 'Olen Joku Muu',
                url: 'www.aaltonen.fi',
                likes: 13
            },
            {
                title: 'Oho',
                author: 'Olen Joku',
                url: 'www.hy.fi',
                likes: 43563
            },
            {
                title: 'Olen Otsikko',
                author: 'I Am',
                url: 'www.aalto.fi',
                likes: 0
            },
            {
                title: 'En Keksi',
                author: 'Mr Nobody',
                url: 'www.turha.com',
                likes: 474
            }
        ]

        const result = listHelper.favoriteBlog(blogs)

        const rightResult = {
            title: 'Oho',
            author: 'Olen Joku',
            likes: 43563
        }
        expect(result.title).toBe('Oho')
        expect(result.likes).toBe(43563)
        expect(result).toEqual(rightResult)
    })
})

describe('mostBlogs', () => {
    test('mostBlogs returns null with empty list', () => {
        const blogs = []

        const result = listHelper.mostBlogs(blogs)
        expect(result).toBe(null)
    })

    test('mostBlogs returns right author', () => {
        const blogs = [
            { _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7, __v: 0 },
            { _id: '5a422aa71b54a676234d17f8', title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5, __v: 0 },
            { _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0 },
            { _id: '5a422b891b54a676234d17fa', title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10, __v: 0 },
            { _id: '5a422ba71b54a676234d17fb', title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0, __v: 0 },
            { _id: '5a422bc61b54a676234d17fc', title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2, __v: 0 }
        ]

        const result = listHelper.mostBlogs(blogs)

        const rightResult = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        expect(result).toEqual(rightResult)
    })
})

describe('mostLikes', () => {
    test('mostLikes returns null with empty list', () => {
        const blogs = []

        const result = listHelper.mostLikes(blogs)
        expect(result).toBe(null)
    })

    test('mostLikes returns right author', () => {
        const blogs = [
            { _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7, __v: 0 },
            { _id: '5a422aa71b54a676234d17f8', title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5, __v: 0 },
            { _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0 },
            { _id: '5a422b891b54a676234d17fa', title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10, __v: 0 },
            { _id: '5a422ba71b54a676234d17fb', title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0, __v: 0 },
            { _id: '5a422bc61b54a676234d17fc', title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2, __v: 0 }
        ]

        const result = listHelper.mostLikes(blogs)

        const rightResult = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        expect(result).toEqual(rightResult)
    })
})