import Controller from "../../../app/Controller"

describe('Controller Class instantiation test ', () => {

    it('Controller can be instantiated', async (done) => {
        const controller = new Controller();
        expect(controller).not.toBeUndefined()
        expect(controller).not.toBeNull()
        done()
    })
})

