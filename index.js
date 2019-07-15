const express = require('express')
const app = express();
const { check, validationResult } = require('express-validator')

const Mysql = require('./mysql/mysql')
const PessoaSchemaMysql = require('./mysql/schemas/pessoaSchema')
const UsuarioSchemaMysql = require('./mysql/schemas/usuarioSchema')

const Mongo = require('./mongo/mongo')
const PessoaSchemaMongo = require('./mongo/schemas/pessoaSchema')

// Autenticação
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./helpers/passwordHelper')
const JWT_SECRET = 'MINHA_CHAVE_SECRETA'

// Dados Javascript
let pessoasJson = require('./pessoas')

const db = new Mysql(PessoaSchemaMysql)
const db_auth = new Mysql(UsuarioSchemaMysql)
// const db = new Mongo(PessoaSchemaMongo)

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Index
app.get('/api/pessoas', verifyToken, async (req, res) => {
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
app.get('/api/pessoas/:id', [
	check('id', 'Id invalido').isInt()
], verifyToken, async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	// Mysql e Mongo
	const pessoa = await db.read({id: req.params.id})
	res.status(200).json(pessoa)

	// JSON
	//res.json(pessoas.filter(pessoa => pessoa.id === parseInt(req.params.id)))
})

// Create
app.post('/api/pessoas', [
	check('nome').isString().isLength({ max: 255 }),
	check('idade').isNumeric()
], verifyToken, async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const novaPessoa = {
		nome: req.body.nome,
		idade: req.body.idade
	}

	// Mysql e Mongo
	const data = await db.create(novaPessoa)
	res.status(201).json({ message: 'Criado com sucesso', data })

	// JSON
	// pessoasJSON.push(novaPessoa)
	// res.status(201).json({message: 'Criado com sucesso'})
})

// Update
app.patch('/api/pessoas/:id', [
	check('nome', 'Nome invalido').isString().isLength({ max: 255 }),
	check('idade', 'Idade invalida').isNumeric()
], verifyToken, async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	// Mysql e Mongo
	const data = await db.update(req.params.id, req.body)
	res.status(200).json({ message: "Usuario atualizado com sucesso", data })

	// JSON
	// const indice = pessoas.findIndex(item => item.id === parseInt(req.params.id))
	// if (indice === -1) res.status(404).json({message: "Usuario não encontrado"})
	// updatePessoa = req.body
	// pessoas[indice] = {...pessoas[indice], ...updatePessoa}
	// res.status(200).json({message:"Usuario atualizado com sucesso"})
})

// Delete
app.delete('/api/pessoas/:id', [
	check('id', 'Id invalido').isInt()
], verifyToken, async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	// Mysql e Mongo
	const data = await db.delete(req.params.id)
	res.status(200).json({ message: "Usuario deletado com sucesso" })

	// JSON
	// const indice = pessoas.findIndex(item => item.id === parseInt(req.params.id))
	// if (indice === -1) res.status(404).json({message: "Usuario não encontrado"})
	// pessoas.splice(indice, 1)
	// res.status(200).json({message:"Usuario deletado com sucesso"})
})

// AUTH - Register
app.post('/api/register',[
	check('username', 'Usuario invalido.').isString().isLength({ max: 255 }),
	check('password', 'Senha invalida.').isString()
], async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { username, password } = req.body
	const novoUsername = username.toLowerCase()
	const novoPassword = await PasswordHelper.hashPassword(password)
	
	const data = await db_auth.create({username: novoUsername, password: novoPassword})
	res.status(201).json(data)
})

// AUTH - Login
app.post('/api/login', [
	check('username', 'Usuario ou senha invalida.').isString().isLength({ max: 255 }),
	check('password', 'Usuario ou senha invalida.').isString()
], async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { username, password } = req.body

	const [usuario] = await db_auth.read({ username: username.toLowerCase() })

	if(!usuario)  return res.status(422).json({message: "Usuario ou senha invalida"})

	const match = await PasswordHelper.comparePassword(password, usuario.password)
	if(!match)  return res.status(422).json({message: "Usuario ou senha invalida"})

	const token = Jwt.sign({
		username,
		id: usuario.id
	}, JWT_SECRET, { expiresIn: '24h' })

	return res.status(200).json({ token });
})

function verifyToken(req, res, next) {
	const headerToken = req.headers['authorization']

	if(typeof headerToken !== 'undefined') {
		Jwt.verify(headerToken, JWT_SECRET, (err, authData) => {
			if(err) {
				res.sendStatus(403)
			} else {
				next()
			}
		})
	} else {
		return res.sendStatus(403)
	}
}

// Run server
app.listen(5000, () => console.log('Server running on port 5000'))