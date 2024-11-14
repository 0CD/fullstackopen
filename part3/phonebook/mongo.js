const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!password) {
  console.log('Please provide the MongoDB password as the first argument.')
  process.exit(1)
}

const url = `mongodb+srv://matt:${password}@fullstackopen.kbkga.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({ name, number })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch(error => {
      console.error('Error adding person to phonebook:', error.message)
      mongoose.connection.close()
    })
}
else if (!name && !number) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.error('Error fetching phonebook:', error.message)
      mongoose.connection.close()
    })
}
else {
  console.log('Please provide both name and phone number, or only the password to view all entries.')
  mongoose.connection.close()
}
