const { expect } = require("expect")

const { isRealString } = require("./isRealString")

describe("Is real string", () => {
    it("should reject non-string values", () => {
        let res = isRealString(65)
        expect(res).toBe(false)
    })

    it("should reject string with only spaces", () => {
        let res = isRealString(" ")
        expect(res).toBe(false)
    })

    it("should allow string with non-space chars", () => {
        let res = isRealString(" test ")
        expect(res).toBe(true)
    })
})