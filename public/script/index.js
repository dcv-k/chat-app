let socket = io()

socket.on("connect", () => {
    console.log("connected to server")
})

socket.on("disconnect", () => {
    console.log("disconnected from server")
})

socket.on("newMessage", message => {
    console.log(message)
})

socket.emit("createMessage", {
    from: "John",
    text: "Hey!"
},
() => {
    console.log("server got it")
})