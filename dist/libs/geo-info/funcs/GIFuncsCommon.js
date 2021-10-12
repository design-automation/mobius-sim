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
const vectors_1 = require("../../geom/vectors");
const common_1 = require("../common");
const THREE = __importStar(require("three"));
const arrs_1 = require("../../../libs/util/arrs");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lGdW5jc0NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2Z1bmNzL0dJRnVuY3NDb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUFxSDtBQUNySCxzQ0FBc0U7QUFDdEUsNkNBQStCO0FBQy9CLGlEQUFxRDtBQUVyRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFFakI7O0dBRUc7QUFDSCxNQUFhLGFBQWE7SUFHdEIsbUdBQW1HO0lBQ25HOztPQUVHO0lBQ0gsWUFBWSxLQUFrQjtRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsbUdBQW1HO0lBQ25HOzs7T0FHRztJQUNJLFdBQVcsQ0FBQyxRQUFtQztRQUNsRCxJQUFJLElBQUEsa0JBQVcsRUFBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBdUIsUUFBdUIsQ0FBQztZQUN0RSxNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNILDRDQUE0QztZQUM1QyxRQUFRLEdBQUcsUUFBeUIsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7WUFDN0IsTUFBTSxXQUFXLEdBQWtCLEVBQUUsQ0FBQztZQUN0QyxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtnQkFDNUIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssaUJBQVEsQ0FBQyxJQUFJLEVBQUU7b0JBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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