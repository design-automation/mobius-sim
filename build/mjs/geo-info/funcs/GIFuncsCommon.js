import { vecAdd, vecCross, vecDiv, vecDot, vecFromTo, vecLen, vecNorm, vecSetLen, vecSum } from '../../geom/vectors';
import { EEntType } from '../common';
import * as THREE from 'three';
import { getArrDepth } from '../../util/arrs';
const EPS = 1e-8;
/**
 * Class for editing geometry.
 */
export class GIFuncsCommon {
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
     */
    getCentroid(ents_arr) {
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, index] = ents_arr;
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
            return this._centroidPosis(posis_i);
        }
        else {
            // divide the input into posis and non posis
            ents_arr = ents_arr;
            const posis_i = [];
            const np_ents_arr = [];
            for (const ent_arr of ents_arr) {
                if (ent_arr[0] === EEntType.POSI) {
                    posis_i.push(ent_arr[1]);
                }
                else {
                    np_ents_arr.push(ent_arr);
                }
            }
            // if we only have posis, just return one centorid
            // in all other cases return a list of centroids
            const np_cents = np_ents_arr.map(ent_arr => this.getCentroid(ent_arr));
            if (posis_i.length > 0) {
                const cen_posis = this._centroidPosis(posis_i);
                if (np_cents.length === 0) {
                    return cen_posis;
                }
                else {
                    np_cents.push(cen_posis);
                }
            }
            return np_cents;
        }
    }
    _centroidPosis(posis_i) {
        const unique_posis_i = Array.from(new Set(posis_i));
        const unique_xyzs = unique_posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
        return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    getCenterOfMass(ents_arr) {
        if (getArrDepth(ents_arr) === 1) {
            const [ent_type, ent_i] = ents_arr;
            const pgons_i = this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
            if (pgons_i.length === 0) {
                return null;
            }
            return this._centerOfMass(pgons_i);
        }
        else {
            const cents = [];
            ents_arr = ents_arr;
            for (const [ent_type, ent_i] of ents_arr) {
                const pgons_i = this.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                if (pgons_i.length === 0) {
                    cents.push(null);
                }
                cents.push(this._centerOfMass(pgons_i));
            }
            return cents;
        }
    }
    _centerOfMass(pgons_i) {
        const face_midpoints = [];
        const face_areas = [];
        let total_area = 0;
        for (const pgon_i of pgons_i) {
            const [midpoint_xyz, area] = this._centerOfMassOfPgon(pgon_i);
            face_midpoints.push(midpoint_xyz);
            face_areas.push(area);
            total_area += area;
        }
        const cent = [0, 0, 0];
        for (let i = 0; i < face_midpoints.length; i++) {
            const weight = face_areas[i] / total_area;
            cent[0] = cent[0] + face_midpoints[i][0] * weight;
            cent[1] = cent[1] + face_midpoints[i][1] * weight;
            cent[2] = cent[2] + face_midpoints[i][2] * weight;
        }
        return cent;
    }
    _centerOfMassOfPgon(pgon_i) {
        const tri_midpoints = [];
        const tri_areas = [];
        let total_area = 0;
        const map_posi_to_v3 = new Map();
        for (const tri_i of this.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
            const posis_i = this.modeldata.geom.nav_tri.navTriToPosi(tri_i);
            const posis_v3 = [];
            for (const posi_i of posis_i) {
                let posi_v3 = map_posi_to_v3.get(posi_i);
                if (posi_v3 === undefined) {
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
                    posi_v3 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
                }
                posis_v3.push(posi_v3);
            }
            const tri_tjs = new THREE.Triangle(posis_v3[0], posis_v3[1], posis_v3[2]);
            let midpoint;
            midpoint = tri_tjs.getMidpoint(midpoint);
            const midpoint_xyz = [midpoint.x, midpoint.y, midpoint.z];
            const area = tri_tjs.getArea();
            tri_midpoints.push(midpoint_xyz);
            tri_areas.push(area);
            total_area += area;
        }
        const cent = [0, 0, 0];
        for (let i = 0; i < tri_midpoints.length; i++) {
            const weight = tri_areas[i] / total_area;
            cent[0] = cent[0] + tri_midpoints[i][0] * weight;
            cent[1] = cent[1] + tri_midpoints[i][1] * weight;
            cent[2] = cent[2] + tri_midpoints[i][2] * weight;
        }
        return [cent, total_area];
    }
    // ================================================================================================
    /**
     * used by sweep
     * TODO update offset code to use this as well
     * private to get a set of planes along the length of a wire.
     * The planes are orientated perpendicular to the wire.
     * @param xyzs
     * @param normal
     * @param close
     */
    getPlanesSeq(xyzs, normal, close) {
        normal = vecNorm(normal);
        // if closed, add a posi to the end
        if (close) {
            xyzs.splice(0, 0, xyzs[xyzs.length - 1]);
            xyzs.push(xyzs[1]);
        }
        // get the perp vectors
        let perp_vec = null;
        let has_bad_edges = false;
        const perp_vecs = []; // normalise dvectors
        for (let i = 0; i < xyzs.length - 1; i++) {
            const xyz0 = xyzs[i];
            const xyz1 = xyzs[i + 1];
            const edge_vec = vecFromTo(xyz0, xyz1);
            if (vecLen(edge_vec) > 0) {
                perp_vec = vecCross(vecNorm(edge_vec), normal);
            }
            else {
                perp_vec = null;
                has_bad_edges = true;
            }
            perp_vecs.push(perp_vec);
        }
        // fix any bad pairs, by setting the perp vec to its next neighbour
        if (has_bad_edges) {
            if (perp_vecs[perp_vecs.length - 1] === null) {
                throw new Error('Error: could not process wire.');
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
        // array for planes
        const planes = [];
        // if not closed, we need to deal with the first and last planes
        if (!close) {
            // first plane
            const first_xyz = xyzs[0];
            const x_axis = perp_vecs[0];
            const first2_perp_vec = perp_vecs[1];
            let y_axis = normal;
            if (vecDot(x_axis, first2_perp_vec) < EPS) { // TODO < what is a good value for this?
                y_axis = vecCross(x_axis, first2_perp_vec);
            }
            const first_plane = [first_xyz, x_axis, y_axis];
            planes.push(first_plane);
        }
        // loop through all the edges and create a plane at the end of the edge
        for (let i = 0; i < perp_vecs.length - 1; i++) {
            // get the xyz
            const xyz = xyzs[i + 1];
            // get the two perpendicular vectors
            const this_perp_vec = perp_vecs[i];
            const next_perp_vec = perp_vecs[i + 1];
            // calc the local norm
            let y_axis = normal;
            if (vecDot(this_perp_vec, next_perp_vec) < EPS) { // TODOD < what is a good value for this?
                y_axis = vecCross(this_perp_vec, next_perp_vec);
            }
            // calc the offset vector
            let x_axis = vecNorm(vecAdd(this_perp_vec, next_perp_vec));
            const dot = vecDot(this_perp_vec, x_axis);
            const vec_len = 1 / dot;
            x_axis = vecSetLen(x_axis, vec_len);
            // create the plane
            const plane = [xyz, x_axis, y_axis];
            planes.push(plane);
        }
        // if not closed, we need to deal with the first and last planes
        if (!close) {
            // last plane
            const last_xyz = xyzs[xyzs.length - 1];
            const x_axis = perp_vecs[perp_vecs.length - 1];
            const last2_perp_vec = perp_vecs[perp_vecs.length - 2];
            let y_axis = normal;
            if (vecDot(last2_perp_vec, x_axis) < EPS) { // TODOD < what is a good value for this?
                y_axis = vecCross(last2_perp_vec, x_axis);
            }
            const last_plane = [last_xyz, x_axis, y_axis];
            planes.push(last_plane);
        }
        // return the planes
        return planes;
    }
    // ================================================================================================
    /**
     * Copy posis, points, plines, pgons
     * @param __model__
     * @param ents_arr
     * @param copy_attributes
     */
    copyGeom(ents_arr, copy_attributes) {
        if (!Array.isArray(ents_arr[0])) {
            const [ent_type, ent_i] = ents_arr;
            switch (ent_type) {
                case EEntType.COLL:
                    return [ent_type, this.modeldata.geom.add.copyColl(ent_i, copy_attributes)];
                case EEntType.PGON:
                    return [ent_type, this.modeldata.geom.add.copyPgon(ent_i, copy_attributes)];
                case EEntType.PLINE:
                    return [ent_type, this.modeldata.geom.add.copyPline(ent_i, copy_attributes)];
                case EEntType.POINT:
                    return [ent_type, this.modeldata.geom.add.copyPoint(ent_i, copy_attributes)];
                case EEntType.POSI:
                    return [ent_type, this.modeldata.geom.add.copyPosi(ent_i, copy_attributes)];
                default:
                    throw new Error('Invalid entity type for copying.');
            }
        }
        else {
            ents_arr = ents_arr;
            // return this.copyGeom(ents_arr[0], copy_attributes);
            return ents_arr.map(ents_arr_item => this.copyGeom(ents_arr_item, copy_attributes));
        }
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     * @param copy_attributes
     * @param vector
     */
    clonePosisInEntsAndMove(ents_arr, copy_attributes, vector) {
        const depth = getArrDepth(ents_arr);
        if (depth === 1) {
            ents_arr = [ents_arr];
        }
        else if (depth > 2) {
            // @ts-ignore
            ents_arr = ents_arr.flat(depth - 2);
        }
        // create the new positions
        const old_to_new_posis_i_map = new Map(); // count number of posis
        for (const ent_arr of ents_arr) {
            const [ent_type, index] = ent_arr;
            // something may not be right here
            // if you copy a pgon + posi, if you process the pgon first you wil make a copy of the posis
            // but the posi may already be copied by the this.copyGeom function, then we get two copies of that posi
            if (ent_type === EEntType.POSI) { // positions
                const old_posi_i = index;
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    // do not clone, just move it
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(old_posi_i);
                    this.modeldata.attribs.posis.setPosiCoords(old_posi_i, vecAdd(xyz, vector));
                    // in this case, the old posi and the new posi are the same
                    old_to_new_posis_i_map.set(old_posi_i, old_posi_i);
                }
            }
            else { // obj or coll
                const old_posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                const ent_new_posis_i = [];
                for (const old_posi_i of old_posis_i) {
                    let new_posi_i;
                    if (old_to_new_posis_i_map.has(old_posi_i)) {
                        new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
                    }
                    else {
                        new_posi_i = this.modeldata.geom.add.copyMovePosi(old_posi_i, vector, copy_attributes);
                        old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                    }
                    ent_new_posis_i.push(new_posi_i);
                }
                this.modeldata.geom.edit_topo.replacePosis(ent_type, index, ent_new_posis_i);
            }
        }
        // return all the new points
        // const all_new_posis_i: number[] = Array.from(old_to_new_posis_i_map.values());
        // return all_new_posis_i.map( posi_i => [EEntType.POSI, posi_i] ) as TEntTypeIdx[];
    }
    /**
     * Clones position in entities. Lone positions are not cloned.
     * @param ents_arr
     * @param copy_attributes
     * @param vector
     */
    clonePosisInEnts(ents_arr, copy_attributes) {
        const depth = getArrDepth(ents_arr);
        if (depth === 1) {
            ents_arr = [ents_arr];
        }
        else if (depth > 2) {
            // @ts-ignore
            ents_arr = ents_arr.flat(depth - 2);
        }
        // create the new positions
        const old_to_new_posis_i_map = new Map(); // count number of posis
        for (const ent_arr of ents_arr) {
            const [ent_type, ent_i] = ent_arr;
            // something may not be right here
            // if you copy a pgon + posi, if you process the pgon first you wil make a copy of the posis
            // but the posi may already be copied by the this.copyGeom function, then we get two copies of that posi
            if (ent_type !== EEntType.POSI) { // obj or coll
                const old_posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                const ent_new_posis_i = [];
                for (const old_posi_i of old_posis_i) {
                    let new_posi_i;
                    if (old_to_new_posis_i_map.has(old_posi_i)) {
                        new_posi_i = old_to_new_posis_i_map.get(old_posi_i);
                    }
                    else {
                        new_posi_i = this.modeldata.geom.add.copyPosi(old_posi_i, copy_attributes);
                        old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                    }
                    ent_new_posis_i.push(new_posi_i);
                }
                this.modeldata.geom.edit_topo.replacePosis(ent_type, ent_i, ent_new_posis_i);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc0NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZnVuY3MvR0lGdW5jc0NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNySCxPQUFPLEVBQUUsUUFBUSxFQUFtQyxNQUFNLFdBQVcsQ0FBQztBQUN0RSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFOUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBRWpCOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFDdEIsbUdBQW1HO0lBQzNGLFNBQVMsQ0FBYztJQUMvQixtR0FBbUc7SUFDbkc7O09BRUc7SUFDSCxZQUFZLEtBQWtCO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxtR0FBbUc7SUFDbkc7OztPQUdHO0lBQ0ksV0FBVyxDQUFDLFFBQW1DO1FBQ2xELElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUF1QixRQUF1QixDQUFDO1lBQ3RFLE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QzthQUFNO1lBQ0gsNENBQTRDO1lBQzVDLFFBQVEsR0FBRyxRQUF5QixDQUFD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