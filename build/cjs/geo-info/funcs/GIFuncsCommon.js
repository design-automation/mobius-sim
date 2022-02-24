"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIFuncsCommon = void 0;
const THREE = __importStar(require("three"));
const vectors_1 = require("../../geom/vectors");
const arrs_1 = require("../../util/arrs");
const common_1 = require("../common");
const EPS = 1e-8;
/**
 * Class for editing geometry.
 */
class GIFuncsCommon {
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
        if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
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
                if (ent_arr[0] === common_1.EEntType.POSI) {
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
        return (0, vectors_1.vecDiv)((0, vectors_1.vecSum)(unique_xyzs), unique_xyzs.length);
    }
    // ================================================================================================
    /**
     *
     * @param ents_arr
     */
    getCenterOfMass(ents_arr) {
        if ((0, arrs_1.getArrDepth)(ents_arr) === 1) {
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
        normal = (0, vectors_1.vecNorm)(normal);
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
            const edge_vec = (0, vectors_1.vecFromTo)(xyz0, xyz1);
            if ((0, vectors_1.vecLen)(edge_vec) > 0) {
                perp_vec = (0, vectors_1.vecCross)((0, vectors_1.vecNorm)(edge_vec), normal);
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
            if ((0, vectors_1.vecDot)(x_axis, first2_perp_vec) < EPS) { // TODO < what is a good value for this?
                y_axis = (0, vectors_1.vecCross)(x_axis, first2_perp_vec);
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
            if ((0, vectors_1.vecDot)(this_perp_vec, next_perp_vec) < EPS) { // TODOD < what is a good value for this?
                y_axis = (0, vectors_1.vecCross)(this_perp_vec, next_perp_vec);
            }
            // calc the offset vector
            let x_axis = (0, vectors_1.vecNorm)((0, vectors_1.vecAdd)(this_perp_vec, next_perp_vec));
            const dot = (0, vectors_1.vecDot)(this_perp_vec, x_axis);
            const vec_len = 1 / dot;
            x_axis = (0, vectors_1.vecSetLen)(x_axis, vec_len);
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
            if ((0, vectors_1.vecDot)(last2_perp_vec, x_axis) < EPS) { // TODOD < what is a good value for this?
                y_axis = (0, vectors_1.vecCross)(last2_perp_vec, x_axis);
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
                case common_1.EEntType.COLL:
                    return [ent_type, this.modeldata.geom.add.copyColl(ent_i, copy_attributes)];
                case common_1.EEntType.PGON:
                    return [ent_type, this.modeldata.geom.add.copyPgon(ent_i, copy_attributes)];
                case common_1.EEntType.PLINE:
                    return [ent_type, this.modeldata.geom.add.copyPline(ent_i, copy_attributes)];
                case common_1.EEntType.POINT:
                    return [ent_type, this.modeldata.geom.add.copyPoint(ent_i, copy_attributes)];
                case common_1.EEntType.POSI:
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
        const depth = (0, arrs_1.getArrDepth)(ents_arr);
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
            if (ent_type === common_1.EEntType.POSI) { // positions
                const old_posi_i = index;
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    // do not clone, just move it
                    const xyz = this.modeldata.attribs.posis.getPosiCoords(old_posi_i);
                    this.modeldata.attribs.posis.setPosiCoords(old_posi_i, (0, vectors_1.vecAdd)(xyz, vector));
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
        const depth = (0, arrs_1.getArrDepth)(ents_arr);
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
            if (ent_type !== common_1.EEntType.POSI) { // obj or coll
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
exports.GIFuncsCommon = GIFuncsCommon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc0NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZnVuY3MvR0lGdW5jc0NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBRS9CLGdEQUFxSDtBQUNySCwwQ0FBOEM7QUFDOUMsc0NBQWdFO0FBR2hFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQUVqQjs7R0FFRztBQUNILE1BQWEsYUFBYTtJQUd0QixtR0FBbUc7SUFDbkc7O09BRUc7SUFDSCxZQUFZLEtBQWtCO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxtR0FBbUc7SUFDbkc7OztPQUdHO0lBQ0ksV0FBVyxDQUFDLFFBQW1DO1FBQ2xELElBQUksSUFBQSxrQkFBVyxFQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUF1QixRQUF1QixDQUFDO1lBQ3RFLE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QzthQUFNO1lBQ0gsNENBQTRDO1lBQzVDLFFBQVEsR0FBRyxRQUF5QixDQUFDO1lBQ3JDLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUM3QixNQUFNLFdBQVcsR0FBa0IsRUFBRSxDQUFDO1lBQ3RDLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO2dCQUM1QixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxpQkFBUSxDQUFDLElBQUksRUFBRTtvQkFDOUIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FB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