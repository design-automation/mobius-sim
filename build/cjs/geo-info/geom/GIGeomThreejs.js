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
exports.GIGeomThreejs = void 0;
const common_1 = require("../common");
const THREE = __importStar(require("three"));
/**
 * Class for geometry.
 */
class GIGeomThreejs {
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
        const tris_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.TRI);
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
        const edges_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.EDGE);
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
        const points_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.POINT);
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
exports.GIGeomThreejs = GIGeomThreejs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tVGhyZWVqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21UaHJlZWpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Y7QUFDbEYsNkNBQStCO0FBSS9COztHQUVHO0FBQ0gsTUFBYSxhQUFhO0lBR3RCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksVUFBVSxDQUFDLElBQVksRUFBRSxVQUErQjtRQVMzRCwyQ0FBMkM7UUFDM0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLFFBQVEsR0FBRztnQkFDUCxXQUFXLEVBQUU7b0JBQ1QsTUFBTSxFQUFFLEtBQUs7aUJBQ2hCO2FBQ0osQ0FBQztTQUNMO1FBRUQsK0JBQStCO1FBQy9CLE1BQU0sYUFBYSxHQUErQixFQUFFLENBQUMsQ0FBQywwQ0FBMEM7UUFDaEcsTUFBTSxvQkFBb0IsR0FBd0MsRUFBRSxDQUFDO1FBQ3JFLFlBQVk7UUFDWixNQUFNLFNBQVMsR0FBVztZQUN0QixRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsQ0FBQztZQUNaLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUztZQUNyQixTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJO1NBQ3JDLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBVztZQUNyQixRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsQ0FBQztZQUNaLElBQUksRUFBRSxLQUFLLENBQUMsUUFBUTtZQUNwQixTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJO1NBQ3JDLENBQUM7UUFDRixNQUFNLFNBQVMsR0FBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBRSxTQUFTLENBQUUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUUsUUFBUSxDQUFFLENBQUMsQ0FBQztRQUNwRyxNQUFNLGNBQWMsR0FBYyxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNwRSwyQ0FBMkM7UUFDM0MsTUFBTSxvQkFBb0IsR0FBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9HLE1BQU0sa0JBQWtCLEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoSCxNQUFNLGdCQUFnQixHQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkcsd0JBQXdCO1FBQ3hCLHlCQUF5QjtRQUN6QixNQUFNLE1BQU0sR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxpQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xGLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQ3hCLE1BQU0sZUFBZSxHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRSxtREFBbUQ7WUFDbkQsTUFBTSxlQUFlLEdBQVMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQVMsQ0FBQztZQUNsRixrREFBa0Q7WUFDbEQsTUFBTSxVQUFVLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sZUFBZSxHQUFhLEVBQUUsQ0FBQztZQUNyQyxJQUFJLGdCQUFnQixLQUFLLFNBQVMsRUFBRTtnQkFDaEMsTUFBTSxlQUFlLEdBQW9CLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQW9CLENBQUM7Z0JBQ25HLElBQUksZUFBZSxLQUFLLFNBQVMsRUFBRTtvQkFDL0IsU0FBUztpQkFDWjthQUNKO1lBQ0QsSUFBSSxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7Z0JBQ3BDLE1BQU0sY0FBYyxHQUFvQixvQkFBb0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFvQixDQUFDO2dCQUN0RyxJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUU7b0JBQzlCLE1BQU0sY0FBYyxHQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3JHLEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFO3dCQUN4QyxJQUFJLGNBQWMsR0FBVyxjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNuRSxJQUFJLGNBQWMsS0FBSyxDQUFDLENBQUMsRUFBRTs0QkFDdkIsTUFBTSxnQkFBZ0IsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7NEJBQ3JHLElBQUksZ0JBQWdCLEtBQUssU0FBUyxFQUFFO2dDQUNoQyxjQUFjLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztnQ0FDbEMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQ0FDbkMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOzZCQUMzRDtpQ0FBTTtnQ0FDSCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixHQUFHLGFBQWEsQ0FBQyxDQUFDOzZCQUMzRDt5QkFDSjt3QkFDRCxJQUFJLGNBQWMsS0FBSyxDQUFDLENBQUMsRUFBRTs0QkFDdkIsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDeEM7cUJBQ0o7aUJBQ0o7YUFDSjtZQUNELElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDMUIsSUFBSSxrQkFBa0IsRUFBRTtnQkFDcEIsTUFBTSxjQUFjLEdBQVEsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBb0IsQ0FBQztnQkFDeEYsSUFBSSxjQUFjLEVBQUU7b0JBQ2hCLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3BCLElBQUksY0FBYyxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksY0FBYyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7d0JBQ3hFLGFBQWEsR0FBRyxJQUFJLENBQUM7cUJBQ3hCO2lCQUNKO2FBQ0o7WUFDRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMseUJBQXlCO2dCQUNsRCxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQXdCO2FBQ3BEO1lBQ0QsaUNBQWlDO1lBQ2pDLElBQUksWUFBWSxFQUFFO2dCQUNkLG9CQUFvQixDQUFDLElBQUksQ0FBRSxDQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBRSxDQUFFLENBQUM7YUFDM0Y7aUJBQU07Z0JBQ0gsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFFLENBQUUsQ0FBQzthQUNyRTtTQUNKO1FBQ0Qsb0ZBQW9GO1FBQ3BGLDhHQUE4RztRQUM5RyxJQUFJLG9CQUFvQixLQUFLLFNBQVMsRUFBRTtZQUNwQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckIsb0JBQW9CLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDL0I7UUFDRCxnRkFBZ0Y7UUFDaEYsTUFBTSxXQUFXLEdBQVcsRUFBRSxDQUFDO1FBQy9CLE1BQU0sY0FBYyxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3RELE1BQU0sa0JBQWtCLEdBQVcsRUFBRSxDQUFDO1FBQ3RDLE1BQU0scUJBQXFCLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDN0QsTUFBTSx5QkFBeUIsR0FBVyxFQUFFLENBQUM7UUFDN0MsdUVBQXVFO1FBQ3ZFLE1BQU0sY0FBYyxHQUFvQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsOEJBQThCO1FBQ2pHLE1BQU0scUJBQXFCLEdBQW9DLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyw4QkFBOEI7UUFDeEcsS0FBSyxNQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7WUFDdEMsb0JBQW9CO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLHlFQUF5RTtZQUN6RSxLQUFLLE1BQU0sU0FBUyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDckMsSUFBSSxjQUFjLEdBQXVCLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZFLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBRTtvQkFDOUIsY0FBYyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7aUJBQ2pEO3FCQUFNO29CQUNILE1BQU0sU0FBUyxHQUFxQixjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDOUUsSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDNUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztxQkFDeEI7eUJBQU07d0JBQ0gsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUN2QztpQkFDSjthQUNKO1NBQ0o7UUFDRCxLQUFLLE1BQU0sWUFBWSxJQUFJLG9CQUFvQixFQUFFO1lBQzdDLG9CQUFvQjtZQUNwQixJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDakIseUJBQXlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCw0REFBNEQ7YUFDL0Q7aUJBQU07Z0JBQ0gseUJBQXlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzRCxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxLQUFLLE1BQU0sU0FBUyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDckMsSUFBSSxjQUFjLEdBQXVCLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDOUUsSUFBSSxjQUFjLEtBQUssU0FBUyxFQUFFO3dCQUM5QixjQUFjLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO3FCQUN4RDt5QkFBTTt3QkFDSCxNQUFNLFNBQVMsR0FBcUIsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzlFLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQzVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7eUJBQ3hCOzZCQUFNOzRCQUNILGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzt5QkFDdkM7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO1FBQ0Qsa0VBQWtFO1FBQ2xFLHNFQUFzRTtRQUN0RSxNQUFNLGVBQWUsR0FBK0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RixNQUFNLHVCQUF1QixHQUErQixJQUFJLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0cseUNBQXlDO1FBQ3pDLGdEQUFnRDtRQUNoRCxhQUFhO1FBQ2IsTUFBTSxnQkFBZ0IsR0FBYSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELGFBQWE7UUFDYixNQUFNLHVCQUF1QixHQUFhLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRSxhQUFhO1FBQ2IsTUFBTSw4QkFBOEIsR0FBYSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsa0JBQWtCO1FBQ2xCLCtDQUErQztRQUMvQyxPQUFPO1lBQ0gsZ0JBQWdCO1lBQ2hCLGNBQWM7WUFDZCx1QkFBdUI7WUFDdkIscUJBQXFCO1lBQ3JCLDhCQUE4QjtZQUM5Qix3RUFBd0U7WUFDeEUsU0FBUztZQUNULGVBQWU7WUFDZix1QkFBdUI7U0FDMUIsQ0FBQztJQUNOLENBQUM7SUFDRDs7Ozs7O09BTUc7SUFDSSxXQUFXLENBQUMsSUFBWSxFQUFFLFVBQStCO1FBTTVELCtCQUErQjtRQUMvQixNQUFNLGNBQWMsR0FBOEIsRUFBRSxDQUFDLENBQUMsNkNBQTZDO1FBQ25HLE1BQU0scUJBQXFCLEdBQXVDLEVBQUUsQ0FBQyxDQUFDLDZDQUE2QztRQUNuSCxZQUFZO1FBQ1osTUFBTSxjQUFjLEdBQVc7WUFDM0IsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsU0FBUyxFQUFFLENBQUM7U0FDZixDQUFDO1FBQ0YsTUFBTSxjQUFjLEdBQVc7WUFDM0IsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsU0FBUyxFQUFFLENBQUM7U0FDZixDQUFDO1FBQ0YsTUFBTSxTQUFTLEdBQWE7WUFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFFLGNBQWMsQ0FBRTtZQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUUsY0FBYyxDQUFFO1NBQzNDLENBQUM7UUFDRixNQUFNLGNBQWMsR0FBYyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNyRCx5QkFBeUI7UUFDekIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0YsSUFBSSxnQkFBNkIsQ0FBQztRQUNsQyxJQUFJLGlCQUFpQixFQUFFO1lBQ25CLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzFFO1FBQ0QsK0JBQStCO1FBQy9CLE1BQU0scUJBQXFCLEdBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRSxNQUFNLGtCQUFrQixHQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDeEUsTUFBTSxnQkFBZ0IsR0FDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpFLHlCQUF5QjtRQUN6Qix5QkFBeUI7UUFDekIsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUMxQixNQUFNLFlBQVksR0FBVSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkUsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDbEIsTUFBTSxXQUFXLEdBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNwRyxNQUFNLGVBQWUsR0FBUSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFvQixDQUFDO2dCQUN4RixJQUFJLGVBQWUsRUFBRTtvQkFDakIsU0FBUztpQkFDWjthQUNKO1lBQ0QsZUFBZTtZQUNmLE1BQU0sTUFBTSxHQUFZLGlCQUFpQixJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNULG1EQUFtRDtnQkFDbkQsTUFBTSxnQkFBZ0IsR0FBVSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBVSxDQUFDO2dCQUNsRixrREFBa0Q7Z0JBQ2xELE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdkUsTUFBTSxZQUFZLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7Z0JBQzlDLElBQUkscUJBQXFCLEtBQUssU0FBUyxFQUFFO29CQUNyQyxNQUFNLGNBQWMsR0FDaEIscUJBQXFCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBVyxDQUFDO29CQUM1RCx3Q0FBd0M7b0JBQ3hDLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBRTt3QkFDOUIsZUFBZSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBQ3pELGVBQWU7d0JBQ2YsSUFBSSxlQUFlLEtBQUssQ0FBQyxDQUFDLEVBQUU7NEJBQ3hCLE1BQU0sZ0JBQWdCLEdBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs0QkFDekUsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7Z0NBQ2hDLGVBQWUsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDMUQsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOzZCQUM1RDtpQ0FBTTtnQ0FDSCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixHQUFHLGNBQWMsQ0FBQyxDQUFDOzZCQUM1RDt5QkFDSjtxQkFDSjtpQkFDSjtnQkFDRCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztnQkFDMUIsSUFBSSxrQkFBa0IsRUFBRTtvQkFDcEIsTUFBTSxXQUFXLEdBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNuRixNQUFNLGNBQWMsR0FBUSxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFvQixDQUFDO29CQUN6RixJQUFJLGNBQWMsRUFBRTt3QkFDaEIsWUFBWSxHQUFHLElBQUksQ0FBQzt3QkFDcEIsSUFBSSxjQUFjLENBQUMsT0FBTyxLQUFLLEtBQUssSUFBSSxjQUFjLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBRTs0QkFDeEUsYUFBYSxHQUFHLElBQUksQ0FBQzt5QkFDeEI7cUJBQ0o7aUJBQ0o7Z0JBQ0QsaUNBQWlDO2dCQUNqQyxJQUFJLFlBQVksRUFBRTtvQkFDZCxxQkFBcUIsQ0FBQyxJQUFJLENBQUUsQ0FBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFFLENBQUM7aUJBQzdGO3FCQUFNO29CQUNILGNBQWMsQ0FBQyxJQUFJLENBQUUsQ0FBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFFLENBQUUsQ0FBQztpQkFDeEU7YUFDSjtTQUNKO1FBQ0QsaUZBQWlGO1FBQ2pGLDhHQUE4RztRQUM5RyxJQUFJLHFCQUFxQixLQUFLLFNBQVMsRUFBRTtZQUNyQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIscUJBQXFCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDaEM7UUFDRCxnRkFBZ0Y7UUFDaEYsTUFBTSxhQUFhLEdBQVksRUFBRSxDQUFDO1FBQ2xDLE1BQU0sZUFBZSxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELE1BQU0sb0JBQW9CLEdBQVksRUFBRSxDQUFDO1FBQ3pDLE1BQU0sc0JBQXNCLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDOUQsTUFBTSwyQkFBMkIsR0FBWSxFQUFFLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQW9DLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyw4QkFBOEI7UUFDakcsTUFBTSxxQkFBcUIsR0FBb0MsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLDhCQUE4QjtRQUN4RyxLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRTtZQUN4QyxxQkFBcUI7WUFDckIsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkQsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MseURBQXlEO1lBQ3pELE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLGNBQWMsR0FBdUIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RSxJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUU7Z0JBQzlCLGNBQWMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ2pEO2lCQUFNO2dCQUNILE1BQU0sU0FBUyxHQUFxQixjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUUsSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDNUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDeEI7cUJBQU07b0JBQ0gsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUN2QzthQUNKO1NBQ0o7UUFDRCxLQUFLLE1BQU0sYUFBYSxJQUFJLHFCQUFxQixFQUFFO1lBQy9DLG9CQUFvQjtZQUNwQixJQUFJLEtBQUssQ0FBQztZQUNWLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQ3JCO2lCQUFNO2dCQUNILEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4RCxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksY0FBYyxHQUF1QixxQkFBcUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlFLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBRTtvQkFDOUIsY0FBYyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbEMscUJBQXFCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDeEQ7cUJBQU07b0JBQ0gsTUFBTSxTQUFTLEdBQXFCLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM5RSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUM1QixTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO3FCQUN4Qjt5QkFBTTt3QkFDSCxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO2lCQUNKO2FBQ0o7U0FDSjtRQUNELGtFQUFrRTtRQUNsRSxzRUFBc0U7UUFDdEUsTUFBTSxlQUFlLEdBQStCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUYsTUFBTSxzQkFBc0IsR0FBK0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVHLHlDQUF5QztRQUN6QyxnREFBZ0Q7UUFDaEQsYUFBYTtRQUNiLE1BQU0sa0JBQWtCLEdBQWEsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxhQUFhO1FBQ2IsTUFBTSx5QkFBeUIsR0FBYSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsYUFBYTtRQUNiLE1BQU0sZ0NBQWdDLEdBQWEsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLGtCQUFrQjtRQUNsQiwrQ0FBK0M7UUFDL0MsT0FBTztZQUNILGtCQUFrQjtZQUNsQixlQUFlO1lBQ2YseUJBQXlCO1lBQ3pCLHNCQUFzQjtZQUN0QixnQ0FBZ0M7WUFDaEMsU0FBUztZQUNULGVBQWU7WUFDZixzQkFBc0I7U0FDekIsQ0FBQztJQUNOLENBQUM7SUFDRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsSUFBWSxFQUFFLFVBQStCO1FBQzdELE1BQU0sbUJBQW1CLEdBQWEsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sZ0JBQWdCLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFFeEQsTUFBTSxrQkFBa0IsR0FBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hILDBCQUEwQjtRQUMxQixNQUFNLFFBQVEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxpQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RGLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO1lBQzVCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLGtCQUFrQixFQUFFO2dCQUNwQixNQUFNLFdBQVcsR0FBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3JHLE1BQU0sY0FBYyxHQUFvQixrQkFBa0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFvQixDQUFDO2dCQUNyRyxJQUFJLGNBQWMsRUFBRTtvQkFDaEIsWUFBWSxHQUFHLElBQUksQ0FBQztpQkFDdkI7YUFDSjtZQUVELE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLGlCQUFpQixHQUFXLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFXLENBQUM7WUFDbkUsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlELGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDeEM7UUFDRCxPQUFPLENBQUMsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ssaUJBQWlCLENBQUMsY0FBK0MsRUFBRSxTQUFpQjtRQUN4RixrRUFBa0U7UUFDbEUsc0VBQXNFO1FBQ3RFLE1BQU0sZUFBZSxHQUErQixFQUFFLENBQUMsQ0FBQyw4QkFBOEI7UUFDdEYsY0FBYyxDQUFDLE9BQU8sQ0FBRSxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUNsRCxLQUFLLE1BQU0sU0FBUyxJQUFJLGNBQWMsRUFBRTtnQkFDcEMsTUFBTSxLQUFLLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLEtBQUssR0FBVyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEQsZUFBZSxDQUFDLElBQUksQ0FBRSxDQUFFLEtBQUssR0FBRyxTQUFTLEVBQUUsS0FBSyxHQUFHLFNBQVMsRUFBRSxTQUFTLENBQUUsQ0FBRSxDQUFDO2FBQy9FO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLGVBQWUsQ0FBQztJQUMzQixDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ssZ0JBQWdCLENBQUMsUUFBaUI7UUFDdEMsTUFBTSxRQUFRLEdBQUk7WUFDZCxJQUFJLEVBQUUsbUJBQW1CO1lBQ3pCLElBQUksRUFBRSxLQUFLLENBQUMsVUFBVTtZQUN0QixZQUFZLEVBQUUsSUFBSTtTQUNyQixDQUFDO1FBQ0YsSUFBSSxRQUFRLEVBQUU7WUFDVixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3JDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakM7U0FDSjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFDRzs7O0dBR0Q7SUFDSyxpQkFBaUIsQ0FBQyxRQUFpQjtRQUN2QyxNQUFNLFFBQVEsR0FBSTtZQUNkLElBQUksRUFBRSxtQkFBbUI7U0FDNUIsQ0FBQztRQUNGLElBQUksUUFBUSxFQUFFO1lBQ1YsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNyQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0o7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0NBQ0o7QUF4ZEQsc0NBd2RDIn0=