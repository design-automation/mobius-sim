"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsThreejs = void 0;
const common_1 = require("../common");
const maps_1 = require("../../util/maps");
/**
 * Class for attributes.
 */
class GIAttribsThreejs {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Threejs
    // For methods to get the array of edges and triangles, see the geom class
    // get3jsTris() and get3jsEdges()
    // ============================================================================
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the position.
     */
    get3jsSeqPosisCoords(ssid) {
        const coords_attrib = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS);
        //
        const coords = [];
        const posi_map = new Map();
        const posis_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.POSI);
        for (const posi_i of posis_i) {
            const tjs_index = coords.push(coords_attrib.getEntVal(posi_i)) - 1;
            posi_map.set(posi_i, tjs_index);
        }
        // @ts-ignore
        return [coords.flat(1), posi_map];
    }
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * Verts that have been deleted will not be included
     * @param verts An array of vertex indices pointing to the positio.
     */
    get3jsSeqVertsCoords(ssid) {
        const coords_attrib = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS);
        //
        const coords = [];
        const vertex_map = new Map();
        const verts_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.VERT);
        for (const vert_i of verts_i) {
            const posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
            const tjs_index = coords.push(coords_attrib.getEntVal(posi_i)) - 1;
            vertex_map.set(vert_i, tjs_index);
        }
        // @ts-ignore
        return [coords.flat(1), vertex_map];
    }
    /**
     * Get a flat array of normals values for all the vertices.
     * Verts that have been deleted will not be included
     */
    get3jsSeqVertsNormals(ssid) {
        if (!this.modeldata.attribs.attribs_maps.get(ssid)._v.has(common_1.EAttribNames.NORMAL)) {
            return null;
        }
        // create a sparse arrays of normals of all verts of polygons
        const verts_attrib = this.modeldata.attribs.attribs_maps.get(ssid)._v.get(common_1.EAttribNames.NORMAL);
        const normals = [];
        const pgons_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.PGON);
        for (const pgon_i of pgons_i) {
            let pgon_normal = null;
            for (const vert_i of this.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PGON, pgon_i)) {
                let normal = verts_attrib.getEntVal(vert_i);
                if (normal === undefined) {
                    pgon_normal = this.modeldata.geom.snapshot.getPgonNormal(ssid, pgon_i);
                    normal = pgon_normal;
                }
                normals[vert_i] = normal;
            }
        }
        // get all the normals
        const verts_normals = [];
        const verts_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.VERT);
        for (const vert_i of verts_i) {
            if (vert_i !== undefined) {
                let normal = normals[vert_i];
                normal = normal === undefined ? [0, 0, 0] : normal;
                verts_normals.push(normal);
            }
        }
        // @ts-ignore
        return verts_normals.flat(1);
    }
    /**
     * Get a flat array of colors values for all the vertices.
     */
    get3jsSeqVertsColors(ssid) {
        if (!this.modeldata.attribs.attribs_maps.get(ssid)._v.has(common_1.EAttribNames.COLOR)) {
            return null;
        }
        const verts_attrib = this.modeldata.attribs.attribs_maps.get(ssid)._v.get(common_1.EAttribNames.COLOR);
        // get all the colors
        const verts_colors = [];
        const verts_i = this.modeldata.geom.snapshot.getEnts(ssid, common_1.EEntType.VERT);
        for (const vert_i of verts_i) {
            if (vert_i !== undefined) {
                const value = verts_attrib.getEntVal(vert_i);
                const _value = value === undefined ? [1, 1, 1] : value;
                verts_colors.push(_value);
            }
        }
        // @ts-ignore
        return verts_colors.flat(1);
    }
    /**
     *
     */
    getModelAttribsForTable(ssid) {
        const attrib = this.modeldata.attribs.attribs_maps.get(ssid).mo;
        if (attrib === undefined) {
            return [];
        }
        const arr = [];
        attrib.forEach((value, key) => {
            // const _value = isString(value) ? `'${value}'` : value;
            const _value = JSON.stringify(value);
            const obj = { Name: key, Value: _value };
            arr.push(obj);
        });
        // console.log(arr);
        return arr;
    }
    /**
     *
     * @param ent_type
     */
    getAttribsForTable(ssid, ent_type) {
        // get the attribs map for this ent type
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // create a map of objects to store the data
        // const data_obj_map: Map< number, { '#': number, _id: string} > = new Map();
        const data_obj_map = new Map();
        // create the ID for each table row
        const ents_i = this.modeldata.geom.snapshot.getEnts(ssid, ent_type);
        // sessionStorage.setItem('attrib_table_ents', JSON.stringify(ents_i));
        let i = 0;
        for (const ent_i of ents_i) {
            // data_obj_map.set(ent_i, { '#': i, _id: `${attribs_maps_key}${ent_i}`} );
            data_obj_map.set(ent_i, { _id: `${attribs_maps_key}${ent_i}` });
            if (ent_type === common_1.EEntType.COLL) {
                const coll_parent = this.modeldata.geom.snapshot.getCollParent(ssid, ent_i);
                data_obj_map.get(ent_i)['_parent'] = coll_parent === undefined ? '' : 'co' + coll_parent;
            }
            i++;
        }
        // loop through all the attributes
        attribs.forEach((attrib, attrib_name) => {
            const data_size = attrib.getDataLength();
            if (attrib.numVals() === 0) {
                return;
            }
            for (const ent_i of ents_i) {
                if (attrib_name.substr(0, 1) === '_' && attrib_name !== '_parent') {
                    const attrib_value = attrib.getEntVal(ent_i);
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                }
                else {
                    const attrib_value = attrib.getEntVal(ent_i);
                    if (attrib_value && attrib_value.constructor === {}.constructor) {
                        data_obj_map.get(ent_i)[`${attrib_name}`] = JSON.stringify(attrib_value);
                    }
                    else if (data_size > 1) {
                        if (attrib_value === undefined) {
                            for (let idx = 0; idx < data_size; idx++) {
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = undefined;
                            }
                        }
                        else {
                            attrib_value.forEach((v, idx) => {
                                const _v = v;
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = _v;
                            });
                        }
                    }
                    else {
                        if (ent_type === common_1.EEntType.POSI && Array.isArray(attrib_value)) {
                            if (attrib_name === 'xyz') {
                                for (let index = 0; index < attrib_value.length; index++) {
                                    const _v = Array.isArray(attrib_value[index]) ?
                                        JSON.stringify(attrib_value[index]) : attrib_value[index];
                                    data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                                }
                                // if (attrib_value.length < 4) {
                                //     console.log(attrib_value)
                                //     for (let index = 0; index < attrib_value.length; index++) {
                                //         const _v = Array.isArray(attrib_value[index]) ?
                                //         JSON.stringify(attrib_value[index]) : attrib_value[index];
                                //         data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                                //     }
                            }
                            else {
                                data_obj_map.get(ent_i)[attrib_name] = JSON.stringify(attrib_value);
                            }
                        }
                        else if (Array.isArray(attrib_value)) {
                            const _attrib_value = (typeof attrib_value[0] === 'string') ? `'${attrib_value[0]}'` : attrib_value[0];
                            data_obj_map.get(ent_i)[`${attrib_name}[0]`] = _attrib_value;
                        }
                        else {
                            const _attrib_value = (typeof attrib_value === 'string') ? `'${attrib_value}'` : attrib_value;
                            data_obj_map.get(ent_i)[`${attrib_name}`] = _attrib_value;
                        }
                    }
                }
            }
        });
        return { data: Array.from(data_obj_map.values()), ents: ents_i };
    }
    /**
     * Gets the sub ents and attibs of an object or collection..
     * Returns an array of maps, each map is: attribname -> attrib_value
     * @param ent_type
     */
    getEntSubAttribsForTable(ssid, ent_type, ent_i, level) {
        const data = [];
        // const attribs_maps_key: string = EEntTypeStr[level];
        // const attribs: Map<string, GIAttribMapBase> = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // const data_headers: Map< string, TAttribDataTypes > = new Map();
        // attribs.forEach( (attrib, attrib_name) => data_headers.set(attrib_name, attrib.getDataType()) );
        // data.push(data_headers);
        data.push(this._addEntSubAttribs(ssid, ent_type, ent_i, level));
        switch (ent_type) {
            case common_1.EEntType.COLL:
                {
                    this.modeldata.geom.snapshot.getCollPgons(ssid, ent_i).forEach(pgon_i => data.push(this._addEntSubAttribs(ssid, common_1.EEntType.PGON, pgon_i, level)));
                    this.modeldata.geom.snapshot.getCollPlines(ssid, ent_i).forEach(pline_i => data.push(this._addEntSubAttribs(ssid, common_1.EEntType.PLINE, pline_i, level)));
                    this.modeldata.geom.snapshot.getCollPoints(ssid, ent_i).forEach(point_i => data.push(this._addEntSubAttribs(ssid, common_1.EEntType.POINT, point_i, level)));
                    this.modeldata.geom.snapshot.getCollChildren(ssid, ent_i).forEach(child_coll_i => data.push(this._addEntSubAttribs(ssid, common_1.EEntType.COLL, child_coll_i, level)));
                }
                return data;
            case common_1.EEntType.PGON:
                {
                    for (const wire_i of this.modeldata.geom.nav.navPgonToWire(ent_i)) {
                        this._addEntSubWire(ssid, wire_i, data, level);
                    }
                }
                return data;
            case common_1.EEntType.PLINE:
                {
                    const wire_i = this.modeldata.geom.nav.navPlineToWire(ent_i);
                    this._addEntSubWire(ssid, wire_i, data, level);
                }
                return data;
            case common_1.EEntType.POINT:
                {
                    const vert_i = this.modeldata.geom.nav.navPointToVert(ent_i);
                    data.push(this._addEntSubAttribs(ssid, common_1.EEntType.VERT, vert_i, level));
                    data.push(this._addEntSubAttribs(ssid, common_1.EEntType.POSI, this.modeldata.geom.nav.navVertToPosi(vert_i), level));
                }
                return data;
            default:
                break;
        }
    }
    _addEntSubWire(ssid, wire_i, data, level) {
        data.push(this._addEntSubAttribs(ssid, common_1.EEntType.WIRE, wire_i, level));
        const edges_i = this.modeldata.geom.nav.navWireToEdge(wire_i);
        for (const edge_i of edges_i) {
            const [vert0_i, vert1_i] = this.modeldata.geom.nav.navEdgeToVert(edge_i);
            const posi0_i = this.modeldata.geom.nav.navVertToPosi(vert0_i);
            data.push(this._addEntSubAttribs(ssid, common_1.EEntType.VERT, vert0_i, level));
            data.push(this._addEntSubAttribs(ssid, common_1.EEntType.POSI, posi0_i, level));
            data.push(this._addEntSubAttribs(ssid, common_1.EEntType.EDGE, edge_i, level));
            if (edge_i === edges_i[edges_i.length - 1]) {
                const posi1_i = this.modeldata.geom.nav.navVertToPosi(vert1_i);
                data.push(this._addEntSubAttribs(ssid, common_1.EEntType.VERT, vert1_i, level));
                data.push(this._addEntSubAttribs(ssid, common_1.EEntType.POSI, posi1_i, level));
            }
        }
    }
    _addEntSubAttribs(ssid, ent_type, ent_i, level) {
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const data_map = new Map();
        data_map.set('_id', `${attribs_maps_key}${ent_i}`);
        if (ent_type !== level) {
            return data_map;
        }
        // loop through all the attributes
        attribs.forEach((attrib, attrib_name) => {
            const data_size = attrib.getDataLength();
            if (attrib.numVals() === 0) {
                return;
            }
            const attrib_value = attrib.getEntVal(ent_i);
            if (attrib_value && attrib_value.constructor === {}.constructor) {
                data_map.set(`${attrib_name}`, JSON.stringify(attrib_value));
            }
            else if (data_size > 1) {
                if (attrib_value === undefined) {
                    for (let idx = 0; idx < data_size; idx++) {
                        data_map.set(`${attrib_name}[${idx}]`, undefined);
                    }
                }
                else {
                    attrib_value.forEach((v, idx) => {
                        const _v = v;
                        data_map.set(`${attrib_name}[${idx}]`, _v);
                    });
                }
            }
            else {
                if (ent_type === common_1.EEntType.POSI && Array.isArray(attrib_value)) {
                    if (attrib_name === 'xyz') {
                        for (let index = 0; index < attrib_value.length; index++) {
                            const _v = Array.isArray(attrib_value[index]) ?
                                JSON.stringify(attrib_value[index]) : attrib_value[index];
                            data_map.set(`${attrib_name}[${index}]`, _v);
                        }
                        // if (attrib_value.length < 4) {
                        //     console.log(attrib_value)
                        //     for (let index = 0; index < attrib_value.length; index++) {
                        //         const _v = Array.isArray(attrib_value[index]) ?
                        //         JSON.stringify(attrib_value[index]) : attrib_value[index];
                        //         data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                        //     }
                    }
                    else {
                        data_map.set(attrib_name, JSON.stringify(attrib_value));
                    }
                }
                else {
                    const _attrib_value = (typeof attrib_value === 'string') ? `'${attrib_value}'` : attrib_value;
                    data_map.set(`${attrib_name}`, _attrib_value);
                }
            }
        });
        return data_map;
    }
    /**
     * @param ent_type
     * @param ents_i
     */
    getEntsVals(ssid, selected_ents, ent_type) {
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const data_obj_map = new Map();
        if (!selected_ents || selected_ents === undefined) {
            return [];
        }
        let i = 0;
        const selected_ents_sorted = (0, maps_1.sortByKey)(selected_ents);
        selected_ents_sorted.forEach(ent => {
            data_obj_map.set(ent, { _id: `${attribs_maps_key}${ent}` });
            if (ent_type === common_1.EEntType.COLL) {
                const coll_parent = this.modeldata.geom.snapshot.getCollParent(ssid, ent);
                data_obj_map.get(ent)['_parent'] = coll_parent === undefined ? '' : coll_parent;
            }
            i++;
        });
        const nullAttribs = new Set();
        attribs.forEach((attrib, attrib_name) => {
            const data_size = attrib.getDataLength();
            if (attrib.numVals() === 0) {
                return;
            }
            nullAttribs.add(attrib_name);
            for (const ent_i of Array.from(selected_ents.values())) {
                if (attrib_name.substr(0, 1) === '_') {
                    const attrib_value = attrib.getEntVal(ent_i);
                    data_obj_map.get(ent_i)[`${attrib_name}`] = attrib_value;
                    nullAttribs.delete(attrib_name);
                }
                else {
                    const attrib_value = attrib.getEntVal(ent_i);
                    if (attrib_value !== undefined) {
                        nullAttribs.delete(attrib_name);
                    }
                    if (data_size > 1) {
                        if (attrib_value === undefined) {
                            for (let idx = 0; idx < data_size; idx++) {
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = undefined;
                            }
                        }
                        else if (attrib_value.constructor === {}.constructor) {
                            data_obj_map.get(ent_i)[`${attrib_name}`] = JSON.stringify(attrib_value);
                        }
                        else {
                            attrib_value.forEach((v, idx) => {
                                const _v = v;
                                data_obj_map.get(ent_i)[`${attrib_name}[${idx}]`] = _v;
                            });
                        }
                    }
                    else {
                        if (ent_type === common_1.EEntType.POSI && Array.isArray(attrib_value)) {
                            if (attrib_value.length < 4) {
                                for (let index = 0; index < attrib_value.length; index++) {
                                    const _v = Array.isArray(attrib_value[index]) ?
                                        JSON.stringify(attrib_value[index]) : attrib_value[index];
                                    data_obj_map.get(ent_i)[`${attrib_name}[${index}]`] = _v;
                                }
                            }
                            else {
                                data_obj_map.get(ent_i)[attrib_name] = JSON.stringify(attrib_value);
                            }
                        }
                        else {
                            const _attrib_value = (typeof attrib_value === 'string') ? `'${attrib_value}'` : attrib_value;
                            data_obj_map.get(ent_i)[`${attrib_name}`] = _attrib_value;
                        }
                    }
                }
            }
        });
        for (const attrib of nullAttribs) {
            data_obj_map.forEach((val, index) => {
                try {
                    // @ts-ignore
                    delete val[attrib];
                }
                catch (ex) { }
            });
        }
        return Array.from(data_obj_map.values());
    }
}
exports.GIAttribsThreejs = GIAttribsThreejs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzVGhyZWVqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzVGhyZWVqcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBcUc7QUFDckcsMENBQTRDO0FBSTVDOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFFMUI7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLFVBQVU7SUFDViwwRUFBMEU7SUFDMUUsaUNBQWlDO0lBQ2pDLCtFQUErRTtJQUMvRTs7OztPQUlHO0lBQ0ksb0JBQW9CLENBQUMsSUFBWTtRQUNwQyxNQUFNLGFBQWEsR0FBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHFCQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakgsRUFBRTtRQUNGLE1BQU0sTUFBTSxHQUFlLEVBQUUsQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoRCxNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxpQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBGLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzFCLE1BQU0sU0FBUyxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQWEsQ0FBRSxHQUFHLENBQUMsQ0FBQztZQUN6RixRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNuQztRQUNELGFBQWE7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