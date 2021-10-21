import * as THREE from 'three';
import { GLTFExporter } from './GLTFExporter.js';
import { GIModel } from '../GIModel';
var MaterialType;
(function (MaterialType) {
    MaterialType["MeshBasicMaterial"] = "MeshBasicMaterial";
    MaterialType["MeshStandardMaterial"] = "MeshStandardMaterial";
    MaterialType["MeshLambertMaterial"] = "MeshLambertMaterial";
    MaterialType["MeshPhongMaterial"] = "MeshPhongMaterial";
    MaterialType["MeshPhysicalMaterial"] = "MeshPhysicalMaterial";
})(MaterialType || (MaterialType = {}));
/**
 *  Export GLTF
 */
export async function exportGltf(model, entities, ssid) {
    // create features from pgons, plines, points
    // const obj_sets: IEntSets = getObjSets(model, entities, ssid);
    // const export_json = '';
    // for (const pgon_i of obj_sets.pg) {
    // }
    // for (const pline_i of obj_sets.pl) {
    // }
    if (entities !== null) {
        const gi_data = model.exportGI(entities);
        model = new GIModel(model.getMetaData());
        model.importGI(gi_data);
        ssid = 1;
    }
    // return JSON.stringify(export_json, null, 2); // pretty
    // convert the model to threejs
    const scene = _convertThreeJS(model, entities, ssid);
    // export the threejs model as GLTF
    // https://threejs.org/docs/#examples/en/exporters/GLTFExporter
    const gltfExporter = new GLTFExporter();
    // GLTF exporter options
    const options = {
        trs: false,
        onlyVisible: false
    };
    // exporter parsing -> promise
    const p = new Promise(resolve => {
        gltfExporter.parse(scene, function (result) {
            for (const material of result['materials']) {
                material['doubleSided'] = true;
            }
            const output = JSON.stringify(result, null, 2);
            resolve(output);
        }, options);
    });
    return p;
}
/**
 *  convert GI model to threejs model
 */
function _convertThreeJS(model, entities, ssid) {
    // Create Threejs scene
    const scene = new THREE.Scene();
    // get geometry data
    const threejs_data = model.get3jsData(ssid);
    // Get materials
    const pline_material_groups = threejs_data.pline_material_groups;
    const pline_materials = threejs_data.pline_materials;
    const pgon_material_groups = threejs_data.pgon_material_groups;
    const pgon_materials = threejs_data.pgon_materials;
    // Create buffers that will be used by all geometry
    const verts_xyz_buffer = new THREE.Float32BufferAttribute(threejs_data.verts_xyz, 3);
    const normals_buffer = new THREE.Float32BufferAttribute(threejs_data.normals, 3);
    const colors_buffer = new THREE.Float32BufferAttribute(threejs_data.colors, 3);
    // add geometry to scene
    _addTris(scene, threejs_data.tri_indices, verts_xyz_buffer, colors_buffer, normals_buffer, pgon_material_groups, pgon_materials);
    _addLines(scene, threejs_data.edge_indices, verts_xyz_buffer, colors_buffer, pline_material_groups, pline_materials);
    _addPoints(scene, threejs_data.point_indices, verts_xyz_buffer, colors_buffer, [255, 255, 255], 1);
    return scene;
}
/**
 * Add threejs triangles to the scene
 */
function _addTris(scene, tris_i, posis_buffer, colors_buffer, normals_buffer, material_groups, materials) {
    const geom = new THREE.BufferGeometry();
    geom.setIndex(tris_i);
    geom.setAttribute('position', posis_buffer);
    if (normals_buffer.count > 0) {
        geom.setAttribute('normal', normals_buffer);
    }
    geom.setAttribute('color', colors_buffer);
    // const colorf = new THREE.Color(parseInt(settings.colors.face_f.replace('#', '0x'), 16));
    // const colorb = new THREE.Color(parseInt(settings.colors.face_b.replace('#', '0x'), 16));
    const colorf = new THREE.Color(parseInt('0xFFFFFF', 16));
    const colorb = new THREE.Color(parseInt('0xDDDDDD', 16));
    geom.clearGroups();
    material_groups.forEach(element => {
        geom.addGroup(element[0], element[1], element[2]);
    });
    // _buffer_geoms.push(geom);
    const material_arr = [];
    let index = 0;
    const l = materials.length;
    for (; index < l; index++) {
        const element = materials[index];
        let mat;
        if (index === 0) {
            delete element.type;
            element.color = colorf;
            mat = new THREE.MeshPhongMaterial(element);
        }
        else if (index === 1) {
            delete element.type;
            element.color = colorb;
            mat = new THREE.MeshPhongMaterial(element);
        }
        else {
            if (element.type === MaterialType.MeshBasicMaterial) {
                delete element.type;
                mat = new THREE.MeshBasicMaterial(element);
            }
            else if (element.type === MaterialType.MeshPhongMaterial) {
                delete element.type;
                mat = new THREE.MeshPhongMaterial(element);
            }
            else if (element.type === MaterialType.MeshPhysicalMaterial) {
                delete element.type;
                // if (settings.background.show) {
                //     element.envMap = scene.background;
                // }
                mat = new THREE.MeshPhysicalMaterial(element);
            }
            else if (element.type === MaterialType.MeshLambertMaterial) {
                delete element.type;
                mat = new THREE.MeshLambertMaterial(element);
            }
            else if (element.type === MaterialType.MeshStandardMaterial) {
                delete element.type;
                mat = new THREE.MeshStandardMaterial(element);
            }
        }
        material_arr.push(mat);
    }
    const mesh = new THREE.Mesh(geom, material_arr);
    mesh.name = 'obj_tri';
    mesh.geometry.computeBoundingSphere();
    if (normals_buffer.count === 0) {
        mesh.geometry.computeVertexNormals();
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // add mesh to scene
    scene.add(mesh);
}
/**
* Add threejs lines to the scene
*/
function _addLines(scene, lines_i, posis_buffer, color_buffer, material_groups, materials) {
    const geom = new THREE.BufferGeometry();
    geom.setIndex(lines_i);
    geom.setAttribute('position', posis_buffer);
    geom.setAttribute('color', color_buffer);
    const material_arr = [];
    let index = 0;
    const l = materials.length;
    for (; index < l; index++) {
        const element = materials[index];
        if (element.type === 'LineBasicMaterial') {
            const mat = new THREE.LineBasicMaterial({
                color: element.color || 0,
                vertexColors: true
            });
            material_arr.push(mat);
        }
        else {
            const mat = new THREE.LineBasicMaterial({
                color: element.color || 0,
                vertexColors: true
            });
            material_arr.push(mat);
        }
    }
    material_groups.forEach(element => {
        geom.addGroup(element[0], element[1], element[2]);
    });
    const newGeom = geom.toNonIndexed();
    const line = new THREE.LineSegments(newGeom, material_arr);
    line.name = 'obj_line';
    line.computeLineDistances();
    scene.add(line);
}
/**
* Add threejs points to the scene
*/
function _addPoints(scene, points_i, posis_buffer, colors_buffer, color, size = 1) {
    const geom = new THREE.BufferGeometry();
    geom.setIndex(points_i);
    geom.setAttribute('position', posis_buffer);
    geom.setAttribute('color', colors_buffer);
    // _buffer_geoms.push(geom);
    // geom.computeBoundingSphere();
    const rgb = `rgb(${color.toString()})`;
    const mat = new THREE.PointsMaterial({
        // color: new THREE.Color(rgb),
        size: size,
        vertexColors: true,
        sizeAttenuation: false
    });
    const point = new THREE.Points(geom, mat);
    point.name = 'obj_pt';
    scene.add(point);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fZ2x0Zi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2lvL2lvX2dsdGYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWpELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFLckMsSUFBSyxZQU1KO0FBTkQsV0FBSyxZQUFZO0lBQ2IsdURBQXVDLENBQUE7SUFDdkMsNkRBQTZDLENBQUE7SUFDN0MsMkRBQTJDLENBQUE7SUFDM0MsdURBQXVDLENBQUE7SUFDdkMsNkRBQTZDLENBQUE7QUFDakQsQ0FBQyxFQU5JLFlBQVksS0FBWixZQUFZLFFBTWhCO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLFVBQVUsQ0FBQyxLQUFjLEVBQUUsUUFBdUIsRUFBRSxJQUFZO0lBQ2xGLDZDQUE2QztJQUM3QyxnRUFBZ0U7SUFDaEUsMEJBQTBCO0lBQzFCLHNDQUFzQztJQUN0QyxJQUFJO0lBQ0osdUNBQXVDO0lBQ3ZDLElBQUk7SUFFSixJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxPQUFPLEdBQVcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDekMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixJQUFJLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFFRCx5REFBeUQ7SUFFekQsK0JBQStCO0lBQy9CLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXJELG1DQUFtQztJQUNuQywrREFBK0Q7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