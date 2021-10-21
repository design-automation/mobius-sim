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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNZXRhRGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL0dJTWV0YURhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7O0dBRUc7QUFDSCxNQUFNLE9BQU8sVUFBVTtJQW1CbkI7O09BRUc7SUFDSDtRQXJCUSxVQUFLLEdBQWM7WUFDdkIsZ0JBQWdCO1lBQ2hCLFVBQVUsRUFBRSxDQUFDO1lBQ2IsVUFBVSxFQUFFLENBQUM7WUFDYixTQUFTLEVBQUUsQ0FBQztZQUNaLFVBQVUsRUFBRSxDQUFDO1lBQ2IsVUFBVSxFQUFFLENBQUM7WUFDYixXQUFXLEVBQUUsQ0FBQztZQUNkLFdBQVcsRUFBRSxDQUFDO1lBQ2QsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsQ0FBQztZQUNiLGFBQWEsRUFBRTtnQkFDWCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksRUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUN2QixJQUFJLEVBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFLLDBEQUEwRDthQUN6RjtTQUNKLENBQUM7UUFLRSx1Q0FBdUM7SUFDM0MsQ0FBQztJQUNELE1BQU07SUFDTix3QkFBd0I7SUFDeEIsTUFBTTtJQUNOLGtFQUFrRTtJQUNsRSw2Q0FBNkM7SUFDN0MsbUNBQW1DO0lBQ25DLG1DQUFtQztJQUNuQyxpQ0FBaUM7SUFDakMsaUNBQWlDO0lBQ2pDLFNBQVM7SUFDVCxvQ0FBb0M7SUFDcEMsc0VBQXNFO0lBQ3RFLDhEQUE4RDtJQUM5RCxpQ0FBaUM7SUFDakMsaUVBQWlFO0lBQ2pFLDJFQUEyRTtJQUMzRSxtRUFBbUU7SUFDbkUsd0RBQXdEO0lBQ3hELHNEQUFzRDtJ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NUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTSxPQUFPO1FBQ1YsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO1FBQzFCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTSxRQUFRO1FBQ1gsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTSxRQUFRO1FBQ1gsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTSxTQUFTO1FBQ1osTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO1FBQzVCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTSxTQUFTO1FBQ1osTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO1FBQzVCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTSxRQUFRO1FBQ1gsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENB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QyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLFVBQVU7WUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELFVBQVU7WUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztDQWtCSiJ9