const path = require("path")
const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const { generateMessage, generateLocationMessage } = require("./utils/message")
const { isRealString } = require("./utils/isRealString")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(path.join(__dirname, "../public")))

io.on("connection", socket => {

    socket.on("join", (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback("Name & Room required")
        }

        socket.join(params.room)
    
        socket.emit("newMessage", generateMessage("admin", `welcome to the chat room ${params.room}`))

        socket.broadcast.emit("newMessage", generateMessage("admin", `${params.name} joined the chat`))
    })

    socket.on("createMessage", (message, callback) => {
        console.log("createMessage", message)
        io.emit("newMessage", generateMessage(message.from, message.text))
        callback()
    })

    socket.on("createLocationMessage", (coords) => {
        io.emit("newLocationMessage", generateLocationMessage("admin", coords.lat, coords.lng))
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

server.listen(3000, () => {
    console.log(process.env.PORT || 3000)
})