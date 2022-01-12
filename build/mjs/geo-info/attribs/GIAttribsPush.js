import { EEntType, EAttribDataTypeStrs, EAttribPush } from '../common';
import * as mathjs from 'mathjs';
/**
 * Class for attributes.
 */
export class GIAttribsPush {
    modeldata;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNQdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0IsUUFBUSxFQUMvQixtQkFBbUIsRUFBNkIsV0FBVyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ25GLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBR2pDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFDZCxTQUFTLENBQWM7SUFDaEM7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLHlCQUF5QjtJQUN6QiwrRUFBK0U7SUFDL0U7O09BRUc7SUFDSSxjQUFjLENBQ2IsZUFBeUIsRUFBRSxrQkFBMEIsRUFBRSxxQkFBb0MsRUFBRSxjQUF3QixFQUNySCxNQUF1QixFQUFJLGtCQUEwQixFQUFFLHFCQUFvQyxFQUFFLE1BQW1CO1FBQ3BILEVBQUU7UUFDRixxREFBcUQ7UUFDckQsRUFBRTtRQUNGLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELDZDQUE2QztRQUM3QyxJQUFJLGVBQWUsS0FBSyxNQUFNLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDM0Msa0NBQWtDO1FBQ2xDLElBQUksQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO1lBQ2xGLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM5RTtRQUNELElBQUksZUFBZSxHQUFhLElBQUksQ0FBQztRQUNyQyxJQUFJLFdBQVcsR0FBVyxJQUFJLENBQUM7UUFDL0IsZ0NBQWdDO1FBQ2hDLElB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