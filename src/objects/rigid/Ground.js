import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Ground {
    constructor(color = 0x0fffff) {

        // Load a low-resolution pixelated texture
        const texture = new THREE.TextureLoader().load('pixelated.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.repeat.set(8, 8); // Increase tiling
        texture.offset.set(0.1, 0.1); // Add offset for variation

        const geometry = new THREE.BoxGeometry(40, 900, 1);
        const material = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
            map: texture
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material();
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(20, 450, 0.5)),
            type: CANNON.Body.STATIC,
            material: this.physMat
        });

        this.body.position.set(0, 0, -150)
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    }

}
