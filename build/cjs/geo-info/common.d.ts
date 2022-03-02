import { GIAttribMapBase } from './attrib_classes/GIAttribMapBase';
export declare const LONGLAT: number[];
export declare const XYPLANE: TPlane;
export declare const YZPLANE: TPlane;
export declare const ZXPLANE: TPlane;
export declare const YXPLANE: TPlane;
export declare const ZYPLANE: TPlane;
export declare const XZPLANE: TPlane;
export declare type TEntTypeIdx = [EEntType, number];
export interface IEntSets {
    ps?: Set<number>;
    pt?: Set<number>;
    pl?: Set<number>;
    pg?: Set<number>;
    co?: Set<number>;
    obj_ps?: Set<number>;
    _v?: Set<number>;
    _t?: Set<number>;
    _e?: Set<number>;
    _w?: Set<number>;
}
export declare type TRay = [Txyz, Txyz];
export declare type TPlane = [Txyz, Txyz, Txyz];
export declare type TBBox = [Txyz, Txyz, Txyz, Txyz];
export declare type TQuery = string;
export declare type TId = string;
export declare type TColor = [number, number, number];
export declare type TNormal = [number, number, number];
export declare type TTexture = [number, number];
export declare enum EEntType {
    POSI = 0,
    VERT = 1,
    TRI = 2,
    EDGE = 3,
    WIRE = 4,
    POINT = 5,
    PLINE = 6,
    PGON = 7,
    COLL = 8,
    MOD = 9
}
export declare enum EEntTypeStr {
    'ps' = 0,
    '_v' = 1,
    '_t' = 2,
    '_e' = 3,
    '_w' = 4,
    'pt' = 5,
    'pl' = 6,
    'pg' = 7,
    'co' = 8,
    'mo' = 9
}
export declare enum EEntStrToGeomMaps {
    'up_posis_verts' = 0,
    'dn_verts_posis' = 1,
    'dn_tris_verts' = 2,
    'dn_edges_verts' = 3,
    'dn_wires_edges' = 4,
    'dn_points_verts' = 5,
    'dn_plines_wires' = 6,
    'dn_pgons_wires' = 7,
    'colls' = 8
}
/**
 * Attribute maps
 */
export interface IAttribsMaps {
    ps: Map<string, GIAttribMapBase>;
    _v: Map<string, GIAttribMapBase>;
    _e: Map<string, GIAttribMapBase>;
    _w: Map<string, GIAttribMapBase>;
    pt: Map<string, GIAttribMapBase>;
    pl: Map<string, GIAttribMapBase>;
    pg: Map<string, GIAttribMapBase>;
    co: Map<string, GIAttribMapBase>;
    mo: Map<string, any>;
}
export declare enum EAttribNames {
    COORDS = "xyz",
    NORMAL = "normal",
    COLOR = "rgb",
    TEXTURE = "uv",
    NAME = "name",
    MATERIAL = "material",
    VISIBILITY = "visibility",
    LABEL = "label",
    COLL_NAME = "name",
    TIMESTAMP = "_ts"
}
export declare enum EWireType {
    PLINE = "pline",
    PGON = "pgon",
    PGON_HOLE = "pgon_hole"
}
export declare enum EFilterOperatorTypes {
    IS_EQUAL = "==",
    IS_NOT_EQUAL = "!=",
    IS_GREATER_OR_EQUAL = ">=",
    IS_LESS_OR_EQUAL = "<=",
    IS_GREATER = ">",
    IS_LESS = "<",
    EQUAL = "="
}
export declare enum ESort {
    DESCENDING = "descending",
    ASCENDING = "ascending"
}
export declare enum EAttribPush {
    AVERAGE = 0,
    MEDIAN = 1,
    SUM = 2,
    MIN = 3,
    MAX = 4,
    FIRST = 5,
    LAST = 6
}
export declare enum EAttribDataTypeStrs {
    NUMBER = "number",
    STRING = "string",
    BOOLEAN = "boolean",
    LIST = "list",
    DICT = "dict"
}
export declare type Txy = [number, number];
export declare type Txyz = [number, number, number];
export declare type TPosi = number;
export declare type TTri = [number, number, number];
export declare type TVert = number;
export declare type TEdge = [number, number];
export declare type TWire = number[];
export declare type TPgonTri = number[];
export declare type TPoint = number;
export declare type TPline = number;
export declare type TPgon = number[];
export declare type TColl = [number, number[], number[], number[]];
export declare type TEntity = TTri | TVert | TEdge | TWire | TPoint | TPline | TPgon | TColl;
export declare type TAttribDataTypes = string | number | boolean | any[] | object;
export declare const RE_SPACES: RegExp;
/**
 * Geom arrays
 */
export interface IGeomMaps {
    dn_verts_posis: Map<number, TVert>;
    dn_tris_verts: Map<number, TTri>;
    dn_edges_verts: Map<number, TEdge>;
    dn_wires_edges: Map<number, TWire>;
    dn_points_verts: Map<number, TPoint>;
    dn_plines_wires: Map<number, TPline>;
    dn_pgons_tris: Map<number, TPgonTri>;
    dn_pgons_wires: Map<number, TPgon>;
    up_posis_verts: Map<number, number[]>;
    up_tris_pgons: Map<number, number>;
    up_verts_edges: Map<number, number[]>;
    up_verts_tris: Map<number, number[]>;
    up_edges_wires: Map<number, number>;
    up_verts_points: Map<number, number>;
    up_wires_plines: Map<number, number>;
    up_wires_pgons: Map<number, number>;
    colls: Set<number>;
}
export interface IGeomCopy {
    points: number[];
    plines: number[];
    pgons: number[];
    colls: number[];
}
export interface IAttribValues {
    number: [number[], Map<string, number>];
    string: [string[], Map<string, number>];
    list: [any[], Map<string, number>];
    dict: [object[], Map<string, number>];
}
export interface IMetaData {
    posi_count: number;
    vert_count: number;
    tri_count: number;
    edge_count: number;
    wire_count: number;
    point_count: number;
    pline_count: number;
    pgon_count: number;
    coll_count: number;
    attrib_values: IAttribValues;
}
export interface ISnapshotData {
    ps: Set<number>;
    pt: Set<number>;
    pl: Set<number>;
    pg: Set<number>;
    co: Set<number>;
    pt_co: Map<number, Set<number>>;
    pl_co: Map<number, Set<number>>;
    pg_co: Map<number, Set<number>>;
    co_pt: Map<number, Set<number>>;
    co_pl: Map<number, Set<number>>;
    co_pg: Map<number, Set<number>>;
    co_ch: Map<number, Set<number>>;
    co_pa: Map<number, number>;
}
export interface IRenumMaps {
    posis: Map<number, number>;
    verts: Map<number, number>;
    tris: Map<number, number>;
    edges: Map<number, number>;
    wires: Map<number, number>;
    points: Map<number, number>;
    plines: Map<number, number>;
    pgons: Map<number, number>;
    colls: Map<number, number>;
}
export interface IModelJSONData {
    type: string;
    version: string;
    geometry: IGeomJSONData;
    attributes: IAttribsJSONData;
}
export interface IGeomJSONData {
    num_posis: number;
    verts: TVert[];
    tris: TTri[];
    edges: TEdge[];
    wires: TWire[];
    points: TPoint[];
    plines: TPline[];
    pgons: TPgon[];
    pgontris: TPgonTri[];
    coll_pgons: number[][];
    coll_plines: number[][];
    coll_points: number[][];
    coll_childs: number[][];
    selected: Map<Number, TEntTypeIdx[]>;
}
export interface IAttribsJSONData {
    posis: IAttribJSONData[];
    verts: IAttribJSONData[];
    edges: IAttribJSONData[];
    wires: IAttribJSONData[];
    points: IAttribJSONData[];
    plines: IAttribJSONData[];
    pgons: IAttribJSONData[];
    colls: IAttribJSONData[];
    model: TModelAttribValuesArr;
}
export interface IAttribJSONData {
    name: string;
    data_type: EAttribDataTypeStrs;
    data: TEntAttribValuesArr;
}
export declare type TEntAttribValuesArr = Array<[TAttribDataTypes, number[]]>;
export declare type TModelAttribValuesArr = Array<[string, TAttribDataTypes]>;
export interface ISIMRenumMaps {
    posis: Map<number, number>;
    verts: Map<number, number>;
    edges: Map<number, number>;
    wires: Map<number, number>;
    points: Map<number, number>;
    plines: Map<number, number>;
    pgons: Map<number, number>;
    colls: Map<number, number>;
}
export interface IModelSIMData {
    type: string;
    version: string;
    geometry: IGeomSIMData;
    attributes: IAttribsSIMData;
}
export interface IGeomSIMData {
    num_posis: number;
    points: number[];
    plines: number[][];
    pgons: number[][][];
    coll_pgons: number[][];
    coll_plines: number[][];
    coll_points: number[][];
    coll_childs: number[][];
}
export interface IAttribsSIMData {
    posis: IAttribSIMData[];
    verts: IAttribSIMData[];
    edges: IAttribSIMData[];
    wires: IAttribSIMData[];
    points: IAttribSIMData[];
    plines: IAttribSIMData[];
    pgons: IAttribSIMData[];
    colls: IAttribSIMData[];
    model: TModelAttribValuesArr;
}
export interface IAttribSIMData {
    name: string;
    data_type: EAttribDataTypeStrs;
    data_vals: TAttribValuesArr;
    data_ents: TAttribEntsArr;
}
export declare type TAttribValuesArr = Array<TAttribDataTypes>;
export declare type TAttribEntsArr = Array<number[]>;
export interface IGeomData {
    num_posis: number;
    verts: TVert[];
    edges: TEdge[];
    wires: TWire[];
    points: TPoint[];
    plines: TPline[];
    pgons: TPgon[];
    coll_pgons: number[][];
    coll_plines: number[][];
    coll_points: number[][];
    coll_childs: number[][];
}
