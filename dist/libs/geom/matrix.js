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
exports.xformMatrix = exports.xfromSourceTargetMatrix = exports.scaleMatrix = exports.rotateMatrix = exports.mirrorMatrix = exports.multMatrix = void 0;
const three = __importStar(require("three"));
const vectors_1 = require("./vectors");
function multMatrix(xyz, m) {
    const v2 = new three.Vector3(...xyz);
    v2.applyMatrix4(m);
    return v2.toArray();
}
exports.multMatrix = multMatrix;
function mirrorMatrix(plane) {
    const origin = plane[0];
    const normal = (0, vectors_1.vecCross)(plane[1], plane[2]);
    // plane normal
    const [a, b, c] = (0, vectors_1.vecNorm)(normal);
    // rotation matrix
    const matrix_mirror = new three.Matrix4();
    matrix_mirror.set(1 - (2 * a * a), -2 * a * b, -2 * a * c, 0, -2 * a * b, 1 - (2 * b * b), -2 * b * c, 0, -2 * a * c, -2 * b * c, 1 - (2 * c * c), 0, 0, 0, 0, 1);
    // translation matrix
    const matrix_trn1 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // final matrix
    const move_mirror_move = matrix_trn2.multiply(matrix_mirror.multiply(matrix_trn1));
    // do the xform
    return move_mirror_move;
}
exports.mirrorMatrix = mirrorMatrix;
function rotateMatrix(ray, angle) {
    const origin = ray[0];
    const axis = (0, vectors_1.vecNorm)(ray[1]);
    // rotation matrix
    const matrix_rot = new three.Matrix4();
    matrix_rot.makeRotationAxis(new three.Vector3(...axis), angle);
    // translation matrix
    const matrix_trn1 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // final matrix
    const move_rot_move = matrix_trn2.multiply(matrix_rot.multiply(matrix_trn1));
    // do the xform
    return move_rot_move;
}
exports.rotateMatrix = rotateMatrix;
function scaleMatrix(plane, factor) {
    // scale matrix
    const matrix_scale = new three.Matrix4();
    matrix_scale.makeScale(factor[0], factor[1], factor[2]);
    // xform matrix
    const matrix_xform1 = xformMatrix(plane, true);
    const matrix_xform2 = xformMatrix(plane, false);
    // final matrix
    const xform_scale_xform = matrix_xform2.multiply(matrix_scale.multiply(matrix_xform1));
    // do the xform
    return xform_scale_xform;
}
exports.scaleMatrix = scaleMatrix;
function xfromSourceTargetMatrix(source_plane, target_plane) {
    // matrix to xform from source to gcs, then from gcs to target
    const matrix_source_to_gcs = xformMatrix(source_plane, true);
    const matrix_gcs_to_target = xformMatrix(target_plane, false);
    // final matrix
    const xform = matrix_gcs_to_target.multiply(matrix_source_to_gcs);
    // return the matrix
    return xform;
}
exports.xfromSourceTargetMatrix = xfromSourceTargetMatrix;
// ================================================================================================
// Helper functions
// ================================================================================================
function xformMatrix(plane, neg) {
    const o = new three.Vector3(...plane[0]);
    const x = new three.Vector3(...plane[1]);
    const y = new three.Vector3(...plane[2]);
    const z = new three.Vector3(...(0, vectors_1.vecCross)(plane[1], plane[2]));
    if (neg) {
        o.negate();
    }
    // origin translate matrix
    const m1 = new three.Matrix4();
    m1.setPosition(o);
    // xfrom matrix
    const m2 = new three.Matrix4();
    m2.makeBasis(x, y, z);
    // combine two matrices
    const m3 = new three.Matrix4();
    if (neg) {
        const m2x = (new three.Matrix4()).copy(m2).invert();
        // first translate to origin, then xform, so m2 x m1
        m3.multiplyMatrices(m2x, m1);
    }
    else {
        // first xform, then translate to origin, so m1 x m2
        m3.multiplyMatrices(m1, m2);
    }
    // return the combined matrix
    return m3;
}
exports.xformMatrix = xformMatrix;
// ---------------------------------------------------------------------------------
// function _matrixFromXYZ(pts: Txyz[],
//     from_origin: Txyz, from_vectors: Txyz[],
//     to_origin: Txyz, to_vectors: Txyz[]): number[][] {
//     const e1: three.Vector3 = new three.Vector3(from_vectors[0][0]).normalize();
//     const e2: three.Vector3 = new three.Vector3(from_vectors[0][1]).normalize();
//     const e3: three.Vector3 = new three.Vector3(from_vectors[0][2]).normalize();
//     const b1: three.Vector3 = new three.Vector3(to_vectors[0][0]).normalize();
//     const b2: three.Vector3 = new three.Vector3(to_vectors[0][1]).normalize();
//     const b3: three.Vector3 = new three.Vector3(to_vectors[0][2]).normalize();
//     if (e1.dot(e2) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (e1.dot(e3) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (e2.dot(e3) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (b1.dot(b2) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (b1.dot(b3) === 0) { throw new Error('Orthonormal initial basis required'); }
//     if (b2.dot(b3) === 0) { throw new Error('Orthonormal initial basis required'); }
//     const matrix: three.Matrix3 = new three.Matrix3();
//     matrix.set(e1.dot(b1), e1.dot(b2), e1.dot(b3),
//     e2.dot(b1), e2.dot(b2), e2.dot(b3),
//     e3.dot(b1), e3.dot(b2), e3.dot(b3));
//     const t_x: number = to_origin[0] - from_origin[0];
//     const t_y: number = to_origin[1] - from_origin[1];
//     const t_z: number = to_origin[2] - from_origin[2];
//     return [[e1.dot(b1), e1.dot(b2), e1.dot(b3), t_x],
//     [e2.dot(b1), e2.dot(b2), e2.dot(b3), t_y],
//     [e3.dot(b1), e3.dot(b2), e3.dot(b3), t_z],
//     [0, 0, 0, 1]];
// }
// export function scaleMatrix(plane: TPlane, factor: Txyz): three.Matrix4 {
//     // scale matrix
//     const matrix_scale: three.Matrix4 = new three.Matrix4();
//     matrix_scale.makeScale(factor[0], factor[1], factor[2]);
//     // xform matrix
//     const matrix_xform1: three.Matrix4 = _xformMatrixFromXYZVectors(
//         plane[0], plane[1], plane[2], true);
//     const matrix_xform2: three.Matrix4 = _xformMatrixFromXYZVectors(
//         plane[0], plane[1], plane[2], false);
//     // final matrix
//     const xform_scale_xform: three.Matrix4 = matrix_xform2.multiply(matrix_scale.multiply(matrix_xform1));
//     // do the xform
//     return xform_scale_xform;
// }
// function _dotVectors(v1: three.Vector3, v2: three.Vector3): number {
//     return v1.dot(v2);
// }
// function _xformMatrixNeg(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
//     const m1: three.Matrix4 = new three.Matrix4();
//     const o_neg: three.Vector3 = o.clone().negate();
//     m1.setPosition(o_neg);
//     const m2: three.Matrix4 = new three.Matrix4();
//     m2.makeBasis(x.normalize(), y.normalize(), _crossVectors(x, y, true));
//     m2.invert();
//     const m3: three.Matrix4 = new three.Matrix4();
//     // first translate to (0,0,0), then xform, so m1 x m2
//     m3.multiplyMatrices(m2, m1);
//     return m3;
// }
// function xformMatrixPos(o: three.Vector3, x: three.Vector3, y: three.Vector3): three.Matrix4 {
//     const m1: three.Matrix4 = new three.Matrix4();
//     m1.setPosition(o);
//     const m2: three.Matrix4 = new three.Matrix4();
//     m2.makeBasis(x.normalize(), y.normalize(), _crossVectors(x, y, true));
//     const m3: three.Matrix4 = new three.Matrix4();
//     // first xform, then translate to origin, so m1 x m2
//     m3.multiplyMatrices(m1, m2);
//     return m3;
// }
// function _xformMatrixFromXYZVectors(o: Txyz, xaxis: Txyz, xyplane: Txyz, neg: boolean): three.Matrix4 {
//     const x_vec: three.Vector3 = new three.Vector3(...xaxis).normalize();
//     const xyplane_vec: three.Vector3 = new three.Vector3(...xyplane).normalize();
//     const z_vec: three.Vector3 = _crossVectors(x_vec, xyplane_vec);
//     const y_vec: three.Vector3 = _crossVectors(z_vec, x_vec);
//     if (neg) {
//         return _xformMatrixNeg(new three.Vector3(...o), x_vec, y_vec);
//     }
//     return xformMatrixPos(new three.Vector3(...o), x_vec, y_vec);
// }
// export function xfromSourceTargetMatrix(source_plane: TPlane, target_plane: TPlane): three.Matrix4 {
//     // matrix to xform from source to gcs, then from gcs to target
//     const matrix_source_to_gcs: three.Matrix4 = _xformMatrixFromXYZVectors(
//         source_plane[0], source_plane[1], source_plane[2], true);
//     const matrix_gcs_to_target: three.Matrix4 = _xformMatrixFromXYZVectors(
//         target_plane[0], target_plane[1], target_plane[2], false);
//     // final matrix
//     const xform: three.Matrix4 = matrix_gcs_to_target.multiply(matrix_source_to_gcs);
//     // return the matrix
//     return xform;
// }
// function _crossVectors(v1: three.Vector3, v2: three.Vector3, norm: boolean = false): three.Vector3 {
//     const v3: three.Vector3 = new three.Vector3();
//     v3.crossVectors(v1, v2);
//     if (norm) { v3.normalize(); }
//     return v3;
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYnMvZ2VvbS9tYXRyaXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUErQjtBQUMvQix1Q0FBOEM7QUFLOUMsU0FBZ0IsVUFBVSxDQUFDLEdBQVMsRUFBRSxDQUFnQjtJQUNsRCxNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBVyxDQUFDLENBQUM7SUFDNUQsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQVUsQ0FBQztBQUNoQyxDQUFDO0FBSkQsZ0NBSUM7QUFFRCxTQUFnQixZQUFZLENBQUMsS0FBYTtJQUN0QyxNQUFNLE1BQU0sR0FBUyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsTUFBTSxNQUFNLEdBQVMsSUFBQSxrQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxlQUFlO0lBQ2YsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQWEsSUFBQSxpQkFBTyxFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLGtCQUFrQjtJQUNsQixNQUFNLGFBQWEsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDekQsYUFBYSxDQUFDLEdBQUcsQ0FDYixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQzFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FB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