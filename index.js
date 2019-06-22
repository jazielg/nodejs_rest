const express = require('express')
const app = express();
const Mysql = require('./mysql')
const Mongo = require('./mongo')

// Dados Javascript
let usersJson = require('./users')

// Iniciar conexão MySql
const mysql = new Mysql()
const mongo = new Mongo()

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Index
app.get('/api/users', async (req, res) => {
	// Mysql
	const dados = await mysql.index()
	res.status(200).json(dados)

	// JSON
	// res.status(200).json(usersJson)
})

// Read
app.get('/api/user/:id', async (req, res) => {
	// Mysql
	const user = await mysql.read({id: req.params.id})
	res.status(200).json(user)

	// JSON
	//res.json(users.filter(user => user.id === parseInt(req.params.id)))
})

// Create
app.post('/api/user', async (req, res) => {
	const newUser = {
		nome: req.body.nome,
		idade: req.body.idade
	}

	// Mongo
	const data = await mongo.create(newUser)
	res.status(201).json({msg: 'Criado com sucesso', data})

	// MySql
	// const data = await mysql.create(newUser)
	// res.status(201).json({msg: 'Criado com sucesso', data})

	// JSON
	// usersJSON.push(newUser)
	// res.status(201).json({msg: 'Criado com sucesso'})
})

// Update
app.put('/api/user/:id', async (req, res) => {
	// Mysql
	const [data] = await mysql.update(req.body, req.params.id)
	if(data === 1) res.status(200).json({msg:"Usuario atualizado com sucesso"})
	res.status(422).json({msg:"Usuarios com parametros errados"})

	// JSON
	// const indice = users.findIndex(item => item.id === parseInt(req.params.id))
    // if (indice === -1) res.status(404).json({msg: "Usuario não encontrado"})
	// updateUser = req.body
    // users[indice] = {...users[indice], ...updateUser}
	// res.status(200).json({msg:"Usuario atualizado com sucesso"})
})

// Delete
app.delete('/api/user/:id', async (req, res) => {
	// Mysql
	const data = await mysql.delete(req.params.id)
	if(data === 1) res.status(200).json({msg:"Usuario deletado com sucesso"})
	res.status(404).json({msg:"Usuario não foi encontrado"})

	// JSON
	// const indice = users.findIndex(item => item.id === parseInt(req.params.id))
	// if (indice === -1) res.status(404).json({msg: "Usuario não encontrado"})
	// users.splice(indice, 1)
	// res.status(200).json({msg:"Usuario deletado com sucesso"})
})

// Run server
app.listen(5000, () => console.log('Server running on port 5000'))