import * as three from 'three';
import * as threex from './threex';
import * as earcut from './earcut';
import { area } from '../geom/triangle';
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
export function triangulateQuad(coords) {
    // TODO this does not take into account degenerate cases
    // TODO two points in same location
    // TODO Three points that are colinear
    const area1 = area(coords[0], coords[1], coords[2]) + area(coords[2], coords[3], coords[0]);
    const area2 = area(coords[0], coords[1], coords[3]) + area(coords[1], coords[2], coords[3]);
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
/**
 * Triangulates a set of coords in 3d with holes
 * If the coords cannot be triangulated, it returns [].
 * @param coords
 */
export function triangulate(coords, holes) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpYW5ndWxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGlicy90cmlhbmd1bGF0ZS90cmlhbmd1bGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEtBQUssTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEtBQUssTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUVuQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsbUVBQW1FO0FBQ25FLGlGQUFpRjtBQUNqRix5Q0FBeUM7QUFFekMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBR2pCLG1IQUFtSDtBQUVuSDs7OztHQUlHO0FBQ0gsbUVBQW1FO0FBQ25FLDBCQUEwQjtBQUMxQixvREFBb0Q7QUFDcEQsZ0NBQWdDO0FBQ2hDLG9CQUFvQjtBQUNwQixRQUFRO0FBQ1IscUNBQXFDO0FBQ3JDLDRCQUE0QjtBQUM1Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBQzdCLDBCQUEwQjtBQUMxQixnREFBZ0Q7QUFDaEQseUJBQXlCO0FBQ3pCLHFEQUFxRDtBQUNyRCx5REFBeUQ7QUFDekQsbUJBQW1CO0FBQ25CLDZFQUE2RTtBQUM3RSxrREFBa0Q7QUFDbEQsWUFBWTtBQUNaLDhGQUE4RjtBQUM5RixRQUFRO0FBQ1IsOERBQThEO0FBQzlELHVCQUF1QjtBQUN2QixzQkFBc0I7QUFDdEIsc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixxREFBcUQ7QUFDckQsZ0NBQWdDO0FBQ2hDLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIsSUFBSTtBQUVKOztHQUVHO0FBQ0gsU0FBUyxlQUFlLENBQUMsTUFBdUI7SUFDNUMsbUNBQW1DO0lBQ25DLG9DQUFvQztJQUNwQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3JCLE9BQU8sTUFBTSxDQUFDO0tB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