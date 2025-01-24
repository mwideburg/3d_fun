import * as THREE from 'three';
import { Ground } from '../objects/rigid/Ground';
import { Box } from '../objects/rigid/Box'
import { AmbientLight } from '../objects/lighting/AmbientLight';
import { DirectionalLight } from '../objects/lighting/DirectionalLight';
import * as CANNON from 'cannon-es'
import { SpotLight } from '../objects/lighting/SpotLight';
import { OrbitPlayer } from '../objects/rigid/OrbitPlayer';
import { StarFoxPlayer } from '../objects/rigid/StarFoxPlayer'
import { Wall } from '../objects/rigid/Wall';
import { LeftObstacle } from '../objects/rigid/LeftObstacle';
import { RightObstacle } from '../objects/rigid/RightObstacle';
import { TopObstacle } from '../objects/rigid/TopObstacle';
import { BottomObstacle } from '../objects/rigid/BottomObstacle';
export class GameScene {
    constructor() {
        this.start = false
        this.ridigBodies = []

        this.animate = this.animate.bind(this);
        this.startContorls = this.startContorls.bind(this);

        this.initGraphics()
        this.initPhsysics()
        this.initWindowResize()
    }

    startContorls() {
        console.log("HEY")
        this.start = true
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

        // Add lights
        const ambientLight = new AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight.light);

        const directionalLight = new DirectionalLight(0xffffff, 1, { x: 15, y: 20, z: 0 });
        this.scene.add(directionalLight.light);

        const spotLight = new SpotLight()
        spotLight.light.position.set(-40, 75, 4.5);
        this.scene.add(spotLight.light);

    }

    initPhsysics() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -45, 0)
        })
        this.world.broadphase = new CANNON.NaiveBroadphase(); // Detect coilliding objects
        this.world.solver.iterations = 15; // collision detection sampling rate
        const defaultMaterial = new CANNON.Material({ restitution: 0.8 });
        this.world.defaultContactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                restitution: 0.8,
                friction: 0.3,
            }
        );

        // Assign default material to world
        this.world.addContactMaterial(this.world.defaultContactMaterial);


        this.ground = new Ground()
        this.addRigidObject(this.ground.mesh, this.ground.body)

        const leftWall = new Wall([-20, 15, -150])
        const rightWall = new Wall([20, 15, -150])
        this.addRigidObject(leftWall.mesh, leftWall.body)
        this.addRigidObject(rightWall.mesh, rightWall.body)

        this.createObstacles()

        const player = new StarFoxPlayer(this.startContorls)
        this.player = player
        this.player.mesh.add(this.camera)
        this.camera.position.set(0, 2, 5);
        this.addRigidObject(this.player.mesh, this.player.body)

        this.timeStep = 1 / 60


        this.renderer.setAnimationLoop(this.animate)
    }

    createObstacles() {
        const wallType = [1, 2, 3, 4]
        let wallPosition = -40
        let wallCount = 0
        let wallTypeIndex = 0
        while (wallCount < 40) {
            const type = wallType[wallTypeIndex]
            let obstacle
            switch (type) {
                case 1:
                    obstacle = new LeftObstacle(0, 30, wallPosition)
                    break;
                case 2:
                    
                    obstacle = new TopObstacle(40, 0, wallPosition)
                    break;
                case 3:
                    obstacle = new RightObstacle(0, 30, wallPosition)
                    break;
                case 4:
                    obstacle = new BottomObstacle(40, 0, wallPosition)
                    break;
                default:
                    break;
            }
            this.addRigidObject(obstacle.mesh, obstacle.body)
            wallPosition -= 45
            wallTypeIndex++
            if(wallTypeIndex > 3) wallTypeIndex = 0
            wallCount++
        }


    }

    addRigidObject(mesh, body) {
        this.scene.add(mesh)
        this.world.addBody(body)
        this.ridigBodies.push([mesh, body])
    }

    animate() {

        this.world.step(this.timeStep)
        for (const [mesh, body] of this.ridigBodies) {
            mesh.position.copy(body.position)
            mesh.quaternion.copy(body.quaternion)
        }
        if (this.start) {
            this.player.moveObject()
        }


        this.renderer.render(this.scene, this.camera);
    }
}
