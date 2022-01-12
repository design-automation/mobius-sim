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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzVGhyZWVqcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNUaHJlZWpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFxRztBQUNyRywwQ0FBNEM7QUFJNUM7O0dBRUc7QUFDSCxNQUFhLGdCQUFnQjtJQUUxQjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsVUFBVTtJQUNWLDBFQUEwRTtJQUMxRSxpQ0FBaUM7SUFDakMsK0VBQStFO0lBQy9FOzs7O09BSUc7SUFDSSxvQkFBb0IsQ0FBQyxJQUFZO1FBQ3BDLE1BQU0sYUFBYSxHQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqSCxFQUFFO1FBQ0YsTUFBTSxNQUFNLEdBQWUsRUFBRSxDQUFDO1FBQzlCLE1BQU0sUUFBUSxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEYsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsTUFBTSxTQUFTLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBRSxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBYSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pGLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsYUFBYTtRQUNi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