const express = require('express')
const app = express();

const Mysql = require('./mysql/mysql')
const PessoaSchemaMysql = require('./mysql/schemas/pessoaSchema')

const Mongo = require('./mongo/mongo')
const PessoaSchemaMongo = require('./mongo/schemas/pessoaSchema')

// Dados Javascript
let pessoasJson = require('./pessoas')

// const db = new Mysql(PessoaSchemaMysql)
const db = new Mongo(PessoaSchemaMongo)

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Index
app.get('/api/pessoas', async (req, res) => {
	let { offset, limit } = req.query
	offset = (offset) ? parseInt(offset) : null
	limit = (limit) ? parseInt(limit) : null
	// Mysql e Mongo
	const dados = await db.index(offset, limit)
	res.status(200).json(dados)

	// JSON
	// res.status(200).json(pessoasJson)
})

// Read
app.get('/api/pessoas/:id', async (req, res) => {
	// Mysql e Mongo
	const pessoa = await db.read(req.params.id)
	res.status(200).json(pessoa)

	// JSON
	//res.json(pessoas.filter(pessoa => pessoa.id === parseInt(req.params.id)))
})

// Create
app.post('/api/pessoas', async (req, res) => {
	const novaPessoa = {
		nome: req.body.nome,
		idade: req.body.idade
	}

	// Mysql e Mongo
	const data = await db.create(novaPessoa)
	res.status(201).json({ msg: 'Criado com sucesso', data })

	// JSON
	// pessoasJSON.push(novaPessoa)
	// res.status(201).json({msg: 'Criado com sucesso'})
})

// Update
app.patch('/api/pessoas/:id', async (req, res) => {
	// Mysql e Mongo
	const data = await db.update(req.params.id, req.body)
	res.status(200).json({ msg: "Usuario atualizado com sucesso" })

	// JSON
	// const indice = pessoas.findIndex(item => item.id === parseInt(req.params.id))
	// if (indice === -1) res.status(404).json({msg: "Usuario não encontrado"})
	// updatePessoa = req.body
	// pessoas[indice] = {...pessoas[indice], ...updatePessoa}
	// res.status(200).json({msg:"Usuario atualizado com sucesso"})
})

// Delete
app.delete('/api/pessoas/:id', async (req, res) => {
	// Mysql e Mongo
	const data = await db.delete(req.params.id)
	res.status(200).json({ msg: "Usuario deletado com sucesso" })

	// JSON
	// const indice = pessoas.findIndex(item => item.id === parseInt(req.params.id))
	// if (indice === -1) res.status(404).json({msg: "Usuario não encontrado"})
	// pessoas.splice(indice, 1)
	// res.status(200).json({msg:"Usuario deletado com sucesso"})
})

// Run server
app.listen(5000, () => console.log('Server running on port 5000'))