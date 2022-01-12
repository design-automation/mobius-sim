/**
 * Geo-info model metadata class.
 */
export class GIMetaData {
    _data = {
        // timestamp: 0,
        posi_count: 0,
        vert_count: 0,
        tri_count: 0,
        edge_count: 0,
        wire_count: 0,
        point_count: 0,
        pline_count: 0,
        pgon_count: 0,
        coll_count: 0,
        attrib_values: {
            number: [[], new Map()],
            string: [[], new Map()],
            list: [[], new Map()],
            dict: [[], new Map()] // an array of dicts, and a map: string key -> array index
        }
    };
    /**
     * Constructor
     */
    constructor() {
        // console.log('CREATING META OBJECT');
    }
    // /**
    //  * Get the meta data.
    //  */
    // public getJSONData(model_data: IModelJSONData): IMetaJSONData {
    //     const data_filtered: IAttribValues = {
    //         number: [[], new Map()],
    //         string: [[], new Map()],
    //         list: [[], new Map()],
    //         dict: [[], new Map()],
    //     };
    //     // filter the metadata values
    //     // we only want the values that are actually used in this model
    //     for (const key of Object.keys(model_data.attributes)) {
    //         if (key !== 'model') {
    //             for (const attrib of model_data.attributes[key]) {
    //                 const data_type: EAttribDataTypeStrs = attrib.data_type;
    //                 if (data_type !== EAttribDataTypeStrs.BOOLEAN) {
    //                     for (const item of attrib.data) {
    //                         const attrib_idx = item[0];
    //                         const attrib_val = this._data.attrib_values[data_type][0][attrib_idx];
    //                         const attrib_key = (data_type === 'number' || data_type === 'string') ? attrib_val : JSON.stringify(attrib_val);
    //                         let new_attrib_idx: number;
    //                         if (attrib_key in data_filtered[data_type][1]) {
    //                             new_attrib_idx = data_filtered[data_type][1].get(attrib_key);
    //                         } else {
    //                             new_attrib_idx = data_filtered[data_type][0].push(attrib_val) - 1;
    //                             data_filtered[data_type][1].set(attrib_key, new_attrib_idx);
    //                         }
    //                         item[0] = new_attrib_idx;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     const data: IMetaJSONData = {
    //         // timestamp: this._data.timestamp,
    //         posi_count: this._data.posi_count,
    //         vert_count: this._data.vert_count,
    //         tri_count: this._data.tri_count,
    //         edge_count: this._data.edge_count,
    //         wire_count: this._data.wire_count,
    //         face_count: this._data.face_count,
    //         point_count: this._data.point_count,
    //         pline_count: this._data.pline_count,
    //         pgon_count: this._data.pgon_count,
    //         coll_count: this._data.coll_count,
    //         attrib_values: {
    //             number_vals: data_filtered.number[0],
    //             string_vals: data_filtered.string[0],
    //             list_vals: data_filtered.list[0],
    //             dict_vals: data_filtered.dict[0]
    //         }
    //     };
    //     return data;
    // }
    // /**
    //  * Merge that data into this meta data.
    //  * The entity counts will be updated.
    //  * The attribute values will be added, if they do not already exist.
    //  * The attribute indexes in model data will also be renumbered.
    //  * @param data
    //  */
    // public  mergeJSONData(data: IModelJSON): void {
    //     const meta_data: IMetaJSONData = data.meta_data;
    //     const model_data: IModelJSONData = data.model_data;
    //     // update the attribute values in this meta
    //     // create the renumbering maps
    //     const attrib_vals: IAttribJSONValues = meta_data.attrib_values;
    //     const renum_num_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.number_vals.length; other_idx++) {
    //         const other_key: number = attrib_vals.number_vals[other_idx];
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.NUMBER)) {
    //             renum_num_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.NUMBER));
    //         } else {
    //             const other_val: number = attrib_vals.number_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.NUMBER);
    //             renum_num_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     const renum_str_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.string_vals.length; other_idx++) {
    //         const other_key: string = attrib_vals.string_vals[other_idx];
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.STRING)) {
    //             renum_str_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.STRING));
    //         } else {
    //             const other_val: string = attrib_vals.string_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.STRING);
    //             renum_str_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     const renum_list_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.list_vals.length; other_idx++) {
    //         const other_key: string = JSON.stringify(attrib_vals.list_vals[other_idx]);
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.LIST)) {
    //             renum_list_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.LIST));
    //         } else {
    //             const other_val: any[] = attrib_vals.list_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.LIST);
    //             renum_list_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     const renum_dict_attrib_vals: Map<number, number>  = new Map();
    //     for (let other_idx = 0; other_idx < attrib_vals.dict_vals.length; other_idx++) {
    //         const other_key: string = JSON.stringify(attrib_vals.dict_vals[other_idx]);
    //         if (this.hasKey(other_key, EAttribDataTypeStrs.DICT)) {
    //             renum_dict_attrib_vals.set(other_idx, this.getIdxFromKey(other_key, EAttribDataTypeStrs.DICT));
    //         } else {
    //             const other_val: object = attrib_vals.dict_vals[other_idx];
    //             const new_idx: number = this.addByKeyVal(other_key, other_val, EAttribDataTypeStrs.DICT);
    //             renum_dict_attrib_vals.set(other_idx, new_idx);
    //         }
    //     }
    //     // apply the renumbering of attribute indexes in the model data
    //     const renum_attrib_vals: Map<string, Map<number, number>> = new Map();
    //     renum_attrib_vals.set(EAttribDataTypeStrs.NUMBER, renum_num_attrib_vals);
    //     renum_attrib_vals.set(EAttribDataTypeStrs.STRING, renum_str_attrib_vals);
    //     renum_attrib_vals.set(EAttribDataTypeStrs.LIST, renum_list_attrib_vals);
    //     renum_attrib_vals.set(EAttribDataTypeStrs.DICT, renum_dict_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.posis, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.verts, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.edges, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.wires, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.faces, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.points, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.plines, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.pgons, renum_attrib_vals);
    //     this._renumAttribValues(model_data.attributes.colls, renum_attrib_vals);
    //     // no need to return the model data
    // }
    //
    getEntCounts() {
        return [
            this._data.posi_count,
            this._data.point_count,
            this._data.pline_count,
            this._data.pgon_count,
            this._data.coll_count
        ];
    }
    // get next index
    nextPosi() {
        const index = this._data.posi_count;
        this._data.posi_count += 1;
        return index;
    }
    nextVert() {
        const index = this._data.vert_count;
        this._data.vert_count += 1;
        return index;
    }
    nextTri() {
        const index = this._data.tri_count;
        this._data.tri_count += 1;
        return index;
    }
    nextEdge() {
        const index = this._data.edge_count;
        this._data.edge_count += 1;
        return index;
    }
    nextWire() {
        const index = this._data.wire_count;
        this._data.wire_count += 1;
        return index;
    }
    nextPoint() {
        const index = this._data.point_count;
        this._data.point_count += 1;
        return index;
    }
    nextPline() {
        const index = this._data.pline_count;
        this._data.pline_count += 1;
        return index;
    }
    nextPgon() {
        const index = this._data.pgon_count;
        this._data.pgon_count += 1;
        return index;
    }
    nextColl() {
        const index = this._data.coll_count;
        this._data.coll_count += 1;
        return index;
    }
    // set next index
    setNextPosi(index) {
        this._data.posi_count = index;
    }
    setNextVert(index) {
        this._data.vert_count = index;
    }
    setNextTri(index) {
        this._data.tri_count = index;
    }
    setNextEdge(index) {
        this._data.edge_count = index;
    }
    setNextWire(index) {
        this._data.wire_count = index;
    }
    setNextPoint(index) {
        this._data.point_count = index;
    }
    setNextPline(index) {
        this._data.pline_count = index;
    }
    setNextPgon(index) {
        this._data.pgon_count = index;
    }
    setNextColl(index) {
        this._data.coll_count = index;
    }
    // attribute values
    addByKeyVal(key, val, data_type) {
        if (this._data.attrib_values[data_type][1].has(key)) {
            return this._data.attrib_values[data_type][1].get(key);
        }
        const index = this._data.attrib_values[data_type][0].push(val) - 1;
        this._data.attrib_values[data_type][1].set(key, index);
        return index;
    }
    getValFromIdx(index, data_type) {
        // TODO this is doing deep copy
        // This may not be a good idea
        const val = this._data.attrib_values[data_type][0][index];
        return val;
        // if (data_type === EAttribDataTypeStrs.LIST) {
        //     return (val as any[]).slice();
        // } else if (data_type === EAttribDataTypeStrs.DICT) {
        //     return lodash.deepCopy(val as object);
        // }
        // return val;
    }
    getIdxFromKey(key, data_type) {
        return this._data.attrib_values[data_type][1].get(key);
    }
    hasKey(key, data_type) {
        return this._data.attrib_values[data_type][1].has(key);
    }
    // create string for debugging
    toDebugStr() {
        return '' +
            'posi_count = ' + this._data.posi_count + '\n' +
            'vert_count = ' + this._data.vert_count + '\n' +
            'tri_count = ' + this._data.tri_count + '\n' +
            'edge_count = ' + this._data.edge_count + '\n' +
            'wire_count = ' + this._data.wire_count + '\n' +
            'point_count = ' + this._data.point_count + '\n' +
            'pline_count = ' + this._data.pline_count + '\n' +
            'pgon_count = ' + this._data.pgon_count + '\n' +
            'coll_count = ' + this._data.coll_count + '\n' +
            'number: ' +
            JSON.stringify(this._data.attrib_values['number'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['number'][1])) +
            '\nstring: ' +
            JSON.stringify(this._data.attrib_values['string'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['string'][1])) +
            '\nlist: ' +
            JSON.stringify(this._data.attrib_values['list'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['list'][1])) +
            '\ndict: ' +
            JSON.stringify(this._data.attrib_values['dict'][0]) +
            JSON.stringify(Array.from(this._data.attrib_values['dict'][1]));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNZXRhRGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vR0lNZXRhRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7R0FFRztBQUNILE1BQU0sT0FBTyxVQUFVO0lBQ1gsS0FBSyxHQUFjO1FBQ3ZCLGdCQUFnQjtRQUNoQixVQUFVLEVBQUUsQ0FBQztRQUNiLFVBQVUsRUFBRSxDQUFDO1FBQ2IsU0FBUyxFQUFFLENBQUM7UUFDWixVQUFVLEVBQUUsQ0FBQztRQUNiLFVBQVUsRUFBRSxDQUFDO1FBQ2IsV0FBVyxFQUFFLENBQUM7UUFDZCxXQUFXLEVBQUUsQ0FBQztRQUNkLFVBQVUsRUFBRSxDQUFDO1FBQ2IsVUFBVSxFQUFFLENBQUM7UUFDYixhQUFhLEVBQUU7WUFDWCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUN2QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLEVBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLEVBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFLLDBEQUEwRDtTQUN6RjtLQUNKLENBQUM7SUFDRjs7T0FFRztJQUNIO1FBQ0ksdUNBQXVDO0lBQzNDLENBQUM7SUFDRCxNQUFNO0lBQ04sd0JBQXdCO0lBQ3hCLE1BQU07SUFDTixrRUFBa0U7SUFDbEUsNkNBQTZDO0lBQzdDLG1DQUFtQztJQUNuQyxtQ0FBbUM7SUFDbkMsaUNBQWlDO0lBQ2pDLGlDQUFpQztJQUNqQyxTQUFTO0lBQ1Qsb0NBQW9DO0lBQ3BDLHNFQUFzRTtJQUN0RSw4REFBOEQ7SUFDOUQsaUNBQWlDO0lBQ2pDLGlFQUFpRTtJQUNqRSwyRUFBMkU7SUFDM0UsbUVBQW1FO0lBQ25FLHdEQUF3RDtJQUN4RCxzREFBc0Q7SUFDdEQsaUdBQWlH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QyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ00sT0FBTztRQUNWLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztRQUMxQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ00sUUFBUTtRQUNYLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ00sUUFBUTtRQUNYLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ00sU0FBUztRQUNaLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQztRQUM1QixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ00sU0FBUztRQUNaLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQztRQUM1QixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ00sUUFBUTtRQUNYLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ00sUUFB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