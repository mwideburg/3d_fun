import * as THREE from 'three';
import { Ground } from '../objects/rigid/Ground';
import { AmbientLight } from '../objects/lighting/AmbientLight';
import * as CANNON from 'cannon-es'
import { StarFoxPlayer } from '../objects/rigid/StarFoxPlayer'
import { Wall } from '../objects/rigid/Wall';
import { LeftObstacle } from '../objects/rigid/LeftObstacle';
import { RightObstacle } from '../objects/rigid/RightObstacle';
import { TopObstacle } from '../objects/rigid/TopObstacle';
import { BottomObstacle } from '../objects/rigid/BottomObstacle';
import { Ceiling } from '../objects/rigid/Ceiling';

export class GameScene {
    constructor() {
        this.start = false
        this.score = 0
        this.ridigBodies = []

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

        this.scene.fog = new THREE.Fog(0xcce0ff, 0, 150);

        // Add lights
        const ambientLight = new AmbientLight(0xffffff, 4);
        ambientLight.castShadow = true
        this.scene.add(ambientLight.light);


    }

    initPhsysics() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0)
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

        this.ceiling = new Ceiling("", .5, true)
        this.addRigidObject(this.ceiling.mesh, this.ceiling.body)

        this.leftWall = new Wall([-20, 15, -150])
        this.rightWall = new Wall([20, 15, -150])
        this.addRigidObject(this.leftWall.mesh, this.leftWall.body)
        this.addRigidObject(this.rightWall.mesh, this.rightWall.body)

        this.createObstacles()

        const player = new StarFoxPlayer()
        this.player = player
        this.player.mesh.add(this.camera)
        this.camera.position.set(0, 1, 5);
        this.addRigidObject(this.player.mesh, this.player.body)

        this.timeStep = 1 / 60


        this.renderer.setAnimationLoop(this.animate)
    }

    createObstacles() {
        this.obstacleSpacing = 30; // Initial spacing
        this.obstacleCount = 0;
        this.obstacleType = 0;
        this.obstaclePosition = -30;

        for (let i = 0; i < 40; i++) {
            this.addObstacle();
        }

        // Create obstacles periodically as the player progresses
        setInterval(() => {
            if (!this.player.disabled) {
                this.obstacleSpacing = Math.max(10, this.obstacleSpacing - 0.1); // Decrease spacing, min 10
                console.log("adding obstacle")
                this.addObstacle();
            }
        }, 1000);
    }

    addObstacle() {
        let obstacle;
        switch (this.obstacleType) {
            case 0:
                obstacle = new LeftObstacle(0, 30, this.obstaclePosition);
                break;
            case 1:
                obstacle = new TopObstacle(40, 0, this.obstaclePosition);
                break;
            case 2:
                obstacle = new RightObstacle(0, 30, this.obstaclePosition);
                break;
            case 3:
                obstacle = new BottomObstacle(40, 0, this.obstaclePosition);
                break;
            default:
                break;
        }
        this.addRigidObject(obstacle.mesh, obstacle.body);
        this.obstaclePosition -= this.obstacleSpacing;
        this.obstacleType = (this.obstacleType + 1) % 4;
    }

    addRigidObject(mesh, body) {
        this.scene.add(mesh)
        this.world.addBody(body)
        this.ridigBodies.push([mesh, body])
    }

    updateBoundry() {
        this.ceiling.mesh.position.z = this.player.mesh.position.z + 5;
        this.ceiling.body.position.z = this.player.mesh.position.z + 5;
        this.ground.mesh.position.z = this.player.mesh.position.z + 5;
        this.ground.body.position.z = this.player.mesh.position.z + 5;
        this.leftWall.mesh.position.z = this.player.mesh.position.z + 5;
        this.leftWall.body.position.z = this.player.mesh.position.z + 5;
        this.rightWall.mesh.position.z = this.player.mesh.position.z + 5;
        this.rightWall.body.position.z = this.player.mesh.position.z + 5;
    }

    updateScore(){
        this.score = Math.floor(this.player.mesh.position.z * -1)
        const scoreDiv = document.getElementById('score-div')
        if(!scoreDiv) return
        scoreDiv.innerText = `Score: ${this.score}`;

    }

    gameOver(){
        const gameOverDiv = document.getElementById('game-over-div')
        const score = document.getElementById('game-score')
        score.innerText =`Score: ${this.score}`
        gameOverDiv.style.display = 'block'
    }


    resetGame() {
        // Stop the game
        this.start = false;
        this.score = 0

        const gameOverDiv = document.getElementById('game-over-div')
        gameOverDiv.style.display = 'none'
        // Clear all rigid bodies and meshes
        for (const [mesh, body] of this.ridigBodies) {
            this.scene.remove(mesh);
            this.world.removeBody(body);
        }
        this.ridigBodies = [];

        // Reinitialize player
        this.player.body.position.set(0, 1, 0);
        this.player.body.velocity.set(0, 0, 0);
        this.player.speed = 1;

        // Reset camera position
        this.camera.position.set(0, 1, 5);

        // Reinitialize ground, walls, and obstacles
        this.initPhsysics();

        console.log("Game has been reset.");
    }

    animate() {

        this.world.step(this.timeStep)
        for (const [mesh, body] of this.ridigBodies) {
            mesh.position.copy(body.position)
            mesh.quaternion.copy(body.quaternion)
        }
        if (!this.player.disabled) {
            this.player.moveObject()
            this.player.speed -= 0.004
            this.updateBoundry()
            this.updateScore()
        }

        for (let collision of this.world.contacts) {
            if (collision.bi.collisionFilterGroup === collision.bj.collisionFilterGroup) {
                console.log("GAME ENDED")
                this.player.disabled = true
                this.gameOver()
            }
        }


        this.renderer.render(this.scene, this.camera);
    }
}
