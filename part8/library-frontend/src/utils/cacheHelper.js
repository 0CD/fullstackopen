import { ALL_AUTHORS } from '../queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })

  cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
    return {
      allAuthors: allAuthors.map((author) => {
        if (author.name === addedBook.author.name) {
          return {
            ...author,
            bookCount: author.bookCount + 1,
          }
        }
        return author
      }),
    }
  })
}