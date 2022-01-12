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
exports.crossVectors = exports.addVectors = exports.subVectors = exports.matrixInv = exports.xformMatrix = exports.multVectorMatrix = void 0;
const three = __importStar(require("three"));
const EPS = 1e-6;
/**
 * Utility functions for threejs.
 */
// Matrices ======================================================================================================
function multVectorMatrix(v, m) {
    const v2 = v.clone();
    v2.applyMatrix4(m);
    return v2;
}
exports.multVectorMatrix = multVectorMatrix;
function xformMatrix(o, x, y, z) {
    x.normalize();
    y.normalize();
    z.normalize();
    const m1 = new three.Matrix4();
    const o_neg = o.clone().negate();
    m1.setPosition(o_neg);
    const m2 = new three.Matrix4();
    m2.makeBasis(x, y, z);
    m2.invert();
    const m3 = new three.Matrix4();
    m3.multiplyMatrices(m2, m1);
    return m3;
}
exports.xformMatrix = xformMatrix;
function matrixInv(m) {
    return (new three.Matrix4()).copy(m).invert();
}
exports.matrixInv = matrixInv;
//  Vectors =======================================================================================================
function subVectors(v1, v2, norm = false) {
    const v3 = new three.Vector3();
    v3.subVectors(v1, v2);
    if (norm) {
        v3.normalize();
    }
    return v3;
}
exports.subVectors = subVectors;
function addVectors(v1, v2, norm = false) {
    const v3 = new three.Vector3();
    v3.addVectors(v1, v2);
    if (norm) {
        v3.normalize();
    }
    return v3;
}
exports.addVectors = addVectors;
function crossVectors(v1, v2, norm = false) {
    const v3 = new three.Vector3();
    v3.crossVectors(v1, v2);
    if (norm) {
        v3.normalize();
    }
    return v3;
}
exports.crossVectors = crossVectors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy90cmlhbmd1bGF0ZS90aHJlZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUErQjtBQUUvQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDakI7O0dBRUc7QUFFRixrSEFBa0g7QUFFbkgsU0FBZ0IsZ0JBQWdCLENBQUMsQ0FBZ0IsRUFBRSxDQUFnQjtJQUMvRCxNQUFNLEVBQUUsR0FBa0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3BDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsT0FBTyxFQUFFLENBQUM7QUFDZCxDQUFDO0FBSkQsNENBSUM7QUFFRCxTQUFnQixXQUFXLENBQUMsQ0FBZ0IsRUFBRSxDQUFnQixFQUFFLENBQWdCLEVBQUUsQ0FBZ0I7SUFDOUYsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2QsTUFBTSxFQUFFLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzlDLE1BQU0sS0FBSyxHQUFrQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNaLE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQWJELGtDQWFDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLENBQWdCO0lBQ3RDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsRCxDQUFDO0FBRkQsOEJBRUM7QUFFRCxtSEFBbUg7QUFFbkgsU0FBZ0IsVUFBVSxDQUFDLEVBQWlCLEVBQUUsRUFBaUIsRUFBRSxPQUFnQixLQUFLO0lBQ2xGLE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0QixJQUFJLElBQUksRUFBRTtRQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUFFO0lBQzVCLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUxELGdDQUtDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLEVBQWlCLEVBQUUsRUFBaUIsRUFBRSxPQUFnQixLQUFLO0lBQ2xGLE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0QixJQUFJLElBQUksRUFBRTtRQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUFFO0lBQzVCLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUxELGdDQUtDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLEVBQWlCLEVBQUUsRUFBaUIsRUFBRSxPQUFnQixLQUFLO0lBQ3BGLE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4QixJQUFJLElBQUksRUFBRTtRQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUFFO0lBQzVCLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUxELG9DQUtDIn0=