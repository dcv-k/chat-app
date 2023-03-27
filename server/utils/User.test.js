const { expect } = require("expect")

const { User } = require("./User")

describe("User", () => {

    let user;

    beforeEach(() => {
        user = new User()
        user.users = [
            {
                id: "0001",
                name: "bhanu",
                room: "mma"
            },
            {
                id: "0002",
                name: "nate",
                room: "mma"
            },
            {
                id: "0003",
                name: "conor",
                room: "boxing"
            }
        ]
    })

    it("should add new user", () => {
        let user = new User()
        let obj = {
            id: "0001",
            name: "bhanu",
            room: "mma"
        }

        let reUser = user.addUser(obj.id, obj.name, obj.room)

        expect(user.users).toEqual([obj])
    })

    it("should give names of boxing fans", () => {
        let userList = user.getUserList("boxing")

        expect(userList).toEqual(["conor"])
    })

    it("should find user", () => {
        let reUser = user.getUser("0002")
        
        expect(reUser.id).toBe("0002")
    })

    it("should not find user", () => {
        let reUser = user.getUser("2")
        
        expect(reUser).toBeUndefined()
    })

    it("should remove user", () => {
        let deUser = user.removeUser("0003")

        expect(deUser.id).toBe("0003")
        expect(user.users.length).toBe(2)
    })

    it("should not remove user", () => {
        let deUser = user.removeUser("3")

        expect(deUser).toBeUndefined()
        expect(user.users.length).toBe(3)
    })
})