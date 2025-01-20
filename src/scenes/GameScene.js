import * as THREE from 'three';
import { Ground } from '../objects/rigid/Ground';
import { Box } from '../objects/rigid/Box'
import { AmbientLight } from '../objects/lighting/AmbientLight';
import { DirectionalLight } from '../objects/lighting/DirectionalLight';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es'
export class GameScene {
    constructor() {
        this.animate = this.animate.bind(this);

        this.initGraphics()
        this.initPhsysics()
        this.initWindowResize()
    }

    initWindowResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initGraphics() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Camera and controls
        this.camera.position.set(0, 5, -20);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 1;
        this.controls.maxDistance = 50;

        // Add lights
        const ambientLight = new AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight.getLight());

        const directionalLight = new DirectionalLight(0xffffff, 1, { x: 5, y: 10, z: 0 });
        this.scene.add(directionalLight.getLight());


    }

    initPhsysics() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.8, 0)
        })

        this.ridigBodies = []

        this.ground = new Ground()
        this.scene.add(this.ground.getMesh())

        this.ridigBodies.push([this.ground.getMesh(), this.ground.getBody()])
        this.world.addBody(this.ground.getBody())

        const box = new Box()

        this.scene.add(box.mesh)
        this.world.addBody(box.body)
        this.ridigBodies.push([box.mesh, box.body])

        const groundBoxContactMat = new CANNON.ContactMaterial(
            this.ground.physMat,
            box.physMat,
            { friction: 0.04 }
        );

        this.world.addContactMaterial(groundBoxContactMat);

        this.timeStep = 1 / 60

        this.renderer.setAnimationLoop(this.animate)
    }

    animate() {

        this.world.step(this.timeStep)

        for (const [mesh, body] of this.ridigBodies) {
            mesh.position.copy(body.position)
            mesh.quaternion.copy(body.quaternion)
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
