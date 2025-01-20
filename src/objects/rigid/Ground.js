import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Ground {
    constructor(color = 0x0000ff) {
        const geometry = new THREE.BoxGeometry(300, 300, 0.2);
        const material = new THREE.MeshStandardMaterial({
            color,
            side: THREE.DoubleSide,
            wireframe: true
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material();
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
            type: CANNON.Body.STATIC,
            material: this.physMat
        });
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    }
}
