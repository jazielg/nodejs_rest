# Node.js RESTful API
> Aplicação do curso de Nodejs do Erick Wendel(https://erickwendel.teachable.com/), RESTful API construido em Node.js, utilizando o framework express ou Hapi, sendo o modo de autenticação implementado ao framework Hapi, preparado para utilizar o banco de dados Mysql ou MongoDB.

## Iniciar aplicação
```bash
# Instalar dependências
npm i

# Servidor localhost:5000
npm start
```

## API Endpoints

#### Rotas Usuários - Autenticação
 - POST `/api/register` <br>
 ```bash
 curl -d '{"username":"user", "password":"mypass"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/register
 ```

 - POST `/api/login` <br>
 ```bash
 curl -d '{"username":"user", "password":"mypass"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/login
 ```

#### Rotas Pessoas - Dados
 - GET `/api/pessoas` (protegida) <br>
```bash
curl -H "Authorization:token" -H "Content-Type: application/json" -X GET http://localhost:5000/api/pessoas
```

 - POST `/api/pessoas` (protegida) <br>
 ```bash
 curl -d '{"nome":"pessoa1", "idade":"20"}' -H "Content-Type: application/json" -H "Authorization:token" -X POST http://localhost:5000/api/pessoas
 ```

 - GET `/api/pessoas/:id` (protegida) <br>
 ```bash
 curl -H "Content-Type: application/json" -H "Authorization:token" -X GET http://localhost:5000/api/pessoas/1
 ```

 - PUT `/api/pessoas/:id` (protegida) <br>
 ```bash
 curl -d '{"idade":"21"}' -H "Content-Type: application/json" -H "Authorization:token" -X PATCH http://localhost:5000/api/pessoas/1
 ```

 - DELETE `/api/pessoas/:id` (protegida) <br>
  ```bash
  curl -H "Content-Type: application/json" -H "Authorization:token" -X DELETE http://localhost:5000/api/pessoas/1
  ```
  
