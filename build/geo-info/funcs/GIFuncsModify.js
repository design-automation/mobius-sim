"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIFuncsModify = void 0;
const matrix_1 = require("../../geom/matrix");
const vectors_1 = require("../../geom/vectors");
const common_1 = require("../common");
const arrs_1 = require("@libs/util/arrs");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc01vZGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZnVuY3MvR0lGdW5jc01vZGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBaUg7QUFDakgsZ0RBQXFIO0FBQ3JILHNDQUFzRTtBQUV0RSwwQ0FBOEM7QUFJOUM7O0dBRUc7QUFDSCxNQUFhLGFBQWE7SUFHdEIsbUdBQW1HO0lBQ25HOztPQUVHO0lBQ0gsWUFBWSxLQUFrQjtRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsbUdBQW1HO0lBQ25HOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsUUFBdUIsRUFBRSxPQUFvQjtRQUNyRCxxQkFBcUI7UUFDckIscUZBQXFGO1FBQ3JGLGVBQWU7UUFDZixJQUFJLElBQUEsa0JBQVcsRUFBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLE1BQU0sR0FBRyxHQUFTLE9BQWUsQ0FBQztZQUNsQyxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ3hHO1lBQ0QsTUFBTSxjQUFjLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzlELE9BQU87WUFDUCxLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRTtnQkFDeEMsTUFBTSxPQUFPLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FB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