import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for geometry.
 */
export declare class GIGeomThreejs {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Returns that data required for threejs triangles.
     * Arguments:
     * 1) ssid: the ssid to return data for
     * 2) vertex_map: a map that maps from gi vertex indicies to threejs vertex indicies
     * Returns:
     * 0) the vertices, as a flat array
     * 1) the select map, that maps from the threejs tri indices to the gi model tri indices
     * 2) the materials array, which is an array of objects
     * 3) the material groups array, which is an array of [ start, count, mat_index ]
     */
    get3jsTris(ssid: number, vertex_map: Map<number, number>): [
        number[],
        Map<number, number>,
        number[],
        Map<number, number>,
        number[],
        object[],
        [
            number,
            number,
            number
        ][],
        [
            number,
            number,
            number
        ][]
    ];
    /**
     * Returns that data required for threejs edges.
     * 0) the vertices, as a flat array
     * 1) the select map, that maps from the threejs edge indices to the gi model edge indices
     * 2) the materials array, which is an array of objects
     * 3) the material groups array, which is an array of [ start, count, mat_index ]
     */
    get3jsEdges(ssid: number, vertex_map: Map<number, number>): [
        number[],
        Map<number, number>,
        number[],
        Map<number, number>,
        number[],
        object[],
        [
            number,
            number,
            number
        ][],
        [number, number, number][]
    ];
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    get3jsPoints(ssid: number, vertex_map: Map<number, number>): [number[], Map<number, number>];
    /**
     * Create a threejs material
     * @param settings
     */
    private _convertMatGroups;
    /**
     * Create a threejs material
     * @param settings
     */
    private _getPgonMaterial;
    /**
 * Create a threejs material
 * @param settings
 */
    private _getPlineMaterial;
}
