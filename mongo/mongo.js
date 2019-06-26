const Mongoose = require('mongoose')
const STATE = {
	0: 'Disconectado',
	1: 'Conectado',
	2: 'Conectando',
	3: 'Disconectando' 
}

class Mongo {

	constructor(connection, schema) {
		this._connection = connection
		this._schema = schema
	}

	static connect() {
		Mongoose.connect('mongodb://localhost:27017/nodejs', {useNewUrlParser: true}, function(error) {
			if(!error) return ;
			console.log('Erro na conexão', error)
		})

		const connection = Mongoose.connection
		connection.once('open', () => console.log('Conectado com mongodb'))

		return connection
	}

	async index(skip=0, limit=10) {
		return this._schema.find().skip(skip).limit(limit)
	}
	
	async read(id) {
		return this._schema.findById(id)
	}

	async create(item) {
		return this._schema.create(item)
	}

	async update(item, id) {
		return this._schema.updateOne({ _id: id}, {$set: item })
	}

	async delete(id) {
		return this._schema.deleteOne({ _id: id})
	}

	async isConnected() {
		return STATE[this._connection.readyState]
	}
}

module.exports = Mongo
