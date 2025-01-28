import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { Obstacle } from './Obstacle';
export class TopObstacle extends Obstacle {
    constructor(width, height, zPosition, color = 0xf00f0f) {
       super(width, height, color)
        this.body.position.set(0, (30 - this.height / 2), zPosition)
    }
}
