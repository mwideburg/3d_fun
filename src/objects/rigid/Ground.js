import * as THREE from 'three';

export class Ground {
    constructor(ammo, size = { x: 20, y: 0.5, z: 20 }, color = 0x0000ff) {
        this.size = size
        this.ammo = ammo
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshStandardMaterial({ color });
        this.object = new THREE.Mesh(geometry, material);
        this.object.receiveShadow = true;
    }

    getObject() {
        return this.object;
    }

    createPhysics(){
         // Create Ammo.js collision shape
         const transform = new this.ammo.btTransform();
         transform.setIdentity();
         transform.setOrigin(new this.ammo.btVector3(this.object.position.x, this.object.position.y, this.object.position.z));
         const motionState = new this.ammo.btDefaultMotionState(transform);
         const collisionShape = new this.ammo.btBoxShape(new this.ammo.btVector3(this.size.x / 2, this.size.y / 2, this.size.z / 2));
         const localInertia = new this.ammo.btVector3(0, 0, 0);
         collisionShape.calculateLocalInertia(0, localInertia); // Static body has zero mass
 
         // Create rigid body
         const rbInfo = new this.ammo.btRigidBodyConstructionInfo(0, motionState, collisionShape, localInertia);
         const body = new this.ammo.btRigidBody(rbInfo);


         return body
    }
}
