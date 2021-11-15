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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpYW5ndWxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWJzL3RyaWFuZ3VsYXRlL3RyaWFuZ3VsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQy9CLE9BQU8sS0FBSyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBRW5DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxtRUFBbUU7QUFDbkUsaUZBQWlGO0FBQ2pGLHlDQUF5QztBQUV6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFHakIsbUhBQW1IO0FBRW5IOzs7O0dBSUc7QUFDSCxtRUFBbUU7QUFDbkUsMEJBQTBCO0FBQzFCLG9EQUFvRDtBQUNwRCxnQ0FBZ0M7QUFDaEMsb0JBQW9CO0FBQ3BCLFFBQVE7QUFDUixxQ0FBcUM7QUFDckMsNEJBQTRCO0FBQzVCLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsMEJBQTBCO0FBQzFCLGdEQUFnRDtBQUNoRCx5QkFBeUI7QUFDekIscURBQXFEO0FBQ3JELHlEQUF5RDtBQUN6RCxtQkFBbUI7QUFDbkIsNkVBQTZFO0FBQzdFLGtEQUFrRDtBQUNsRCxZQUFZO0FBQ1osOEZBQThGO0FBQzlGLFFBQVE7QUFDUiw4REFBOEQ7QUFDOUQsdUJBQXVCO0FBQ3ZCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsc0JBQXNCO0FBQ3RCLHFEQUFxRDtBQUNyRCxnQ0FBZ0M7QUFDaEMsbUJBQW1CO0FBQ25CLGlCQUFpQjtBQUNqQixJQUFJO0FBRUo7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxNQUF1QjtJQUM1QyxtQ0FBbUM7SUFDbkMsb0NBQW9DO0lBQ3BDLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDckIsT0FBTyxNQUFNLENBQUM7S0FDakI7SUFDRCwwQkFBMEI7SUFDMUIsTUFBTSxRQUFRLEdBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDLDJDQUEyQztJQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjtRQUNELElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkI7UUFDRCxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztT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