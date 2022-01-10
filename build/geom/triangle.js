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
exports.area = exports.normal = void 0;
const three = __importStar(require("three"));
const EPS = 1e-6;
function normal(v1, v2, v3, norm = false) {
    const _v1 = new three.Vector3(...v1);
    const _v2 = new three.Vector3(...v2);
    const _v3 = new three.Vector3(...v3);
    const t = new three.Triangle(_v1, _v2, _v3);
    const _normal = new three.Vector3();
    t.getNormal(_normal);
    if (norm) {
        _normal.normalize();
    }
    return _normal.toArray();
}
exports.normal = normal;
function area(v1, v2, v3) {
    const _v1 = new three.Vector3(...v1);
    const _v2 = new three.Vector3(...v2);
    const _v3 = new three.Vector3(...v3);
    const t = new three.Triangle(_v1, _v2, _v3);
    return t.getArea();
}
exports.area = area;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpYW5nbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWJzL2dlb20vdHJpYW5nbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUErQjtBQUUvQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFFakIsU0FBZ0IsTUFBTSxDQUFDLEVBQVEsRUFBRSxFQUFRLEVBQUUsRUFBUSxFQUFFLE9BQWdCLEtBQUs7SUFDdEUsTUFBTSxHQUFHLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sR0FBRyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNwRCxNQUFNLEdBQUcsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDcEQsTUFBTSxDQUFDLEdBQW1CLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVELE1BQU0sT0FBTyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuRCxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLElBQUksSUFBSSxFQUFFO1FBQ04sT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ3ZCO0lBQ0QsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFVLENBQUM7QUFDckMsQ0FBQztBQVhELHdCQVdDO0FBRUQsU0FBZ0IsSUFBSSxDQUFDLEVBQVEsRUFBRSxFQUFRLEVBQUUsRUFBUTtJQUM3QyxNQUFNLEdBQUcsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDcEQsTUFBTSxHQUFHLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sR0FBRyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNwRCxNQUFNLENBQUMsR0FBbUIsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDNUQsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkIsQ0FBQztBQU5ELG9CQU1DIn0=