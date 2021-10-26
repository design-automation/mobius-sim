/**
 * Geo-info model metadata class.
 */
export class GIMetaData {
    /**
     * Constructor
     */
    constructor() {
        this._data = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNZXRhRGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYnMvZ2VvLWluZm8vR0lNZXRhRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTs7R0FFRztBQUNILE1BQU0sT0FBTyxVQUFVO0lBbUJuQjs7T0FFRztJQUNIO1FBckJRLFVBQUssR0FBYztZQUN2QixnQkFBZ0I7WUFDaEIsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsQ0FBQztZQUNiLFNBQVMsRUFBRSxDQUFDO1lBQ1osVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsQ0FBQztZQUNiLFdBQVcsRUFBRSxDQUFDO1lBQ2QsV0FBVyxFQUFFLENBQUM7WUFDZCxVQUFVLEVBQUUsQ0FBQztZQUNiLFVBQVUsRUFBRSxDQUFDO1lBQ2IsYUFBYSxFQUFFO2dCQUNYLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxFQUFJLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksRUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUssMERBQTBEO2FBQ3pGO1NBQ0osQ0FBQztRQUtFLHVDQUF1QztJQUMzQyxDQUFDO0lBQ0QsTUFBTTtJQUNOLHdCQUF3QjtJQUN4QixNQUFNO0lBQ04sa0VBQWtFO0lBQ2xFLDZDQUE2QztJQUM3QyxtQ0FBbUM7SUFDbkMsbUNBQW1DO0lBQ25DLGlDQUFpQztJQUNqQyxpQ0FBaUM7SUFDakMsU0FBUztJQUNULG9DQUFvQztJQUNwQyxzRUFBc0U7SUFDdEUsOERBQThEO0lBQzlELGlDQUFpQztJQUNqQyxpRUFBaUU7SUFDakUsMkVBQTJFO0lBQzNFLG1FQUFtRTtJQUNuRSx3REFBd0Q7SUFDeEQsc0RBQXNEO0lBQ3RELGlH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LENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNNLE9BQU87UUFDVixNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7UUFDMUIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNNLFFBQVE7UUFDWCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNNLFFBQVE7UUFDWCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNNLFNBQVM7UUFDWixNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7UUFDNUIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNNLFNBQVM7UUFDWixNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7UUFDNUIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNNLFFBQVE7UUFDWCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNN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Q0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakUsVUFBVTtZQUNWLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsVUFBVTtZQUNWLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0NBa0JKIn0=