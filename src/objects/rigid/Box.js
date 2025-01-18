import * as THREE from 'three';

export class Box {
    constructor(ammo, size = { x: 1, y: 1, z: 1 }, mass = 1, color = 0xff0000) {
        this.size = size
        this.mass = mass
        this.ammo = ammo

        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshStandardMaterial({ color });
        this.object = new THREE.Mesh(geometry, material);
        this.object.castShadow = true;
    }

    createPhysics(){
        const transform = new this.ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.ammo.btVector3(this.object.position.x, this.object.position.y, this.object.position.z));
        const motionState = new this.ammo.btDefaultMotionState(transform);
        const collisionShape = new this.ammo.btBoxShape(new this.ammo.btVector3(this.size.x / 2, this.size.y / 2, this.size.z / 2));
        const localInertia = new this.ammo.btVector3(0, 0, 0);
        collisionShape.calculateLocalInertia(this.mass, localInertia);

        // Create rigid body
        const rbInfo = new this.ammo.btRigidBodyConstructionInfo(this.mass, motionState, collisionShape, localInertia);
        const body = new this.ammo.btRigidBody(rbInfo);
        body.setFriction(0.5);

        return body
    }

    getObject() {
        return this.object;
    }

    setPosition(position) {
        this.object.position.copy(position);
    }

    rotate(x, y, z) {
        this.object.rotation.x += x;
        this.object.rotation.y += y;
        this.object.rotation.z += z;
    }
    
}
