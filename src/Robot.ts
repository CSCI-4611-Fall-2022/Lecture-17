/* Lecture 17
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { RobotPart } from './RobotPart';

export class Robot extends gfx.Transform3
{
    public root: RobotPart;

    constructor()
    {
        super();
        this.root = new RobotPart('root');
        this.add(this.root);  
    }

    createMeshes(): void
    {
        this.root.createMeshes();
    }

    setPose(name: string, pose: gfx.Quaternion): void
    {
        this.root.setPose(name, pose);
    }

    update(deltaTime: number): void
    {
        // to be added
    }
}