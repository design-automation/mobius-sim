import { EEntType, EAttribDataTypeStrs, EAttribPush } from '../common';
import * as mathjs from 'mathjs';
/**
 * Class for attributes.
 */
export class GIAttribsPush {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Push entity attributes
    // ============================================================================
    /**
     * Promotes attrib values up and down the hierarchy.
     */
    pushAttribVals(source_ent_type, source_attrib_name, source_attrib_idx_key, source_indices, target, target_attrib_name, target_attrib_idx_key, method) {
        //
        // TODO make sure only to push onto active ents TOFIX
        //
        const ssid = this.modeldata.active_ssid;
        // if source and target are same, then return
        if (source_ent_type === target) {
            return;
        }
        // check that the attribute exists
        if (!this.modeldata.attribs.query.hasEntAttrib(source_ent_type, source_attrib_name)) {
            throw new Error('Error pushing attributes: The attribute does not exist.');
        }
        let target_ent_type = null;
        let target_coll = null;
        // check if this is coll -> coll
        if (target === 'coll_parent' || target === 'coll_children') {
            if (source_ent_type !== EEntType.COLL) {
                throw new Error('Error pushing attributes between collections: The source and target must both be collections.');
            }
            target_coll = target;
            target_ent_type = EEntType.COLL;
        }
        else {
            target_ent_type = target;
        }
        // get the data type and data size of the existing attribute
        const source_data_type = this.modeldata.attribs.query.getAttribDataType(source_ent_type, source_attrib_name);
        const source_data_size = this.modeldata.attribs.query.getAttribDataLength(source_ent_type, source_attrib_name);
        // get the target data type and size
        let target_data_type = source_data_type;
        let target_data_size = source_data_size;
        if (target_attrib_idx_key !== null) {
            // so the target data type must be a list or a dict
            if (typeof target_attrib_idx_key === 'number') {
                target_data_type = EAttribDataTypeStrs.LIST;
            }
            else if (typeof target_attrib_idx_key === 'string') {
                target_data_type = EAttribDataTypeStrs.DICT;
            }
            else {
                throw new Error('The target attribute index or key is not valid: "' + target_attrib_idx_key + '".');
            }
        }
        else if (source_attrib_idx_key !== null) {
            // get the first data item as a template to check data type and data size
            const first_val = this.modeldata.attribs.get.getEntAttribValOrItem(source_ent_type, source_indices[0], source_attrib_name, source_attrib_idx_key);
            target_data_type = this._checkDataType(first_val);
            if (target_data_type === EAttribDataTypeStrs.LIST) {
                const first_val_arr = first_val;
                target_data_size = first_val_arr.length;
                for (const val of first_val_arr) {
                    if (typeof val !== 'number') {
                        throw new Error('The attribute value being pushed is a list but the values in the list are not numbers.');
                    }
                }
            }
            else if (target_data_type === EAttribDataTypeStrs.NUMBER) {
                target_data_size = 0;
            }
            else {
                throw new Error('The attribute value being pushed is neither a number nor a list of numbers.');
            }
        }
        // move attributes from entities up to the model, or form model down to entities
        if (target_ent_type === EEntType.MOD) {
            this.modeldata.attribs.add.addAttrib(target_ent_type, target_attrib_name, target_data_type);
            const attrib_values = [];
            for (const index of source_indices) {
                const value = this.modeldata.attribs.get.getEntAttribValOrItem(source_ent_type, index, source_attrib_name, source_attrib_idx_key);
                attrib_values.push(value);
            }
            const agg_value = this._aggregateVals(attrib_values, target_data_size, method);
            if (typeof target_attrib_idx_key === 'number') {
                this.modeldata.attribs.set.setModelAttribListIdxVal(target_attrib_name, target_attrib_idx_key, agg_value);
            }
            else if (typeof target_attrib_idx_key === 'string') {
                this.modeldata.attribs.set.setModelAttribDictKeyVal(target_attrib_name, target_attrib_idx_key, agg_value);
            }
            else {
                this.modeldata.attribs.set.setModelAttribVal(target_attrib_name, agg_value);
            }
            return;
        }
        else if (source_ent_type === EEntType.MOD) {
            const value = this.modeldata.attribs.get.getModelAttribValOrItem(source_attrib_name, source_attrib_idx_key);
            this.modeldata.attribs.add.addAttrib(target_ent_type, target_attrib_name, target_data_type);
            const target_ents_i = this.modeldata.geom.snapshot.getEnts(ssid, target_ent_type);
            for (const target_ent_i of target_ents_i) {
                if (typeof target_attrib_idx_key === 'number') {
                    this.modeldata.attribs.set.setEntsAttribListIdxVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
                }
                else if (typeof target_attrib_idx_key === 'string') {
                    this.modeldata.attribs.set.setEntsAttribDictKeyVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
                }
                else {
                    this.modeldata.attribs.set.setCreateEntsAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
                }
            }
            return;
        }
        // get all the values for each target
        const attrib_values_map = new Map();
        for (const index of source_indices) {
            const attrib_value = this.modeldata.attribs.get.getEntAttribValOrItem(source_ent_type, index, source_attrib_name, source_attrib_idx_key);
            let target_ents_i = null;
            if (target_coll === 'coll_parent') {
                const parent = this.modeldata.geom.nav.navCollToCollParent(index);
                target_ents_i = (parent === undefined) ? [] : [parent];
            }
            else if (target_coll === 'coll_children') {
                target_ents_i = this.modeldata.geom.nav.navCollToCollChildren(index);
            }
            else {
                target_ent_type = target_ent_type;
                target_ents_i = this.modeldata.geom.nav.navAnyToAny(source_ent_type, target_ent_type, index);
            }
            for (const target_ent_i of target_ents_i) {
                if (!attrib_values_map.has(target_ent_i)) {
                    attrib_values_map.set(target_ent_i, []);
                }
                attrib_values_map.get(target_ent_i).push(attrib_value);
            }
        }
        // create the new target attribute if it does not already exist
        if (target_coll !== null) {
            target_ent_type = target_ent_type;
            this.modeldata.attribs.add.addAttrib(target_ent_type, target_attrib_name, target_data_type);
        }
        // calculate the new value and set the attribute
        attrib_values_map.forEach((attrib_values, target_ent_i) => {
            let value = attrib_values[0];
            if (attrib_values.length > 1) {
                value = this._aggregateVals(attrib_values, target_data_size, method);
            }
            if (typeof target_attrib_idx_key === 'number') {
                this.modeldata.attribs.set.setEntsAttribListIdxVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
            }
            else if (typeof target_attrib_idx_key === 'string') {
                this.modeldata.attribs.set.setEntsAttribDictKeyVal(target_ent_type, target_ent_i, target_attrib_name, target_attrib_idx_key, value);
            }
            else {
                this.modeldata.attribs.set.setCreateEntsAttribVal(target_ent_type, target_ent_i, target_attrib_name, value);
            }
        });
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    // TODO for mathjs operations, check the values are numbers...
    _aggregateVals(values, data_size, method) {
        switch (method) {
            case EAttribPush.AVERAGE:
                if (data_size > 1) {
                    const result = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.mean(values.map(vec => vec[i]));
                    }
                    return result;
                }
                else {
                    return mathjs.mean(values);
                }
            case EAttribPush.MEDIAN:
                if (data_size > 1) {
                    const result = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.median(values.map(vec => vec[i]));
                    }
                    return result;
                }
                else {
                    return mathjs.median(values);
                }
            case EAttribPush.SUM:
                if (data_size > 1) {
                    const result = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.sum(values.map(vec => vec[i]));
                    }
                    return result;
                }
                else {
                    return mathjs.sum(values);
                }
            case EAttribPush.MIN:
                if (data_size > 1) {
                    const result = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.min(values.map(vec => vec[i]));
                    }
                    return result;
                }
                else {
                    return mathjs.min(values);
                }
            case EAttribPush.MAX:
                if (data_size > 1) {
                    const result = [];
                    for (let i = 0; i < data_size; i++) {
                        result[i] = mathjs.max(values.map(vec => vec[i]));
                    }
                    return result;
                }
                else {
                    return mathjs.max(values);
                }
            case EAttribPush.LAST:
                return values[values.length - 1];
            default:
                return values[0]; // EAttribPush.FIRST
        }
    }
    /**
     * Utility method to check the data type of an attribute.
     * @param value
     */
    _checkDataType(value) {
        if (typeof value === 'string') {
            return EAttribDataTypeStrs.STRING;
        }
        else if (typeof value === 'number') {
            return EAttribDataTypeStrs.NUMBER;
        }
        else if (typeof value === 'boolean') {
            return EAttribDataTypeStrs.BOOLEAN;
        }
        else if (Array.isArray(value)) {
            return EAttribDataTypeStrs.LIST;
        }
        else if (typeof value === 'object') {
            return EAttribDataTypeStrs.DICT;
        }
        throw new Error('Data type for new attribute not recognised.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzUHVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQW9CLFFBQVEsRUFDL0IsbUJBQW1CLEVBQTZCLFdBQVcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNuRixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUdqQzs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFhO0lBRXZCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNELCtFQUErRTtJQUMvRSx5QkFBeUI7SUFDekIsK0VBQStFO0lBQy9FOztPQUVHO0lBQ0ksY0FBYyxDQUNiLGVBQXlCLEVBQUUsa0JBQTBCLEVBQUUscUJBQW9DLEVBQUUsY0FBd0IsRUFDckgsTUFBdUIsRUFBSSxrQkFBMEIsRUFBRSxxQkFBb0MsRUFBRSxNQUFtQjtRQUNwSCxFQUFFO1FBQ0YscURBQXFEO1FBQ3JELEVBQUU7UUFDRixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCw2Q0FBNkM7UUFDN0MsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQzNDLGtDQUFrQztRQUNsQyxJQUFJLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsRUFBRTtZQUNsRixNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7U0FDOUU7UUFDRCxJQUFJLGVBQWUsR0FBYSxJQUFJLENBQUM7UUFDckMsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDO1FBQy9CLGdDQUFnQztRQUNoQyxJQUFJLE1BQU0sS0FB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