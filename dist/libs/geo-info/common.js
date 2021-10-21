// longitude latitude in Singapore, NUS
export const LONGLAT = [103.778329, 1.298759];
// some constants
export const XYPLANE = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
export const YZPLANE = [[0, 0, 0], [0, 1, 0], [0, 0, 1]];
export const ZXPLANE = [[0, 0, 0], [0, 0, 1], [1, 0, 0]];
export const YXPLANE = [[0, 0, 0], [0, 1, 0], [1, 0, 0]];
export const ZYPLANE = [[0, 0, 0], [0, 0, 1], [0, 1, 0]];
export const XZPLANE = [[0, 0, 0], [1, 0, 0], [0, 0, 1]];
// Types of entities
export var EEntType;
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
})(EEntType || (EEntType = {}));
// Must match types of entities
export var EEntTypeStr;
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
})(EEntTypeStr || (EEntTypeStr = {}));
// Must match types of entities
// Must also match interface IGeomMaps
export var EEntStrToGeomMaps;
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
})(EEntStrToGeomMaps || (EEntStrToGeomMaps = {}));
// Names of attributes
export var EAttribNames;
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
})(EAttribNames || (EAttribNames = {}));
// Wire Type
export var EWireType;
(function (EWireType) {
    EWireType["PLINE"] = "pline";
    EWireType["PGON"] = "pgon";
    EWireType["PGON_HOLE"] = "pgon_hole";
})(EWireType || (EWireType = {}));
// The types of operators that can be used in a filter.
export var EFilterOperatorTypes;
(function (EFilterOperatorTypes) {
    EFilterOperatorTypes["IS_EQUAL"] = "==";
    EFilterOperatorTypes["IS_NOT_EQUAL"] = "!=";
    EFilterOperatorTypes["IS_GREATER_OR_EQUAL"] = ">=";
    EFilterOperatorTypes["IS_LESS_OR_EQUAL"] = "<=";
    EFilterOperatorTypes["IS_GREATER"] = ">";
    EFilterOperatorTypes["IS_LESS"] = "<";
    EFilterOperatorTypes["EQUAL"] = "=";
})(EFilterOperatorTypes || (EFilterOperatorTypes = {}));
export var ESort;
(function (ESort) {
    ESort["DESCENDING"] = "descending";
    ESort["ASCENDING"] = "ascending";
})(ESort || (ESort = {}));
export var EAttribPush;
(function (EAttribPush) {
    EAttribPush[EAttribPush["AVERAGE"] = 0] = "AVERAGE";
    EAttribPush[EAttribPush["MEDIAN"] = 1] = "MEDIAN";
    EAttribPush[EAttribPush["SUM"] = 2] = "SUM";
    EAttribPush[EAttribPush["MIN"] = 3] = "MIN";
    EAttribPush[EAttribPush["MAX"] = 4] = "MAX";
    EAttribPush[EAttribPush["FIRST"] = 5] = "FIRST";
    EAttribPush[EAttribPush["LAST"] = 6] = "LAST";
})(EAttribPush || (EAttribPush = {}));
// enums
export var EAttribDataTypeStrs;
(function (EAttribDataTypeStrs) {
    // INT = 'Int',
    EAttribDataTypeStrs["NUMBER"] = "number";
    EAttribDataTypeStrs["STRING"] = "string";
    EAttribDataTypeStrs["BOOLEAN"] = "boolean";
    EAttribDataTypeStrs["LIST"] = "list";
    EAttribDataTypeStrs["DICT"] = "dict"; // an object
})(EAttribDataTypeStrs || (EAttribDataTypeStrs = {}));
export const RE_SPACES = /\s+/g;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLHVDQUF1QztBQUN2QyxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFOUMsaUJBQWlCO0FBQ2pCLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRSxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFXLENBQUMsQ0FBQyxDQUFDLEVB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