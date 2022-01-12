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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsdUNBQXVDO0FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUU5QyxpQkFBaUI7QUFDakIsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRSxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFakUsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRSxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxD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