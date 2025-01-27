import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Wall {
    constructor(position, color = 0x8B4513) {
        const geometry = new THREE.BoxGeometry(900, 30, 1);
        const material = new THREE.MeshStandardMaterial({
            color,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material({friction: 0, restitution: 1});
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(450, 15, 0.5)),
            type: CANNON.Body.STATIC,
            material: this.physMat
        });
        this.body.quaternion.setFromEuler(0, -Math.PI / 2, 0)
        this.body.position.set(...position)
    }

}
