declare type Txyz = [number, number, number];
declare type TRay = [Txyz, Txyz];
declare type TPlane = [Txyz, Txyz, Txyz];
export declare function distance(c1: Txyz, c2: Txyz | TRay | TPlane): number;
export declare function distanceManhattan(c1: Txyz, c2: Txyz | TRay | TPlane): number;
export declare function distanceManhattanSq(c1: Txyz, c2: Txyz | TRay | TPlane): number;
export {};
