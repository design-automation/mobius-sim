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
exports.triangulate = exports.triangulateQuad = void 0;
const three = __importStar(require("three"));
const threex = __importStar(require("./threex"));
const earcut = __importStar(require("./earcut"));
const triangle_1 = require("../geom/triangle");
// import { ConvexHull } from 'three/examples/jsm/math/ConvexHull';
// import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
// import { Earcut } from 'three/Earcut';
const EPS = 1e-6;
//  3D to 2D ======================================================================================================
/**
 * Function that returns a matrix to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are more or less co-planar.
 * Returns null if the plane cannot be found, e.g. points are all colinear.
 */
// function _getMatrixOld(points: three.Vector3[]): three.Matrix4 {
//     // calculate origin
//     const o: three.Vector3 = new three.Vector3();
//     for (const v of points) {
//         o.add(v);
//     }
//     o.divideScalar(points.length);
//     // find three vectors
//     let vx: three.Vector3;
//     let vz: three.Vector3;
//     let got_vx = false;
//     for (let i = 0; i < points.length; i++) {
//         if (!got_vx) {
//             vx =  threex.subVectors(points[i], o);
//             if (vx.lengthSq() !== 0) {got_vx = true; }
//         } else {
//             vz = threex.crossVectors(vx, threex.subVectors(points[i], o));
//             if (vz.lengthSq() !== 0) { break; }
//         }
//         if (i === points.length - 1) { return null; } // could not find any pair of vectors
//     }
//     const vy: three.Vector3 =  threex.crossVectors(vz, vx);
//     // create matrix
//     vx.normalize();
//     vy.normalize();
//     vz.normalize();
//     const m2: three.Matrix4 = new three.Matrix4();
//     m2.makeBasis(vx, vy, vz);
//     m2.invert();
//     return m2;
// }
/**
 * Gtes three extreme points that can be used to calculate the transform matrix
 */
function _getThreePoints(points) {
    // console.log("_getExtremePoints")
    // basic case, a triangle with holes
    if (points.length === 3) {
        return points;
    }
    // find the extreme points
    const extremes = [0, 0, 0, 0, 0, 0];
    // min x, min y, min z, max x, max y, max z
    for (let i = 0; i < points.length; i++) {
        if (points[i].x < points[extremes[0]].x) {
            extremes[0] = i;
        }
        if (points[i].y < points[extremes[1]].y) {
            extremes[1] = i;
        }
        if (points[i].z < points[extremes[2]].z) {
            extremes[2] = i;
        }
        if (points[i].x > points[extremes[3]].x) {
            extremes[3] = i;
        }
        if (points[i].y > points[extremes[4]].y) {
            extremes[4] = i;
        }
        if (points[i].z > points[extremes[5]].z) {
            extremes[5] = i;
        }
    }
    // calc sizes
    const x_size = Math.abs(points[extremes[3]].x - points[extremes[0]].x);
    const y_size = Math.abs(points[extremes[4]].y - points[extremes[1]].y);
    const z_size = Math.abs(points[extremes[5]].z - points[extremes[2]].z);
    // add the extreme points
    const set_selected = new Set();
    if (x_size > 0) {
        set_selected.add(extremes[0]);
        set_selected.add(extremes[3]);
    }
    if (y_size > 0) {
        set_selected.add(extremes[1]);
        set_selected.add(extremes[4]);
    }
    if (z_size > 0) {
        set_selected.add(extremes[2]);
        set_selected.add(extremes[5]);
    }
    // get three points that are not too close together
    const LIMIT = 0.0001; /// I am not sure what to set this to
    const selected = Array.from(set_selected).sort((a, b) => a - b);
    let three_selected = [selected[0]];
    for (let i = 1; i < selected.length; i++) {
        // I am not really sure if this distance check is needed
        // we already got extreme points
        // but it is possible that two or even three extreme points are right next to each other
        // squashed together in a corner... so I leave this check for now
        if (points[selected[i - 1]].manhattanDistanceTo(points[selected[i]]) > LIMIT) {
            three_selected.push(selected[i]);
        }
        if (three_selected.length === 3) {
            break;
        }
    }
    // we should now have three points
    if (three_selected.length === 3) {
        // console.log("FAST METHOD");
        return three_selected.map(i => points[i]);
    }
    else if (three_selected.length === 2) {
        // there is always a special case... the dreaded diagonal shape
        // console.log("SLOW METHOD", [first, second]);
        const [first, second] = three_selected;
        const line = new three.Line3(points[first], points[second]);
        let third;
        let dist = 0;
        for (let i = 0; i < points.length; i++) {
            const cur_point = points[i];
            if (cur_point !== points[first] && cur_point !== points[second]) {
                const dummy = new three.Vector3();
                const close_point = line.closestPointToPoint(cur_point, true, dummy);
                const cur_dist = cur_point.manhattanDistanceTo(close_point);
                if (dist < cur_dist) {
                    third = i;
                    dist = cur_dist;
                }
            }
            if (dist > LIMIT) {
                break;
            }
        }
        if (third === undefined) {
            return null;
        }
        three_selected = [first, second, third].sort((a, b) => a - b);
        return three_selected.map(i => points[i]);
    }
    // else if (selected.size === 2) { // special diagonal case
    //     console.log("XXXXXXXXXXXXXXX")
    //     return null;
    //     // TODO replace with convex hull
    //     const pair_idxs: number[] = Array.from(selected.values());
    //     const line: three.Line3 = new three.Line3(points[pair_idxs[0]], points[pair_idxs[1]]);
    //     const line_len: number = line.delta(new three.Vector3()).manhattanLength();
    //     let max_dist = 1e-4;
    //     let third_point_idx = null;
    //     for (let i = 0; i < points.length; i++) {
    //         if (i !== pair_idxs[0] && i !== pair_idxs[1]) {
    //             const point_on_line: three.Vector3 = line.closestPointToPoint(points[i], false, new three.Vector3());
    //             const dist_to_line: number = point_on_line.manhattanDistanceTo(points[i]);
    //             if (dist_to_line > max_dist) {
    //                 third_point_idx = i;
    //                 max_dist = dist_to_line;
    //             }
    //             if (dist_to_line / line_len > 0.01) { break; }
    //         }
    //     }
    //     if (third_point_idx === null) { return null; }
    //     const extreme_points: three.Vector3[] =
    // [pair_idxs[0], pair_idxs[1], third_point_idx].sort((a, b) => a - b ).map( i => points[i] );
    //     return extreme_points;
    // }
    // could not find points
    return null;
}
/**
 * Function that returns a matrix to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are more or less co-planar.
 * Returns null if the plane cannot be found, e.g. points are all colinear.
 */
function _getMatrix(points) {
    const three_points = _getThreePoints(points);
    // if (extreme_points === null) {
    //     console.log("POINTS = ",points)
    //     extreme_points = _getExtremePointsConvex(points);
    // }
    if (three_points === null) {
        return null;
    }
    // console.log("points", points)
    // console.log("extremes", extremes)
    // console.log("selected", selected)
    // console.log("points2", points2)
    // calculate origin
    // const o: three.Vector3 = new three.Vector3();
    // o.x = (points2[0].x + points2[0].x + points2[0].x) / 3;
    // o.y = (points2[1].y + points2[1].y + points2[1].y) / 3;
    // o.z = (points2[2].z + points2[2].z + points2[2].z) / 3;
    const vx = threex.subVectors(three_points[1], three_points[0]).normalize();
    const v2 = threex.subVectors(three_points[2], three_points[1]).normalize();
    const vz = threex.crossVectors(vx, v2).normalize();
    const vy = threex.crossVectors(vz, vx).normalize();
    // console.log(vx, vy, vz)
    // create matrix
    const m2 = new three.Matrix4();
    m2.makeBasis(vx, vy, vz);
    m2.invert();
    return m2;
}
/**
 * Triangulate a 4 sided shape
 * @param coords
 */
function triangulateQuad(coords) {
    // TODO this does not take into account degenerate cases
    // TODO two points in same location
    // TODO Three points that are colinear
    const area1 = (0, triangle_1.area)(coords[0], coords[1], coords[2]) + (0, triangle_1.area)(coords[2], coords[3], coords[0]);
    const area2 = (0, triangle_1.area)(coords[0], coords[1], coords[3]) + (0, triangle_1.area)(coords[1], coords[2], coords[3]);
    // const tri1a: Txyz[] = [coords[0], coords[1], coords[2]];
    // const tri1b: Txyz[] = [coords[2], coords[3], coords[0]];
    // const tri2a: Txyz[] = [coords[0], coords[1], coords[3]];
    // const tri2b: Txyz[] = [coords[1], coords[2], coords[3]];
    if (area1 < area2) {
        return [[0, 1, 2], [2, 3, 0]];
    }
    else {
        return [[0, 1, 3], [1, 2, 3]];
    }
}
exports.triangulateQuad = triangulateQuad;
/**
 * Triangulates a set of coords in 3d with holes
 * If the coords cannot be triangulated, it returns [].
 * @param coords
 */
function triangulate(coords, holes) {
    // check if we have holes
    const has_holes = (holes !== undefined && holes.length !== 0);
    // basic case, a triangle with no holes
    if (coords.length === 3 && !has_holes) {
        return [[0, 1, 2]];
    }
    // basic case, a quad with no holes
    if (coords.length === 4 && !has_holes) {
        return triangulateQuad(coords);
    }
    // get the matrix to transform from 2D to 3D
    const coords_v = coords.map(coord => new three.Vector3(...coord));
    const matrix = _getMatrix(coords_v);
    // check for null, which means no plane could be found
    if (matrix === null) {
        return [];
    }
    // create an array to store all x y vertex coordinates
    const flat_vert_xys = [];
    // get the perimeter vertices and add them to the array
    const coords_v_2d = coords_v.map((coord_v) => threex.multVectorMatrix(coord_v, matrix));
    if (coords_v_2d === undefined || coords_v_2d === null || coords_v_2d.length === 0) {
        console.log('WARNING: triangulation failed.');
        return [];
    }
    coords_v_2d.forEach(coord_v_2d => flat_vert_xys.push(coord_v_2d.x, coord_v_2d.y));
    // hole vertices uing EARCUT
    // holes is an array of hole indices if any (e.g. [5, 8] for a 12-vertex input would mean
    // one hole with vertices 5–7 and another with 8–11).
    const hole_indices = [];
    let index_counter = coords_v.length;
    if (has_holes) {
        for (const hole of holes) {
            hole_indices.push(index_counter);
            if (hole.length) {
                const hole_coords_v = hole.map(hole_coord => new three.Vector3(...hole_coord));
                const hole_coords_v_2d = hole_coords_v.map((hole_coord_v) => threex.multVectorMatrix(hole_coord_v, matrix));
                const one_hole = [];
                hole_coords_v_2d.forEach(hole_coord_v => flat_vert_xys.push(hole_coord_v.x, hole_coord_v.y));
                index_counter += hole.length;
            }
        }
    }
    // do the triangulation
    const flat_tris_i = earcut.Earcut.triangulate(flat_vert_xys, hole_indices);
    // convert the triangles into lists of three
    const tris_i = [];
    for (let i = 0; i < flat_tris_i.length; i += 3) {
        tris_i.push([flat_tris_i[i], flat_tris_i[i + 1], flat_tris_i[i + 2]]);
    }
    // return the list of triangles
    return tris_i;
}
exports.triangulate = triangulate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpYW5ndWxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGlicy90cmlhbmd1bGF0ZS90cmlhbmd1bGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQStCO0FBQy9CLGlEQUFtQztBQUNuQyxpREFBbUM7QUFFbkMsK0NBQXdDO0FBQ3hDLG1FQUFtRTtBQUNuRSxpRkFBaUY7QUFDakYseUNBQXlDO0FBRXpDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQUdqQixtSEFBbUg7QUFFbkg7Ozs7R0FJRztBQUNILG1FQUFtRTtBQUNuRSwwQkFBMEI7QUFDMUIsb0RBQW9EO0FBQ3BELGdDQUFnQztBQUNoQyxvQkFBb0I7QUFDcEIsUUFBUTtBQUNSLHFDQUFxQztBQUNyQyw0QkFBNEI7QUFDNUIsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3QiwwQkFBMEI7QUFDMUIsZ0RBQWdEO0FBQ2hELHlCQUF5QjtBQUN6QixxREFBcUQ7QUFDckQseURBQXlEO0FBQ3pELG1CQUFtQjtBQUNuQiw2RUFBNkU7QUFDN0Usa0RBQWtEO0FBQ2xELFlBQVk7QUFDWiw4RkFBOEY7QUFDOUYsUUFBUTtBQUNSLDhEQUE4RDtBQUM5RCx1QkFBdUI7QUFDdkIsc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIscURBQXFEO0FBQ3JELGdDQUFnQztBQUNoQyxtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCLElBQUk7QUFFSjs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLE1BQXVCO0lBQzVDLG1DQUFtQztJQUNuQyxvQ0FBb0M7SUFDcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNyQixPQUFPLE1BQU0sQ0FBQztLQUNqQjtJQUNELDBCQUEwQjtJQUMxQixNQUFNLFFBQVEsR0FBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUMsMkNBQTJDO0lBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkI7UUFDRCxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjtRQUNELElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkI7UUFDRCxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMs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