const Mongoose = require('mongoose')
const STATE = {
	0: 'Disconectado',
	1: 'Conectado',
	2: 'Conectando',
	3: 'Disconectando' 
}

class Mongo {

	constructor() {
		this._driver = null
		this._dados = null
		this.connect()
	}

	async connect() {
		Mongoose.connect('mongodb://localhost:27017/nodejs', {useNewUrlParser: true}, function(error) {
			if(!error) return ;
			console.log('Erro na conexão', error)
		})

		const connection = Mongoose.connection
		connection.once('open', () => console.log('Conectado com mongodb'))
		this._driver = connection
		await this.defineModel()
	}

	async defineModel() {
		const dadosSchema = new Mongoose.Schema({
			nome: {
				type: String,
				required: true
			},
			idade: {
				type: Number,
				required: true
			},
			createdAt: {
				type: Date,
				default: new Date()
			}
		})

		this._dados = Mongoose.model('dados', dadosSchema)
	}

	async index(skip=0, limit=10) {
		return this._dados.find().skip(skip).limit(limit)
	}
	
	async read(id) {
		return this._dados.findById(id)
	}

	async create(item) {
		return this._dados.create(item)
	}

	async update(item, id) {
		return this._dados.updateOne({ _id: id}, {$set: item })
	}

	async delete(id) {
		return this._dados.deleteOne({ _id: id})
	}

	async isConnected() {
		return STATE[this._driver.readyState]
	}
}

module.exports = Mongo
