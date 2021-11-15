import { IGeomMaps } from '../common';
import { GIModelData } from '../GIModelData';
/**
 * Class for deleting geometry.
 */
export declare class GIGeomDelVert {
    private modeldata;
    private _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata: GIModelData, geom_maps: IGeomMaps);
    /**
     * Deletes a vert.
     *
     * In the general case, the two edges adjacent to the deleted vert will be merged.
     * This means that the next edge will be deleted.
     * The end vert of the previous edge will connect to the end posi of the next edge.
     *
     * The first special case is if the vert is for a point. In that case, just delete the point.
     *
     * Then there are two special cases for whicj we delete the whole object
     *
     * 1) If the wire is open and has only 1 edge, then delete the wire
     * 2) if the wire is closed pgon and has only 3 edges, then:
     *    a) If the wire is the boundary of the pgon, then delete the whole pgon
     *    b) If the wire is a hole in the pgon, then delete the hole
     *
     * Assuming the special cases above do not apply,
     * then there are two more special cases for open wires
     *
     * 1) If the vert is at the start of an open wire, then delete the first edge
     * 2) If teh vert is at the end of an open wire, then delete the last edge
     *
     * Finally, we come to the standard case.
     * The next edge is deleted, and the prev edge gets rewired.
     *
     * Call by GIGeomEditTopo.replaceVertPosi()
     *
     * Checks time stamps.
     * @param vert_i
     */
    delVert(vert_i: number): void;
    /**
     * Deletes multiple verts in a pline.
     *
     * Checks time stamps.
     */
    delPlineVerts(pline_i: number, verts_i: number[]): void;
    /**
     * Deletes multiple verts in a pline.
     *
     * Checks time stamps.
     */
    delPgonVerts(pgon_i: number, verts_i: number[]): void;
    /**
     * Special case, delete the pline
     * @param wire_i
     */
    private __delVert__OpenPline1Edge;
    /**
     * Special case, delete the first edge
     * @param vert_i
     */
    private __delVert__OpenPlineStart;
    /**
     * Special case, delete the last edge
     * @param vert_i
     */
    private __delVert__OpenPlineEnd;
    /**
     * Special case, delete the pgon
     * @param face_i
     */
    private __delVert__PgonBoundaryWire3Edge;
    /**
     * Special case, delete either the hole
     * @param vert_i
     */
    private __delVert__PgonHoleWire3Edge;
    /**
     * Final case, delete the next edge, reqire the previous edge
     * For pgons, this does not update the tris
     * @param vert_i
     */
    private __delVert__StandardCase;
}
