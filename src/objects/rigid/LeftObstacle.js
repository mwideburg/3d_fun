import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { Obstacle } from './Obstacle';
export class LeftObstacle extends Obstacle {
    constructor(width, height, zPosition, color = 0xf0ffff) {
       super(width, height, color)
        this.body.position.set(-20 + (this.width/2), 15, zPosition)
    }
}
