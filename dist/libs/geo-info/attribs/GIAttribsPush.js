"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsPush = void 0;
const common_1 = require("../common");
const mathjs = __importStar(require("mathjs"));
/**
 * Class for attributes.
 */
class GIAttribsPush {
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
            if (source_ent_type !== common_1.EEntType.COLL) {
                throw new Error('Error pushing attributes between collections: The source and target must both be collections.');
            }
            target_coll = target;
            target_ent_type = common_1.EEntType.COLL;
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
                target_data_type = common_1.EAttribDataTypeStrs.LIST;
            }
            else if (typeof target_attrib_idx_key === 'string') {
                target_data_type = common_1.EAttribDataTypeStrs.DICT;
            }
            else {
                throw new Error('The target attribute index or key is not valid: "' + target_attrib_idx_key + '".');
            }
        }
        else if (source_attrib_idx_key !== null) {
            // get the first data item as a template to check data type and data size
            const first_val = this.modeldata.attribs.get.getEntAttribValOrItem(source_ent_type, source_indices[0], source_attrib_name, source_attrib_idx_key);
            target_data_type = this._checkDataType(first_val);
            if (target_data_type === common_1.EAttribDataTypeStrs.LIST) {
                const first_val_arr = first_val;
                target_data_size = first_val_arr.length;
                for (const val of first_val_arr) {
                    if (typeof val !== 'number') {
                        throw new Error('The attribute value being pushed is a list but the values in the list are not numbers.');
                    }
                }
            }
            else if (target_data_type === common_1.EAttribDataTypeStrs.NUMBER) {
                target_data_size = 0;
            }
            else {
                throw new Error('The attribute value being pushed is neither a number nor a list of numbers.');
            }
        }
        // move attributes from entities up to the model, or form model down to entities
        if (target_ent_type === common_1.EEntType.MOD) {
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
        else if (source_ent_type === common_1.EEntType.MOD) {
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
            case common_1.EAttribPush.AVERAGE:
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
            case common_1.EAttribPush.MEDIAN:
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
            case common_1.EAttribPush.SUM:
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
            case common_1.EAttribPush.MIN:
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
            case common_1.EAttribPush.MAX:
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
            case common_1.EAttribPush.LAST:
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
            return common_1.EAttribDataTypeStrs.STRING;
        }
        else if (typeof value === 'number') {
            return common_1.EAttribDataTypeStrs.NUMBER;
        }
        else if (typeof value === 'boolean') {
            return common_1.EAttribDataTypeStrs.BOOLEAN;
        }
        else if (Array.isArray(value)) {
            return common_1.EAttribDataTypeStrs.LIST;
        }
        else if (typeof value === 'object') {
            return common_1.EAttribDataTypeStrs.DICT;
        }
        throw new Error('Data type for new attribute not recognised.');
    }
}
exports.GIAttribsPush = GIAttribsPush;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzUHVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQ21GO0FBQ25GLCtDQUFpQztBQUdqQzs7R0FFRztBQUNILE1BQWEsYUFBYTtJQUV2Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UseUJBQXlCO0lBQ3pCLCtFQUErRTtJQUMvRTs7T0FFRztJQUNJLGNBQWMsQ0FDYixlQUF5QixFQUFFLGtCQUEwQixFQUFFLHFCQUFvQyxFQUFFLGNBQXdCLEVBQ3JILE1BQXVCLEVBQUksa0JBQTBCLEVBQUUscUJBQW9DLEVBQUUsTUFBbUI7UUFDcEgsRUFBRTtRQUNGLHFEQUFxRDtRQUNyRCxFQUFFO1FBQ0YsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsNkNBQTZDO1FBQzdDLElBQUksZUFBZSxLQUFLLE1BQU0sRUFBRTtZQUFFLE9BQU87U0FBRTtRQUMzQyxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLGtCQUFrQixDQUFDLEVBQUU7WUFDbEYsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsSUFBSSxlQUFlLEdBQWEsSUFBSSxDQUFDO1FBQ3JDLElBQUksV0FBVyxHQUFXLElBQUksQ0FBQztRQUMvQixnQ0FBZ0M7UUFDaEMsSUFBSSxNQUFNLEtBQUssYUFBYSxJQUFJLE1BQU0sS0FBSyxlQUFlLEVBQUU7WUFDeEQsSUFBSSxlQUFlLEtBQUssaUJBQVEs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