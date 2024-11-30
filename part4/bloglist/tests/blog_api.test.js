const { test, after, describe, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require("node:assert");
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
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
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('the first blog is about Canonical string reduction', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.title)
        assert(contents.includes('Canonical string reduction'))
    })

    test('blogs have an id property instead of _id', async () => {
        const response = await api.get('/api/blogs')

        assert(response.body[0].id)
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

        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.title)
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
        assert(contents.includes('First class tests'))
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

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initialBlogs.length)
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

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initialBlogs.length)
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

        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.likes)
        assert(contents.includes(0))
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

        const response = await api.get('/api/blogs')

        const blogsAtEnd = response.body.map(r => r.title)
        assert(blogsAtEnd.length === initialBlogs.length - 1)
        assert(!blogsAtEnd.includes('Canonical string reduction'))
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

        const response = await api.get('/api/blogs')

        const authors = response.body.map(r => r.author)
        assert(authors.includes('Sebastian Fors'))

        const likes = response.body.map(r => r.likes)
        assert(likes.includes(10))
    })
})

after(async () => {
    await mongoose.connection.close()
})