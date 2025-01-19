import * as THREE from 'three';
import { Ground } from '../objects/rigid/Ground';
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

    initWindowResize(){
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initGraphics() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Camera and controls
        this.camera.position.set(0, 5, 5);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 1;
        this.controls.maxDistance = 50;

        // Add lights
        const ambientLight = new AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight.getLight());

        const directionalLight = new DirectionalLight(0xffffff, 1, { x: 5, y: 10, z: 0 });
        this.scene.add(directionalLight.getLight());   
        
        const ground = new Ground()
        this.groundMesh = ground.getObject()
        this.scene.add(ground.getObject())
    }

    initPhsysics() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.8, 0)
        })

        this.groundBody = new CANNON.Body({
            shape: new CANNON.Plane(),
            type: CANNON.Body.STATIC
        })
        this.world.addBody(this.groundBody)


        this.timeStep = 1/60
        
        this.renderer.setAnimationLoop(this.animate)
    }
    
    animate() {
        
        this.world.step(this.timeStep)

        this.groundMesh.position.copy(this.groundBody.position)
        this.groundMesh.quaternion.copy(this.groundBody.quaternion)
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
