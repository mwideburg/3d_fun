import * as THREE from 'three';

export class SpotLight {
    constructor(
        color = 0xffffff,
        intensity = 10,
        distance = 100,
        angle = Math.PI / 6, // Default to 30 degrees (Math.PI / 6)
        position = { x: 0, y: 30, z: 0 },
    ) {
        this.light = new THREE.SpotLight(color, intensity, distance, angle, .2, 0);
        // this.helper = new THREE.SpotLightHelper(this.light, 5);
        
        this.light.position.set(position.x, position.y, position.z);
        this.light.shadow.mapSize.width = 1024; // Higher for better shadow quality
        this.light.shadow.mapSize.height = 1024;
        this.light.shadow.camera.near = 0.5; // Closer near plane for sharper shadows
        this.light.shadow.camera.far = 200;
        this.light.castShadow = true;

    }
}
