/* Lecture 17
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import * as IK from 'ikts'
import { RobotPart } from './RobotPart';

export class Robot extends gfx.Transform3
{
    public root: RobotPart;

    private ikSolver: IK.Structure3D;
    private ikChain: IK.Chain3D;

    constructor()
    {
        super();
        this.root = new RobotPart('root');
        this.add(this.root);  

        // Recursively create the IK chain
        this.ikChain = new IK.Chain3D();
        this.root.createChain(this.ikChain);

        // Initialize the IK structure
        this.ikSolver = new IK.Structure3D();
        this.ikSolver.add(this.ikChain, new IK.V3());
    }

    createMeshes(): void
    {
        this.root.createMeshes();
    }

    setPose(name: string, pose: gfx.Quaternion): void
    {
        this.root.setPose(name, pose);
    }

    update(target: gfx.Vector3): void
    {
        // Set the target position for the ik solver
        this.ikSolver.targets[0].set(target.x, target.y, target.z);

        // Use the ik solver to compute new poses for the robot
        this.ikSolver.update();

        // Recursively update all parts of the robot
        this.root.update(this.ikChain);
    }
}