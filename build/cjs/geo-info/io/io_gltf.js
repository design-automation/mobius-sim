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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportGltf = void 0;
const THREE = __importStar(require("three"));
const GLTFExporter_js_1 = require("./GLTFExporter.js");
const GIModel_1 = require("../GIModel");
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
function exportGltf(model, entities, ssid) {
    return __awaiter(this, void 0, void 0, function* () {
        // create features from pgons, plines, points
        // const obj_sets: IEntSets = getObjSets(model, entities, ssid);
        // const export_json = '';
        // for (const pgon_i of obj_sets.pg) {
        // }
        // for (const pline_i of obj_sets.pl) {
        // }
        if (entities !== null) {
            const gi_data = model.exportGI(entities);
            model = new GIModel_1.GIModel(model.getMetaData());
            model.importGI(gi_data);
            ssid = 1;
        }
        // return JSON.stringify(export_json, null, 2); // pretty
        // convert the model to threejs
        const scene = _convertThreeJS(model, entities, ssid);
        // export the threejs model as GLTF
        // https://threejs.org/docs/#examples/en/exporters/GLTFExporter
        const gltfExporter = new GLTFExporter_js_1.GLTFExporter();
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
    });
}
exports.exportGltf = exportGltf;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fZ2x0Zi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vaW8vaW9fZ2x0Zi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLHVEQUFpRDtBQUVqRCx3Q0FBcUM7QUFLckMsSUFBSyxZQU1KO0FBTkQsV0FBSyxZQUFZO0lBQ2IsdURBQXVDLENBQUE7SUFDdkMsNkRBQTZDLENBQUE7SUFDN0MsMkRBQTJDLENBQUE7SUFDM0MsdURBQXVDLENBQUE7SUFDdkMsNkRBQTZDLENBQUE7QUFDakQsQ0FBQyxFQU5JLFlBQVksS0FBWixZQUFZLFFBTWhCO0FBRUQ7O0dBRUc7QUFDSCxTQUFzQixVQUFVLENBQUMsS0FBYyxFQUFFLFFBQXVCLEVBQUUsSUFBWTs7UUFDbEYsNkNBQTZDO1FBQzdDLGdFQUFnRTtRQUNoRSwwQkFBMEI7UUFDMUIsc0NBQXNDO1FBQ3RDLElBQUk7UUFDSix1Q0FBdUM7UUFDdkMsSUFBSTtRQUVKLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtZQUNuQixNQUFNLE9BQU8sR0FBVyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELEtBQUssR0FBRyxJQUFJLGlCQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDekMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QixJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ1o7UUFFRCx5REFBeUQ7UUFFekQsK0JBQStCO1FBQy9CLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXJELG1DQUFtQztRQUNuQywrREFBK0Q7UUFDL0QsTUFBTSxZQUFZLEdBQUcsSUFBSSw4QkFBWSxFQUFFLENBQUM7UUFFeEMsd0JBQXdCO1FBQ3hCLE1BQU0s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