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

	async isConnected() {
		return STATE[this._driver.readyState]
	}
}

module.exports = Mongo
