import * as THREE from 'three';
import { EEntType } from '../geo-info/common';
//
export function createSingleMeshBufTjs(__model__, ents_arrs) {
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
            case EEntType.PGON:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvbS9tZXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRS9CLE9BQU8sRUFBZSxRQUFRLEVBQVEsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRSxFQUFFO0FBQ0YsTUFBTSxVQUFVLHNCQUFzQixDQUM3QixTQUFrQixFQUFFLFNBQXdCO0lBRWpELHNGQUFzRjtJQUN0RixrQkFBa0I7SUFDbEIsb0ZBQW9GO0lBQ3BGLHNGQUFzRjtJQUN0RixnQ0FBZ0M7SUFDaEMsTUFBTSxPQUFPLEdBQW1CLElBQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDOUQsT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0lBQ2hDLHVCQUF1QjtJQUN2QixNQUFNLFdBQVcsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMzQyxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksU0FBUyxFQUFFO1FBQ3ZDLE1BQU0sV0FBVyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pGLFdBQVcsQ0FBQyxPQUFPLENBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLENBQUM7S0FDcEU7SUFDRCxtQ0FBbUM7SUFDbkMsTUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDO0lBQy9CLE1BQU0sa0JBQWtCLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDMUQsTUFBTSxjQUFjLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FB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