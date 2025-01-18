import * as THREE from 'three';

export class Box {
    constructor(size = { x: 1, y: 1, z: 1 }, color = 0xff0000) {
        this.size = size
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshStandardMaterial({ color });
        this.object = new THREE.Mesh(geometry, material);
        this.object.castShadow = true;
    }

    getObject() {
        return this.object;
    }

    setPosition(position) {
        this.object.position.copy(position);
    }

    rotate(x, y, z) {
        this.object.rotation.x += x;
        this.object.rotation.y += y;
        this.object.rotation.z += z;
    }
    
}
