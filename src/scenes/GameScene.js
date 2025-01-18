import * as THREE from 'three';
import { Box } from '../objects/rigid/Box';
import { Ground } from '../objects/rigid/Ground';
import { AmbientLight } from '../objects/lighting/AmbientLight';
import { DirectionalLight } from '../objects/lighting/DirectionalLight';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Ammo from '../../ammo/ammo.js'
import { deltaTime } from 'three/tsl';
export class GameScene {
    constructor(ammo) {
        this.initPhsysics()
        this.initGraphics()

        // Animation
        this.animate = this.animate.bind(this);
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

        // Add ground
        const ground = new Ground();
        this.ground = ground
        this.scene.add(ground.getObject());

        // Add box
        this.box = new Box();
        this.box.setPosition(new THREE.Vector3(0, 20, 0));
        this.scene.add(this.box.getObject());
        

        
    }
    addDynamicPhysicsBody(object, size, mass) {
        const transform = new this.ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.ammo.btVector3(object.position.x, object.position.y, object.position.z));
        const motionState = new this.ammo.btDefaultMotionState(transform);
        const collisionShape = new this.ammo.btBoxShape(new this.ammo.btVector3(size.x / 2, size.y / 2, size.z / 2));
        const localInertia = new this.ammo.btVector3(0, 0, 0);
        collisionShape.calculateLocalInertia(mass, localInertia);

        // Create rigid body
        const rbInfo = new this.ammo.btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia);
        const body = new this.ammo.btRigidBody(rbInfo);
        body.setFriction(0.5);

        // Add to physics world
        this.physicsWorld.addRigidBody(body);
        this.rigidBodies.push({ object, body });
    }

    addStaticPhysicsBody(object, size) {
        // Create Ammo.js collision shape
        const transform = new this.ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.ammo.btVector3(object.position.x, object.position.y, object.position.z));
        const motionState = new this.ammo.btDefaultMotionState(transform);
        const collisionShape = new this.ammo.btBoxShape(new this.ammo.btVector3(size.x / 2, size.y / 2, size.z / 2));
        const localInertia = new this.ammo.btVector3(0, 0, 0);
        collisionShape.calculateLocalInertia(0, localInertia); // Static body has zero mass

        // Create rigid body
        const rbInfo = new this.ammo.btRigidBodyConstructionInfo(0, motionState, collisionShape, localInertia);
        const body = new this.ammo.btRigidBody(rbInfo);

        // Add to physics world
        this.physicsWorld.addRigidBody(body);
    }

    async initPhsysics() {
        // Wait for Ammo to be fully initialized
        this.ammo = await Ammo();
        // Create physics world with gravity
        const collisionConfiguration = new this.ammo.btDefaultCollisionConfiguration();
        const dispatcher = new this.ammo.btCollisionDispatcher(collisionConfiguration);
        const broadphase = new this.ammo.btDbvtBroadphase();
        const solver = new this.ammo.btSequentialImpulseConstraintSolver();
        this.physicsWorld = new this.ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
        this.physicsWorld.setGravity(new this.ammo.btVector3(0, -9.8, 0));

        this.rigidBodies = [];
        this.timeStep = 1 / 60;
        this.addDynamicPhysicsBody(this.box.getObject(), new THREE.Vector3(1, 1, 1), 1); // Mass = 1
        this.addStaticPhysicsBody(this.ground.getObject(), new THREE.Vector3(20, 0.5, 20));
        this.animate()
    }

    updatePhysics(deltaTime) {
        // Step simulation
        this.physicsWorld.stepSimulation(deltaTime, 10);

        // Update Three.js objects based on Ammo.js physics
        for (const { object, body } of this.rigidBodies) {
            const motionState = body.getMotionState();
            if (motionState) {
                const transform = new this.ammo.btTransform();
                motionState.getWorldTransform(transform);
                const origin = transform.getOrigin();
                const rotation = transform.getRotation();

                object.position.set(origin.x(), origin.y(), origin.z());
                object.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
            }
        }
    }



    animate() {
        requestAnimationFrame(this.animate);

        const deltaTime = this.timeStep;
        this.box.rotate(0.01, 0.01, 0);
        this.updatePhysics(deltaTime)
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
