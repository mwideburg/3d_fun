import * as THREE from 'three';

export class Ground {
    constructor(color = 0x0000ff) {
        const geometry = new THREE.PlaneGeometry(30, 30);
        const material = new THREE.MeshStandardMaterial({ color });
        this.object = new THREE.Mesh(geometry, material);
        this.object.receiveShadow = true;
    }

    getObject() {
        return this.object;
    }

    createPhysics(){
        
    }
}
