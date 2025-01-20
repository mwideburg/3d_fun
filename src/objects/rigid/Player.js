import { Box } from "./Box"


export class Player extends Box {
    constructor(color = 0x00ff00){
        super(undefined, color)
    }
}