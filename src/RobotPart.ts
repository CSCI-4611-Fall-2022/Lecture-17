/* Lecture 17
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import * as IK from 'ikts'

export class RobotPart extends gfx.Transform3
{
    public name: string;
    public boneLength: number;

    private boneId: number;

    constructor(name: string)
    {
        super();

        this.name = name;
        this.boneId = -1;

        // Recursively create the robot skeleton
        if(this.name == 'root')
        {
            this.boneLength = 0.05;

            const child = new RobotPart('upperArm');
            child.position.set(0, this.boneLength, 0);
            this.add(child);
        }
        else if(this.name == 'upperArm')
        {
            this.boneLength = 0.5;
            this.rotation = gfx.Quaternion.makeRotationY(gfx.MathUtils.degreesToRadians(-45));

            const child = new RobotPart('middleArm');
            child.position.set(0, this.boneLength, 0);
            this.add(child);
        }
        else if(this.name == 'middleArm')
        {
            this.boneLength = 0.4;
            this.rotation = gfx.Quaternion.makeRotationZ(gfx.MathUtils.degreesToRadians(45));

            const child = new RobotPart('lowerArm');
            child.position.set(0, this.boneLength, 0);
            this.add(child);
        }
        else if(this.name == 'lowerArm')
        {
            this.boneLength = 0.4;
            this.rotation = gfx.Quaternion.makeRotationZ(gfx.MathUtils.degreesToRadians(45));
        
            const child = new RobotPart('endEffector');
            child.position.set(0, this.boneLength, 0);
            this.add(child);
        }
        else if(this.name == 'endEffector')
        {
            this.boneLength = 0.1;
        }
        else
        {
            this.boneLength = 0;
        }
    }

    // Recursively create all the mesh geometry for the robot parts. 
    // Each mesh will be defined in the robot part's local space.
    createMeshes(): void
    {
        if(this.name == 'root')
        {
            const box = new gfx.BoxMesh(0.5, this.boneLength, 0.5);
            box.translateY(this.boneLength/2);
            this.add(box);

            const sphere = new gfx.SphereMesh(0.1, 2);
            sphere.scale.set(1, 0.5, 1);
            sphere.translateY(this.boneLength);
            this.add(sphere);
        }
        else if(this.name == 'upperArm')
        {
            const arm = new gfx.BoxMesh(0.05, this.boneLength, 0.05);
            arm.translateY(this.boneLength/2);
            this.add(arm);

            const sphere = new gfx.SphereMesh(0.05, 1);
            sphere.translateY(this.boneLength);
            this.add(sphere);
        }
        else if(this.name == 'middleArm')
        {
            const arm = new gfx.BoxMesh(0.05, this.boneLength, 0.05);
            arm.translateY(this.boneLength/2);
            this.add(arm);

            const sphere = new gfx.SphereMesh(0.05, 1);
            sphere.translateY(this.boneLength);
            this.add(sphere);
        }
        else if(this.name == 'lowerArm')
        {
            const arm = new gfx.BoxMesh(0.05, this.boneLength, 0.05);
            arm.translateY(this.boneLength/2);
            this.add(arm);

            const sphere = new gfx.SphereMesh(0.05, 1);
            sphere.translateY(this.boneLength);
            this.add(sphere);
        }
        else if(this.name == 'endEffector')
        {
            const pincher = new gfx.BoxMesh(0.025, this.boneLength, 0.025);

            const leftPincher1 = new gfx.MeshInstance(pincher);
            leftPincher1.rotateY(gfx.MathUtils.degreesToRadians(90));
            leftPincher1.rotateZ(gfx.MathUtils.degreesToRadians(45));
            leftPincher1.translateY(this.boneLength/2 + 0.03);
            this.add(leftPincher1);

            const leftPincher2 = new gfx.MeshInstance(pincher);
            leftPincher2.translateY(this.boneLength/2 - 0.01);
            leftPincher2.rotateZ(gfx.MathUtils.degreesToRadians(-75));
            leftPincher2.translateY(this.boneLength/2 - 0.01);
            leftPincher1.add(leftPincher2);

            const rightPincher1 = new gfx.MeshInstance(pincher);
            rightPincher1.rotateY(gfx.MathUtils.degreesToRadians(90));
            rightPincher1.rotateZ(gfx.MathUtils.degreesToRadians(-45));
            rightPincher1.translateY(this.boneLength/2 + 0.03);
            this.add(rightPincher1);

            const rightPincher2 = new gfx.MeshInstance(pincher);
            rightPincher2.translateY(this.boneLength/2 - 0.01);
            rightPincher2.rotateZ(gfx.MathUtils.degreesToRadians(75));
            rightPincher2.translateY(this.boneLength/2 - 0.01);
            rightPincher1.add(rightPincher2);
        }

        // Recursively call this function for each child robot part
        this.children.forEach((child: gfx.Transform3)=>{
            if(child instanceof RobotPart)
            {
                child.createMeshes();
            }
        });
    }

    setPose(name: string, pose: gfx.Quaternion): void
    {
        if(this.name == name)
        {
            this.rotation.copy(pose);
        }
        else
        {
            // Recursively call this function for each child robot part
            this.children.forEach((child: gfx.Transform3)=>{
                if(child instanceof RobotPart)
                {
                    child.setPose(name, pose);
                }
            });
        }
    }

    createChain(chain: IK.Chain3D): void
    {
        if(this.name == 'upperArm')
        {
            const bone = new IK.Bone3D(
                new IK.V3(this.position.x, this.position.y, this.position.z),
                undefined,
                new IK.V3(0, 1, 0),
                this.boneLength
            );

            chain.addBone(bone);

            this.boneId = 0;
        }
        else if(this.name != 'root')
        {
            // Add on a bone onto the existing chain
        }

        // Recursively call this function for each child robot part
        this.children.forEach((child: gfx.Transform3)=>{
            if(child instanceof RobotPart)
            {
                child.createChain(chain);
            }
        });
    }
}