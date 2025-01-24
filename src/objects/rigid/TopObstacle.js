import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { Obstacle } from './Obstacle';
export class TopObstacle extends Obstacle {
    constructor(width, height, zPosition, color = 0xf00fff) {
       super(width, height, color)
        console.log(this.width)
        console.log(-20 + (this.width/2))
        this.body.position.set(0, (30 - this.height / 2), zPosition)
    }
}
