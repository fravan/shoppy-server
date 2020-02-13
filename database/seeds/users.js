const { sql } = require('slonik')
const bcrypt = require('bcryptjs')

async function addUser(
  connection,
  { firstName, lastName, email, password, type }
) {
  return await connection.oneFirst(sql`
    INSERT INTO users (first_name, last_name, email, password, type, active)
    VALUES (${firstName}, ${lastName}, ${email}, ${password}, ${type}, TRUE)
    RETURNING id
  `)
}

async function start(connection) {
  console.log('  Adding some users...')
  const franckPassword = await bcrypt.hash('franck', 10)
  const louisPassword = await bcrypt.hash('louis', 10)
  const mariaPassword = await bcrypt.hash('maria', 10)

  const franck = await addUser(connection, {
    firstName: 'Franck',
    lastName: 'Chtelfrave',
    email: 'franck@example.com',
    password: franckPassword,
    type: 2,
  })
  const louis = await addUser(connection, {
    firstName: 'Louis',
    lastName: 'Deromarin',
    email: 'louis.deromarin@example.com',
    password: louisPassword,
    type: 1,
  })
  const maria = await addUser(connection, {
    firstName: 'Maria',
    lastName: 'Deromarin',
    email: 'maria.deromarin@example.com',
    password: mariaPassword,
    type: 0,
  })

  console.log('      users inserted !')
  return [franck, louis, maria]
}

module.exports = start
