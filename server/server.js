const path = require("path")
const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const { generateMessage } = require("./utils/message")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(path.join(__dirname, "../public")))

io.on("connection", socket => {
    console.log("new user connected")

    socket.emit("newMessage", generateMessage("admin", "welcome to the chat app!"))

    socket.broadcast.emit("newMessage", generateMessage("admin", "New user connected!"))

    socket.on("createMessage", (message, callback) => {
        console.log("createMessage", message)
        io.emit("newMessage", generateMessage(message.from, message.text))
        callback()
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

server.listen(3000, () => {
    console.log(process.env.PORT || 3000)
})