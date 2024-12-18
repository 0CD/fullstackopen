describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request({
      url: 'http://localhost:3003/api/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        username: 'cypress',
        name: 'Cypress Tests',
        password: 'cypress123',
      },
    })
    cy.request({
      url: 'http://localhost:3003/api/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        username: 'cypress2',
        name: 'Cypress Tests',
        password: 'cypress123',
      },
    }).then(() => {
      cy.visit('')
    })
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('cypress123')
      cy.get('#login-button').click()
      cy.get('.success').contains('Successfully logged in as Cypress Tests')
      cy.contains('Cypress Tests logged-in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wr0ngus3rn4m3')
      cy.get('#password').type('wr0ngp4ssw0rd')
      cy.get('#login-button').click()
      cy.get('.error').contains('Wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.request({
        url: 'http://localhost:3003/api/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          username: 'cypress',
          password: 'cypress123',
        },
      }).then((response) => {
        localStorage.setItem('loggedUser', JSON.stringify(response.body))
        cy.visit('')
      })
    })

    it('A blog can be created', function () {
      cy.contains('button', 'new blog').click()
      cy.get('input[name="Title"]').type('Cypress Test Blog')
      cy.get('input[name="Author"]').type('Cypress Tests')
      cy.get('input[name="URL"]').type('https://cypress.io')
      cy.contains('button', 'create').click()
      cy.get('.success').contains(
        'A new blog Cypress Test Blog by Cypress Tests added'
      )
      cy.contains('Cypress Test Blog Cypress Tests')
    })

    it('A blog can be liked', function () {
      cy.contains('button', 'new blog').click()
      cy.get('input[name="Title"]').type('Cypress Test Blog')
      cy.get('input[name="Author"]').type('Cypress Tests')
      cy.get('input[name="URL"]').type('https://cypress.io')
      cy.contains('button', 'create').click()
      cy.contains('button', 'view').click()
      cy.contains('button', 'like').click()
      cy.contains('1')
    })

    it('A blog can be deleted', function () {
      cy.contains('button', 'new blog').click()
      cy.get('input[name="Title"]').type('Cypress Test Blog')
      cy.get('input[name="Author"]').type('Cypress Tests')
      cy.get('input[name="URL"]').type('https://cypress.io')
      cy.contains('button', 'create').click()
      cy.contains('button', 'view').click()
      cy.contains('button', 'remove').click()
      cy.get('.success').contains(
        'A blog Cypress Test Blog by Cypress Tests removed'
      )
      cy.get('.blog').should('not.exist')
    })

    it('A blog remove button is only shown to the user who created the blog', function () {
      cy.contains('button', 'new blog').click()
      cy.get('input[name="Title"]').type('Cypress Test Blog')
      cy.get('input[name="Author"]').type('Cypress Tests')
      cy.get('input[name="URL"]').type('https://cypress.io')
      cy.contains('button', 'create').click()

      cy.contains('button', 'logout').click()
      cy.get('#username').type('cypress2')
      cy.get('#password').type('cypress123')
      cy.get('#login-button').click()
      cy.contains('button', 'view').click()

      cy.get('.blog').should('not.contain', 'remove')
    })
  })

  describe('When logged in 2', function () {
    beforeEach(function () {
      cy.request({
        url: 'http://localhost:3003/api/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          username: 'cypress',
          password: 'cypress123',
        },
      }).then((response) => {
        const token = response.body.token
        localStorage.setItem('loggedUser', JSON.stringify(response.body))
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'The title with the most likes',
            author: 'Cypress Tests',
            url: 'https://cypress.io',
            likes: 50,
          },
        })
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'The title with the second most likes',
            author: 'Cypress Tests',
            url: 'https://cypress.io',
            likes: 30,
          },
        })
        cy.visit('')
      })
    })

    it('Blogs are ordered by likes', function () {
      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).contains('The title with the most likes')
        cy.wrap(blogs[1]).contains('The title with the second most likes')
      })
    })
  })
})
