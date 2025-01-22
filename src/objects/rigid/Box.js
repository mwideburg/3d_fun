import * as THREE from 'three';
import * as CANNON from 'cannon-es'

export class Box {
    constructor(size = { x: 2, y: 2, z: 2 }, color = 0xff0000) {
        this.size = size
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshPhongMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;

        this.physMat = new CANNON.Material();
        this.body = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            position: new CANNON.Vec3(5, 2, 0),
            material: this.physMat
        })

        this.body.angularVelocity.set(0, 10, 0);
        this.body.angularDamping = 0.5;
    }
}
