"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rayGtoL = exports.rayLtoG = exports.rayFromPln = exports.rayLMove = exports.rayRot = exports.rayMove = exports.rayCopy = exports.rayFromTo = exports.rayMake = void 0;
const vectors_1 = require("../../libs/geom/vectors");
const arrs_1 = require("../../libs/util/arrs");
const matrix_1 = require("../../libs/geom/matrix");
const _check_inline_args_1 = require("../_check_inline_args");
/**
 * Creates a ray from an origin "o" and a direction vector "d".
 * Creates a ray from an origin "o", a direction vector "d", and length "l".
 * @param origin
 * @param dir
 * @param len
 */
function rayMake(debug, origin, dir, len) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayMake', arguments, 3, 2);
    }
    // overloaded case
    const origin_dep = (0, arrs_1.getArrDepth)(origin);
    const dir_dep = (0, arrs_1.getArrDepth)(dir);
    if (origin_dep === 2 || dir_dep === 2) {
        if (dir_dep === 1) {
            // only origin is Txyz[]
            return origin.map(origin_val => rayMake(debug, origin_val, dir, len));
        }
        else if (origin_dep === 1) {
            // only dir is Txyz[]
            return dir.map(dir_val => rayMake(debug, origin, dir_val, len));
        }
        else {
            // both origin and dir are Txyz[], they must be equal length
            if (origin.length === dir.length) {
                const vecs = [];
                for (let i = 0; i < origin.length; i++) {
                    vecs.push(rayMake(debug, origin[i], dir[i], len));
                }
                return vecs;
            }
            else {
                throw new Error('Error making rays with lists of vectors: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both origin and dir are Txyz
    const ray_vec = len ? (0, vectors_1.vecSetLen)(dir, len) : dir;
    return [origin.slice(), ray_vec];
}
exports.rayMake = rayMake;
/**
 * Creates a ray between to points.
 * @param xyz1
 * @param xyz2
 */
function rayFromTo(debug, xyz1, xyz2) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayFromTo', arguments, 2);
    }
    // overloaded case
    const depth1 = (0, arrs_1.getArrDepth)(xyz1);
    const depth2 = (0, arrs_1.getArrDepth)(xyz2);
    if (depth1 === 2 || depth2 === 2) {
        if (depth2 === 1) {
            // only xyz1 is Txyz[]
            return xyz1.map(a_xyz1 => [a_xyz1, (0, vectors_1.vecFromTo)(a_xyz1, xyz2)]);
        }
        else if (depth1 === 1) {
            // only xyz2 is Txyz[]
            return xyz2.map(a_xyz2 => [xyz1, (0, vectors_1.vecFromTo)(xyz1, a_xyz2)]);
        }
        else {
            // both xyz1 and xyz2 are Txyz[], they must be equal length
            if (xyz1.length === xyz2.length) {
                const rays = [];
                for (let i = 0; i < xyz1.length; i++) {
                    rays.push([xyz1[i], (0, vectors_1.vecFromTo)(xyz1[i], xyz2[i])]);
                }
                return rays;
            }
            else {
                throw new Error('Error calculating vectors between two between lists of coordinates: The two lists must be of equal length.');
            }
        }
    }
    // normal case, both xyz1 and xyz2 are Txyz
    return [xyz1, (0, vectors_1.vecFromTo)(xyz1, xyz2)];
}
exports.rayFromTo = rayFromTo;
/**
 * Make a copy of the ray "r"
 * @param ray
 */
function rayCopy(debug, ray) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayCopy', arguments, 1);
    }
    // overloaded case
    const ray_dep = (0, arrs_1.getArrDepth)(ray);
    if (ray_dep === 3) {
        return ray.map(ray_one => rayCopy(debug, ray_one));
    }
    // normal case
    return [ray[0].slice(), ray[1].slice()];
}
exports.rayCopy = rayCopy;
/**
 * Move the ray "r" relative to the global X, Y, and Z axes, by vector "v".
 * @param ray
 * @param vec
 */
function rayMove(debug, ray, vec) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayMove', arguments, 2);
    }
    // overloaded case
    const ray_dep = (0, arrs_1.getArrDepth)(ray);
    const vec_dep = (0, arrs_1.getArrDepth)(vec);
    if (ray_dep === 3) {
        ray = ray;
        if (vec_dep === 1) {
            vec = vec;
            return ray.map(ray_one => rayMove(debug, ray_one, vec));
        }
        else if (vec_dep === 2 && ray.length === vec.length) {
            vec = vec;
            const rays = [];
            for (let i = 0; i < ray.length; i++) {
                rays.push(rayMove(debug, ray[i], vec[i]));
            }
        }
        else {
            throw new Error('Error moving a list rays with a list of vectors: The two lists must be of equal length.');
        }
    }
    // normal case
    ray = ray;
    vec = vec;
    return [(0, vectors_1.vecAdd)(ray[0], vec), ray[1].slice()];
}
exports.rayMove = rayMove;
/**
 * Rotate the ray "r1" around the ray "r2", by angle "a" (in radians).
 * @param ray1
 * @param ray2
 * @param ang
 */
function rayRot(debug, ray1, ray2, ang) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayRot', arguments, 3);
    }
    // overloaded case
    const ray1_dep = (0, arrs_1.getArrDepth)(ray1);
    const ray2_dep = (0, arrs_1.getArrDepth)(ray2);
    const ang_dep = (0, arrs_1.getArrDepth)(ang);
    if (ray1_dep === 3) {
        ray1 = ray1;
        if (ray2_dep === 2 && ang_dep === 0) {
            ray2 = ray2;
            ang = ang;
            return ray1.map(ray1_one => rayRot(debug, ray1_one, ray2, ang));
        }
        else if (ray2_dep === 3 && ang_dep === 1 && ray1.length === ray2.length && ray1.length === ang.length) {
            ray2 = ray2;
            ang = ang;
            const rays = [];
            for (let i = 0; i < ray1.length; i++) {
                rays.push(rayRot(debug, ray1[i], ray2[i], ang[i]));
            }
            return rays;
        }
        else {
            throw new Error('Error rotating a list planes with a list of ray2s and angles: The three lists must be of equal length.');
        }
    }
    // normal case
    ray1 = ray1;
    ray2 = ray2;
    ang = ang;
    const from_ray2_o_to_ray1_o = (0, vectors_1.vecFromTo)(ray2[0], ray1[0]);
    const rot_ray1_origin = (0, vectors_1.vecAdd)(ray2[0], (0, vectors_1.vecRot)(from_ray2_o_to_ray1_o, ray2[1], ang));
    return [rot_ray1_origin, (0, vectors_1.vecRot)(ray1[1], ray2[1], ang)];
}
exports.rayRot = rayRot;
/**
 * Move the ray "r" relative to the ray direction vector, by distance "d".
 * @param ray
 * @param dist
 */
function rayLMove(debug, ray, dist) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayLMove', arguments, 2);
    }
    // overloaded case
    const ray_dep = (0, arrs_1.getArrDepth)(ray);
    const dist_dep = (0, arrs_1.getArrDepth)(dist);
    if (ray_dep === 3) {
        ray = ray;
        if (dist_dep === 0) {
            dist = dist;
            return ray.map(ray_one => rayLMove(debug, ray_one, dist));
        }
        else if (dist_dep === 1 && ray.length === dist.length) {
            dist = dist;
            const rays = [];
            for (let i = 0; i < ray.length; i++) {
                rays.push(rayLMove(debug, ray[i], dist[i]));
            }
        }
        else {
            throw new Error('Error moving a list rays with a list of distances: The two lists must be of equal length.');
        }
    }
    // normal case
    ray = ray;
    dist = dist;
    const vec = (0, vectors_1.vecMult)((0, vectors_1.vecNorm)(ray[1]), dist);
    return [(0, vectors_1.vecAdd)(ray[0], vec), ray[1].slice()];
}
exports.rayLMove = rayLMove;
/**
 * Create a ray from a plane "p", with the same origin and with a direction along the plane z axis.
 * @param pln
 */
function rayFromPln(debug, pln) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayFromPln', arguments, 1);
    }
    // overloaded case
    const pln_dep = (0, arrs_1.getArrDepth)(pln);
    if (pln_dep === 3) {
        return pln.map(pln_one => rayFromPln(debug, pln_one));
    }
    // normal case
    pln = pln;
    return [pln[0].slice(), (0, vectors_1.vecCross)(pln[1], pln[2])];
}
exports.rayFromPln = rayFromPln;
/**
 * Transforms a ray from a local coordinate system define by plane "p" to the global coordinate system.
 * @param r
 * @param p
 */
function rayLtoG(debug, r, p) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayLtoG', arguments, 2);
    }
    return _rayXForm(debug, r, p, true);
}
exports.rayLtoG = rayLtoG;
/**
 * Transforms a ray from the global coordinate system to a local coordinate system define by plane "p".
 * @param r
 * @param p
 */
function rayGtoL(debug, r, p) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('rayGtoL', arguments, 2);
    }
    return _rayXForm(debug, r, p, false);
}
exports.rayGtoL = rayGtoL;
function _rayXForm(debug, r, p, to_global) {
    // overloaded case
    const depth1 = (0, arrs_1.getArrDepth)(r);
    const depth2 = (0, arrs_1.getArrDepth)(p);
    if (depth1 === 2 && depth2 === 2) {
        // r is TRay and p is TPlane
        r = r;
        p = p;
        const p2 = [[0, 0, 0], p[1], p[2]];
        const origin = (0, matrix_1.multMatrix)(r[0], (0, matrix_1.xformMatrix)(p, to_global));
        const dir = (0, matrix_1.multMatrix)(r[1], (0, matrix_1.xformMatrix)(p2, to_global));
        return [origin, dir];
    }
    else if (depth1 === 3 && depth2 === 2) {
        // r is TRay[] and p is TPlane
        r = r;
        p = p;
        const p2 = [[0, 0, 0], p[1], p[2]];
        const m = (0, matrix_1.xformMatrix)(p, to_global);
        const m2 = (0, matrix_1.xformMatrix)(p2, to_global);
        const result = [];
        for (const a_r of r) {
            const origin = (0, matrix_1.multMatrix)(a_r[0], m);
            const dir = (0, matrix_1.multMatrix)(a_r[1], m2);
            result.push([origin, dir]);
        }
        return result;
    }
    else if (depth1 === 2 && depth2 === 3) {
        // r is TRay and p is TPlane[]
        r = r;
        p = p;
        const result = [];
        for (const a_p of p) {
            const p2 = [[0, 0, 0], a_p[1], a_p[2]];
            const origin = (0, matrix_1.multMatrix)(r[0], (0, matrix_1.xformMatrix)(a_p, to_global));
            const dir = (0, matrix_1.multMatrix)(r[1], (0, matrix_1.xformMatrix)(p2, to_global));
            result.push([origin, dir]);
        }
        return result;
    }
    else if (depth1 === 3 && depth2 === 3) {
        // r is TRay[] p is TPlane[], they must be equal length
        r = r;
        p = p;
        if (r.length !== p.length) {
            throw new Error('Error transforming rays: The list of rays and list of planes must be of equal length.');
        }
        const result = [];
        for (let i = 0; i < r.length; i++) {
            const p2 = [[0, 0, 0], p[i][1], p[i][2]];
            const origin = (0, matrix_1.multMatrix)(r[i][0], (0, matrix_1.xformMatrix)(p[i], to_global));
            const dir = (0, matrix_1.multMatrix)(r[i][1], (0, matrix_1.xformMatrix)(p2, to_global));
            result.push([origin, dir]);
        }
        return result;
    }
    throw new Error('Error transforming rays: Cannot process the input lists.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3JheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2lubGluZS9fcmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVEQUE4SDtBQUM5SCxpREFBcUQ7QUFDckQscURBQW1FO0FBQ25FLDhEQUFxRDtBQUVyRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixPQUFPLENBQUMsS0FBYyxFQUFFLE1BQW1CLEVBQUUsR0FBZ0IsRUFBRSxHQUFZO0lBQ3ZGLElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBQSxpQ0FBWSxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzVDO0lBQ0Qsa0JBQWtCO0lBQ2xCLE1BQU0sVUFBVSxHQUFXLElBQUEsa0JBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxNQUFNLE9BQU8sR0FBVyxJQUFBLGtCQUFXLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsSUFBSSxVQUFVLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7UUFDbkMsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO1lBQ2Ysd0JBQXdCO1lBQ3hCLE9BQVEsTUFBaUIsQ0FBQyxHQUFHLENBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQWtCLEVBQUUsR0FBVyxFQUFFLEdBQUcsQ0FBUyxDQUFDLENBQUM7U0FDOUc7YUFBTSxJQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDekIscUJBQXFCO1lBQ3JCLE9BQVEsR0FBYyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBYyxFQUFFLE9BQWUsRUFBRSxHQUFHLENBQVMsQ0FBQyxDQUFDO1NBQ3hHO2FBQU07WUFDSCw0REFBNEQ7WUFDNUQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlC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