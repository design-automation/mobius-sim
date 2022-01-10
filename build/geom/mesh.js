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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYnMvZ2VvbS9tZXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFFL0IsK0NBQWlFO0FBQ2pFLEVBQUU7QUFDRixTQUFnQixzQkFBc0IsQ0FDN0IsU0FBa0IsRUFBRSxTQUF3QjtJQUVqRCxzRkFBc0Y7SUFDdEYsa0JBQWtCO0lBQ2xCLG9GQUFvRjtJQUNwRixzRkFBc0Y7SUFDdEYsZ0NBQWdDO0lBQ2hDLE1BQU0sT0FBTyxHQUFtQixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzlELE9BQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUNoQyx1QkFBdUI7SUFDdkIsTUFBTSxXQUFXLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDM0MsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLFNBQVMsRUFBRTtRQUN2QyxNQUFNLFdBQVcsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RixXQUFXLENBQUMsT0FBTyxDQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxDQUFDO0tBQ3BFO0lBQ0QsbUNBQW1DO0lBQ25DLE1BQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztJQUMvQixNQUFNLGtCQUFrQixHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzFELE1BQU0sY0FBYyxHQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUMsTUFBTSxNQUFNLEdBQVcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sR0FBRyxHQUFTLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUUsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFDRCxnQ0FBZ0M7SUFDaEMsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxTQUFTLEVBQUU7UUFDdkMsUUFBUSxRQUFRLEVBQUU7WUFDZCxLQUFLLGlCQUFRLENBQUMsSUFBSTtnQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixNQUFNO1lBQ1Y7Z0JBQ0ksTUFBTSxZQUFZLEdBQ2QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQy9ELFlBQVksQ0FBQyxPQUFPLENBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFFLENBQUM7Z0JBQ2pFLE1BQU07U0FDYjtLQUNKO0lBQ0Qsb0JBQW9CO0lBQ3BCLE1BQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztJQUMvQixNQUFNLGFBQWEsR0FBYSxFQUFFLENBQUM7SUFDbkMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1FBQzFCLDBCQUEwQjtRQUMxQixNQUFNLE1BQU0sR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9FLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQ3hCLE1BQU0sV0FBVyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkYsU0FBUyxDQUFDLElBQUksQ0FBRSxrQkFBa0IsQ0FBQyxHQUFHLENBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztZQUMxRCxTQUFTLENBQUMsSUFBSSxDQUFFLGtCQUFrQixDQUFDLEdBQUcsQ0FBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQzFELFNBQVMsQ0FBQyxJQUFJLENBQUUsa0JBQWtCLENBQUMsR0FBRyxDQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFDMUQsMkJBQTJCO1lBQzNCLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDaEMsT0FBTyxFQUFFLENBQUM7U0FDYjtLQUNKO0lBQ0QsMENBQTBDO0lBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzVDLFFBQVEsQ0FBQyxRQUFRLENBQUUsU0FBUyxDQUFFLENBQUM7SUFDL0IsUUFBUSxDQUFDLFlBQVksQ0FBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUUsU0FBUyxFQUFFLENBQUMsQ0FBRSxDQUFFLENBQUM7SUFDdEYsTUFBTSxJQUFJLEdBQWUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCw4Q0FBOEM7SUFDOUMsT0FBTyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBaEVELHdEQWdFQyJ9