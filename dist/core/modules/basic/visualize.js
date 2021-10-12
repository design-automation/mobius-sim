"use strict";
/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 * @module
 */
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
exports.BBox = exports.Plane = exports.Ray = exports.Mesh = exports._EMeshMethod = exports.Edge = exports._EEdgeMethod = exports._EColorRampMethod = exports.Gradient = exports.Color = exports._Ecolors = exports._ESide = void 0;
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const common_1 = require("../../../libs/geo-info/common");
const common_2 = require("../../../libs/geo-info/common");
const common_id_funcs_1 = require("../../../libs/geo-info/common_id_funcs");
const arrs_1 = require("../../../libs/util/arrs");
const vectors_1 = require("../../../libs/geom/vectors");
const ch = __importStar(require("chroma-js"));
const Mathjs = __importStar(require("mathjs"));
// ================================================================================================
var _ESide;
(function (_ESide) {
    _ESide["FRONT"] = "front";
    _ESide["BACK"] = "back";
    _ESide["BOTH"] = "both";
})(_ESide = exports._ESide || (exports._ESide = {}));
var _Ecolors;
(function (_Ecolors) {
    _Ecolors["NO_VERT_COLORS"] = "none";
    _Ecolors["VERT_COLORS"] = "apply_rgb";
})(_Ecolors = exports._Ecolors || (exports._Ecolors = {}));
// ================================================================================================
/**
 * Sets color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param color The color, [0,0,0] is black, [1,1,1] is white.
 * @returns void
 */
function Color(__model__, entities, color) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return;
    }
    // --- Error Check ---
    const fn_name = 'visualize.Color';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], null);
        }
        chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
    }
    else {
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    _color(__model__, ents_arr, color);
}
exports.Color = Color;
function _color(__model__, ents_arr, color) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(common_2.EEntType.VERT, common_1.EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(common_2.EEntType.VERT, common_1.EAttribNames.COLOR, common_1.EAttribDataTypeStrs.LIST);
    }
    // make a list of all the verts
    let all_verts_i = [];
    if (ents_arr === null) {
        all_verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, common_2.EEntType.VERT);
    }
    else {
        for (const ent_arr of ents_arr) {
            const [ent_type, ent_i] = ent_arr;
            if (ent_type === common_2.EEntType.VERT) {
                all_verts_i.push(ent_i);
            }
            else {
                const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const vert_i of verts_i) {
                    all_verts_i.push(vert_i);
                }
            }
        }
    }
    // set all verts to have same color
    __model__.modeldata.attribs.set.setEntsAttribVal(common_2.EEntType.VERT, all_verts_i, common_1.EAttribNames.COLOR, color);
}
// ================================================================================================
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use.
 * @returns void
 */
function Gradient(__model__, entities, attrib, range, method) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if (!(0, arrs_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'visualize.Gradient';
        let ents_arr = null;
        let attrib_name;
        let attrib_idx_or_key;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], null);
            chk.checkArgs(fn_name, 'attrib', attrib, [chk.isStr, chk.isStrStr, chk.isStrNum]);
            chk.checkArgs(fn_name, 'range', range, [chk.isNull, chk.isNum, chk.isNumL]);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
            if (!__model__.modeldata.attribs.query.hasEntAttrib(ents_arr[0][0], attrib_name)) {
                throw new Error(fn_name + ': The attribute with name "' + attrib + '" does not exist on these entities.');
            }
            else {
                let data_type = null;
                if (attrib_idx_or_key === null) {
                    data_type = __model__.modeldata.attribs.query.getAttribDataType(ents_arr[0][0], attrib_name);
                }
                else {
                    const first_val = __model__.modeldata.attribs.get.getEntAttribValOrItem(ents_arr[0][0], ents_arr[0][1], attrib_name, attrib_idx_or_key);
                }
                if (data_type !== common_1.EAttribDataTypeStrs.NUMBER) {
                    throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                        'For generating a gradient, the attribute must be a number.');
                }
            }
        }
        else {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists], null) as TEntTypeIdx[];
            ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
        }
        // --- Error Check ---
        if (range === null) {
            range = [null, null];
        }
        range = Array.isArray(range) ? range : [0, range];
        _gradient(__model__, ents_arr, attrib_name, attrib_idx_or_key, range, method);
    }
}
exports.Gradient = Gradient;
// https://codesandbox.io/s/5w573r54w4
var _EColorRampMethod;
(function (_EColorRampMethod) {
    _EColorRampMethod["FALSE_COLOR"] = "false_color";
    _EColorRampMethod["BLACK_BODY"] = "black_body";
    _EColorRampMethod["WHITE_RED"] = "white_red";
    _EColorRampMethod["WHITE_GREEN"] = "white_green";
    _EColorRampMethod["WHITE_BLUE"] = "white_blue";
    _EColorRampMethod["BLUE_RED"] = "blue_red";
    _EColorRampMethod["GREEN_RED"] = "green_red";
    _EColorRampMethod["BLUE_GREEN"] = "blue_green";
    _EColorRampMethod["GREY_SCALE"] = "grey_scale";
    _EColorRampMethod["ORRD"] = "OrRd";
    _EColorRampMethod["PUBU"] = "PuBu";
    _EColorRampMethod["BUPU"] = "BuPu";
    _EColorRampMethod["ORANGES"] = "Oranges";
    _EColorRampMethod["BUGN"] = "BuGn";
    _EColorRampMethod["YLORBR"] = "YlOrBr";
    _EColorRampMethod["YLGN"] = "YlGn";
    _EColorRampMethod["REDS"] = "Reds";
    _EColorRampMethod["RDPU"] = "RdPu";
    _EColorRampMethod["GREENS"] = "Greens";
    _EColorRampMethod["YLGNBU"] = "YlGnBu";
    _EColorRampMethod["PURPLES"] = "Purples";
    _EColorRampMethod["GNBU"] = "GnBu";
    _EColorRampMethod["GREYS"] = "Greys";
    _EColorRampMethod["YLORRD"] = "YlOrRd";
    _EColorRampMethod["PURD"] = "PuRd";
    _EColorRampMethod["BLUES"] = "Blues";
    _EColorRampMethod["PUBUGN"] = "PuBuGn";
    _EColorRampMethod["VIRIDIS"] = "Viridis";
    _EColorRampMethod["SPECTRAL"] = "Spectral";
    _EColorRampMethod["RDYLGN"] = "RdYlGn";
    _EColorRampMethod["RDBU"] = "RdBu";
    _EColorRampMethod["PIYG"] = "PiYG";
    _EColorRampMethod["PRGN"] = "PRGn";
    _EColorRampMethod["RDYLBU"] = "RdYlBu";
    _EColorRampMethod["BRBG"] = "BrBG";
    _EColorRampMethod["RDGY"] = "RdGy";
    _EColorRampMethod["PUOR"] = "PuOr";
    _EColorRampMethod["SET2"] = "Set2";
    _EColorRampMethod["ACCENT"] = "Accent";
    _EColorRampMethod["SET1"] = "Set1";
    _EColorRampMethod["SET3"] = "Set3";
    _EColorRampMethod["DARK2"] = "Dark2";
    _EColorRampMethod["PAIRED"] = "Paired";
    _EColorRampMethod["PASTEL2"] = "Pastel2";
    _EColorRampMethod["PASTEL1"] = "Pastel1";
})(_EColorRampMethod = exports._EColorRampMethod || (exports._EColorRampMethod = {}));
function _gradient(__model__, ents_arr, attrib_name, idx_or_key, range, method) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(common_2.EEntType.VERT, common_1.EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(common_2.EEntType.VERT, common_1.EAttribNames.COLOR, common_1.EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type = ents_arr[0][0];
    const ents_i = ents_arr.map(ent_arr => ent_arr[1]);
    // push the attrib down from the ent to its verts
    if (first_ent_type !== common_2.EEntType.VERT) {
        __model__.modeldata.attribs.push.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i, common_2.EEntType.VERT, attrib_name, null, common_1.EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        if (ent_type === common_2.EEntType.VERT) {
            all_verts_i.push(ent_i);
        }
        else {
            const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // get the attribute values
    const vert_values = __model__.modeldata.attribs.get.getEntAttribVal(common_2.EEntType.VERT, all_verts_i, attrib_name);
    // if range[0] is null, get min value
    if (range[0] === null) {
        range[0] = Mathjs.min(vert_values);
    }
    // if range[1] is null. get max value
    if (range[1] === null) {
        range[1] = Mathjs.max(vert_values);
    }
    // create color scale
    const scales = {
        'false_color': ['blue', 'cyan', 'green', 'yellow', 'red'],
        'black_body': ['black', 'red', 'yellow', 'white'],
        'white_red': ['white', 'red'],
        'white_blue': ['white', 'blue'],
        'white_green': ['white', 'green'],
        'blue_red': ['blue', 'red'],
        'green_red': ['green', 'red'],
        'blue_green': ['blue', 'green'],
        'grey_scale': ['white', 'black']
    };
    let scale = null;
    if (method in scales) {
        scale = scales[method];
    }
    else {
        scale = method;
    }
    const col_scale = ch.scale(scale);
    const col_domain = col_scale.domain(range);
    // make a values map, grouping together all the verts that have the same value
    const values_map = new Map();
    for (let i = 0; i < all_verts_i.length; i++) {
        if (!values_map.has(vert_values[i])) {
            // const col: TColor = colFalse(vert_values[i], range[0], range[1]);
            const ch_col = col_domain(vert_values[i]).gl();
            const col = [ch_col[0], ch_col[1], ch_col[2]];
            values_map.set(vert_values[i], [col, [all_verts_i[i]]]);
        }
        else {
            values_map.get(vert_values[i])[1].push(all_verts_i[i]);
        }
    }
    // set color of each group of verts
    values_map.forEach((col_and_verts_i) => {
        const col = col_and_verts_i[0];
        const verts_i = col_and_verts_i[1];
        __model__.modeldata.attribs.set.setEntsAttribVal(common_2.EEntType.VERT, verts_i, common_1.EAttribNames.COLOR, col);
    });
}
// ================================================================================================
var _EEdgeMethod;
(function (_EEdgeMethod) {
    _EEdgeMethod["VISIBLE"] = "visible";
    _EEdgeMethod["HIDDEN"] = "hidden";
})(_EEdgeMethod = exports._EEdgeMethod || (exports._EEdgeMethod = {}));
/**
 * Controls how edges are visualized by setting the visibility of the edge.
 * \n
 * The method can either be 'visible' or 'hidden'.
 * 'visible' means that an edge line will be visible.
 * 'hidden' means that no edge lines will be visible.
 * \n
 * @param entities A list of edges, or other entities from which edges can be extracted.
 * @param method Enum, visible or hidden.
 * @returns void
 */
function Edge(__model__, entities, method) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return;
    }
    // --- Error Check ---
    const fn_name = 'visualize.Edge';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], null);
        }
    }
    else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    if (!__model__.modeldata.attribs.query.hasEntAttrib(common_2.EEntType.EDGE, common_1.EAttribNames.VISIBILITY)) {
        if (method === _EEdgeMethod.VISIBLE) {
            return;
        }
        else {
            __model__.modeldata.attribs.add.addAttrib(common_2.EEntType.EDGE, common_1.EAttribNames.VISIBILITY, common_1.EAttribDataTypeStrs.STRING);
        }
    }
    // Get the unique edges
    let edges_i = [];
    if (ents_arr !== null) {
        const set_edges_i = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === common_2.EEntType.EDGE) {
                set_edges_i.add(ent_i);
            }
            else {
                const ent_edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
                for (const ent_edge_i of ent_edges_i) {
                    set_edges_i.add(ent_edge_i);
                }
            }
        }
        edges_i = Array.from(set_edges_i);
    }
    else {
        edges_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, common_2.EEntType.EDGE);
    }
    // Set edge visibility
    const setting = method === _EEdgeMethod.VISIBLE ? null : 'hidden';
    __model__.modeldata.attribs.set.setEntsAttribVal(common_2.EEntType.EDGE, edges_i, common_1.EAttribNames.VISIBILITY, setting);
}
exports.Edge = Edge;
// ================================================================================================
var _EMeshMethod;
(function (_EMeshMethod) {
    _EMeshMethod["FACETED"] = "faceted";
    _EMeshMethod["SMOOTH"] = "smooth";
})(_EMeshMethod = exports._EMeshMethod || (exports._EMeshMethod = {}));
/**
 * Controls how polygon meshes are visualized by creating normals on vertices.
 * \n
 * The method can either be 'faceted' or 'smooth'.
 * 'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
 * 'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.
 * \n
 * @param entities Vertices belonging to polygons, or entities from which polygon vertices can be extracted.
 * @param method Enum, the types of normals to create, faceted or smooth.
 * @returns void
 */
function Mesh(__model__, entities, method) {
    entities = (0, arrs_1.arrMakeFlat)(entities);
    if ((0, arrs_1.isEmptyArr)(entities)) {
        return;
    }
    // --- Error Check ---
    const fn_name = 'visualize.Mesh';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], null);
        }
    }
    else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = (0, common_id_funcs_1.idsBreak)(entities);
    }
    // --- Error Check ---
    // Get the unique verts that belong to pgons
    let verts_i = [];
    if (ents_arr !== null) {
        const set_verts_i = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === common_2.EEntType.VERT) {
                if (__model__.modeldata.geom.query.getTopoObjType(common_2.EEntType.VERT, ent_i) === common_2.EEntType.PGON) {
                    set_verts_i.add(ent_i);
                }
            }
            else if (ent_type === common_2.EEntType.POINT) {
                // skip
            }
            else if (ent_type === common_2.EEntType.PLINE) {
                // skip
            }
            else if (ent_type === common_2.EEntType.PGON) {
                const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(common_2.EEntType.PGON, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    set_verts_i.add(ent_vert_i);
                }
            }
            else if (ent_type === common_2.EEntType.COLL) {
                const coll_pgons_i = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(common_2.EEntType.PGON, coll_pgon_i);
                    for (const ent_vert_i of ent_verts_i) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
            else {
                const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    if (__model__.modeldata.geom.query.getTopoObjType(common_2.EEntType.VERT, ent_vert_i) === common_2.EEntType.PGON) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
        }
        verts_i = Array.from(set_verts_i);
    }
    else {
        verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, common_2.EEntType.VERT);
    }
    // calc vertex normals and set edge visibility
    switch (method) {
        case _EMeshMethod.FACETED:
            _meshFaceted(__model__, verts_i);
            break;
        case _EMeshMethod.SMOOTH:
            _meshSmooth(__model__, verts_i);
            break;
        default:
            break;
    }
}
exports.Mesh = Mesh;
function _meshFaceted(__model__, verts_i) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(common_2.EEntType.VERT, common_1.EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(common_2.EEntType.VERT, common_1.EAttribNames.NORMAL, common_1.EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_vert_pgons = new Map();
    const set_pgons_i = new Set();
    for (const vert_i of verts_i) {
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(common_2.EEntType.VERT, vert_i); // TODO optimize
        if (pgons_i.length === 1) { // one polygon
            map_vert_pgons.set(vert_i, pgons_i[0]);
            set_pgons_i.add(pgons_i[0]);
        }
    }
    // calc the normals one time
    const normals = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set the normal
    map_vert_pgons.forEach((pgon_i, vert_i) => {
        const normal = normals[pgon_i];
        __model__.modeldata.attribs.set.setEntAttribVal(common_2.EEntType.VERT, vert_i, common_1.EAttribNames.NORMAL, normal);
    });
}
function _meshSmooth(__model__, verts_i) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(common_2.EEntType.VERT, common_1.EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(common_2.EEntType.VERT, common_1.EAttribNames.NORMAL, common_1.EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_posi_pgons = new Map();
    const set_pgons_i = new Set();
    const vert_to_posi = [];
    for (const vert_i of verts_i) {
        const posi_i = __model__.modeldata.geom.nav.navVertToPosi(vert_i);
        vert_to_posi[vert_i] = posi_i;
        if (!map_posi_pgons.has(posi_i)) {
            const posi_pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(common_2.EEntType.VERT, vert_i);
            map_posi_pgons.set(posi_i, posi_pgons_i);
            for (const posi_pgon_i of posi_pgons_i) {
                set_pgons_i.add(posi_pgon_i);
            }
        }
    }
    // calc all normals one time
    const normals = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set normals on all verts
    for (const vert_i of verts_i) {
        const posi_i = vert_to_posi[vert_i];
        let normal = [0, 0, 0];
        const posi_pgons_i = map_posi_pgons.get(posi_i);
        for (const posi_pgon_i of posi_pgons_i) {
            normal = [
                normal[0] + normals[posi_pgon_i][0],
                normal[1] + normals[posi_pgon_i][1],
                normal[2] + normals[posi_pgon_i][2]
            ];
        }
        const div = posi_pgons_i.length;
        normal = [normal[0] / div, normal[1] / div, normal[2] / div];
        normal = (0, vectors_1.vecNorm)(normal);
        __model__.modeldata.attribs.set.setEntAttribVal(common_2.EEntType.VERT, vert_i, common_1.EAttribNames.NORMAL, normal);
    }
}
// ================================================================================================
/**
 * Visualises a ray or a list of rays by creating a polyline with an arrow head.
 *
 * @param __model__
 * @param rays Polylines representing the ray or rays.
 * @param scale Scales the arrow head of the vector.
 * @returns entities, a line with an arrow head representing the ray.
 * @example ray1 = visualize.Ray([[1,2,3],[0,0,1]])
 */
function Ray(__model__, rays, scale) {
    // --- Error Check ---
    const fn_name = 'visualize.Ray';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'ray', rays, [chk.isRay, chk.isRayL]);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    // --- Error Check ---
    return (0, common_id_funcs_1.idsMake)(_visRay(__model__, rays, scale));
}
exports.Ray = Ray;
function _visRay(__model__, rays, scale) {
    if ((0, arrs_1.getArrDepth)(rays) === 2) {
        const ray = rays;
        const origin = ray[0];
        const vec = ray[1]; // vecMult(ray[1], scale);
        const end = (0, vectors_1.vecAdd)(origin, vec);
        // create orign point
        const origin_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create pline
        const end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(end_posi_i, end);
        const pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, end_posi_i]);
        // create the arrow heads
        const vec_unit = (0, vectors_1.vecNorm)(ray[1]);
        const head_scale = scale;
        let vec_norm = null;
        if ((0, vectors_1.vecDot)([0, 0, 1], vec)) {
            vec_norm = (0, vectors_1.vecSetLen)((0, vectors_1.vecCross)(vec_unit, [0, 1, 0]), head_scale);
        }
        else {
            vec_norm = (0, vectors_1.vecSetLen)((0, vectors_1.vecCross)(vec_unit, [0, 0, 1]), head_scale);
        }
        const vec_rev = (0, vectors_1.vecSetLen)((0, vectors_1.vecMult)(vec, -1), head_scale);
        const arrow_a = (0, vectors_1.vecAdd)((0, vectors_1.vecAdd)(end, vec_rev), vec_norm);
        const arrow_a_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_a_posi_i, arrow_a);
        const arrow_a_pline_i = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_a_posi_i]);
        const arrow_b = (0, vectors_1.vecSub)((0, vectors_1.vecAdd)(end, vec_rev), vec_norm);
        const arrow_b_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_b_posi_i, arrow_b);
        const arrow_b_pline_i = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_b_posi_i]);
        // return the geometry IDs
        return [
            [common_2.EEntType.PLINE, pline_i],
            [common_2.EEntType.PLINE, arrow_a_pline_i],
            [common_2.EEntType.PLINE, arrow_b_pline_i]
        ];
    }
    else {
        const ents_arr = [];
        for (const ray of rays) {
            const ray_ents = _visRay(__model__, ray, scale);
            for (const ray_ent of ray_ents) {
                ents_arr.push(ray_ent);
            }
        }
        return ents_arr;
    }
}
// ================================================================================================
/**
 * Visualises a plane or a list of planes by creating polylines.
 *
 * @param __model__
 * @param plane A plane or a list of planes.
 * @returns Entities, a square plane polyline and three axis polyline.
 * @example plane1 = visualize.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
function Plane(__model__, planes, scale) {
    // --- Error Check ---
    const fn_name = 'visualize.Plane';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'planes', planes, [chk.isPln, chk.isPlnL]);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    // --- Error Check ---
    return (0, common_id_funcs_1.idsMake)(_visPlane(__model__, planes, scale));
}
exports.Plane = Plane;
function _visPlane(__model__, planes, scale) {
    if ((0, arrs_1.getArrDepth)(planes) === 2) {
        const plane = planes;
        const origin = plane[0];
        const x_vec = (0, vectors_1.vecMult)(plane[1], scale);
        const y_vec = (0, vectors_1.vecMult)(plane[2], scale);
        let x_end = (0, vectors_1.vecAdd)(origin, x_vec);
        let y_end = (0, vectors_1.vecAdd)(origin, y_vec);
        const z_end = (0, vectors_1.vecAdd)(origin, (0, vectors_1.vecSetLen)((0, vectors_1.vecCross)(x_vec, y_vec), scale));
        const plane_corners = [
            (0, vectors_1.vecAdd)(x_end, y_vec),
            (0, vectors_1.vecSub)(y_end, x_vec),
            (0, vectors_1.vecSub)((0, vectors_1.vecSub)(origin, x_vec), y_vec),
            (0, vectors_1.vecSub)(x_end, y_vec),
        ];
        x_end = (0, vectors_1.vecAdd)(x_end, (0, vectors_1.vecMult)(x_vec, 0.1));
        y_end = (0, vectors_1.vecSub)(y_end, (0, vectors_1.vecMult)(y_vec, 0.1));
        // create the point
        const origin_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create the x axis
        const x_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(x_end_posi_i, x_end);
        const x_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, x_end_posi_i]);
        // create the y axis
        const y_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(y_end_posi_i, y_end);
        const y_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, y_end_posi_i]);
        // create the z axis
        const z_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(z_end_posi_i, z_end);
        const z_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, z_end_posi_i]);
        // create pline for plane
        const corner_posis_i = [];
        for (const corner of plane_corners) {
            const posi_i = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, corner);
            corner_posis_i.push(posi_i);
        }
        const plane_i = __model__.modeldata.geom.add.addPline(corner_posis_i, true);
        // return the geometry IDs
        return [
            [common_2.EEntType.PLINE, x_pline_i],
            [common_2.EEntType.PLINE, y_pline_i],
            [common_2.EEntType.PLINE, z_pline_i],
            [common_2.EEntType.PLINE, plane_i]
        ];
    }
    else {
        const ents_arr = [];
        for (const plane of planes) {
            const plane_ents = _visPlane(__model__, plane, scale);
            for (const plane_ent of plane_ents) {
                ents_arr.push(plane_ent);
            }
        }
        return ents_arr;
    }
}
// ================================================================================================
/**
 * Visualises a bounding box by adding geometry to the model.
 *
 * @param __model__
 * @param bboxes A list of lists.
 * @returns Entities, twelve polylines representing the box.
 * @example bbox1 = virtual.viBBox(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
function BBox(__model__, bboxes) {
    // --- Error Check ---
    const fn_name = 'visualize.BBox';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'bbox', bboxes, [chk.isBBox]); // TODO bboxs can be a list // add isBBoxList to enable check
    }
    // --- Error Check ---
    return (0, common_id_funcs_1.idsMake)(_visBBox(__model__, bboxes));
}
exports.BBox = BBox;
function _visBBox(__model__, bboxs) {
    if ((0, arrs_1.getArrDepth)(bboxs) === 2) {
        const bbox = bboxs;
        const _min = bbox[1];
        const _max = bbox[2];
        // bottom
        const ps0 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps0, _min);
        const ps1 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps1, [_max[0], _min[1], _min[2]]);
        const ps2 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps2, [_max[0], _max[1], _min[2]]);
        const ps3 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps3, [_min[0], _max[1], _min[2]]);
        // top
        const ps4 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps4, [_min[0], _min[1], _max[2]]);
        const ps5 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps5, [_max[0], _min[1], _max[2]]);
        const ps6 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps6, _max);
        const ps7 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps7, [_min[0], _max[1], _max[2]]);
        // plines bottom
        const pl0 = __model__.modeldata.geom.add.addPline([ps0, ps1]);
        const pl1 = __model__.modeldata.geom.add.addPline([ps1, ps2]);
        const pl2 = __model__.modeldata.geom.add.addPline([ps2, ps3]);
        const pl3 = __model__.modeldata.geom.add.addPline([ps3, ps0]);
        // plines top
        const pl4 = __model__.modeldata.geom.add.addPline([ps4, ps5]);
        const pl5 = __model__.modeldata.geom.add.addPline([ps5, ps6]);
        const pl6 = __model__.modeldata.geom.add.addPline([ps6, ps7]);
        const pl7 = __model__.modeldata.geom.add.addPline([ps7, ps4]);
        // plines vertical
        const pl8 = __model__.modeldata.geom.add.addPline([ps0, ps4]);
        const pl9 = __model__.modeldata.geom.add.addPline([ps1, ps5]);
        const pl10 = __model__.modeldata.geom.add.addPline([ps2, ps6]);
        const pl11 = __model__.modeldata.geom.add.addPline([ps3, ps7]);
        // return
        return [pl0, pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8, pl9, pl10, pl11].map(pl => [common_2.EEntType.PLINE, pl]);
    }
    else {
        const ents_arr = [];
        for (const bbox of bboxs) {
            const bbox_ents = _visBBox(__model__, bbox);
            for (const bbox_ent of bbox_ents) {
                ents_arr.push(bbox_ent);
            }
        }
        return ents_arr;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzdWFsaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvbW9kdWxlcy9iYXNpYy92aXN1YWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBZ0Q7QUFFaEQsd0RBQTBDO0FBRzFDLGtEQUEwSDtBQUMxSCxrREFBbUU7QUFDbkUsMkVBQTBFO0FBQzFFLGlEQUE4RTtBQUM5RSx1REFBMEc7QUFDMUcsOENBQWdDO0FBQ2hDLCtDQUFpQztBQUNqQyxtR0FBbUc7QUFDbkcsSUFBWSxNQUlYO0FBSkQsV0FBWSxNQUFNO0lBQ2QseUJBQWlCLENBQUE7SUFDakIsdUJBQWUsQ0FBQTtJQUNmLHVCQUFlLENBQUE7QUFDbkIsQ0FBQyxFQUpXLE1BQU0sR0FBTixjQUFNLEtBQU4sY0FBTSxRQUlqQjtBQUNELElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQixtQ0FBeUIsQ0FBQTtJQUN6QixxQ0FBMkIsQ0FBQTtBQUMvQixDQUFDLEVBSFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFHbkI7QUFDRCxtR0FBbUc7QUFDbkc7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLFNBQWtCLEVBQUUsUUFBbUIsRUFBRSxLQUFhO0lBQ3hFLFFBQVEsR0FBRyxJQUFBLGtCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsSUFBSSxJQUFBLGlCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPO0tBQUU7SUFDckMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDO0lBQ2xDLElBQUksUUFBUSxHQUFrQixJQUFJLENBQUM7SUFDbkMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtZQUNuQixRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMs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LENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUQsYUFBYTtRQUNiLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5RCxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUQsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlELE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5RCxrQkFBa0I7UUFDbEIsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlELE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5RCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0QsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9ELFNBQVM7UUFDVCxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGlCQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFrQixDQUFDO0tBQzFIO1NBQU07UUFDSCxNQUFNLFFBQVEsR0FBa0IsRUFBRSxDQUFDO1FBQ25DLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLE1BQU0sU0FBUyxHQUFrQixRQUFRLENBQUMsU0FBUyxFQUFFLElBQWEsQ0FBQyxDQUFDO1lBQ3BFLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO2dCQUM5QixRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1NBQ0o7UUFDRCxPQUFPLFFBQVEsQ0FBQztLQUNuQjtBQUNMLENBQUMifQ==