let scrollToBottom = () => {
    let message = document.querySelector("#messages").lastElementChild
    message.scrollIntoView()
}

let socket = io()

socket.on("connect", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsObject = Object.fromEntries(urlParams.entries());

    socket.emit("join", paramsObject, (err) => {
        if (err) {
            alert(err)
            window.location.href = "/"
        } else {
            console.log("connected to server")
        }
    })
})

socket.on("disconnect", () => {
    console.log("disconnected from server")
})

socket.on("updateUsersList", (users) => {
    let ol = document.createElement("ol")

    users.forEach((user) => {
        let li = document.createElement("li")
        li.innerHTML = user
        ol.appendChild(li)
    })

    let userList = document.querySelector("#people")
    userList.innerHTML = ""
    userList.appendChild(ol)
})

socket.on("newMessage", message => {
    let formattedTime = moment(message.createdAt).format("LT")
    let template = document.querySelector("#message-template").innerHTML
    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    })

    let div = document.createElement("div")
    div.innerHTML = html

    document.querySelector("#messages").append(div)

    scrollToBottom()
})

socket.on("newLocationMessage", message => {
    let formattedTime = moment(message.createdAt).format("LT")
    let template = document.querySelector("#location-message-template").innerHTML
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    })
    
    let div = document.createElement("div")
    div.innerHTML = html

    document.querySelector("#messages").appendChild(div)

    scrollToBottom()
})

document.querySelector("#btn-submit").addEventListener("click", e => {
    e.preventDefault()
    socket.emit("createMessage", {
        from: "User",
        text: document.querySelector("input[name='message']").value
    }, () => {})
})

document.querySelector("#send-location").addEventListener("click", () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser")
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            socket.emit("createLocationMessage", {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        },
        () => {
            alert("Unable to fetch location")
        }
    )
})