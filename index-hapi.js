const Hapi = require('hapi')
const Joi = require('joi')

const Mysql = require('./mysql/mysql')
const PessoaSchemaMysql = require('./mysql/schemas/pessoaSchema')

const app = new Hapi.server({
    port: 5000
})

async function main() {
    const db = new Mysql(PessoaSchemaMysql)

    app.route([
        // Index
        {
            path: '/api/users',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    query: {
                        offset: Joi.number().integer().default(null),
                        limit: Joi.number().integer().default(null)
                    }
                }
            },
            handler: (request, head) => {
                const { offset, limit } = request.query
                return db.index(offset, limit)
            }
        },
        // Read
        {
            path: '/api/users/{id}',
            method: 'GET',
            handler: (request, head) => {
                return db.read(request.params.id)
            }
        },
        // Create
        {
            path: '/api/users',
            method: 'POST',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    payload: {
                        nome: Joi.string().required().min(3).max(255),
                        idade: Joi.number().integer().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const {nome, idade} = request.payload
                const result = await db.create({nome, idade})
                return headers.response(result).code(201)
            }
        },
        // Update
        {
            path: '/api/users/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(255),
                        idade: Joi.number().integer()
                    }
                }
            },
            handler: async (request, headers) => {
                const { id } = request.params
                const { payload } = request

                const dadosString = JSON.stringify(payload)
                const dados = JSON.parse(dadosString)

                const result = await db.update(id, dados)
                return headers.response().code(204)
            }
        }
    ])

    await app.start()
    console.log("Server running on port", app.info.port);
}

main()
