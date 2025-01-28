import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Ground {
    constructor(color = 0xff0000) {
        const geometry = new THREE.BoxGeometry(40, 500, 1);
        const material = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
            opacity: .4,
            transparent: true
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material();
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(250, 250, 0.5)),
            type: CANNON.Body.STATIC,
            material: this.physMat
        });

        this.body.position.set(0, 0, -150)
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    }

}
