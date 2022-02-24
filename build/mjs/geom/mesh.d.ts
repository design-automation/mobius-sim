import * as THREE from 'three';
import { GIModel } from '@libs/geo-info/GIModel';
import { TEntTypeIdx } from '../geo-info/common';
export declare function createSingleMeshBufTjs(__model__: GIModel, ents_arrs: TEntTypeIdx[]): [
    THREE.Mesh,
    number[]
];
