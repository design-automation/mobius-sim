"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCityJSON = void 0;
const common_1 = require("../common");
const proj4_1 = __importDefault(require("proj4"));
var ECityJSONGeomType;
(function (ECityJSONGeomType) {
    ECityJSONGeomType["MULTIPOINT"] = "MultiPoint";
    ECityJSONGeomType["MULTILINESTRING"] = "MultiLineString";
    ECityJSONGeomType["MULTISURFACE"] = "MultiSurface";
    ECityJSONGeomType["COMPOSITESURFACE"] = "CompositeSurface";
    ECityJSONGeomType["SOLID"] = "Solid";
    ECityJSONGeomType["MULTISOLID"] = "MultiSolid";
    ECityJSONGeomType["COMPOSITESOLID"] = "CompositeSolid";
    ECityJSONGeomType["GEOMETRYINSTANCE"] = "GeometryInstance";
})(ECityJSONGeomType || (ECityJSONGeomType = {}));
/**
 * Import CityJSON
 */
function importCityJSON(model, geojson_str) {
    const ssid = model.modeldata.active_ssid;
    // parse the json data str
    const cityjson_obj = JSON.parse(geojson_str);
    // check type and version
    if (cityjson_obj.type !== 'CityJSON') {
        throw new Error('The data being imported is not CityJSON.');
    }
    if (!('version' in cityjson_obj) || !cityjson_obj.version.startsWith('1.')) {
        throw new Error('The CityJSON data is the wrong version. It must be version 1.x.');
    }
    // crs projection
    let proj_obj = null;
    if ('metadata' in cityjson_obj && 'referenceSystem' in cityjson_obj.metadata) {
        proj_obj = _createGeoJSONProjection2(model, cityjson_obj.vertices[0], cityjson_obj.transform);
    }
    // create positions
    const posis_i = [];
    for (const xyz of cityjson_obj.vertices) {
        // create the posi
        const posi_i = _addPosi(model, xyz, cityjson_obj.transform, proj_obj);
        posis_i.push(posi_i);
    }
    // add materials
    let mat_names = null;
    if ('appearance' in cityjson_obj) {
        mat_names = _addMaterials(model, cityjson_obj.appearance);
    }
    // arrays for objects
    const points_i = new Set();
    const plines_i = new Set();
    const pgons_i = new Set();
    const colls_i = new Set();
    // loop through the geometry
    for (const cityobj_key of Object.keys(cityjson_obj.CityObjects)) {
        const cityobj = cityjson_obj.CityObjects[cityobj_key];
        // create collection for the CityJSON object
        const obj_coll_i = model.modeldata.geom.add.addColl();
        _addObjAttribs(model, obj_coll_i, cityobj, cityobj_key);
        // add geom
        for (const geom of cityobj.geometry) {
            // create collection for geometry (lod and type)
            const geom_coll_i = model.modeldata.geom.add.addColl();
            model.modeldata.geom.snapshot.addCollChildren(ssid, obj_coll_i, geom_coll_i);
            _addGeomAttribs(model, geom_coll_i, geom);
            // add entities to geometry collection
            switch (geom.type) {
                case ECityJSONGeomType.MULTIPOINT: {
                    const new_points_i = _addMultiPoint(model, geom, posis_i);
                    for (const point_i of new_points_i) {
                        points_i.add(point_i);
                    }
                    model.modeldata.geom.snapshot.addCollPoints(ssid, geom_coll_i, new_points_i);
                    _addSemanticAttribs(model, common_1.EEntType.POINT, new_points_i, geom);
                    break;
                }
                case ECityJSONGeomType.MULTILINESTRING: {
                    const new_plines_i = _addMultiLineString(model, geom, posis_i);
                    for (const pline_i of new_plines_i) {
                        plines_i.add(pline_i);
                    }
                    model.modeldata.geom.snapshot.addCollPlines(ssid, geom_coll_i, new_plines_i);
                    _addSemanticAttribs(model, common_1.EEntType.PLINE, new_plines_i, geom);
                    break;
                }
                case ECityJSONGeomType.MULTISURFACE:
                case ECityJSONGeomType.COMPOSITESURFACE: {
                    const new_pgons_i = _addMultiSurface(model, geom, posis_i);
                    for (const pgon_i of new_pgons_i) {
                        pgons_i.add(pgon_i);
                    }
                    model.modeldata.geom.snapshot.addCollPgons(ssid, geom_coll_i, new_pgons_i);
                    _addSemanticAttribs(model, common_1.EEntType.PGON, new_pgons_i, geom);
                    _addMaterialAttribs(model, new_pgons_i, geom, mat_names);
                    break;
                }
                case ECityJSONGeomType.SOLID: {
                    const new_pgons_i = _addSolid(model, geom, posis_i);
                    for (const pgon_i of new_pgons_i) {
                        pgons_i.add(pgon_i);
                    }
                    model.modeldata.geom.snapshot.addCollPgons(ssid, geom_coll_i, new_pgons_i);
                    _addSemanticAttribs(model, common_1.EEntType.PGON, new_pgons_i, geom);
                    _addMaterialAttribs(model, new_pgons_i, geom, mat_names);
                    break;
                }
                case ECityJSONGeomType.MULTISOLID:
                case ECityJSONGeomType.COMPOSITESOLID: {
                    const new_pgons_i = _addMultiSolid(model, geom, posis_i);
                    for (const pgon_i of new_pgons_i) {
                        pgons_i.add(pgon_i);
                    }
                    model.modeldata.geom.snapshot.addCollPgons(ssid, geom_coll_i, new_pgons_i);
                    _addSemanticAttribs(model, common_1.EEntType.PGON, new_pgons_i, geom);
                    _addMaterialAttribs(model, new_pgons_i, geom, mat_names);
                    break;
                }
                case ECityJSONGeomType.GEOMETRYINSTANCE:
                    throw new Error('Importing CityJSON data: Geometry Instances not implemented.');
                default:
                    break;
            }
        }
    }
    // return sets
    return {
        pt: points_i,
        pl: plines_i,
        pg: pgons_i,
        co: colls_i
    };
}
exports.importCityJSON = importCityJSON;
function _createGeoJSONProjection2(model, first_xyz, transform) {
    let x = first_xyz[0];
    let y = first_xyz[1];
    if (transform) {
        x = (x * transform.scale[0]) + transform.translate[0];
        y = (y * transform.scale[1]) + transform.translate[1];
    }
    // from
    let proj_from_str = null;
    if (model.modeldata.attribs.query.hasModelAttrib('proj')) {
        proj_from_str = model.modeldata.attribs.get.getModelAttribVal('proj');
    }
    else {
        proj_from_str = 'WGS84';
    }
    // long lat
    let longitude = null;
    let latitude = null;
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        longitude = geolocation['longitude'];
        latitude = geolocation['latitude'];
    }
    else {
        const long_lat = (0, proj4_1.default)(proj_from_str, 'WGS84', [x, y]);
        // change long lat
        longitude = long_lat[0];
        latitude = long_lat[1];
        model.modeldata.attribs.set.setModelAttribVal('geolocation', {
            'longitude': longitude,
            'latitude': latitude
        });
    }
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    const proj_to_str2 = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    // create projector
    const proj_obj = (0, proj4_1.default)(proj_from_str, proj_to_str2);
    return proj_obj;
}
/*
"metadata": {
  "referenceSystem": "urn:ogc:def:crs:EPSG::7415"
}
*/
/**
 * Get long lat TESTING
 * @param crs The crs string
 */
function _setLongLat(model, crs) {
    // const proj_str_a = '+proj=tmerc +lat_0=';
    // const proj_str_b = ' +lon_0=';
    // const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    // const proj_from_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    const proj_to_str = 'WGS84';
    const proj_from_str = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +vunits=m +no_defs';
    return (0, proj4_1.default)(proj_from_str, proj_to_str, [0, 0]);
}
/**
 * Add a point to the model
 * @param model The model.
 * @param point The features to add.
 */
function _addPosi(model, xyz, transform, proj_obj) {
    // // rotate to north
    // if (rot_matrix) {
    //     xyz = multMatrix(xyz, rot_matrix);
    // }
    // transform
    if (transform) {
        xyz[0] = (xyz[0] * transform.scale[0]) + transform.translate[0];
        xyz[1] = (xyz[1] * transform.scale[1]) + transform.translate[1];
        xyz[2] = (xyz[2] * transform.scale[2]) + transform.translate[2];
    }
    // project
    if (proj_obj) {
        const xy = proj_obj.forward([xyz[0], xyz[1]]);
        xyz[0] = xy[0];
        xyz[1] = xy[1];
    }
    // create the posi
    const posi_i = model.modeldata.geom.add.addPosi();
    model.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
    // return the index
    return posi_i;
}
/*
{
  "type": "MultiPoint",
  "lod": 1,
  "boundaries": [2, 44, 0, 7]
}
*/
/**
 * Add a MultiPoint to the model
 * @param model The model
 * @param geom The CityJSON geometry object to add.
 * @param posis_i The array of positions.
 */
function _addMultiPoint(model, geom, posis_i) {
    // create the point
    const points_i = [];
    for (const idx of geom.boundaries) {
        points_i.push(model.modeldata.geom.add.addPoint(posis_i[idx]));
    }
    return points_i;
}
/*
{
  "type": "MultiLineString",
  "lod": 1,
  "boundaries": [
    [2, 3, 5], [77, 55, 212]
  ]
}
*/
/**
 * Add a MultiLineString to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addMultiLineString(model, geom, posis_i) {
    const plines_i = [];
    for (let idxs of geom.boundaries) {
        const close = idxs.length > 2 && idxs[0] === idxs[idxs.length];
        if (close) {
            idxs = idxs.slice(0, idxs.length - 1);
        }
        const pline_posis_i = idxs.map((i) => posis_i[i]);
        plines_i.push(model.modeldata.geom.add.addPline(pline_posis_i, close));
    }
    return plines_i;
}
/*
{
  "type": "MultiSurface",
  "lod": 2,
  "boundaries": [
    [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]]
  ]
}
*/
/*
{
    "type": "CompositeSurface",
    "lod": 2,
    "boundaries": [
       [[0, 3, 2]], [[4, 5, 6]], [[0, 1, 5]], [[1, 2, 6]], [[2, 3, 7]], [[3, 0, 4]]
    ]
}
*/
/**
 * Add a MultiSurface to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addMultiSurface(model, geom, posis_i) {
    const pgons_i = [];
    for (const idxs of geom.boundaries) {
        const pgon_posis_i = idxs.map((i_list) => i_list.map((i) => posis_i[i]));
        pgons_i.push(model.modeldata.geom.add.addPgon(pgon_posis_i[0], pgon_posis_i.slice(1)));
    }
    return pgons_i;
}
/*
{
  "type": "Solid",
  "lod": 2,
  "boundaries": [
    [ [[0, 3, 2, 1, 22]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ], //-- exterior shell
    [ [[240, 243, 124]], [[244, 246, 724]], [[34, 414, 45]], [[111, 246, 5]] ] //-- interior shell
  ]
}
*/
/**
 * Add a Solid to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addSolid(model, geom, posis_i) {
    // create pgons
    const pgons_i = [];
    for (const shell of geom.boundaries) {
        for (const idxs of shell) {
            const pgon_posis_i = idxs.map((i_list) => i_list.map((i) => posis_i[i]));
            pgons_i.push(model.modeldata.geom.add.addPgon(pgon_posis_i[0], pgon_posis_i.slice(1)));
        }
    }
    return pgons_i;
}
/*
{
    "type": "MultiSolid",
    "lod": 2,
    "boundaries": [
      [
        [ [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[10, 13, 22, 31]] ]
      ],
      [
        [ [[5, 34, 31, 12]], [[44, 54, 62, 74]], [[10, 111, 445, 222]], [[111, 123, 922, 66]] ]
      ]
    ]
  }
*/
/*
{
   "type": "CompositeSolid",
   "lod": 2,
   "boundaries": [
     [ //-- 1st Solid
       [ [[0, 3, 2, 1, 22]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ]
     ],
     [ //-- 2nd Solid
       [ [[666, 667, 668]], [[74, 75, 76]], [[880, 881, 885]], [[111, 122, 226]] ]
     ]
   ]
  }
*/
/**
 * Add a MultiSolid to the model
 * @param model The model
 * @param geom The CityJSON object to add.
 * @param posis_i The array of positions.
 */
function _addMultiSolid(model, geom, posis_i) {
    // create pgons
    const pgons_i = [];
    for (const solid of geom.boundaries) {
        for (const shell of solid) {
            for (const idxs of shell) {
                const pgon_posis_i = idxs.map((i_list) => i_list.map((i) => posis_i[i]));
                pgons_i.push(model.modeldata.geom.add.addPgon(pgon_posis_i[0], pgon_posis_i.slice(1)));
            }
        }
    }
    return pgons_i;
}
/*
"id-1": {
    "type": "Building",
    "attributes": {
      "roofType": "gable roof"
    },
    "geographicalExtent": [ 84710.1, 446846.0, -5.3, 84757.1, 446944.0, 40.9 ],
    "children": ["id-56", "id-832", "mybalcony"]
}
*/
/**
 * Adds attributes to the model
 * @param model The model
 * @param coll_i The entity index.
 * @param geom The cityJSON geometry object.
 */
function _addGeomAttribs(model, coll_i, geom) {
    model.modeldata.attribs.set.setCreateEntsAttribVal(common_1.EEntType.COLL, coll_i, 'type', geom.type);
    model.modeldata.attribs.set.setCreateEntsAttribVal(common_1.EEntType.COLL, coll_i, 'lod', geom.lod);
}
/*
{
  "type": "MultiSurface",
  "lod": 2,
  "boundaries": [
    [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[0, 2, 3, 8]], [[10, 12, 23, 48]]
  ],
  "semantics": {
    "surfaces" : [
      {
        "type": "WallSurface",
        "slope": 33.4,
        "children": [2]
      },
      {
        "type": "RoofSurface",
        "slope": 66.6
      },
      {
        "type": "Door",
        "parent": 0,
        "colour": "blue"
      }
    ],
    "values": [0, 0, null, 1, 2]
  }
}
*/
/*
{
   "type": "CompositeSolid",
   "lod": 2,
   "boundaries": [
     [ //-- 1st Solid
       [ [[0, 3, 2, 1, 22]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ]
     ],
     [ //-- 2nd Solid
       [ [[666, 667, 668]], [[74, 75, 76]], [[880, 881, 885]], [[111, 122, 226]] ]
     ]
   ],
   "semantics": {
     "surfaces" : [
       {
         "type": "RoofSurface",
       },
       {
         "type": "WallSurface",
       }
     ],
     "values": [
       [ //-- 1st Solid
         [0, 1, 1, null]
       ],
       [ //-- 2nd Solid get all null values
         null
       ]
     ]
   }
 }
*/
/**
 * Adds attributes to the model
 * @param model The model
 * @param ent_type The entity type
 * @param ent_i The entity index.
 * @param geom The cityJSON geometry object.
 */
function _addSemanticAttribs(model, ent_type, ents_i, geom) {
    if (!geom.hasOwnProperty('semantics')) {
        return;
    }
    const surfaces = geom.semantics.surfaces;
    let values = geom.semantics.values;
    if (geom.type === 'CompositeSolid' || geom.type === 'MultiSolid') {
        _expandNullValues(values, geom.boundaries);
        values = values.flat(2);
    }
    else {
        values = values.flat(1);
    }
    if (ents_i.length !== values.length) {
        console.log('CityJSON import: Error adding sematic attributes to polygons.');
        console.log('Num entities: ', ents_i.length);
        console.log('Num values: ', values.length);
        console.log(ents_i, values);
        return;
    }
    for (let i = 0; i < ents_i.length; i++) {
        if (values[i] === null) {
            continue;
        }
        const surface = surfaces[values[i]];
        for (const [key, val] of Object.entries(surface)) {
            model.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i[i], key, val);
        }
    }
}
/*
{
  "type": "Solid",
  "lod": 2,
  "boundaries": [
    [ [[0, 3, 2, 1]], [[4, 5, 6, 7]], [[0, 1, 5, 4]], [[1, 2, 6, 5]] ]
  ],
  "material": {
    "irradiation": {
      "values": [[0, 0, 1, null]]
    },
    "irradiation-2": {
      "values": [[2, 2, 1, null]]
    }
  }
}
*/
/**
 * Adds material assignments to the polygons in the model
 * @param model The model
 * @param ent_i The entity index.
 * @param geom The cityJSON geometry object.
 * @param mat_names The names of the materials.
 */
function _addMaterialAttribs(model, ents_i, geom, mat_names) {
    if (!mat_names) {
        return;
    }
    if (!geom.hasOwnProperty('material')) {
        return;
    }
    for (const [theme_key, theme_data] of Object.entries(geom.material)) {
        let values = theme_data['values'];
        if (geom.type === 'CompositeSolid' || geom.type === 'MultiSolid') {
            _expandNullValues(values, geom.boundaries);
            values = values.flat(2);
        }
        else {
            values = values.flat(1);
        }
        if (ents_i.length !== values.length) {
            console.log('CityJSON import: Error adding sematic attributes to polygons.');
            console.log('Num entities: ', ents_i.length);
            console.log('Num values: ', values.length);
            console.log(ents_i, values);
            return;
        }
        for (let i = 0; i < ents_i.length; i++) {
            if (values[i] === null) {
                continue;
            }
            const mat_name = mat_names[values[i]];
            model.modeldata.attribs.set.setCreateEntsAttribVal(common_1.EEntType.PGON, ents_i[i], 'material', mat_name);
        }
    }
}
/**
 * Adds object attributes to the model
 * @param model The model
 * @param ent_type The entity type
 * @param ent_i The entity index.
 * @param obj The cityJSON object.
 * @param id The key to the CityJSON object.
 */
function _addObjAttribs(model, coll_i, obj, id) {
    model.modeldata.attribs.set.setCreateEntsAttribVal(common_1.EEntType.COLL, coll_i, 'id', id);
    model.modeldata.attribs.set.setCreateEntsAttribVal(common_1.EEntType.COLL, coll_i, 'type', obj.type);
    if (obj.hasOwnProperty('children')) {
        model.modeldata.attribs.set.setCreateEntsAttribVal(common_1.EEntType.COLL, coll_i, 'children', obj.children);
    }
    if (!obj.hasOwnProperty('attributes')) {
        return;
    }
    for (const name of Object.keys(obj.attributes)) {
        let value = obj.attributes[name];
        if (value === null) {
            continue;
        }
        const value_type = typeof obj.attributes[name];
        if (value_type === 'object') {
            value = JSON.stringify(value);
        }
        model.modeldata.attribs.set.setCreateEntsAttribVal(common_1.EEntType.COLL, coll_i, name, value);
    }
}
/*
"materials": [
  {
    "name": "roofandground",
    "ambientIntensity":  0.2000,
    "diffuseColor":  [0.9000, 0.1000, 0.7500],
    "emissiveColor": [0.9000, 0.1000, 0.7500],
    "specularColor": [0.9000, 0.1000, 0.7500],
    "shininess": 0.2,
    "transparency": 0.5,
    "isSmooth": false
  },
  {
    "name": "wall",
    "ambientIntensity":  0.4000,
    "diffuseColor":  [0.1000, 0.1000, 0.9000],
    "emissiveColor": [0.1000, 0.1000, 0.9000],
    "specularColor": [0.9000, 0.1000, 0.7500],
    "shininess": 0.0,
    "transparency": 0.5,
    "isSmooth": true
  }
]
*/
/**
 * Adds materials defentitons to the model
 * @param model The model
 * @param appearance The CityJSON appearance object
 */
function _addMaterials(model, appearance) {
    if (!appearance.materials) {
        return;
    }
    const mat_names = [];
    for (const material of appearance.materials) {
        const mat_obj = {
            'type': 'MeshPhongMaterial',
            'color': 'diffuseColor' in material ? material.diffuseColor : [1, 1, 1],
            'emissive': 'emissiveColor' in material ? material.emissiveColor : [0, 0, 0],
            'specular': 'specularColor' in material ? material.specularColor : [0, 0, 0],
            'shininess': 'shininess' in material ? material.shininess * 100 : 0,
            'opacity': 'transparency' in material ? 1 - material.transparency : 1,
            'transparent': 'transparency' in material ? true : false,
            'side': 2,
            'vertexColors': 0,
        };
        model.modeldata.attribs.set.setModelAttribVal(material.name, mat_obj);
        mat_names.push(material.name);
    }
    return mat_names;
}
/*
   "boundaries": [
     [ //-- 1st Solid
       [ ..., ..., ..., ... ]
     ],
     [ //-- 2nd Solid
       [ ..., ..., ..., ... ]
     ]
   ],
   ....
    "values": [
       [ //-- 1st Solid
         [0, 1, 1, null]
       ],
       [ //-- 2nd Solid get all null values
         null
       ]
    ]
*/
/**
 *
 * @param arr1 An array of arrays of values, some null
 * @param arr2 An array of arrays
 */
function _expandNullValues(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] === null) {
                arr1[i][j] = Array(arr2[i][j].length).fill(null);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fY2l0eWpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2lvL2lvX2NpdHlqc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHNDQUF1RTtBQUN2RSxrREFBMEI7QUFJMUIsSUFBSyxpQkFTSjtBQVRELFdBQUssaUJBQWlCO0lBQ2xCLDhDQUF5QixDQUFBO0lBQ3pCLHdEQUFtQyxDQUFBO0lBQ25DLGtEQUE2QixDQUFBO0lBQzdCLDBEQUFxQyxDQUFBO0lBQ3JDLG9DQUFlLENBQUE7SUFDZiw4Q0FBeUIsQ0FBQTtJQUN6QixzREFBaUMsQ0FBQTtJQUNqQywwREFBcUMsQ0FBQTtBQUN6QyxDQUFDLEVBVEksaUJBQWlCLEtBQWpCLGlCQUFpQixRQVNyQjtBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLEtBQWMsRUFBRSxXQUFtQjtJQUM5RCxNQUFNLElBQUksR0FBVyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztJQUNqRCwwQkFBMEI7SUFDMUIsTUFBTSxZQUFZLEdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNsRCx5QkFBeUI7SUFDekIsSUFBSSxZQUFZLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtRQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7S0FDL0Q7SUFDRCxJQUFJLENBQUMsQ0FBQyxTQUFTLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4RSxNQUFNLElBQUksS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7S0FDdEY7SUFDRCxpQkFBaUI7SUFDakIsSUFBSSxRQUFRLEdBQW9CLElBQUksQ0FBQztJQUNyQyxJQUFJLFVBQVUsSUFBSSxZQUFZLElBQUksaUJBQWlCLElBQUksWUFBWSxDQUFDLFFBQVEs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