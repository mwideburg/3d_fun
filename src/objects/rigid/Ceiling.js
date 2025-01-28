import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Ceiling {
    constructor(path, opacity, transparent, color = 0xfffff) {
        const geometry = new THREE.BoxGeometry(40, 500, 1);
        const material = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
            opacity,
            transparent
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material();
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(20, 450, 0.5)),
            type: CANNON.Body.STATIC,
            material: this.physMat
        });

        this.body.position.set(0, 30, -150)
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    }
}