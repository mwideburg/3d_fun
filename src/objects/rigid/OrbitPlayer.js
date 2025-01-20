import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class OrbitPlayer {
    constructor(size = { x: 1, y: 1, z: 1 }, world) {
        const material = new THREE.MeshNormalMaterial();
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
        this.mesh = new THREE.Mesh(geometry, material);

        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        this.body = new CANNON.Body({ mass: 1 });
        this.body.fixedRotation = true
        this.body.addShape(shape);
        this.body.position.set(0, 2, 0);

        this.controls = {
            W: false,
            A: false,
            S: false,
            D: false,
            Q: false,
            E: false,
            Plus: false,
            Minus: false,
        }
        this.acceleration = 0
        this.pitchSpeed = 0
        this.rollSpeed = 0
        this.yawSpeed = 0;
        this.accelerationImpulse = new CANNON.Vec3();

        this.createControls()
    }
    createControls() {
        window.addEventListener("keydown", (event) => this.handleKeyDown(event.key));
        window.addEventListener("keyup", (event) => this.handleKeyUp(event.key));
    }

    handleKeyDown(key) {
        console.log(key)
        switch (key.toLowerCase()) {
            case "w":
                this.controls.W = true;
                break;
            case "s":
                this.controls.S = true;
                break;
            case "a":
                this.controls.A = true;
                break;
            case "d":
                this.controls.D = true;
                break;
            case "q":
                this.controls.Q = true;
                break;
            case "e":
                this.controls.E = true;
                break;
            case "control":
                this.controls.Ctrl = true;
                break;
            case "shift":
                this.controls.Shft = true;
                break;
            case "=":
                this.controls.Plus = true;
                break;
            case "-":
                this.controls.Minus = true;
                break;
        }
    }

    handleKeyUp(key) {
        switch (key.toLowerCase()) {
            case "w":
                this.controls.W = false;
                break;
            case "s":
                this.controls.S = false;
                break;
            case "a":
                this.controls.A = false;
                break;
            case "d":
                this.controls.D = false;
                break;
            case "q":
                this.controls.Q = false;
                break;
            case "e":
                this.controls.E = false;
                break;
            case "control":
                this.controls.Ctrl = false;
                break;
            case "shift":
                this.controls.Shft = false;
                break;
            case "=":
                this.controls.Plus = false;
                break;
            case "-":
                this.controls.Minus = false;
                break;
        }
    }

    moveObject() {
        const { W, S, A, D, Q, E, Plus, Minus } = this.controls
        if (Plus) { this.acceleration = -1 }
        if (Minus) { this.acceleration = 1 }
        if (Plus || Minus) {
            this.accelerationImpulse.set(0, 0, this.acceleration);
            this.body.quaternion.vmult(this.accelerationImpulse, this.accelerationImpulse);
            this.body.applyImpulse(this.accelerationImpulse, this.body.position);
        }

        if (W || S || A || D || Q || E) {
            if (W) { this.pitchSpeed = -.7 } else if (S) { this.pitchSpeed = .7 } else { this.pitchSpeed = 0 }
            if (A) { this.rollSpeed = .7 } else if (D) { this.rollSpeed = -.7 } else { this.rollSpeed = 0 }
            if (Q) { this.yawSpeed = .7 } else if (E) { this.yawSpeed = -.7 } else { this.yawSpeed = 0 }

            var directionVector = new CANNON.Vec3(this.pitchSpeed, this.yawSpeed, this.rollSpeed);
            var directionVector = this.body.quaternion.vmult(directionVector);

            this.body.angularVelocity.set(directionVector.x, directionVector.y, directionVector.z);
        }

        this.body.linearDamping = .5;
        this.body.angularDamping = 0.9;
    }




}