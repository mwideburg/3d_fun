import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Obstacle {
    constructor(width, height) {
        this.height = height
        this.width = width
        const retroColors = [0xff4500, 0xffd700, 0x00ff00, 0x1e90ff, 0xff1493];
        this.color = retroColors[Math.floor(Math.random() * retroColors.length)];
        
        const geometry = new THREE.BoxGeometry(1, this.getRandomHeight(), this.getRandomWidth());
        const material = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: .5,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true;

        this.physMat = new CANNON.Material({friction: 0, restitution: 1});
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(.5, this.height/2, this.width/2)),
            type: CANNON.Body.STATIC,
            material: this.physMat,
            collisionFilterGroup: 2,
        });
        this.body.quaternion.setFromEuler(0, -Math.PI / 2, 0)

        this.body.position.set(-20 + (this.width/2) + 1, 15, -40)
    }

    getRandomWidth() {
        if(this.width) return this.width

        const scaledMin = Math.ceil(3);
        const scaledMax = Math.floor(6);

        const randomScaled = Math.floor(Math.random() * (scaledMax - scaledMin + 1)) + scaledMin;

        this.width = randomScaled * 5
        return this.width
    }

    getRandomHeight() {
        if(this.height) return this.height

        const scaledMin = Math.ceil(3);
        const scaledMax = Math.floor(4.5);

        const randomScaled = Math.floor(Math.random() * (scaledMax - scaledMin + 1)) + scaledMin;

        this.height = randomScaled * 5
        return this.height
    }
}
