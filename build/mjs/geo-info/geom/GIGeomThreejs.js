import { EEntType } from '../common';
import * as THREE from 'three';
/**
 * Class for geometry.
 */
export class GIGeomThreejs {
    modeldata;
    _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Returns that data required for threejs triangles.
     * Arguments:
     * 1) ssid: the ssid to return data for
     * 2) vertex_map: a map that maps from gi vertex indicies to threejs vertex indicies
     * Returns:
     * 0) the vertices, as a flat array
     * 1) the select map, that maps from the threejs tri indices to the gi model tri indices
     * 2) the materials array, which is an array of objects
     * 3) the material groups array, which is an array of [ start, count, mat_index ]
     */
    get3jsTris(ssid, vertex_map) {
        // TODO this should not be parsed each time
        let settings = JSON.parse(localStorage.getItem('mpm_settings'));
        if (!settings) {
            settings = {
                'wireframe': {
                    'show': false
                }
            };
        }
        // arrays to store threejs data
        const tri_data_arrs = []; // tri_mat_indices, new_tri_verts_i, tri_i
        const vrmesh_tri_data_arrs = [];
        // materials
        const mat_front = {
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 0,
            side: THREE.FrontSide,
            wireframe: settings.wireframe.show
        };
        const mat_back = {
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 0,
            side: THREE.BackSide,
            wireframe: settings.wireframe.show
        };
        const materials = [this._getPgonMaterial(mat_front), this._getPgonMaterial(mat_back)];
        const material_names = ['default_front', 'default_back'];
        // get the material attribute from polygons
        const pgon_material_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pg.get('material');
        const pgon_vr_cam_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pg.get('vr_nav_mesh');
        const pgon_text_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pg.get('text');
        // loop through all tris
        // get ents from snapshot
        const tris_i = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.TRI);
        for (const tri_i of tris_i) {
            const tri_verts_index = this._geom_maps.dn_tris_verts.get(tri_i);
            // get the verts, face and the polygon for this tri
            const new_tri_verts_i = tri_verts_index.map(v => vertex_map.get(v));
            // get the materials for this tri from the polygon
            const tri_pgon_i = this._geom_maps.up_tris_pgons.get(tri_i);
            const tri_mat_indices = [];
            if (pgon_text_attrib !== undefined) {
                const text_attrib_val = pgon_text_attrib.getEntVal(tri_pgon_i);
                if (text_attrib_val !== undefined) {
                    continue;
                }
            }
            if (pgon_material_attrib !== undefined) {
                const mat_attrib_val = pgon_material_attrib.getEntVal(tri_pgon_i);
                if (mat_attrib_val !== undefined) {
                    const pgon_mat_names = (Array.isArray(mat_attrib_val)) ? mat_attrib_val : [mat_attrib_val];
                    for (const pgon_mat_name of pgon_mat_names) {
                        let pgon_mat_index = material_names.indexOf(pgon_mat_name);
                        if (pgon_mat_index === -1) {
                            const mat_settings_obj = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(pgon_mat_name);
                            if (mat_settings_obj !== undefined) {
                                pgon_mat_index = materials.length;
                                material_names.push(pgon_mat_name);
                                materials.push(this._getPgonMaterial(mat_settings_obj));
                            }
                            else {
                                throw new Error('Material not found: ' + pgon_mat_name);
                            }
                        }
                        if (pgon_mat_index !== -1) {
                            tri_mat_indices.push(pgon_mat_index);
                        }
                    }
                }
            }
            let vrmesh_check = false;
            let vrmesh_hidden = false;
            if (pgon_vr_cam_attrib) {
                const mat_attrib_val = pgon_vr_cam_attrib.getEntVal(tri_pgon_i);
                if (mat_attrib_val) {
                    vrmesh_check = true;
                    if (mat_attrib_val.visible === false || mat_attrib_val.visible === 'false') {
                        vrmesh_hidden = true;
                    }
                }
            }
            if (tri_mat_indices.length === 0) {
                tri_mat_indices.push(0); // default material front
                tri_mat_indices.push(1); // default material back
            }
            // add the data to the data_array
            if (vrmesh_check) {
                vrmesh_tri_data_arrs.push([tri_mat_indices, new_tri_verts_i, tri_i, vrmesh_hidden]);
            }
            else {
                tri_data_arrs.push([tri_mat_indices, new_tri_verts_i, tri_i]);
            }
        }
        // sort that data_array, so that we get triangls sorted according to their materials
        // for each entry in the data_array, the first item is the material indices, so that they are sorted correctly
        if (pgon_material_attrib !== undefined) {
            tri_data_arrs.sort();
            vrmesh_tri_data_arrs.sort();
        }
        // loop through the sorted array and create the tris and groups data for threejs
        const tri_verts_i = [];
        const tri_select_map = new Map();
        const vrmesh_tri_verts_i = [];
        const vrmesh_tri_select_map = new Map();
        const vrmesh_hidden_tri_verts_i = [];
        // const vrmesh_hidden_tri_select_map: Map<number, number> = new Map();
        const mat_groups_map = new Map(); // mat_index -> [start, end][]
        const vrmesh_mat_groups_map = new Map(); // mat_index -> [start, end][]
        for (const tri_data_arr of tri_data_arrs) {
            // save the tri data
            const tjs_i = tri_verts_i.push(tri_data_arr[1]) - 1;
            tri_select_map.set(tjs_i, tri_data_arr[2]);
            // go through all materials for this tri and add save the mat groups data
            for (const mat_index of tri_data_arr[0]) {
                let start_end_arrs = mat_groups_map.get(mat_index);
                if (start_end_arrs === undefined) {
                    start_end_arrs = [[tjs_i, tjs_i]];
                    mat_groups_map.set(mat_index, start_end_arrs);
                }
                else {
                    const start_end = start_end_arrs[start_end_arrs.length - 1];
                    if (tjs_i === start_end[1] + 1) {
                        start_end[1] = tjs_i;
                    }
                    else {
                        start_end_arrs.push([tjs_i, tjs_i]);
                    }
                }
            }
        }
        for (const tri_data_arr of vrmesh_tri_data_arrs) {
            // save the tri data
            if (tri_data_arr[3]) {
                vrmesh_hidden_tri_verts_i.push(tri_data_arr[1]);
                // vrmesh_hidden_tri_select_map.set(tjs_i, tri_data_arr[2]);
            }
            else {
                vrmesh_hidden_tri_verts_i.push(tri_data_arr[1]);
                const tjs_i = vrmesh_tri_verts_i.push(tri_data_arr[1]) - 1;
                vrmesh_tri_select_map.set(tjs_i, tri_data_arr[2]);
                for (const mat_index of tri_data_arr[0]) {
                    let start_end_arrs = vrmesh_mat_groups_map.get(mat_index);
                    if (start_end_arrs === undefined) {
                        start_end_arrs = [[tjs_i, tjs_i]];
                        vrmesh_mat_groups_map.set(mat_index, start_end_arrs);
                    }
                    else {
                        const start_end = start_end_arrs[start_end_arrs.length - 1];
                        if (tjs_i === start_end[1] + 1) {
                            start_end[1] = tjs_i;
                        }
                        else {
                            start_end_arrs.push([tjs_i, tjs_i]);
                        }
                    }
                }
            }
        }
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups = this._convertMatGroups(mat_groups_map, 3);
        const vr_mesh_material_groups = this._convertMatGroups(vrmesh_mat_groups_map, 3);
        // convert the verts list to a flat array
        // tslint:disable-next-line:no-unused-expression
        // @ts-ignore
        const tri_verts_i_flat = tri_verts_i.flat(1);
        // @ts-ignore
        const vrmesh_tri_verts_i_flat = vrmesh_tri_verts_i.flat(1);
        // @ts-ignore
        const vrmesh_hidden_tri_verts_i_flat = vrmesh_hidden_tri_verts_i.flat(1);
        // return the data
        // there are four sets of data that are returns
        return [
            tri_verts_i_flat,
            tri_select_map,
            vrmesh_tri_verts_i_flat,
            vrmesh_tri_select_map,
            vrmesh_hidden_tri_verts_i_flat,
            // vrmesh_hidden_tri_select_map,    // 3) the select map for vr nav mesh
            materials,
            material_groups,
            vr_mesh_material_groups
        ];
    }
    /**
     * Returns that data required for threejs edges.
     * 0) the vertices, as a flat array
     * 1) the select map, that maps from the threejs edge indices to the gi model edge indices
     * 2) the materials array, which is an array of objects
     * 3) the material groups array, which is an array of [ start, count, mat_index ]
     */
    get3jsEdges(ssid, vertex_map) {
        // arrays to store threejs data
        const edge_data_arrs = []; // edge_mat_indices, new_edge_verts_i, edge_i
        const vrmesh_edge_data_arrs = []; // edge_mat_indices, new_edge_verts_i, edge_i
        // materials
        const line_mat_black = {
            color: [0, 0, 0],
            linewidth: 1
        };
        const line_mat_white = {
            color: [1, 1, 1],
            linewidth: 1
        };
        const materials = [
            this._getPlineMaterial(line_mat_black),
            this._getPlineMaterial(line_mat_white)
        ];
        const material_names = ['black', 'white'];
        // check the hidden edges
        const visibility_attrib = this.modeldata.attribs.attribs_maps.get(ssid)._e.get('visibility');
        let hidden_edges_set;
        if (visibility_attrib) {
            hidden_edges_set = new Set(visibility_attrib.getEntsFromVal('hidden'));
        }
        // get the edge material attrib
        const pline_material_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pl.get('material');
        const pgon_vr_cam_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pg.get('vr_nav_mesh');
        const pgon_text_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pg.get('text');
        // loop through all edges
        // get ents from snapshot
        const edges_i = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.EDGE);
        for (const edge_i of edges_i) {
            const edge_verts_i = this._geom_maps.dn_edges_verts.get(edge_i);
            if (pgon_text_attrib) {
                const edge_pgon_i = this._geom_maps.up_wires_pgons.get(this._geom_maps.up_edges_wires.get(edge_i));
                const text_attrib_val = pgon_text_attrib.getEntVal(edge_pgon_i);
                if (text_attrib_val) {
                    continue;
                }
            }
            // check hidden
            const hidden = visibility_attrib && hidden_edges_set.has(edge_i);
            if (!hidden) {
                // get the verts, face and the polygon for this tri
                const new_edge_verts_i = edge_verts_i.map(v => vertex_map.get(v));
                // get the materials for this tri from the polygon
                const edge_wire_i = this._geom_maps.up_edges_wires.get(edge_i);
                const edge_pline_i = this._geom_maps.up_wires_plines.get(edge_wire_i);
                let pline_mat_index = 0; // default black line
                if (pline_material_attrib !== undefined) {
                    const pline_mat_name = pline_material_attrib.getEntVal(edge_pline_i);
                    // check if the polyline has a material?
                    if (pline_mat_name !== undefined) {
                        pline_mat_index = material_names.indexOf(pline_mat_name);
                        // add material
                        if (pline_mat_index === -1) {
                            const mat_settings_obj = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(pline_mat_name);
                            if (mat_settings_obj !== undefined) {
                                pline_mat_index = material_names.push(pline_mat_name) - 1;
                                materials.push(this._getPlineMaterial(mat_settings_obj));
                            }
                            else {
                                throw new Error('Material not found: ' + pline_mat_name);
                            }
                        }
                    }
                }
                let vrmesh_check = false;
                let vrmesh_hidden = false;
                if (pgon_vr_cam_attrib) {
                    const edge_pgon_i = this._geom_maps.up_wires_pgons.get(this._geom_maps.up_edges_wires.get(edge_i));
                    const mat_attrib_val = pgon_vr_cam_attrib.getEntVal(edge_pgon_i);
                    if (mat_attrib_val) {
                        vrmesh_check = true;
                        if (mat_attrib_val.visible === false || mat_attrib_val.visible === 'false') {
                            vrmesh_hidden = true;
                        }
                    }
                }
                // add the data to the data_array
                if (vrmesh_check) {
                    vrmesh_edge_data_arrs.push([pline_mat_index, new_edge_verts_i, edge_i, vrmesh_hidden]);
                }
                else {
                    edge_data_arrs.push([pline_mat_index, new_edge_verts_i, edge_i]);
                }
            }
        }
        // sort that data_array, so that we get edges sorted according to their materials
        // for each entry in the data_array, the first item is the material indices, so that they are sorted correctly
        if (pline_material_attrib !== undefined) {
            edge_data_arrs.sort();
            vrmesh_edge_data_arrs.sort();
        }
        // loop through the sorted array and create the edge and groups data for threejs
        const edges_verts_i = [];
        const edge_select_map = new Map();
        const vrmesh_edges_verts_i = [];
        const vrmesh_edge_select_map = new Map();
        const vrmesh_hidden_edges_verts_i = [];
        const mat_groups_map = new Map(); // mat_index -> [start, end][]
        const vrmesh_mat_groups_map = new Map(); // mat_index -> [start, end][]
        for (const edge_data_arr of edge_data_arrs) {
            // save the edge data
            const tjs_i = edges_verts_i.push(edge_data_arr[1]) - 1;
            edge_select_map.set(tjs_i, edge_data_arr[2]);
            // get the edge material and add save the mat groups data
            const mat_index = edge_data_arr[0];
            let start_end_arrs = mat_groups_map.get(mat_index);
            if (start_end_arrs === undefined) {
                start_end_arrs = [[tjs_i, tjs_i]];
                mat_groups_map.set(mat_index, start_end_arrs);
            }
            else {
                const start_end = start_end_arrs[start_end_arrs.length - 1];
                if (tjs_i === start_end[1] + 1) {
                    start_end[1] = tjs_i;
                }
                else {
                    start_end_arrs.push([tjs_i, tjs_i]);
                }
            }
        }
        for (const edge_data_arr of vrmesh_edge_data_arrs) {
            // save the tri data
            let tjs_i;
            if (edge_data_arr[3]) {
            }
            else {
                tjs_i = vrmesh_edges_verts_i.push(edge_data_arr[1]) - 1;
                vrmesh_edge_select_map.set(tjs_i, edge_data_arr[2]);
                const mat_index = edge_data_arr[0];
                let start_end_arrs = vrmesh_mat_groups_map.get(mat_index);
                if (start_end_arrs === undefined) {
                    start_end_arrs = [[tjs_i, tjs_i]];
                    vrmesh_mat_groups_map.set(mat_index, start_end_arrs);
                }
                else {
                    const start_end = start_end_arrs[start_end_arrs.length - 1];
                    if (tjs_i === start_end[1] + 1) {
                        start_end[1] = tjs_i;
                    }
                    else {
                        start_end_arrs.push([tjs_i, tjs_i]);
                    }
                }
            }
        }
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups = this._convertMatGroups(mat_groups_map, 2);
        const vrmesh_material_groups = this._convertMatGroups(vrmesh_mat_groups_map, 2);
        // convert the verts list to a flat array
        // tslint:disable-next-line:no-unused-expression
        // @ts-ignore
        const edges_verts_i_flat = edges_verts_i.flat(1);
        // @ts-ignore
        const vrmesh_edges_verts_i_flat = vrmesh_edges_verts_i.flat(1);
        // @ts-ignore
        const vrmesh_hidden_edges_verts_i_flat = vrmesh_hidden_edges_verts_i.flat(1);
        // return the data
        // there are four sets of data that are returns
        return [
            edges_verts_i_flat,
            edge_select_map,
            vrmesh_edges_verts_i_flat,
            vrmesh_edge_select_map,
            vrmesh_hidden_edges_verts_i_flat,
            materials,
            material_groups,
            vrmesh_material_groups
        ];
    }
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    get3jsPoints(ssid, vertex_map) {
        const points_verts_i_filt = [];
        const point_select_map = new Map();
        const pgon_vr_cam_attrib = this.modeldata.attribs.attribs_maps.get(ssid).pg.get('vr_nav_mesh');
        // get ents from snapshot0
        const points_i = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.POINT);
        for (const point_i of points_i) {
            let vrmesh_check = false;
            if (pgon_vr_cam_attrib) {
                const edge_pgon_i = this._geom_maps.up_wires_pgons.get(this._geom_maps.up_edges_wires.get(point_i));
                const mat_attrib_val = pgon_vr_cam_attrib.getEntVal(edge_pgon_i);
                if (mat_attrib_val) {
                    vrmesh_check = true;
                }
            }
            const vert_i = this._geom_maps.dn_points_verts.get(point_i);
            const new_point_verts_i = vertex_map.get(vert_i);
            const tjs_i = points_verts_i_filt.push(new_point_verts_i) - 1;
            point_select_map.set(tjs_i, point_i);
        }
        return [points_verts_i_filt, point_select_map];
    }
    /**
     * Create a threejs material
     * @param settings
     */
    _convertMatGroups(mat_groups_map, num_verts) {
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups = []; // [start, count, mat_index][]
        mat_groups_map.forEach((start_end_arrs, mat_index) => {
            for (const start_end of start_end_arrs) {
                const start = start_end[0];
                const count = start_end[1] - start_end[0] + 1;
                material_groups.push([start * num_verts, count * num_verts, mat_index]);
            }
        });
        return material_groups;
    }
    /**
     * Create a threejs material
     * @param settings
     */
    _getPgonMaterial(settings) {
        const material = {
            type: 'MeshPhongMaterial',
            side: THREE.DoubleSide,
            vertexColors: true
        };
        if (settings) {
            for (const key of Object.keys(settings)) {
                material[key] = settings[key];
            }
        }
        return material;
    }
    /**
 * Create a threejs material
 * @param settings
 */
    _getPlineMaterial(settings) {
        const material = {
            type: 'LineBasicMaterial'
        };
        if (settings) {
            for (const key of Object.keys(settings)) {
                material[key] = settings[key];
            }
        }
        return material;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tVGhyZWVqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21UaHJlZWpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBa0MsUUFBUSxFQUFlLE1BQU0sV0FBVyxDQUFDO0FBQ2xGLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBSS9COztHQUVHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFDZCxTQUFTLENBQWM7SUFDdkIsVUFBVSxDQUFZO0lBQzlCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksVUFBVSxDQUFDLElBQVksRUFBRSxVQUErQjtRQVMzRCwyQ0FBMkM7UUFDM0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLFFBQVEsR0FBRztnQkFDUCxXQUFXLEVBQUU7b0JBQ1QsTUFBTSxFQUFFLEtBQUs7aUJBQ2hCO2FBQ0osQ0FBQztTQUNMO1FBRUQsK0JBQStCO1FBQy9CLE1BQU0sYUFBYSxHQUErQixFQUFFLENBQUMsQ0FBQywwQ0FBMEM7UUFDaEcsTUFBTSxvQkFBb0IsR0FBd0MsRUFBRSxDQUFDO1FBQ3JFLFlBQVk7UUFDWixNQUFNLFNBQVMsR0FBVztZQUN0QixRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsQ0FBQztZQUNaLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUztZQUNyQixTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJ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