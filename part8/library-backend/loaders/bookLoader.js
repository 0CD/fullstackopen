const DataLoader = require('dataloader')
const Book = require('../models/book')

const bookLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({ author: { $in: authorIds } })
  return authorIds.map(authorId => books.filter(book => book.author.toString() === authorId.toString()))
})

module.exports = bookLoader