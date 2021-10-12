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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tVGhyZWVqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tVGhyZWVqcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtGO0FBQ2xGLDZDQUErQjtBQUkvQjs7R0FFRztBQUNILE1BQWEsYUFBYTtJQUd0Qjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0Q7Ozs7Ozs7Ozs7T0FVRztJQUNJLFVBQVUsQ0FBQyxJQUFZLEVBQUUsVUFBK0I7UUFPM0QsMkNBQTJDO1FBQzNDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxRQUFRLEdBQUc7Z0JBQ1AsV0FBVyxFQUFFO29CQUNULE1BQU0sRUFBRSxLQUFLO2lCQUNoQjthQUNKLENBQUM7U0FDTDtRQUVELCtCQUErQjtRQUMvQixNQUFNLGFBQWEsR0FBK0IsRUFBRSxDQUFDLENBQUMsMENBQTBDO1FBQ2hHLE1BQU0sb0JBQW9CLEdBQXdDLEVBQUUsQ0FBQztRQUNyRSxZQUFZO1FBQ1osTUFBTSxTQUFTLEdBQVc7WUFDdEIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsU0FBUyxFQUFFLENBQUM7WUFDWixJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDckIsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSTtTQUNyQyxDQUFDO1FBQ0YsTUFBTSxRQUFRLEdBQVc7WUFDckIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFB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