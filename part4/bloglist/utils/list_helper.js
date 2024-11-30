const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    else {
        return blogs.reduce((sum, blog) => sum + blog.likes, 0)
    }
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    else {
        const maxLikes = Math.max(...blogs.map(blog => blog.likes))
        const favorite = blogs.find(blog => blog.likes === maxLikes)

        return {
            title: favorite.title,
            author: favorite.author,
            likes: favorite.likes
        }
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    else {
        const authorCounts = blogs.reduce((count, blog) => {
            count[blog.author] = (count[blog.author] || 0) + 1
            return count
        }, {})
        const maxBlogs = Math.max(...Object.values(authorCounts))
        const maxBlogsAuthor = Object.keys(authorCounts).find(author => authorCounts[author] === maxBlogs)

        return {
            author: maxBlogsAuthor,
            blogs: maxBlogs
        }
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    else {
        const authorLikes = blogs.reduce((likes, blog) => {
            likes[blog.author] = (likes[blog.author] || 0) + blog.likes
            return likes
        }, {})
        const maxLikes = Math.max(...Object.values(authorLikes))
        const maxLikesAuthor = Object.keys(authorLikes).find(author => authorLikes[author] === maxLikes)

        return {
            author: maxLikesAuthor,
            likes: maxLikes
        }
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}