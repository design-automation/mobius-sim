"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RE_SPACES = exports.EAttribDataTypeStrs = exports.EAttribPush = exports.ESort = exports.EFilterOperatorTypes = exports.EWireType = exports.EAttribNames = exports.EEntStrToGeomMaps = exports.EEntTypeStr = exports.EEntType = exports.XZPLANE = exports.ZYPLANE = exports.YXPLANE = exports.ZXPLANE = exports.YZPLANE = exports.XYPLANE = exports.LONGLAT = void 0;
// longitude latitude in Singapore, NUS
exports.LONGLAT = [103.778329, 1.298759];
// some constants
exports.XYPLANE = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
exports.YZPLANE = [[0, 0, 0], [0, 1, 0], [0, 0, 1]];
exports.ZXPLANE = [[0, 0, 0], [0, 0, 1], [1, 0, 0]];
exports.YXPLANE = [[0, 0, 0], [0, 1, 0], [1, 0, 0]];
exports.ZYPLANE = [[0, 0, 0], [0, 0, 1], [0, 1, 0]];
exports.XZPLANE = [[0, 0, 0], [1, 0, 0], [0, 0, 1]];
// Types of entities
var EEntType;
(function (EEntType) {
    EEntType[EEntType["POSI"] = 0] = "POSI";
    EEntType[EEntType["VERT"] = 1] = "VERT";
    EEntType[EEntType["TRI"] = 2] = "TRI";
    EEntType[EEntType["EDGE"] = 3] = "EDGE";
    EEntType[EEntType["WIRE"] = 4] = "WIRE";
    EEntType[EEntType["POINT"] = 5] = "POINT";
    EEntType[EEntType["PLINE"] = 6] = "PLINE";
    EEntType[EEntType["PGON"] = 7] = "PGON";
    EEntType[EEntType["COLL"] = 8] = "COLL";
    EEntType[EEntType["MOD"] = 9] = "MOD";
})(EEntType = exports.EEntType || (exports.EEntType = {}));
// Must match types of entities
var EEntTypeStr;
(function (EEntTypeStr) {
    EEntTypeStr[EEntTypeStr["ps"] = 0] = "ps";
    EEntTypeStr[EEntTypeStr["_v"] = 1] = "_v";
    EEntTypeStr[EEntTypeStr["_t"] = 2] = "_t";
    EEntTypeStr[EEntTypeStr["_e"] = 3] = "_e";
    EEntTypeStr[EEntTypeStr["_w"] = 4] = "_w";
    EEntTypeStr[EEntTypeStr["pt"] = 5] = "pt";
    EEntTypeStr[EEntTypeStr["pl"] = 6] = "pl";
    EEntTypeStr[EEntTypeStr["pg"] = 7] = "pg";
    EEntTypeStr[EEntTypeStr["co"] = 8] = "co";
    EEntTypeStr[EEntTypeStr["mo"] = 9] = "mo";
})(EEntTypeStr = exports.EEntTypeStr || (exports.EEntTypeStr = {}));
// Must match types of entities
// Must also match interface IGeomMaps
var EEntStrToGeomMaps;
(function (EEntStrToGeomMaps) {
    EEntStrToGeomMaps[EEntStrToGeomMaps["up_posis_verts"] = 0] = "up_posis_verts";
    EEntStrToGeomMaps[EEntStrToGeomMaps["dn_verts_posis"] = 1] = "dn_verts_posis";
    EEntStrToGeomMaps[EEntStrToGeomMaps["dn_tris_verts"] = 2] = "dn_tris_verts";
    EEntStrToGeomMaps[EEntStrToGeomMaps["dn_edges_verts"] = 3] = "dn_edges_verts";
    EEntStrToGeomMaps[EEntStrToGeomMaps["dn_wires_edges"] = 4] = "dn_wires_edges";
    EEntStrToGeomMaps[EEntStrToGeomMaps["dn_points_verts"] = 5] = "dn_points_verts";
    EEntStrToGeomMaps[EEntStrToGeomMaps["dn_plines_wires"] = 6] = "dn_plines_wires";
    EEntStrToGeomMaps[EEntStrToGeomMaps["dn_pgons_wires"] = 7] = "dn_pgons_wires";
    EEntStrToGeomMaps[EEntStrToGeomMaps["colls"] = 8] = "colls";
})(EEntStrToGeomMaps = exports.EEntStrToGeomMaps || (exports.EEntStrToGeomMaps = {}));
// Names of attributes
var EAttribNames;
(function (EAttribNames) {
    EAttribNames["COORDS"] = "xyz";
    EAttribNames["NORMAL"] = "normal";
    EAttribNames["COLOR"] = "rgb";
    EAttribNames["TEXTURE"] = "uv";
    EAttribNames["NAME"] = "name";
    EAttribNames["MATERIAL"] = "material";
    EAttribNames["VISIBILITY"] = "visibility";
    EAttribNames["LABEL"] = "label";
    EAttribNames["COLL_NAME"] = "name";
    EAttribNames["TIMESTAMP"] = "_ts";
})(EAttribNames = exports.EAttribNames || (exports.EAttribNames = {}));
// Wire Type
var EWireType;
(function (EWireType) {
    EWireType["PLINE"] = "pline";
    EWireType["PGON"] = "pgon";
    EWireType["PGON_HOLE"] = "pgon_hole";
})(EWireType = exports.EWireType || (exports.EWireType = {}));
// The types of operators that can be used in a filter.
var EFilterOperatorTypes;
(function (EFilterOperatorTypes) {
    EFilterOperatorTypes["IS_EQUAL"] = "==";
    EFilterOperatorTypes["IS_NOT_EQUAL"] = "!=";
    EFilterOperatorTypes["IS_GREATER_OR_EQUAL"] = ">=";
    EFilterOperatorTypes["IS_LESS_OR_EQUAL"] = "<=";
    EFilterOperatorTypes["IS_GREATER"] = ">";
    EFilterOperatorTypes["IS_LESS"] = "<";
    EFilterOperatorTypes["EQUAL"] = "=";
})(EFilterOperatorTypes = exports.EFilterOperatorTypes || (exports.EFilterOperatorTypes = {}));
var ESort;
(function (ESort) {
    ESort["DESCENDING"] = "descending";
    ESort["ASCENDING"] = "ascending";
})(ESort = exports.ESort || (exports.ESort = {}));
var EAttribPush;
(function (EAttribPush) {
    EAttribPush[EAttribPush["AVERAGE"] = 0] = "AVERAGE";
    EAttribPush[EAttribPush["MEDIAN"] = 1] = "MEDIAN";
    EAttribPush[EAttribPush["SUM"] = 2] = "SUM";
    EAttribPush[EAttribPush["MIN"] = 3] = "MIN";
    EAttribPush[EAttribPush["MAX"] = 4] = "MAX";
    EAttribPush[EAttribPush["FIRST"] = 5] = "FIRST";
    EAttribPush[EAttribPush["LAST"] = 6] = "LAST";
})(EAttribPush = exports.EAttribPush || (exports.EAttribPush = {}));
// enums
var EAttribDataTypeStrs;
(function (EAttribDataTypeStrs) {
    // INT = 'Int',
    EAttribDataTypeStrs["NUMBER"] = "number";
    EAttribDataTypeStrs["STRING"] = "string";
    EAttribDataTypeStrs["BOOLEAN"] = "boolean";
    EAttribDataTypeStrs["LIST"] = "list";
    EAttribDataTypeStrs["DICT"] = "dict"; // an object
})(EAttribDataTypeStrs = exports.EAttribDataTypeStrs || (exports.EAttribDataTypeStrs = {}));
exports.RE_SPACES = /\s+/g;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHVDQUF1QztBQUMxQixRQUFBLE9BQU8sR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUU5QyxpQkFBaUI7QUFDSixRQUFBLE9BQU8sR0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsUUFBQSxPQUFPLEdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELFFBQUEsT0FBTyxHQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVwRCxRQUFBLE9BQU8sR0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsUUFBQSxPQUFPLEdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMs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