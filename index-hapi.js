const Hapi = require('hapi')
const Joi = require('joi')

const Mysql = require('./mysql/mysql')
const PessoaSchemaMysql = require('./mysql/schemas/pessoaSchema')

const Mongo = require('./mongo/mongo')
const PessoaSchemaMongo = require('./mongo/schemas/pessoaSchema')

const app = new Hapi.server({
    port: 5000
})

async function main() {
    const db = new Mongo(PessoaSchemaMongo)

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
            handler: async (request, headers) => {
                const { offset, limit } = request.query
                const data = await db.index(offset, limit)
                return headers.response(data).code(200)
            }
        },
        // Read
        {
            path: '/api/users/{id}',
            method: 'GET',
            handler: async (request, headers) => {
                const data = await db.read(request.params.id)
                return headers.response(data).code(200)
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
                const data = await db.create({nome, idade})
                return headers.response({message:"Criado com sucesso!", data}).code(201)
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
                return headers.response('Atualizado com sucesso!').code(200)
            }
        },
        {
            path: "/api/users/{id}",
            method: "DELETE",
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const { id } = request.params

                const result = await db.delete(id)
                return headers.response({message:"Deletado com sucesso!", result}).code(200)
            }
        }
    ])

    await app.start()
    console.log("Server running on port", app.info.port);
}

main()
