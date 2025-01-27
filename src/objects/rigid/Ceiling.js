import { Ground } from "./Ground"

export class Ceiling extends Ground {
    constructor(color = 0x87CEEB){
        super(color)
        this.body.position.set(0, 30, -150)
    }
}