import * as THREE from 'three';
import { TEntTypeIdx } from '../geo-info/common';
import { GIModel } from '../geo-info/GIModel';
export declare function createSingleMeshBufTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): [
    THREE.Mesh,
    number[]
];
