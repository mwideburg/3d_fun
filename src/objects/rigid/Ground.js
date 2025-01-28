import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class Ground {
    constructor(texturePath, opacity = 1, transparent = false, color = 0x0fffff) {

        // Load a low-resolution pixelated texture
        var loader = new THREE.TextureLoader();
        var groundTexture = loader.load(`${texturePath}`);
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25, 25);
        // groundTexture.anisotropy = 16;
        groundTexture.encoding = THREE.sRGBEncoding;

        const geometry = new THREE.BoxGeometry(500, 500, 1);
        const material = new THREE.MeshLambertMaterial({
            color,
            side: THREE.DoubleSide,
            map: groundTexture,
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

        this.body.position.set(0, 0, -150)
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    }

}
