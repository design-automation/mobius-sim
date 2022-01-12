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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNQdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FDbUY7QUFDbkYsK0NBQWlDO0FBR2pDOztHQUVHO0FBQ0gsTUFBYSxhQUFhO0lBRXZCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNELCtFQUErRTtJQUMvRSx5QkFBeUI7SUFDekIsK0VBQStFO0lBQy9FOztPQUVHO0lBQ0ksY0FBYyxDQUNiLGVBQXlCLEVBQUUsa0JBQTBCLEVBQUUscUJBQW9DLEVBQUUsY0FBd0IsRUFDckgsTUFBdUIsRUFBSSxrQkFBMEIsRUFBRSxxQkFBb0MsRUFBRSxNQUFtQjtRQUNwSCxFQUFFO1FBQ0YscURBQXFEO1FBQ3JELEVBQUU7UUFDRixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCw2Q0FBNkM7UUFDN0MsSUFBSSxlQUFlLEtBQUssTUFBTSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQzNDLGtDQUFrQztRQUNsQyxJQUFJLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsRUFBRTtZQUNsRixNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7U0FDOUU7UUFDRCxJQUFJLGVBQWUsR0FBYSxJQUFJLENBQUM7UUFDckMsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDO1FBQy9CLGdDQUFnQztRQUNoQyxJQUFJLE1BQU0sS0FBSyxhQUFhLElBQUksTUFBTSxLQUFLLGVBQWUsRUFBRTtZQUN4RCxJQUFJLGVBQWUsS0FBSyxpQkFBUSxDQUFD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