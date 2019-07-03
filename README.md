# Node.js RESTful API
> RESTful API construido em Node.js, possibilitando a utilização do framework express ou Hapi, sendo o modo de autenticação aplicado ao framework Hapi, e preparado para utilizar o banco de dados em Mysql ou MongoDB.

## Iniciar aplicação
```bash
# Instalar dependências
npm i

# Servidor localhost:5000
npm start
```

## API Endpoints

#### Rotas Usuários - Autenticação
 - POST /api/register <br>
 `curl -d '{"username":"user", "password":"mypass"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/register`

 - POST /api/login <br>
 `curl -d '{"username":"user", "password":"mypass"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/login`

#### Rotas Pessoas - Dados
 - GET /api/pessoas (protegida) <br>
 `curl -H "Authorization:token" -H "Content-Type: application/json" -X GET http://localhost:5000/api/pessoas`
 - POST /api/pessoas (protegida) <br>
 `curl -d '{"nome":"pessoa1", "idade":"20"}' -H "Content-Type: application/json" -H "Authorization:token" -X POST http://localhost:5000/api/pessoas`
 - GET /api/pessoas/:id (protegida) <br>
 `curl -H "Content-Type: application/json" -H "Authorization:token" -X GET http://localhost:5000/api/pessoas/1`
 - PUT /api/pessoas/:id (protegida) <br>
 `curl -d '{"idade":"21"}' -H "Content-Type: application/json" -H "Authorization:token" -X PATCH http://localhost:5000/api/pessoas/1`
 - DELETE /api/pessoas/:id (protegida) <br>
  `curl -H "Content-Type: application/json" -H "Authorization:token" -X DELETE http://localhost:5000/api/pessoas/1`
  
