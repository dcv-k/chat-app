var { expect } = require("expect")
const { generateMessage, generateLocationMessage } = require("./message")

describe("Generate message", () => {
    it("should generate correct message object", () => {
        let from = "test from"
        let text = "test text"
        let message = generateMessage(from, text)
        
        expect(typeof message.createdAt).toBe("number")
        expect(message).toMatchObject({from, text})
    })
})

describe("Generate location message", () => {
    it("should generate correct location object", () => {
        let from = "test from"
        let lat = 44
        let lng = 55
        let url = `https://www.google.com/maps?q=${lat}, ${lng}`
        let message = generateLocationMessage(from, lat, lng)

        expect(typeof message.createdAt).toBe("number")
        expect(message).toMatchObject({from, url})
    })
})