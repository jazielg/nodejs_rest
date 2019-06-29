const Sequelize = require('sequelize')

class Mysql {

	constructor(schema) {
		this._schema = null
		this._connection = this.connect()
		this.defineModel(schema)
	}

	async connect() {
		const connection = new Sequelize('nodejs', 'root', '123456', {
		  	dialect: 'mysql',
		  	host: 'localhost'
		})
		return connection
	}

	async defineModel(schema) {
		const connection = await this._connection
		const model = connection.define(
			schema.name, schema.schema, schema.options
		)
		this._schema = await model.sync()
	}

	async index(offset = null, limit = null) {
		return this._schema.findAll({offset, limit, raw: true })
	}

	async read(id) {
		return this._schema.findAll({where: {id}, raw: true})
	}

	async create(item) {
		const { dataValues } = await this._schema.create(item)
		return dataValues
	}

	async update(id, item) {
		return this._schema.update(item, {where: {id}})
	}

	async delete(id) {
		return this._schema.destroy({where: {id}})
	}

	async isConnected() {
		try {
			await this._connection.authenticate()
			return true
		} catch(error) {
			console.log('Fail!', error)
			return false
		}
	}
}

module.exports = Mysql
