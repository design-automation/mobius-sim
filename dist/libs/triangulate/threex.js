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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYnMvdHJpYW5ndWxhdGUvdGhyZWV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFFL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2pCOztHQUVHO0FBRUYsa0hBQWtIO0FBRW5ILFNBQWdCLGdCQUFnQixDQUFDLENBQWdCLEVBQUUsQ0FBZ0I7SUFDL0QsTUFBTSxFQUFFLEdBQWtCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUpELDRDQUlDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxDQUFnQixFQUFFLENBQWdCO0lBQzlGLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNkLE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxNQUFNLEtBQUssR0FBa0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hELEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEIsTUFBTSxFQUFFLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzlDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0QixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDWixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1QixPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFiRCxrQ0FhQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxDQUFnQjtJQUN0QyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEQsQ0FBQztBQUZELDhCQUVDO0FBRUQsbUhBQW1IO0FBRW5ILFNBQWdCLFVBQVUsQ0FBQyxFQUFpQixFQUFFLEVBQWlCLEVBQUUsT0FBZ0IsS0FBSztJQUNsRixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEIsSUFBSSxJQUFJLEVBQUU7UUFBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7S0FBRTtJQUM1QixPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFMRCxnQ0FLQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxFQUFpQixFQUFFLEVBQWlCLEVBQUUsT0FBZ0IsS0FBSztJQUNsRixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEIsSUFBSSxJQUFJLEVBQUU7UUFBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7S0FBRTtJQUM1QixPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFMRCxnQ0FLQztBQUVELFNBQWdCLFlBQVksQ0FBQyxFQUFpQixFQUFFLEVBQWlCLEVBQUUsT0FBZ0IsS0FBSztJQUNwRixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEIsSUFBSSxJQUFJLEVBQUU7UUFBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7S0FBRTtJQUM1QixPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFMRCxvQ0FLQyJ9