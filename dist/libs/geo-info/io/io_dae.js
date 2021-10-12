"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDae = exports.importDae = void 0;
const GIModel_1 = require("../GIModel");
const common_1 = require("../common");
const triangle_1 = require("../../geom/triangle");
const distance_1 = require("../../geom/distance");
/**
 * Import obj
 */
function importDae(obj_str) {
    const model = new GIModel_1.GIModel();
    throw new Error('Not implemented');
    return model;
}
exports.importDae = importDae;
function getInstGeom(id, material_id) {
    return `
                <instance_geometry url="#${id}">
                    <bind_material>
                        <technique_common>
                            <instance_material symbol="instance_material_${material_id}" target="#${material_id}">
                                <bind_vertex_input semantic="UVSET0" input_semantic="TEXCOORD" input_set="0" />
                            </instance_material>
                        </technique_common>
                    </bind_material>
                </instance_geometry>
                `;
}
function getGeomMeshPgon(id, num_posis, xyz_str, num_tri, indices_str, material_id) {
    return `
        <geometry id="${id}">
            <mesh>
                <source id="${id}_positions">
                    <float_array id="${id}_positions_array" count="${num_posis}">${xyz_str}</float_array>
                    <technique_common>
                        <accessor count="${num_posis / 3}" source="#${id}_positions_array" stride="3">
                            <param name="X" type="float" />
                            <param name="Y" type="float" />
                            <param name="Z" type="float" />
                        </accessor>
                    </technique_common>
                </source>
                <vertices id="${id}_vertices">
                    <input semantic="POSITION" source="#${id}_positions" />
                </vertices>
                <triangles count="${num_tri}" material="instance_material_${material_id}">
                    <input offset="0" semantic="VERTEX" source="#${id}_vertices" />
                    <p>${indices_str}</p>
                </triangles>
            </mesh>
        </geometry>
        `;
}
function getGeomMeshPline(id, num_posis, xyz_str, num_lines, indices_str, material_id) {
    return `
        <geometry id="${id}">
            <mesh>
                <source id="${id}_positions">
                    <float_array id="${id}_positions_array" count="${num_posis}">${xyz_str}</float_array>
                    <technique_common>
                        <accessor count="${num_posis / 3}" source="#${id}_positions_array" stride="3">
                            <param name="X" type="float" />
                            <param name="Y" type="float" />
                            <param name="Z" type="float" />
                        </accessor>
                    </technique_common>
                </source>
                <vertices id="${id}_vertices">
                    <input semantic="POSITION" source="#${id}_positions" />
                </vertices>
                <lines count="${num_lines}" material="instance_material_${material_id}">
                    <input offset="0" semantic="VERTEX" source="#${id}_vertices" />
                    <p>${indices_str}</p>
                </lines>
            </mesh>
        </geometry>
        `;
}
function getMaterial(id, effect_id) {
    return `
            <material id="${id}" name="material_${id}">
                <instance_effect url="#${effect_id}" />
            </material>
        `;
}
function getPgonEffect(id, color) {
    return `
            <effect id="${id}">
                <profile_COMMON>
                    <technique sid="COMMON">
                        <lambert>
                            <diffuse>
                                <color>${color} 1</color>
                            </diffuse>
                        </lambert>
                    </technique>
                </profile_COMMON>
            </effect>
            `;
}
function getPlineEffect(id, color) {
    return `
            <effect id="${id}">
                <profile_COMMON>
                    <technique sid="COMMON">
                        <constant>
                            <transparent opaque="A_ONE">
                                <color>${color} 1</color>
                            </transparent>
                            <transparency>
                                <float>1</float>
                            </transparency>
                        </constant>
                    </technique>
                </profile_COMMON>
            </effect>
            `;
}
function getVisualSceneNode(id) {
    return `
                <node id="${id}" name="vs_node_${id}">
                    <matrix>1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1</matrix>
                    <instance_node url="#node_${id}" />
                </node>
                `;
}
function getNodesWithInstGeoms(id, inst_geoms) {
    return `
        <node id="node_${id}" name="lib_node_${id}">
            ${inst_geoms}
        </node>
        `;
}
/**
 * Process polygons
 */
function processColls(model) {
    const ssid = this.modeldata.active_ssid;
    const colls_map = new Map();
    // go through the collections
    const colls_i = model.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.COLL);
    for (const coll_i of colls_i) {
        const parent = model.modeldata.geom.snapshot.getCollParent(ssid, coll_i);
        // const pgons_i: number[] = model.modeldata.geom.nav.navCollToPgon(coll_i);
        // const plines_i: number[] = model.modeldata.geom.nav.navCollToPline(coll_i);
        if (!colls_map.has(parent)) {
            colls_map.set(parent, []);
        }
        colls_map.get(parent).push(coll_i);
    }
    for (const coll_i of colls_map.get(null)) {
        // TODO
    }
}
function processPgonInColl(model, pgon_i) {
    // TODO
}
/**
 * Process polygons
 */
function processMaterialPgon(model, pgon_i, has_color_attrib, materials_map, material_effects_map, materials_rev_map) {
    const pgon_verts_i = model.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PGON, pgon_i);
    let material_id = 'default_pgon_material';
    if (has_color_attrib) {
        let color = [0, 0, 0];
        for (const pgon_vert_i of pgon_verts_i) {
            let vert_color = model.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.VERT, pgon_vert_i, common_1.EAttribNames.COLOR);
            if (vert_color === null || vert_color === undefined) {
                vert_color = [1, 1, 1];
            }
            color = [color[0] + vert_color[0], color[1] + vert_color[1], color[2] + vert_color[2]];
        }
        const num_verts = pgon_verts_i.length;
        color = [color[0] / num_verts, color[1] / num_verts, color[2] / num_verts];
        const color_str = color.join(' ');
        if (materials_rev_map.has(color_str)) {
            material_id = materials_rev_map.get(color_str);
        }
        else {
            material_id = 'mat_' + materials_rev_map.size;
            const effect_id = material_id + '_eff';
            materials_map.set(material_id, getMaterial(material_id, effect_id));
            material_effects_map.set(effect_id, getPgonEffect(effect_id, color_str));
            materials_rev_map.set(color_str, material_id);
        }
    }
    return material_id;
}
function processGeomMeshPgon(model, pgon_i, material_id, geom_meshes_map) {
    const id = 'pg' + pgon_i;
    let xyz_str = '';
    const pgon_verts_i = model.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PGON, pgon_i);
    const vert_map = new Map();
    for (let i = 0; i < pgon_verts_i.length; i++) {
        const vert_i = pgon_verts_i[i];
        const posi_i = model.modeldata.geom.nav.navVertToPosi(vert_i);
        const xyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
        xyz_str += ' ' + xyz.join(' ');
        vert_map.set(posi_i, i);
    }
    let indices = '';
    const pgon_tris_i = model.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
    let num_tris = 0;
    for (const tri_i of pgon_tris_i) {
        const tri_posis_i = model.modeldata.geom.nav_tri.navTriToPosi(tri_i);
        const corners_xyzs = tri_posis_i.map(tri_posi_i => model.modeldata.attribs.posis.getPosiCoords(tri_posi_i));
        const tri_area = (0, triangle_1.area)(corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
        if (tri_area > 0) {
            for (const tri_posi_i of tri_posis_i) {
                indices += ' ' + vert_map.get(tri_posi_i);
            }
            num_tris++;
        }
    }
    geom_meshes_map.set(id, getGeomMeshPgon(id, pgon_verts_i.length * 3, xyz_str, num_tris, indices, material_id));
}
/**
 * Process polylines
 */
function processMaterialPline(model, pline_i, has_color_attrib, materials_map, material_effects_map, materials_rev_map) {
    const pline_verts_i = model.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PLINE, pline_i);
    let material_id = 'default_pline_material';
    if (has_color_attrib) {
        let color = [0, 0, 0];
        for (const pline_vert_i of pline_verts_i) {
            let vert_color = model.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.VERT, pline_vert_i, common_1.EAttribNames.COLOR);
            if (vert_color === null || vert_color === undefined) {
                vert_color = [1, 1, 1];
            }
            color = [color[0] + vert_color[0], color[1] + vert_color[1], color[2] + vert_color[2]];
        }
        const num_verts = pline_verts_i.length;
        color = [color[0] / num_verts, color[1] / num_verts, color[2] / num_verts];
        const color_str = color.join(' ');
        if (materials_map.has(color_str)) {
            material_id = materials_map.get(color_str);
        }
        else {
            material_id = 'mat_' + materials_map.size;
            const effect_id = material_id + '_eff';
            materials_map.set(material_id, getMaterial(material_id, effect_id));
            material_effects_map.set(effect_id, getPlineEffect(effect_id, color_str));
            materials_rev_map.set(color_str, material_id);
        }
    }
    return material_id;
}
function processGeomMeshPline(model, pline_i, material_id, geom_meshes_map) {
    const id = 'pl' + pline_i;
    let xyz_str = '';
    const pline_verts_i = model.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PLINE, pline_i);
    const vert_map = new Map();
    for (let i = 0; i < pline_verts_i.length; i++) {
        const vert_i = pline_verts_i[i];
        const posi_i = model.modeldata.geom.nav.navVertToPosi(vert_i);
        const xyz = model.modeldata.attribs.posis.getPosiCoords(posi_i);
        xyz_str += ' ' + xyz.join(' ');
        vert_map.set(posi_i, i);
    }
    let indices = '';
    const pline_edges_i = model.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.PLINE, pline_i);
    let num_edges = 0;
    for (const edge_i of pline_edges_i) {
        const edge_posis_i = model.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.EDGE, edge_i);
        const ends_xyzs = edge_posis_i.map(tri_posi_i => model.modeldata.attribs.posis.getPosiCoords(tri_posi_i));
        const edge_length = (0, distance_1.distance)(ends_xyzs[0], ends_xyzs[1]);
        if (edge_length > 0) {
            for (const edge_posi_i of edge_posis_i) {
                indices += ' ' + vert_map.get(edge_posi_i);
            }
            num_edges++;
        }
    }
    geom_meshes_map.set(id, getGeomMeshPline(id, pline_verts_i.length * 3, xyz_str, num_edges, indices, material_id));
}
/**
 * Export to dae collada file
 */
function exportDae(model, ssid) {
    // do we have color, texture, normal?
    const has_color_attrib = model.modeldata.attribs.query.hasEntAttrib(common_1.EEntType.VERT, common_1.EAttribNames.COLOR);
    const has_normal_attrib = model.modeldata.attribs.query.hasEntAttrib(common_1.EEntType.VERT, common_1.EAttribNames.NORMAL);
    const has_texture_attrib = model.modeldata.attribs.query.hasEntAttrib(common_1.EEntType.VERT, common_1.EAttribNames.TEXTURE);
    // create maps to store all the data
    const scene_inst_geoms_map = new Map();
    const nodes_inst_geoms_map = new Map();
    const visual_scene_nodes_map = new Map();
    const geom_meshes_map = new Map();
    const materials_map = new Map();
    const material_effectss_map = new Map();
    // create a rev map to look up colours
    const materials_pgons_rev_map = new Map();
    const materials_plines_rev_map = new Map();
    // process the polygons that are not in a collection
    const pgons_i = model.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.PGON);
    for (const pgon_i of pgons_i) {
        const material_id = processMaterialPgon(model, pgon_i, has_color_attrib, materials_map, material_effectss_map, materials_pgons_rev_map);
        const id = 'pg' + pgon_i;
        processGeomMeshPgon(model, pgon_i, material_id, geom_meshes_map);
        const inst_geom = getInstGeom(id, material_id);
        const colls_i = model.modeldata.geom.nav.navPgonToColl(pgon_i);
        if (colls_i === undefined) {
            scene_inst_geoms_map.set(id, inst_geom);
        }
        else {
            const coll_id = 'co' + colls_i[0];
            if (!visual_scene_nodes_map.has(coll_id)) {
                visual_scene_nodes_map.set(coll_id, getVisualSceneNode(coll_id));
            }
            if (!nodes_inst_geoms_map.has(coll_id)) {
                nodes_inst_geoms_map.set(coll_id, []);
            }
            nodes_inst_geoms_map.get(coll_id).push(inst_geom);
        }
    }
    // process the polylines that are not in a collection
    const plines_i = model.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.PLINE);
    for (const pline_i of plines_i) {
        const material_id = processMaterialPline(model, pline_i, has_color_attrib, materials_map, material_effectss_map, materials_plines_rev_map);
        const id = 'pl' + pline_i;
        processGeomMeshPline(model, pline_i, material_id, geom_meshes_map);
        const inst_geom = getInstGeom(id, material_id);
        const colls_i = model.modeldata.geom.nav.navPlineToColl(pline_i);
        if (colls_i === undefined) {
            scene_inst_geoms_map.set(id, inst_geom);
        }
        else {
            const coll_id = 'co' + colls_i[0];
            if (!visual_scene_nodes_map.has(coll_id)) {
                visual_scene_nodes_map.set(coll_id, getVisualSceneNode(coll_id));
            }
            if (!nodes_inst_geoms_map.has(coll_id)) {
                nodes_inst_geoms_map.set(coll_id, []);
            }
            nodes_inst_geoms_map.get(coll_id).push(inst_geom);
        }
    }
    // create the strings for insertion into the template
    let inst_geoms = Array.from(scene_inst_geoms_map.values()).join('');
    const geom_meshes = Array.from(geom_meshes_map.values()).join('');
    const materials = Array.from(materials_map.values()).join('');
    const material_effects = Array.from(material_effectss_map.values()).join('');
    // create the strings for the collections
    inst_geoms = inst_geoms + Array.from(visual_scene_nodes_map.values()).join('');
    let nodes = '';
    const ids = Array.from(nodes_inst_geoms_map.keys());
    for (const id of ids) {
        const node_inst_geoms = nodes_inst_geoms_map.get(id).join('');
        nodes = nodes + getNodesWithInstGeoms(id, node_inst_geoms);
    }
    // main template for a dae file, returned by this function
    const template = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
    <asset>
        <contributor>
            <authoring_tool>Mobius Modeller</authoring_tool>
        </contributor>
        <unit meter="1" name="meter" />
        <up_axis>Z_UP</up_axis>
    </asset>
	<library_materials>
		<material id="default_pgon_material" name="material">
			<instance_effect url="#default_pgon_effect" />
        </material>
        <material id="default_pline_material" name="material">
			<instance_effect url="#default_pline_effect" />
        </material>
        ${materials}
	</library_materials>
    <library_effects>
        <effect id="default_pgon_effect">
            <profile_COMMON>
                <technique sid="COMMON">
                    <lambert>
                        <diffuse>
                            <color>1 1 1 1</color>
                        </diffuse>
                    </lambert>
                </technique>
            </profile_COMMON>
        </effect>
        <effect id="default_pline_effect">
            <profile_COMMON>
                <technique sid="COMMON">
                    <constant>
                        <transparent opaque="A_ONE">
                            <color>0 0 0 1</color>
                        </transparent>
                        <transparency>
                            <float>1</float>
                        </transparency>
                    </constant>
                </technique>
            </profile_COMMON>
        </effect>
        ${material_effects}
    </library_effects>
    <scene>
        <instance_visual_scene url="#visual_scene" />
    </scene>
    <library_visual_scenes>
        <visual_scene id="visual_scene">
            <node name="mobius_modeller">
                ${inst_geoms}
            </node>
        </visual_scene>
    </library_visual_scenes>
    <library_nodes>
        ${nodes}
    </library_nodes>
    <library_geometries>
        ${geom_meshes}
    </library_geometries>
</COLLADA>
`;
    return template;
}
exports.exportDae = exportDae;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fZGFlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vaW8vaW9fZGFlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFxQztBQUNyQyxzQ0FBc0c7QUFDdEcsa0RBQTJDO0FBQzNDLGtEQUErQztBQUUvQzs7R0FFRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxPQUFlO0lBQ3JDLE1BQU0sS0FBSyxHQUFZLElBQUksaUJBQU8sRUFBRSxDQUFDO0lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNuQyxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBSkQsOEJBSUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxFQUFVLEVBQUUsV0FBbUI7SUFDaEQsT0FBTzsyQ0FDZ0MsRUFBRTs7OzJFQUc4QixXQUFXLGNBQWMsV0FBVzs7Ozs7O2lCQU05RixDQUFDO0FBQ2xCLENBQUM7QUFDRCxTQUFTLGVBQWUsQ0FBQyxFQUFVLEVBQzNCLFNBQWlCLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxXQUFtQixFQUFFLFdBQW1CO0lBQ2pHLE9BQU87d0JBQ2EsRUFBRTs7OEJBRUksRUFBRTt1Q0FDTyxFQUFFLDRCQUE0QixTQUFTLEtBQUssT0FBTzs7MkNBRS9DLFNBQVMsR0FBRyxDQUFDLGNBQWMsRUFBRTs7Ozs7OztnQ0FPeEMsRUFBRTswREFDd0IsRUFBRTs7b0NBRXhCLE9BQU8saUNBQWlDLFdBQVc7bUVBQ3BCLEVBQUU7eUJBQzVDLFdBQVc7Ozs7U0FJM0IsQ0FBQztBQUNWLENBQUM7QUFDRCxTQUFTLGdCQUFnQixDQUFDLEVBQVUsRUFDNUIsU0FBaUIsRUFBRSxPQUFlLEVBQUUsU0FBaUIsRUFBRSxXQUFtQixFQUFFLFdBQW1CO0lBQ25HLE9BQU87d0JBQ2EsRUFBRTs7OEJBRUksRUFBRTt1Q0FDTyxFQUFFLDRCQUE0QixTQUFTLEtBQUssT0FBTzs7MkNBRS9DLFNB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