import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Ground {
    constructor(color = 0x0000ff) {
        const geometry = new THREE.BoxGeometry(300, 300, 1);
        const material = new THREE.MeshStandardMaterial({
            color,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material();
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(150, 150, 0.5)),
            type: CANNON.Body.STATIC,
            material: this.physMat
        });
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    }

}
