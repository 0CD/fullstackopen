const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const mongoose = require("mongoose");

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body
    const user = request.user

    try {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })

        try {
            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
            response.status(201).json(savedBlog)
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/:id/comments', async (request, response, next) => {
    const { id } = request.params
    const { comment } = request.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ error: 'invalid blog id' })
    }

    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        blog.comments = blog.comments.concat(comment)
        const updatedBlog = await blog.save()
        response.status(201).json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    const user = request.user

    try {
        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        if (blog.user.toString() !== user.id.toString()) {
            return response.status(403).json({ error: 'permission denied' })
        }

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog)
    } catch (error) {
        response.status(404).json({ error: error.message })
    }
})

module.exports = blogRouter