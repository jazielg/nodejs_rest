const Hapi = require('hapi')
const Joi = require('joi')

const Mysql = require('./mysql/mysql')
const PessoaSchemaMysql = require('./mysql/schemas/pessoaSchema')

const Mongo = require('./mongo/mongo')
const PessoaSchemaMongo = require('./mongo/schemas/pessoaSchema')

const Jwt = require('jsonwebtoken')
const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'MINHA_CHAVE_SECRETA'

const app = new Hapi.server({
    port: 5000
})

async function main() {
    const db = new Mongo(PessoaSchemaMongo)

    await app.register([
        HapiJwt
    ])
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: (dado, request) => {
            // Verifica no banco se o usuario continua ativo
            return {
                isValid: true // caso não valido false  
            }
        }
    })
    app.auth.default('jwt')

    const headers = Joi.object({
        authorization: Joi.string().required()
    }).unknown()

    app.route([
        // Index
        {
            path: '/api/pessoas',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    headers,
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
            path: '/api/pessoas/{id}',
            method: 'GET',
            config: {
                validate: {
                    headers
                }
            },
            handler: async (request, headers) => {
                const data = await db.read(request.params.id)
                return headers.response(data).code(200)
            }
        },
        // Create
        {
            path: '/api/pessoas',
            method: 'POST',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(255),
                        idade: Joi.number().integer().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const { nome, idade } = request.payload
                const data = await db.create({ nome, idade })
                return headers.response({ message: "Criado com sucesso!", data }).code(201)
            }
        },
        // Update
        {
            path: '/api/pessoas/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    headers,
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
        // Delete
        {
            path: "/api/pessoas/{id}",
            method: "DELETE",
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const { id } = request.params

                const result = await db.delete(id)
                return headers.response({ message: "Deletado com sucesso!", result }).code(200)
            }
        },
        // AUTH
        {
            path: "/api/login",
            method: "POST",
            config: {
                auth: false,
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
                    payload: {
                        username: Joi.string().required().max(255),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const { username, password } = request.payload

                if (username !== 'user1' || password !== '123')
                    return headers.response({ statusCode: 401, error: "Unauthorized", message: "Unauthorized" }).code(401)

                const token = Jwt.sign({
                    username,
                    id: 1
                }, JWT_SECRET)

                return { token }
            }
        }
    ])

    await app.start()
    console.log("Server running on port", app.info.port);
}

main()
