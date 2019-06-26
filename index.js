const express = require('express')
const app = express();

const Mysql = require('./mysql/mysql')
const PessoaSchemaMysql = require('./mysql/schemas/pessoaSchema')

const Mongo = require('./mongo/mongo')
const PessoaSchemaMongo = require('./mongo/schemas/pessoaSchema')

// Dados Javascript
let usersJson = require('./users')

const db = new Mysql(PessoaSchemaMysql)
// const db = new Mongo(PessoaSchemaMongo)

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Index
app.get('/api/users', async (req, res) => {
	// Mysql e Mongo
	const dados = await db.index()
	res.status(200).json(dados)

	// JSON
	// res.status(200).json(usersJson)
})

// Read
app.get('/api/users/:id', async (req, res) => {
	// Mysql e Mongo
	const user = await db.read(req.params.id)
	res.status(200).json(user)

	// JSON
	//res.json(users.filter(user => user.id === parseInt(req.params.id)))
})

// Create
app.post('/api/users', async (req, res) => {
	const newUser = {
		nome: req.body.nome,
		idade: req.body.idade
	}

	// Mysql e Mongo
	const data = await db.create(newUser)
	res.status(201).json({msg: 'Criado com sucesso', data})

	// JSON
	// usersJSON.push(newUser)
	// res.status(201).json({msg: 'Criado com sucesso'})
})

// Update
app.put('/api/users/:id', async (req, res) => {
	// Mysql e Mongo
	const data = await db.update(req.body, req.params.id)
	res.status(200).json({msg:"Usuario atualizado com sucesso"})

	// JSON
	// const indice = users.findIndex(item => item.id === parseInt(req.params.id))
    // if (indice === -1) res.status(404).json({msg: "Usuario não encontrado"})
	// updateUser = req.body
    // users[indice] = {...users[indice], ...updateUser}
	// res.status(200).json({msg:"Usuario atualizado com sucesso"})
})

// Delete
app.delete('/api/users/:id', async (req, res) => {
	// Mysql e Mongo
	const data = await db.delete(req.params.id)
	res.status(200).json({msg:"Usuario deletado com sucesso"})

	// JSON
	// const indice = users.findIndex(item => item.id === parseInt(req.params.id))
	// if (indice === -1) res.status(404).json({msg: "Usuario não encontrado"})
	// users.splice(indice, 1)
	// res.status(200).json({msg:"Usuario deletado com sucesso"})
})

// Run server
app.listen(5000, () => console.log('Server running on port 5000'))