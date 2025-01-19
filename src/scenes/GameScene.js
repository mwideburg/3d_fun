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
        this.initGraphics = this.initGraphics.bind(this);
        this.initPhsysics = this.initPhsysics.bind(this);
        this.initWindowResize = this.initWindowResize.bind(this);
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

        const ground = new Ground()
        this.groundMesh = ground.getObject()
        this.scene.add(ground.getObject())

        const groundPhysMat = new CANNON.Material();

        this.groundBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            //mass: 10
            shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
            type: CANNON.Body.STATIC,
            material: groundPhysMat
        });
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

        this.ridigBodies.push([this.groundMesh, this.groundBody])
        this.world.addBody(this.groundBody)
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
        const box = new Box()
        // box.setPosition(new THREE.Vector3(0, 5, 0))
        const boxBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            mass: 10,
            position: new CANNON.Vec3(1, 5, 0)
        })
        this.scene.add(box.getObject())
        this.world.addBody(boxBody)
        this.ridigBodies.push([box.getObject(), boxBody])

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
