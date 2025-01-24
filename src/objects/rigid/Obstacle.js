import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Obstacle {
    constructor(width, height, color = 0xf0ffff) {
        this.height = height
        this.width = width
        const geometry = new THREE.BoxGeometry(1, this.getRandomHeight(), this.getRandomWidth());
        const material = new THREE.MeshStandardMaterial({
            color,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material({friction: 0, restitution: 1});
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(.5, this.height/2, this.width/2)),
            type: CANNON.Body.STATIC,
            material: this.physMat
        });
        this.body.quaternion.setFromEuler(0, -Math.PI / 2, 0)

        this.body.position.set(-20 + (this.width/2) + 1, 15, -40)
    }

    getRandomWidth() {
        if(this.width) return this.width
        // Ensure min and max are integers
        const scaledMin = Math.ceil(3);
        const scaledMax = Math.floor(6);

        const randomScaled = Math.floor(Math.random() * (scaledMax - scaledMin + 1)) + scaledMin;

        this.width = randomScaled * 5
        return this.width
    }

    getRandomHeight() {
        if(this.height) return this.height
        // Ensure min and max are integers
        const scaledMin = Math.ceil(3);
        const scaledMax = Math.floor(5);

        const randomScaled = Math.floor(Math.random() * (scaledMax - scaledMin + 1)) + scaledMin;

        this.height = randomScaled * 5
        return this.height
    }
}
