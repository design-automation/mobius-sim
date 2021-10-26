import { mirrorMatrix, multMatrix, rotateMatrix, scaleMatrix, xfromSourceTargetMatrix } from '../../geom/matrix';
import { vecAdd, vecCross, vecDiv, vecDot, vecFromTo, vecLen, vecNorm, vecSetLen, vecSum } from '../../geom/vectors';
import { EEntType } from '../common';
import { getArrDepth } from '../../util/arrs';
/**
 * Class for transforming geometry: move, rotate, mirror, scale, xform.
 */
export class GIFuncsModify {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc01vZGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZnVuY3MvR0lGdW5jc01vZGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDakgsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckgsT0FBTyxFQUFFLFFBQVEsRUFBbUMsTUFBTSxXQUFXLENBQUM7QUFFdEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSTlDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFHdEIsbUdBQW1HO0lBQ25HOztPQUVHO0lBQ0gsWUFBWSxLQUFrQjtRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsbUdBQW1HO0lBQ25HOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsUUFBdUIsRUFBRSxPQUFvQjtRQUNyRCxxQkFBcUI7UUFDckIscUZBQXFGO1FBQ3JGLGVBQWU7UUFDZixJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLE1BQU0sR0FBRyxHQUFTLE9BQWUsQ0FBQztZQUNsQyxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMs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