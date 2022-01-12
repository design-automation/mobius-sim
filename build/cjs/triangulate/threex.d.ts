import * as three from 'three';
/**
 * Utility functions for threejs.
 */
export declare function multVectorMatrix(v: three.Vector3, m: three.Matrix4): three.Vector3;
export declare function xformMatrix(o: three.Vector3, x: three.Vector3, y: three.Vector3, z: three.Vector3): three.Matrix4;
export declare function matrixInv(m: three.Matrix4): three.Matrix4;
export declare function subVectors(v1: three.Vector3, v2: three.Vector3, norm?: boolean): three.Vector3;
export declare function addVectors(v1: three.Vector3, v2: three.Vector3, norm?: boolean): three.Vector3;
export declare function crossVectors(v1: three.Vector3, v2: three.Vector3, norm?: boolean): three.Vector3;
