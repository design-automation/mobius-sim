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
exports.createSingleMeshBufTjs = void 0;
const THREE = __importStar(require("three"));
const common_1 = require("../geo-info/common");
//
function createSingleMeshBufTjs(__model__, ents_arrs) {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order 
    // to be detected;
    // intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side 
    // property to THREE.DoubleSide.
    const mat_tjs = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_i_set = new Set();
    for (const [ent_type, ent_i] of ents_arrs) {
        const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        ent_posis_i.forEach(ent_posi_i => posis_i_set.add(ent_posi_i));
    }
    // create a flat list of xyz coords
    const xyzs_flat = [];
    const posi_i_to_xyzs_map = new Map();
    const unique_posis_i = Array.from(posis_i_set);
    for (let i = 0; i < unique_posis_i.length; i++) {
        const posi_i = unique_posis_i[i];
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        xyzs_flat.push(...xyz);
        posi_i_to_xyzs_map.set(posi_i, i);
    }
    // get an array of all the pgons
    const pgons_i = [];
    for (const [ent_type, ent_i] of ents_arrs) {
        switch (ent_type) {
            case common_1.EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            default:
                const coll_pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                coll_pgons_i.forEach(coll_pgon_i => pgons_i.push(coll_pgon_i));
                break;
        }
    }
    // create tjs meshes
    const tris_flat = [];
    const idx_to_pgon_i = [];
    let idx_tjs = 0;
    for (const pgon_i of pgons_i) {
        // create the tjs geometry
        const tris_i = __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
        for (const tri_i of tris_i) {
            const tri_posis_i = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
            tris_flat.push(posi_i_to_xyzs_map.get(tri_posis_i[0]));
            tris_flat.push(posi_i_to_xyzs_map.get(tri_posis_i[1]));
            tris_flat.push(posi_i_to_xyzs_map.get(tri_posis_i[2]));
            // add the index to the map
            idx_to_pgon_i[idx_tjs] = pgon_i;
            idx_tjs++;
        }
    }
    // create the mesh, assigning the material
    const geom_tjs = new THREE.BufferGeometry();
    geom_tjs.setIndex(tris_flat);
    geom_tjs.setAttribute('position', new THREE.Float32BufferAttribute(xyzs_flat, 3));
    const mesh = new THREE.Mesh(geom_tjs, mat_tjs);
    // return the mesh and a map tri_idx -> pgon_i
    return [mesh, idx_to_pgon_i];
}
exports.createSingleMeshBufTjs = createSingleMeshBufTjs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWJzL2dlb20vbWVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBRS9CLCtDQUFpRTtBQUNqRSxFQUFFO0FBQ0YsU0FBZ0Isc0JBQXNCLENBQzdCLFNBQWtCLEVBQUUsU0FBd0I7SUFFakQsc0ZBQXNGO0lBQ3RGLGtCQUFrQjtJQUNsQixvRkFBb0Y7SUFDcEYsc0ZBQXNGO0lBQ3RGLGdDQUFnQztJQUNoQyxNQUFNLE9BQU8sR0FBbUIsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUM5RCxPQUFPLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDaEMsdUJBQXVCO0lBQ3ZCLE1BQU0sV0FBVyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzNDLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxTQUFTLEVBQUU7UUFDdkMsTUFBTSxXQUFXLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekYsV0FBVyxDQUFDLE9BQU8sQ0FBRSxVQUFVLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsQ0FBQztLQUNwRTtJQUNELG1DQUFtQztJQUNuQyxNQUFNLFNBQVMsR0FBYSxFQUFFLENBQUM7SUFDL0IsTUFBTSxrQkFBa0IsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMxRCxNQUFNLGNBQWMsR0FBYSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFF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