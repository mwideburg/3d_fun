import * as THREE from 'three';

export class AmbientLight {
    constructor(color = 0xffffff, intensity = 0.5) {
        this.light = new THREE.AmbientLight(color, intensity);
    }
}
