const path = require("path")
const express = require("express")
const http = require("http")
const socketIO = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(path.join(__dirname, "../public")))

io.on("connection", socket => {
    console.log("new user connected")

    socket.emit("newMessage", {
        from: "system",
        text: "Welcome to the chat app!"
    })

    socket.broadcast.emit("newMessage", {
        from: "system",
        text: "A new user connected!"
    })

    socket.on("createMessage", message => {
        console.log("createMessage", message)
        socket.emit("newMessage", {
            from: message.from,
            text: message.text
        })
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

server.listen(3000, () => {
    console.log(process.env.PORT || 3000)
})