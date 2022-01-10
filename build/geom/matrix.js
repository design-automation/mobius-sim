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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGlicy9nZW9tL21hdHJpeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLHVDQUE4QztBQUs5QyxTQUFnQixVQUFVLENBQUMsR0FBUyxFQUFFLENBQWdCO0lBQ2xELE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFXLENBQUMsQ0FBQztJQUM1RCxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBVSxDQUFDO0FBQ2hDLENBQUM7QUFKRCxnQ0FJQztBQUVELFNBQWdCLFlBQVksQ0FBQyxLQUFhO0lBQ3RDLE1BQU0sTUFBTSxHQUFTLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixNQUFNLE1BQU0sR0FBUyxJQUFBLGtCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELGVBQWU7SUFDZixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBYSxJQUFBLGlCQUFPLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsa0JBQWtCO0lBQ2xCLE1BQU0sYUFBYSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN6RCxhQUFhLENBQUMsR0FBRyxDQUNiLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFDMUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUMxQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FDYixDQUFDO0lBQ0YscUJBQXFCO0lBQ3JCLE1BQU0sV0FBVyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN2RCxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEUsTUFBTSxXQUFXLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZELFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxlQUFlO0lBQ2YsTUFBTSxnQkFBZ0IsR0FBa0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbEcsZUFBZTtJQUNmLE9BQU8sZ0JBQWdCLENBQUM7QUFDNUIsQ0FBQztBQXRCRCxvQ0FzQkM7QUFFRCxTQUFnQixZQUFZLENBQUMsR0FBUyxFQUFFLEtBQWE7SUFDakQsTUFBTSxNQUFNLEdBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLE1BQU0sSUFBSSxHQUFTLElBQUEsaUJBQU8sRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxrQkFBa0I7SUFDbEIsTUFBTSxVQUFVLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RELFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvRCxxQkFBcUI7SUFDckIsTUFBTSxXQUFXLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZELFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRSxNQUFNLFdBQVcsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkQsV0FBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELGVBQWU7SUFDZixNQUFNLGFBQWEsR0FBa0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDNUYsZUFBZTtJQUNmLE9BQU8sYUFBYSxDQUFDO0FBQ3pCLENBQUM7QUFmRCxvQ0FlQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBWTtJQUNuRCxlQUFlO0lBQ2YsTUFBTSxZQUFZLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3hELFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxlQUFlO0lBQ2YsTUFBTSxhQUFhLEdBQWtCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUQsTUFBTSxhQUFhLEdBQWtCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0QsZUFBZTtJQUNmLE1BQU0saUJBQWlCLEdBQWtCLGFBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLGVBQWU7SUFDZixPQUFPLGlCQUFpQixDQUFDO0FBQzdCLENBQUM7QUFYRCxrQ0FXQztBQUVELFNBQWdCLHVCQUF1QixDQUFDLFlBQW9CLEVBQUUsWUFBb0I7SUFDOUUsOERBQThEO0lBQzlELE1BQU0sb0JBQW9CLEdBQWtCLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUUsTUFBTSxvQkFBb0IsR0FBa0IsV0FBVyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3RSxlQUFlO0lBQ2YsTUFBTSxLQUFLLEdBQWtCLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2pGLG9CQUFvQjtJQUNwQixPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBUkQsMERBUUM7QUFFRCxtR0FBbUc7QUFDbkcsbUJBQW1CO0FBQ25CLG1HQUFtRztBQUNuRyxTQUFnQixXQUFXLENBQUMsS0FBYSxFQUFFLEdBQVk7SUFDbkQsTUFBTSxDQUFDLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sQ0FBQyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxNQUFNLENBQUMsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsTUFBTSxDQUFDLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUEsa0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxJQUFJLEdBQUcsRUFBRTtRQUNMLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNkO0lBQ0QsMEJBQTBCO0lBQzFCLE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLGVBQWU7SUFDZixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLHVCQUF1QjtJQUN2QixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsSUFBSSxHQUFHLEVBQUU7UUFDTCxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RELG9EQUFvRDtRQUNwRCxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2hDO1NBQU07UUFDSCxvREFBb0Q7UUFDcEQsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUMvQjtJQUNELDZCQUE2QjtJQUM3QixPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUExQkQsa0NBMEJDO0FBRUQsb0ZBQW9GO0FBRXBGLHVDQUF1QztBQUN2QywrQ0FBK0M7QUFDL0MseURBQXlEO0FBRXpELG1GQUFtRjtBQUNuRixtRkFBbUY7QUFDbkYsbUZBQW1GO0FBRW5GLGlGQUFpRjtBQUNqRixpRkFBaUY7QUFDakYsaUZBQWlGO0FBRWpGLHVGQUF1RjtBQUN2Rix1RkFBdUY7QUFDdkYsdUZBQXVGO0FBQ3ZGLHVGQUF1RjtBQUN2Rix1RkFBdUY7QUFDdkYsdUZBQXVGO0FBRXZGLHlEQUF5RDtBQUN6RCxxREFBcUQ7QUFDckQsMENBQTBDO0FBQzFDLDJDQUEyQztBQUUzQyx5REFBeUQ7QUFDekQseURBQXlEO0FBQ3pELHlEQUF5RDtBQUV6RCx5REFBeUQ7QUFDekQsaURBQWlEO0FBQ2pELGlEQUFpRDtBQUNqRCxxQkFBcUI7QUFDckIsSUFBSTtBQUVKLDRFQUE0RTtBQUM1RSxzQkFBc0I7QUFDdEIsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCxzQkFBc0I7QUFDdEIsdUVBQXVFO0FBQ3ZFLCtDQUErQztBQUMvQyx1RUFBdUU7QUFDdkUsZ0RBQWdEO0FBQ2hELHNCQUFzQjtBQUN0Qiw2R0FBNkc7QUFDN0csc0JBQXNCO0FBQ3RCLGdDQUFnQztBQUNoQyxJQUFJO0FBR0osdUVBQXVFO0FBQ3ZFLHlCQUF5QjtBQUN6QixJQUFJO0FBRUosa0dBQWtHO0FBQ2xHLHFEQUFxRDtBQUNyRCx1REFBdUQ7QUFDdkQsNkJBQTZCO0FBQzdCLHFEQUFxRDtBQUNyRCw2RUFBNkU7QUFDN0UsbUJBQW1CO0FBQ25CLHFEQUFxRDtBQUNyRCw0REFBNEQ7QUFDNUQsbUNBQW1DO0FBQ25DLGlCQUFpQjtBQUNqQixJQUFJO0FBRUosaUdBQWlHO0FBQ2pHLHFEQUFxRDtBQUNyRCx5QkFBeUI7QUFDekIscURBQXFEO0FBQ3JELDZFQUE2RTtBQUM3RSxxREFBcUQ7QUFDckQsMkRBQTJEO0FBQzNELG1DQUFtQztBQUNuQyxpQkFBaUI7QUFDakIsSUFBSTtBQUlKLDBHQUEwRztBQUMxRyw0RUFBNEU7QUFDNUUsb0ZBQW9GO0FBQ3BGLHNFQUFzRTtBQUN0RSxnRUFBZ0U7QUFDaEUsaUJBQWlCO0FBQ2pCLHlFQUF5RTtBQUN6RSxRQUFRO0FBQ1Isb0VBQW9FO0FBQ3BFLElBQUk7QUFFSix1R0FBdUc7QUFDdkcscUVBQXFFO0FBQ3JFLDhFQUE4RTtBQUM5RSxvRUFBb0U7QUFDcEUsOEVBQThFO0FBQzlFLHFFQUFxRTtBQUNyRSxzQkFBc0I7QUFDdEIsd0ZBQXdGO0FBQ3hGLDJCQUEyQjtBQUMzQixvQkFBb0I7QUFDcEIsSUFBSTtBQUVKLHVHQUF1RztBQUN2RyxxREFBcUQ7QUFDckQsK0JBQStCO0FBQy9CLG9DQUFvQztBQUNwQyxpQkFBaUI7QUFDakIsSUFBSSJ9