const express = require('express')
const uuid = require('uuid')
const app = express()

app.use(express.json())


const orders = []

const checkUserId = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return response.status(404).json({error: "order not found"})
    }

    request.userIndex = index
    request.userId = id

    next()

}

const checkMethodAndUrl = (request, response, next) => {

    const url = request.url
    const method = request.method

    console.log(method, url)

    next()

}

app.get('/order/', checkMethodAndUrl, (request, response) => {

    return response.json(orders)
})

app.get ('/order/:id', checkUserId, checkMethodAndUrl, (request, response) => {

    const index = request.userIndex


    return response.json(orders[index])
})

app.post('/order/', checkMethodAndUrl, (request, response) => {

    const { order, clientName, price } = request.body

    const clientOrder = { id: uuid.v4(), order, clientName, price, status: "in preparation" }

    orders.push(clientOrder)

    return response.status(201).json(orders)
})

app.put('/order/:id', checkUserId, checkMethodAndUrl, (request, response) => {

    const {order, clientName, price} = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedOder = { id, order, clientName, price, status: "in preparation"}

    orders[index] = updatedOder

    return response.json(orders)
})

app.delete('/order/:id', checkUserId, checkMethodAndUrl, (request, response) => {

    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/order/:id', checkUserId, checkMethodAndUrl, (request, response) => {

    const index = request.userIndex

    orders[index].status = "ready"

    

    return response.json(orders[index])


})



app.listen(3000, () => {

    console.log('✅ Server started on port: 3000')
})