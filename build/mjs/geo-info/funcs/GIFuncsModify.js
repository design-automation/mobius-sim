import { mirrorMatrix, multMatrix, rotateMatrix, scaleMatrix, xfromSourceTargetMatrix } from '../../geom/matrix';
import { vecAdd, vecCross, vecDiv, vecDot, vecFromTo, vecLen, vecNorm, vecSetLen, vecSum } from '../../geom/vectors';
import { EEntType } from '../common';
import { getArrDepth } from '../../util/arrs';
/**
 * Class for transforming geometry: move, rotate, mirror, scale, xform.
 */
export class GIFuncsModify {
    // ================================================================================================
    modeldata;
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
        if (getArrDepth(vectors) === 1) {
            const posis_i = [];
            const vec = vectors;
            for (const ent_arr of ents_arr) {
                this.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]).forEach(posi_i => posis_i.push(posi_i));
            }
            const unique_posis_i = Array.from(new Set(posis_i));
            // loop
            for (const unique_posi_i of unique_posis_i) {
                const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
                const new_xyz = vecAdd(old_xyz, vec);
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
                const vec = vecDiv(vecSum(vecs), vecs.length);
                const new_xyz = vecAdd(old_xyz, vec);
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
        const matrix = rotateMatrix(ray, angle);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = multMatrix(old_xyz, matrix);
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
        const matrix = scaleMatrix(plane, scale);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = multMatrix(old_xyz, matrix);
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
        const matrix = mirrorMatrix(plane);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = multMatrix(old_xyz, matrix);
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
        const matrix = xfromSourceTargetMatrix(from, to);
        for (const unique_posi_i of unique_posis_i) {
            const old_xyz = this.modeldata.attribs.posis.getPosiCoords(unique_posi_i);
            const new_xyz = multMatrix(old_xyz, matrix);
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
        const edges_i = this.modeldata.geom.nav.navAnyToEdge(EEntType.WIRE, wire_i).slice(); // make a copy
        const is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
        // the index to these arrays is the edge_i
        let perp_vec = null;
        let has_bad_edges = false;
        const perp_vecs = []; // index is edge_i
        const pairs_xyzs = []; // index is edge_i
        const pairs_posis_i = []; // index is edge_i
        for (const edge_i of edges_i) {
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            const xyzs = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
            const edge_vec = vecFromTo(xyzs[0], xyzs[1]);
            const edge_len = vecLen(edge_vec);
            pairs_xyzs[edge_i] = xyzs;
            pairs_posis_i[edge_i] = posis_i;
            if (edge_len > 0) {
                perp_vec = vecCross(vecNorm(edge_vec), vec_norm);
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
            let offset_vec = vecNorm(vecAdd(this_perp_vec, next_perp_vec));
            const dot = vecDot(this_perp_vec, offset_vec);
            const vec_len = dist / dot;
            offset_vec = vecSetLen(offset_vec, vec_len);
            // move the posi
            const new_xyz = vecAdd(old_xyz, offset_vec);
            this.modeldata.attribs.posis.setPosiCoords(posi_i, new_xyz);
        }
        // if this is not a closed wire we have to move first and last posis
        if (!is_closed) {
            // first posi
            const first_edge_i = edges_i[0];
            const first_posi_i = pairs_posis_i[first_edge_i][0];
            const first_old_xyz = pairs_xyzs[first_edge_i][0];
            const first_perp_vec = vecSetLen(perp_vecs[first_edge_i], dist);
            const first_new_xyz = vecAdd(first_old_xyz, first_perp_vec);
            this.modeldata.attribs.posis.setPosiCoords(first_posi_i, first_new_xyz);
            // last posi
            const last_edge_i = edges_i[edges_i.length - 1];
            const last_posi_i = pairs_posis_i[last_edge_i][1];
            const last_old_xyz = pairs_xyzs[last_edge_i][1];
            const last_perp_vec = vecSetLen(perp_vecs[last_edge_i], dist);
            const last_new_xyz = vecAdd(last_old_xyz, last_perp_vec);
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
            if (ent_type === EEntType.PGON) {
                this.modeldata.geom.edit_pgon.triPgons(index);
            }
            else {
                const pgons_i = this.modeldata.geom.nav.navAnyToPgon(ent_type, index);
                this.modeldata.geom.edit_pgon.triPgons(pgons_i);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc01vZGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZnVuY3MvR0lGdW5jc01vZGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDakgsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckgsT0FBTyxFQUFFLFFBQVEsRUFBbUMsTUFBTSxXQUFXLENBQUM7QUFFdEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSTlDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFDdEIsbUdBQW1HO0lBQzNGLFNBQVMsQ0FBYztJQUMvQixtR0FBbUc7SUFDbkc7O09BRUc7SUFDSCxZQUFZLEtBQWtCO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxtR0FBbUc7SUFDbkc7Ozs7T0FJRztJQUNJLElBQUksQ0FBQyxRQUF1QixFQUFFLE9BQW9CO1FBQ3JELHFCQUFxQjtRQUNyQixxRkFBcUY7UUFDckYsZUFBZTtRQUNmLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1QixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQVMsT0FBZSxDQUFDO1lBQ2xDLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO2dCQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFB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