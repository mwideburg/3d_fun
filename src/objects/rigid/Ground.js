import * as THREE from 'three';

export class Ground {
    constructor(size = { x: 20, y: 0.5, z: 20 }, color = 0x0000ff) {
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshStandardMaterial({ color });
        this.object = new THREE.Mesh(geometry, material);
        this.object.receiveShadow = true;
    }

    getObject() {
        return this.object;
    }
}
