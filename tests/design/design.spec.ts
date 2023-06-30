import design from "../../src/design"

describe("design", () => {
    it("shoudl return the expected design objects", () => {
        const cr = {}
        const br = {}

        expect(design.withConfig(cr, br)).toHaveProperty("controller")
        expect(design.withConfig(cr, br)).toHaveProperty("f")
        expect(design.withConfig(cr, br)).toHaveProperty("chain")
        expect(design.withConfig(cr, br)).toHaveProperty("c")
        expect(design.withConfig(cr, br)).toHaveProperty("alt")
        expect(design.withConfig(cr, br)).toHaveProperty("a")
    })
})
