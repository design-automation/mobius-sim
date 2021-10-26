import { EEntType } from '../common';
import * as THREE from 'three';
/**
 * Class for geometry.
 */
export class GIGeomThreejs {
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
            }
        }
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups = this._convertMatGroups(mat_groups_map, 3);
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
            material_groups // 5) the material groups array, which is an array of [ start, count, mat_index ]
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
            }
        }
        // convert the mat_groups_map into the format required for threejs
        // for each material group, we need an array [start, count, mat_index]
        const material_groups = this._convertMatGroups(mat_groups_map, 2);
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
            material_groups // 5) the material groups array, which is an array of [ start, count, mat_index ]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tVGhyZWVqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21UaHJlZWpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBa0MsUUFBUSxFQUFlLE1BQU0sV0FBVyxDQUFDO0FBQ2xGLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBSS9COztHQUVHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFHdEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7Ozs7Ozs7O09BVUc7SUFDSSxVQUFVLENBQUMsSUFBWSxFQUFFLFVBQStCO1FBTzNELDJDQUEyQztRQUMzQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsUUFBUSxHQUFHO2dCQUNQLFdBQVcsRUFBRTtvQkFDVCxNQUFNLEVBQUUsS0FBSztpQkFDaEI7YUFDSixDQUFDO1NBQ0w7UUFFRCwrQkFBK0I7UUFDL0IsTUFBTSxhQUFhLEdBQStCLEVBQUUsQ0FBQyxDQUFDLDBDQUEwQztRQUNoRyxNQUFNLG9CQUFvQixHQUF3QyxFQUFFLENBQUM7UUFDckUsWUFBWTtRQUNaLE1BQU0sU0FBUyxHQUFXO1lBQ3RCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFNBQVMsRUFBRSxDQUFDO1lBQ1osSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3JCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUk7U0FDckMsQ0FBQztRQUNGLE1BQU0sUUFBUSxHQUFXO1lB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