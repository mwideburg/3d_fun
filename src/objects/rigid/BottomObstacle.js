import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { Obstacle } from './Obstacle';
export class BottomObstacle extends Obstacle {
    constructor(width, height, zPosition, color = 0xf00fff) {
       super(width, height, color)
        this.body.position.set(0, this.height / 2, zPosition)
    }
}
