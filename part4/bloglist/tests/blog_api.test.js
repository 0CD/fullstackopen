const { test, after, describe, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require("node:assert");
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

describe('API: GET blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const blogs = await helper.blogsInDb()

        assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })

    test('the first blog is about Canonical string reduction', async () => {
        const blogs = await helper.blogsInDb()

        const titles = blogs.map(r => r.title)
        assert(titles.includes('Canonical string reduction'))
    })

    test('blogs have an id property instead of _id', async () => {
        const blogs = await helper.blogsInDb()

        assert(blogs[0].id)
    })
})

describe('API: POST blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)
        assert.strictEqual(titles.length, helper.initialBlogs.length + 1)
        assert(titles.includes('First class tests'))
    })

    test('a blog without title is not added', async () => {
        const newBlog = {
            _id: "5a422bc61b54a676234d17fc",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a blog without url is not added', async () => {
        const newBlog = {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            likes: 2,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a blog without likes defaults to 0', async () => {
        const newBlog = {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const likes = blogsAtEnd.map(r => r.likes)
        assert(likes.includes(0))
    })
})

describe('API: DELETE blogs', () => {
    test('a blog with an invalid id returns 404', async () => {
      await api
            .delete(`/api/blogs/g1bb3r1shid`)
            .expect(404)
    })

    test('a blog can be deleted', async () => {
        await api
            .delete(`/api/blogs/5a422b3a1b54a676234d17f9`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)
        assert(titles.length === helper.initialBlogs.length - 1)
        assert(!titles.includes('Canonical string reduction'))
    })
})

describe('API: PUT blogs', () => {
    test('a blog with an invalid id returns 404', async () => {
        const updatedBlog = {
            title: "React patterns",
            author: "Sebastian Fors",
            url: "https://reactpatterns.com/",
            likes: 10
        }

        await api
            .put(`/api/blogs/g1bb3r1shid`)
            .send(updatedBlog)
            .expect(404)
    })

    test('a blog can be updated', async () => {
        const updatedBlog = {
            title: "React patterns",
            author: "Sebastian Fors",
            url: "https://reactpatterns.com/",
            likes: 10
        }

        await api
            .put(`/api/blogs/5a422a851b54a676234d17f7`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const authors = blogsAtEnd.map(r => r.author)
        assert(authors.includes('Sebastian Fors'))

        const likes = blogsAtEnd.map(r => r.likes)
        assert(likes.includes(10))
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'forsen',
            name: 'Sebastian Fors',
            password: 'ILoveForsen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creating fails with invalid username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'password'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(usersAtStart.length === usersAtEnd.length)
        assert(result.body.error.includes('is shorter than the minimum allowed length'))
    })

    test('creating fails with invalid password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'validUsername',
            name: 'Superuser',
            password: 'pa'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(usersAtStart.length === usersAtEnd.length)
        assert(result.body.error.includes('Password must be at least 3 characters long'))
    })
})

after(async () => {
    await mongoose.connection.close()
})