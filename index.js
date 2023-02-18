const {
    request,
    response
} = require('express');
const express = require('express');
const uuid = require('uuid');

const port = 3000
const app = express()

app.use(express.json())
/* 

    - Query params => meusite.com/projects?name=myName&age=myAge // FILTRO
    - Route params => /projects // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
    - Middleware => INTECEPTADOR => Tem o pode de parar ou alterar dados da requisição 
    
*/
const users = []
/* Middleware */
const checkUpdateId = (request, response, next) => {
    const {
        id
    } = request.params
    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({
            message: "User not found"
        })

    }

    request.userIndex = index
    request.userId = id

    next()
}
/*  GET */
app.get('/users', (request, response) => {
    return response.json(users)
})
/* const { id } = request.params */ //Destructiring assignment //
/*  POST */
app.post('/users', (request, response) => {
    const {
        name,
        age
    } = request.body

    const user = {
        id: uuid.v4(),
        name,
        age
    }

    users.push(user)

    return response.status(201).json(user);

})
/*  PUT - Usaremos aqui o Middlens*/

app.put('/users/:id', checkUpdateId, (request, response) => {
    const {
        name,
        age
    } = request.body

    const index = request.userIndex
    const id = request.userId

    const updateUser = {
        id,
        name,
        age
    }
    users[index] = updateUser
    return response.json(updateUser)
})
/*  DELETE - Usaremos aqui o Middlens*/
app.delete('/users/:id', checkUpdateId, (request, response) => {

    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()

})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})