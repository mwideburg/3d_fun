import * as THREE from 'three';
import { Ground } from '../objects/rigid/Ground';
import { Box } from '../objects/rigid/Box'
import { AmbientLight } from '../objects/lighting/AmbientLight';
import { DirectionalLight } from '../objects/lighting/DirectionalLight';
import * as CANNON from 'cannon-es'
import { SpotLight } from '../objects/lighting/SpotLight';
import { OrbitPlayer } from '../objects/rigid/OrbitPlayer';
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
        const fielofview = 75;
        const aspectratio = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fielofview, aspectratio, near, far);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Camera and controls

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.minDistance = 1;
        // this.controls.maxDistance = 500;

        // Add lights
        const ambientLight = new AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight.getLight());

        const directionalLight = new DirectionalLight(0xffffff, 1, { x: 15, y: 20, z: 0 });
        this.scene.add(directionalLight.getLight());
        this.scene.add(directionalLight.helper)

        const spotLight = new SpotLight()
        spotLight.light.position.set(-40, 75, 4.5);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight.light);
        this.scene.add(spotLight.light);
        this.scene.add(spotLightHelper);
        const shadowCameraHelper = new THREE.CameraHelper(spotLight.light.shadow.camera);
        this.scene.add(shadowCameraHelper);

    }

    initPhsysics() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, 0, 0)
        })
        this.world.broadphase = new CANNON.NaiveBroadphase(); // Detect coilliding objects
        this.world.solver.iterations = 15; // collision detection sampling rate

        this.ridigBodies = []

        this.ground = new Ground()

        this.scene.add(this.ground.mesh)
        this.world.addBody(this.ground.body)
        this.ridigBodies.push([this.ground.mesh, this.ground.body])


        const box = new Box()

        this.scene.add(box.mesh)
        this.world.addBody(box.body)
        this.ridigBodies.push([box.mesh, box.body])

        // this.player = new Player()
        // this.player.body.position.set(5, 2, 30);
        // this.camera.position.set(0,2,5)

        // this.scene.add(this.player.mesh)
        // this.player.mesh.add(this.camera)
        // this.world.addBody(this.player.body)
        // this.ridigBodies.push([this.player.mesh, this.player.body])

        const player = new OrbitPlayer(this.scene, this.world)
        this.player = player
        this.player.mesh.add(this.camera)
        this.camera.position.set(0, 2, 5);
        this.scene.add(this.player.mesh)
        this.world.addBody(this.player.body)
        this.ridigBodies.push([this.player.mesh, this.player.body])

        this.timeStep = 1 / 60


        this.renderer.setAnimationLoop(this.animate)
    }

    animate() {

        this.world.step(this.timeStep)
        for (const [mesh, body] of this.ridigBodies) {
            mesh.position.copy(body.position)
            mesh.quaternion.copy(body.quaternion)
        }
        this.player.moveObject()

        this.renderer.render(this.scene, this.camera);
    }
}
