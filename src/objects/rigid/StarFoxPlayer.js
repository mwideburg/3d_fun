import * as THREE from 'three';
import * as CANNON from 'cannon-es'
export class StarFoxPlayer {
    constructor(start, size = { x: 1, y: 1, z: 1 }) {
        this.start = start
        const material = new THREE.MeshNormalMaterial();
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true
        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        this.body = new CANNON.Body({ mass: 5, collisionFilterGroup: 2 });
        this.body.fixedRotation = true
        this.body.addShape(shape);
        this.body.position.set(0, 1, 0);

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
        this.accelerationVertical = 0
        this.accelerationHorizontal = 0
        this.pitchSpeed = 0
        this.rollSpeed = 0
        this.yawSpeed = 0;
        this.speed = -10
        this.accelerationImpulse = new CANNON.Vec3(0, 0, -2);

        this.createControls()
    }
    createControls() {
        window.addEventListener("keydown", (event) => this.handleKeyDown(event.key));
        window.addEventListener("keyup", (event) => this.handleKeyUp(event.key));
    }

    handleKeyDown(key) {
        this.start()
        switch (key.toLowerCase()) {
            case "q":
                this.controls.Q = true;
                break;
            case "e":
                this.controls.E = true;
                break;
            case "+":
                this.controls.Plus = true;
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
            case "q":
                this.controls.Q = false;
                break;
            case "e":
                this.controls.E = false;
                break;
            case "shift":
                this.controls.Shft = false;
                break;
            case "+":
                this.controls.Plus = false;
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
        const { Q, E, Plus, Minus } = this.controls

        if (Plus || Minus) {
            this.accelerationVertical = Plus ? -5 : 5
        } else {
            this.accelerationVertical = 0
        }
        if (Q || E) {
            this.accelerationHorizontal = Q ? -3 : 3
        } else {
            this.accelerationHorizontal = 0
        }
        // Set constant velocity for the Z-axis

        this.body.velocity.z = this.speed;
        this.accelerationImpulse.set(this.accelerationHorizontal, this.accelerationVertical, 0);
        this.body.quaternion.vmult(this.accelerationImpulse, this.accelerationImpulse);
        this.body.applyImpulse(this.accelerationImpulse, this.body.position);

        this.body.linearDamping = .1;
        this.body.angularDamping = 0.9;
    }




}