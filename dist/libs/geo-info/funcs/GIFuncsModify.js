"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIFuncsModify = void 0;
const matrix_1 = require("../../geom/matrix");
const vectors_1 = require("../../geom/vectors");
const common_1 = require("../common");
const arrs_1 = require("../../../libs/util/arrs");
/**
 * Class for transforming geometry: move, rotate, mirror, scale, xform.
 */
class GIFuncsModify {
    // ================================================================================================
    /**
     * Constructor
     */
    constructor(model) {
        this.modeldata = model;
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param vectors
     */
    move(ents_arr, vectors) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // process ents
        if ((0, arrs_1.getArrDepth)(vectors) === 1) {
            const posis_i = [];
            const vec = vectors;
            for (const ent_arr of ents_arr) {
                this.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]).forEach(posi_i => posis_i.push(posi_i));
            }
            const unique_posis_i = Array.from(new Set(posis_i));
            // loop
            for (const unique_posi_i of unique_posis_i) {
                const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
                const new_xyz = (0, vectors_1.vecAdd)(old_xyz, vec);
                this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
            }
        }
        else {
            if (ents_arr.length !== vectors.length) {
                throw new Error('If multiple vectors are given, then the number of vectors must be equal to the number of entities.');
            }
            const posis_i = [];
            const vecs_map = new Map();
            for (let i = 0; i < ents_arr.length; i++) {
                const [ent_type, index] = ents_arr[i];
                const vec = vectors[i];
                const ent_posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                for (const ent_posi_i of ent_posis_i) {
                    posis_i.push(ent_posi_i);
                    if (!vecs_map.has(ent_posi_i)) {
                        vecs_map.set(ent_posi_i, []);
                    }
                    vecs_map.get(ent_posi_i).push(vec);
                }
            }
            // TODO entities could share positions, in which case the same position could be moved multi times
            // This could be confusing for the user
            // TODO snapshot
            for (const posi_i of posis_i) {
                const old_xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
                const vecs = vecs_map.get(posi_i);
                const vec = (0, vectors_1.vecDiv)((0, vectors_1.vecSum)(vecs), vecs.length);
                const new_xyz = (0, vectors_1.vecAdd)(old_xyz, vec);
                this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
            }
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param ray
     * @param angle
     */
    rotate(ents_arr, ray, angle) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // rotate all positions
        const posis_i = [];
        for (const ents of ents_arr) {
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ents[0], ents[1]));
        }
        const unique_posis_i = Array.from(new Set(posis_i));
        const matrix = (0, matrix_1.rotateMatrix)(ray, angle);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = (0, matrix_1.multMatrix)(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param plane
     * @param scale
     */
    scale(ents_arr, plane, scale) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // handle scale type
        if (!Array.isArray(scale)) {
            scale = [scale, scale, scale];
        }
        // scale all positions
        const posis_i = [];
        for (const ents of ents_arr) {
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ents[0], ents[1]));
        }
        const unique_posis_i = Array.from(new Set(posis_i));
        const matrix = (0, matrix_1.scaleMatrix)(plane, scale);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = (0, matrix_1.multMatrix)(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param plane
     */
    mirror(ents_arr, plane) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // mirror all positions
        const posis_i = [];
        for (const ents of ents_arr) {
            const [ent_type, index] = ents;
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ent_type, index));
        }
        const unique_posis_i = Array.from(new Set(posis_i));
        const matrix = (0, matrix_1.mirrorMatrix)(plane);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = (0, matrix_1.multMatrix)(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param from
     * @param to
     */
    xform(ents_arr, from, to) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // xform all positions
        const posis_i = [];
        for (const ents of ents_arr) {
            const [ent_type, index] = ents;
            // TODO do not use spread operator
            posis_i.push(...this.modeldata.geom.nav.navAnyToPosi(ent_type, index));
        }
        const unique_posis_i = Array.from(new Set(posis_i));
        const matrix = (0, matrix_1.xfromSourceTargetMatrix)(from, to);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = (0, matrix_1.multMatrix)(old_xyz, matrix);
            this.modeldata.attribs.posis.setPosiCoords(unique_posi_i, new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param dist
     */
    offset(ents_arr, dist) {
        // snapshot copy ents
        // ents_arr = this.modeldata.geom.snapshot.copyObjs(ents_arr, true) as TEntTypeIdx[];
        // get all wires and offset
        const pgons_i = [];
        for (const ents of ents_arr) {
            const [ent_type, index] = ents;
            const wires_i = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
            for (const wire_i of wires_i) {
                this._offsetWire(wire_i, dist);
            }
            // save all pgons for re-tri
            const pgon_i = this.modeldata.geom.nav.navAnyToPgon(ent_type, index);
            if (pgon_i.length === 1) {
                if (pgons_i.indexOf(pgon_i[0]) === -1) {
                    pgons_i.push(pgon_i[0]);
                }
            }
        }
        // re-tri all polygons
        if (pgons_i.length > 0) {
            this.modeldata.geom.edit_pgon.triPgons(pgons_i);
        }
    }
    _offsetWire(wire_i, dist) {
        // get the normal of the wire
        const vec_norm = this.modeldata.geom.query.getWireNormal(wire_i);
        // if (vecLen(vec_norm) === 0) {
        //     vec_norm = [0, 0, 1];
        // }
        // loop through all edges and collect the required data
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.WIRE, wire_i).slice(); // make a copy
        const is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
        // the index to these arrays is the edge_i
        let perp_vec = null;
        let has_bad_edges = false;
        const perp_vecs = []; // index is edge_i
        const pairs_xyzs = []; // index is edge_i
        const pairs_posis_i = []; // index is edge_i
        for (const edge_i of edges_i) {
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
            const xyzs = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
            const edge_vec = (0, vectors_1.vecFromTo)(xyzs[0], xyzs[1]);
            const edge_len = (0, vectors_1.vecLen)(edge_vec);
            pairs_xyzs[edge_i] = xyzs;
            pairs_posis_i[edge_i] = posis_i;
            if (edge_len > 0) {
                perp_vec = (0, vectors_1.vecCross)((0, vectors_1.vecNorm)(edge_vec), vec_norm);
            }
            else {
                if (perp_vec === null) {
                    has_bad_edges = true;
                }
            }
            perp_vecs[edge_i] = perp_vec;
        }
        // fix any bad edges, by setting the perp vec to its next neighbour
        if (has_bad_edges) {
            if (perp_vecs[perp_vecs.length - 1] === null) {
                throw new Error('Error: could not offset wire.');
            }
            for (let i = perp_vecs.length - 1; i >= 0; i--) {
                if (perp_vecs[i] === null) {
                    perp_vecs[i] = perp_vec;
                }
                else {
                    perp_vec = perp_vecs[i];
                }
            }
        }
        // add edge if this is a closed wire
        // make sure the edges_i is a copy, otherwise we are pushing into the model data structure
        if (is_closed) {
            edges_i.push(edges_i[0]); // add to the end
        }
        // loop through all the valid edges
        for (let i = 0; i < edges_i.length - 1; i++) {
            // get the two edges
            const this_edge_i = edges_i[i];
            const next_edge_i = edges_i[i + 1];
            // get the end posi_i and xyz of this edge
            const posi_i = pairs_posis_i[this_edge_i][1];
            const old_xyz = pairs_xyzs[this_edge_i][1];
            // get the two perpendicular vectors
            const this_perp_vec = perp_vecs[this_edge_i];
            const next_perp_vec = perp_vecs[next_edge_i];
            // calculate the offset vector
            let offset_vec = (0, vectors_1.vecNorm)((0, vectors_1.vecAdd)(this_perp_vec, next_perp_vec));
            const dot = (0, vectors_1.vecDot)(this_perp_vec, offset_vec);
            const vec_len = dist / dot;
            offset_vec = (0, vectors_1.vecSetLen)(offset_vec, vec_len);
            // move the posi
            const new_xyz = (0, vectors_1.vecAdd)(old_xyz, offset_vec);
            this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
        }
        // if this is not a closed wire we have to move first and last posis
        if (!is_closed) {
            // first posi
            const first_edge_i = edges_i[0];
            const first_posi_i = pairs_posis_i[first_edge_i][0];
            const first_old_xyz = pairs_xyzs[first_edge_i][0];
            const first_perp_vec = (0, vectors_1.vecSetLen)(perp_vecs[first_edge_i], dist);
            const first_new_xyz = (0, vectors_1.vecAdd)(first_old_xyz, first_perp_vec);
            this.modeldata.attribs.posis.setPosiCoords(first_posi_i, first_new_xyz);
            // last posi
            const last_edge_i = edges_i[edges_i.length - 1];
            const last_posi_i = pairs_posis_i[last_edge_i][1];
            const last_old_xyz = pairs_xyzs[last_edge_i][1];
            const last_perp_vec = (0, vectors_1.vecSetLen)(perp_vecs[last_edge_i], dist);
            const last_new_xyz = (0, vectors_1.vecAdd)(last_old_xyz, last_perp_vec);
            this.modeldata.attribs.posis.setPosiCoords(last_posi_i, last_new_xyz);
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    remesh(ents_arr) {
        // no snapshot copy in this case
        for (const [ent_type, index] of ents_arr) {
            if (ent_type === common_1.EEntType.PGON) {
                this.modeldata.geom.edit_pgon.triPgons(index);
            }
            else {
                const pgons_i = this.modeldata.geom.nav.navAnyToPgon(ent_type, index);
                this.modeldata.geom.edit_pgon.triPgons(pgons_i);
            }
        }
    }
}
exports.GIFuncsModify = GIFuncsModify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc01vZGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NNb2RpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQWlIO0FBQ2pILGdEQUFxSDtBQUNySCxzQ0FBc0U7QUFFdEUsaURBQXFEO0FBSXJEOztHQUVHO0FBQ0gsTUFBYSxhQUFhO0lBR3RCLG1HQUFtRztJQUNuRzs7T0FFRztJQUNILFlBQVksS0FBa0I7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELG1HQUFtRztJQUNuRzs7OztPQUlHO0lBQ0ksSUFBSSxDQUFDLFFBQXVCLEVBQUUsT0FBb0I7UUFDckQscUJBQXFCO1FBQ3JCLHFGQUFxRjtRQUNyRixlQUFlO1FBQ2YsSUFBSSxJQUFBLGtCQUFXLEVBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUM3QixNQUFNLEdBQUcsR0FBUyxPQUFlLENBQUM7WUFDbEMsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUN4RztZQUNELE1BQU0sY0FBYyxHQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM5RCxPQUFPO1lBQ1AsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUU7Z0JBQ3hDLE1BQU0sT0FBTyxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hGLE1BQU0sT0FBTyxHQUFTLElBQUEsZ0JBQU0sRUFBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3RFO1NBQ0o7YUFBTTtZQUNILElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLG9HQUFvRyxDQUFDLENBQUM7YUFDekg7WUFDRCxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7WUFDN0IsTUFBTSxRQUFRLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7WUFDaEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQXVCLFFBQVEsQ0FBQyxDQUFDLENBQWdCLENBQUM7Z0JBQ3pFLE1BQU0sR0FBRyxHQUFTLE9BQU8sQ0FBQyxDQUFDLENBQVMsQ0FBQztnQkFDckMsTUFBTSxXQUFXLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3JGLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO29CQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTt3QkFDNUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ2hDO29CQUNELFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN0QzthQUNKO1lBQ0Qsa0dBQWtHO1lBQ2xHLHVDQUF1QztZQUV2QyxnQkFBZ0I7WUFFaEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7Z0JBQzFCLE1BQU0sT0FBTyxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pFLE1BQU0sSUFBSSxHQUFXLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sR0FBRyxHQUFTLElBQUEsZ0JBQU0sRUFBRSxJQUFBLGdCQUFNLEVBQUUsSUFBSSxDQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLE9BQU8sR0FBUyxJQUFBLGdCQUFNLEVBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUMvRDtTQUNKO0lBQ0wsQ0FBQztJQUNELG1HQUFtRztJQUNuRzs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxRQUF1QixFQUFFLEdBQVMsRUFBRSxLQUFhO1FBQzNELHFCQUFxQjtRQUNyQixxRkFBcUY7UUFDckYsdUJBQXVCO1FBQ3ZCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLFFBQVEsRUFBRTtZQUN6QixrQ0FBa0M7WUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0U7UUFDRCxNQUFNLGNBQWMsR0FBYSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQWtCLElBQUEscUJBQVksRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUU7WUFDeEMsTUFBTSxPQUFPLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRixNQUFNLE9BQU8sR0FBUyxJQUFBLG1CQUFVLEVBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3RFO0lBQ0wsQ0FBQztJQUNELG1HQUFtRztJQUNuRzs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxRQUF1QixFQUFFLEtBQWEsRUFBRSxLQUFrQjtRQUNuRSxxQkFBcUI7UUFDckIscUZBQXFGO1FBQ3JGLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN2QixLQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2pDO1FBQ0Qsc0JBQXNCO1FBQ3RCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLFFBQVEsRUFBRTtZQUN6QixrQ0FBa0M7WUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0U7UUFDRCxNQUFNLGNBQWMsR0FBYSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQWtCLElBQUEsb0JBQVcsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEQsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUU7WUFDeEMsTUFBTSxPQUFPLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRixNQUFNLE9BQU8sR0FBUyxJQUFBLG1CQUFVLEVBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3RFO0lBQ0wsQ0FBQztJQUNELG1HQUFtRztJQUNuRzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFFBQXVCLEVBQUUsS0FBYTtRQUNoRCxxQkFBcUI7UUFDckIscUZBQXFGO1FBQ3JGLHVCQUF1QjtRQUN2QixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSyxNQUFNLElBQUksSUFBSSxRQUFRLEVBQUU7WUFDekIsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBZ0IsSUFBbUIsQ0FBQztZQUMzRCxrQ0FBa0M7WUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDMUU7UUFDRCxNQUFNLGNBQWMsR0FBYSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQWtCLElBQUEscUJBQVksRUFBQyxLQUFLLENBQUMsQ0FBQztRQUNsRCxLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRTtZQUN4QyxNQUFNLE9BQU8sR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hGLE1BQU0sT0FBTyxHQUFTLElBQUEsbUJBQVUsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDdEU7SUFDTCxDQUFDO0lBQ0QsbUdBQW1HO0lBQ25HOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFFBQXVCLEVBQUUsSUFBWSxFQUFFLEVBQVU7UUFDMUQscUJBQXFCO1FBQ3JCLHFGQUFxRjtRQUNyRixzQkFBc0I7UUFDdEIsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1FBQzdCLEtBQUssTUFBTSxJQUFJLElBQUksUUFBUSxFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQXVCLElBQW1CLENBQUM7WUFDbEUsa0NBQWtDO1lBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzFFO1FBQ0QsTUFBTSxjQUFjLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzlELE1BQU0sTUFBTSxHQUFrQixJQUFBLGdDQUF1QixFQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRSxLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRTtZQUN4QyxNQUFNLE9BQU8sR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hGLE1BQU0sT0FBTyxHQUFTLElBQUEsbUJBQVUsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDdEU7SUFDTCxDQUFDO0lBQ0QsbUdBQW1HO0lBQ25HOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsUUFBdUIsRUFBRSxJQUFZO1FBQy9DLHFCQUFxQjtRQUNyQixxRkFBcUY7UUFDckYsMkJBQTJCO1FBQzNCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLFFBQVEsRUFBRTtZQUN6QixNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUF1QixJQUFtQixDQUFDO1lBQ2xFLE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hGLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO2dCQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNsQztZQUNELDRCQUE0QjtZQUM1QixNQUFNLE1BQU0sR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNCO2FBQ0o7U0FDSjtRQUNELHNCQUFzQjtRQUN0QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkQ7SUFDTCxDQUFDO0lBQ08sV0FBVyxDQUFDLE1BQWMsRUFBRSxJQUFZO1FBQzVDLDZCQUE2QjtRQUM3QixNQUFNLFFBQVEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZFLGdDQUFnQztRQUNoQyw0QkFBNEI7UUFDNUIsSUFBSTtRQUNKLHVEQUF1RDtRQUN2RCxNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsY0FBYztRQUM3RyxNQUFNLFNBQVMsR0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFFLDBDQUEwQztRQUMxQyxJQUFJLFFBQVEsR0FBUyxJQUFJLENBQUM7UUFDMUIsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLE1BQU0sU0FBUyxHQUFXLEVBQUUsQ0FBQyxDQUFPLGtCQUFrQjtRQUN0RCxNQUFNLFVBQVUsR0FBbUIsRUFBRSxDQUFDLENBQVEsa0JBQWtCO1FBQ2hFLE1BQU0sYUFBYSxHQUF1QixFQUFFLENBQUMsQ0FBRyxrQkFBa0I7UUFDbEUsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsTUFBTSxPQUFPLEdBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFxQixDQUFDO1lBQ2xILE1BQU0sSUFBSSxHQUFpQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBaUIsQ0FBQztZQUNySCxNQUFNLFFBQVEsR0FBUyxJQUFBLG1CQUFTLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sUUFBUSxHQUFXLElBQUEsZ0JBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQztZQUMxQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzFCLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDaEMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO2dCQUNkLFFBQVEsR0FBRyxJQUFBLGtCQUFRLEVBQUMsSUFBQSxpQkFBTyxFQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3BEO2lCQUFNO2dCQUNILElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtvQkFDbkIsYUFBYSxHQUFHLElBQUksQ0FBQztpQkFDeEI7YUFDSjtZQUNELFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUM7U0FDaEM7UUFDRCxtRUFBbUU7UUFDbkUsSUFBSSxhQUFhLEVBQUU7WUFDZixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2FBQ3BEO1lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM1QyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7b0JBQ3ZCLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7aUJBQzNCO3FCQUFNO29CQUNILFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNCO2FBQ0o7U0FDSjtRQUNELG9DQUFvQztRQUNwQywwRkFBMEY7UUFDMUYsSUFBSSxTQUFTLEVBQUU7WUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1NBQzlDO1FBQ0QsbUNBQW1DO1FBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxvQkFBb0I7WUFDcEIsTUFBTSxXQUFXLEdBQVcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sV0FBVyxHQUFXLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0MsMENBQTBDO1lBQzFDLE1BQU0sTUFBTSxHQUFXLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxNQUFNLE9BQU8sR0FBUyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsb0NBQW9DO1lBQ3BDLE1BQU0sYUFBYSxHQUFTLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuRCxNQUFNLGFBQWEsR0FBUyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkQsOEJBQThCO1lBQzlCLElBQUksVUFBVSxHQUFTLElBQUEsaUJBQU8sRUFBQyxJQUFBLGdCQUFNLEVBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDckUsTUFBTSxHQUFHLEdBQVcsSUFBQSxnQkFBTSxFQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQzNCLFVBQVUsR0FBRyxJQUFBLG1CQUFTLEVBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLGdCQUFnQjtZQUNoQixNQUFNLE9BQU8sR0FBUyxJQUFBLGdCQUFNLEVBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQy9EO1FBQ0Qsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDWixhQUFhO1lBQ2IsTUFBTSxZQUFZLEdBQVcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sWUFBWSxHQUFXLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxNQUFNLGFBQWEsR0FBUyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsTUFBTSxjQUFjLEdBQVUsSUFBQSxtQkFBUyxFQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RSxNQUFNLGFBQWEsR0FBUyxJQUFBLGdCQUFNLEVBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3hFLFlBQVk7WUFDWixNQUFNLFdBQVcsR0FBVyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLFdBQVcsR0FBVyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxZQUFZLEdBQVMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sYUFBYSxHQUFVLElBQUEsbUJBQVMsRUFBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckUsTUFBTSxZQUFZLEdBQVMsSUFBQSxnQkFBTSxFQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztTQUN6RTtJQUNMLENBQUM7SUFDRCxtR0FBbUc7SUFDbkc7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFFBQXVCO1FBQ2pDLGdDQUFnQztRQUNoQyxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksUUFBUSxFQUFFO1lBQ3RDLElBQUksUUFBUSxLQUFLLGlCQUFRLENBQUMsSUFBSSxFQUFFO2dCQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2pEO2lCQUFNO2dCQUNILE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNoRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ25EO1NBQ0o7SUFDTCxDQUFDO0NBRUo7QUE1U0Qsc0NBNFNDIn0=