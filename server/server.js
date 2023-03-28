const path = require("path")
const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const { generateMessage, generateLocationMessage } = require("./utils/message")
const { isRealString } = require("./utils/isRealString")
const { User } = require("./utils/User")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
let user = new User()

app.use(express.static(path.join(__dirname, "../public")))

io.on("connection", socket => {

    socket.on("join", (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name & Room required")
        }

        socket.join(params.room)
        user.removeUser(socket.id)
        user.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit("updateUsersList", user.getUserList(params.room))
        socket.emit("newMessage", generateMessage("admin", `welcome to the chat room ${params.room}`))

        socket.broadcast.emit("newMessage", generateMessage("admin", `${params.name} joined the chat`))
    })

    socket.on("createMessage", (message, callback) => {
        let reUser = user.getUser(socket.id)

        if (reUser && isRealString(message.text)) {
            io.to(reUser.room).emit("newMessage", generateMessage(user.name, message.text))
        }

        io.emit("newMessage", generateMessage(message.from, message.text))
        callback()
    })

    socket.on("createLocationMessage", (coords) => {
        let reUser = user.getUser(socket.id)

        if (user) {
            io.to(reUser.room).emit("newLocationMessage", generateLocationMessage("admin", coords.lat, coords.lng))
        }
    })

    socket.on("disconnect", () => {
        let reUser = user.removeUser(socket.id)

        if (user) {
            io.to(reUser.room).emit("updateUserList", user.getUserList(reUser.room))
            io.to(reUser.room).emit("newMessage", generateMessage("admin", `${reUser} has left ${reUser.room} room`))
        }
    })
})

server.listen(3000, () => {
    console.log(process.env.PORT || 3000)
})