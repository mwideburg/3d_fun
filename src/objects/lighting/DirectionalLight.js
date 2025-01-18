import * as THREE from 'three';

export class DirectionalLight {
    constructor(color = 0xffffff, intensity = 1, position = { x: 5, y: 10, z: 0 }) {
        this.light = new THREE.DirectionalLight(color, intensity);
        this.light.position.set(position.x, position.y, position.z);
        this.light.castShadow = true;
    }

    getLight() {
        return this.light;
    }
}
