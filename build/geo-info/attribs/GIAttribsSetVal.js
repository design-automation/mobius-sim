import { EAttribDataTypeStrs, EEntTypeStr } from '../common';
import lodash from 'lodash';
/**
 * Class for attributes.
 */
export class GIAttribsSetVal {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Model attributes
    // ============================================================================
    /**
     * Set a model attrib value
     * @param id
     * @param name
     * @param value
     */
    setModelAttribVal(name, value) {
        const ssid = this.modeldata.active_ssid;
        this.modeldata.attribs.attribs_maps.get(ssid).mo.set(name, value);
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setModelAttribListIdxVal(name, idx, value) {
        const ssid = this.modeldata.active_ssid;
        const list_value = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(name);
        if (list_value === undefined) {
            throw new Error('Attribute with this name does not exist.');
        }
        if (!Array.isArray(list_value)) {
            throw new Error('Attribute is not a list, so indexed values are not allowed.');
        }
        list_value[idx] = value;
    }
    /**
     * Set a model attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setModelAttribDictKeyVal(name, key, value) {
        const ssid = this.modeldata.active_ssid;
        const dict_value = this.modeldata.attribs.attribs_maps.get(ssid).mo.get(name);
        if (dict_value === undefined) {
            throw new Error('Attribute with this name does not exist.');
        }
        if (Array.isArray(dict_value) || typeof dict_value !== 'object') {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        dict_value[key] = value;
    }
    // ============================================================================
    // Entity attributes
    // ============================================================================
    /**
     * Set an entity attrib value
     * If the attribute does not exist, then it is created.
     * @param id
     * @param name
     * @param value
     */
    setCreateEntsAttribVal(ent_type, ents_i, name, value) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        // get the attrib
        let attrib = attribs.get(name);
        if (attrib === undefined) {
            const new_data_type = this._checkDataType(value);
            attrib = this.modeldata.attribs.add.addAttrib(ent_type, name, new_data_type);
        }
        // set the data
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            attrib.setEntVal(ent_i, value);
        }
    }
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntAttribVal(ent_type, ent_i, name, value) {
        const ssid = this.modeldata.active_ssid;
        const attrib = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ent_type]].get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist:' + name);
        }
        attrib.setEntVal(ent_i, value);
    }
    /**
     * Set an entity attrib value, for just one ent
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribVal(ent_type, ents_i, name, value) {
        const ssid = this.modeldata.active_ssid;
        const attrib = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ent_type]].get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist:' + name);
        }
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            attrib.setEntVal(ent_i, value);
        }
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribListIdxVal(ent_type, ents_i, name, idx, value) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (attrib.getDataType() !== EAttribDataTypeStrs.LIST) {
            throw new Error('Attribute is not a list, so indexed values are not allowed.');
        }
        // replace the data
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            const data = lodash.cloneDeep(attrib.getEntVal(ent_i)); // this will be a deep copy of the data
            data[idx] = value;
            attrib.setEntVal(ent_i, data);
        }
    }
    /**
     * Set an entity attrib indexed value.
     * If the attribute does not exist, it throws an error.
     * @param id
     * @param name
     * @param value
     */
    setEntsAttribDictKeyVal(ent_type, ents_i, name, key, value) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib = attribs.get(name);
        if (attrib === undefined) {
            throw new Error('Attribute does not exist.');
        }
        if (attrib.getDataType() !== EAttribDataTypeStrs.DICT) {
            throw new Error('Attribute is not a dictionary, so keyed values are not allowed.');
        }
        // replace the data
        ents_i = Array.isArray(ents_i) ? ents_i : [ents_i];
        for (const ent_i of ents_i) {
            const data = lodash.cloneDeep(attrib.getEntVal(ent_i)); // this will be a deep copy of the data
            data[key] = value;
            attrib.setEntVal(ent_i, data);
        }
    }
    // ============================================================================
    // Copy entity attributes
    // ============================================================================
    /**
     * Copy all attribs from one entity to another entity
     * @param ent_type
     * @param name
     */
    copyAttribs(ent_type, from_ent_i, to_ent_i) {
        const ssid = this.modeldata.active_ssid;
        // get the attrib names
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        const attrib_names = Array.from(attribs.keys());
        // copy each attrib
        for (const attrib_name of attrib_names) {
            if (attrib_name[0] === '_') {
                continue;
            } // skip attrib names that start with underscore
            const attrib = attribs.get(attrib_name);
            const attrib_value = attrib.getEntVal(from_ent_i); // deep copy
            attrib.setEntVal(to_ent_i, attrib_value);
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
        throw new Error('Data type for new attribute not recognised: ' + value);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzU2V0VmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1NldFZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsbUJBQW1CLEVBQWdCLFdBQVcsRUFBZSxNQUFNLFdBQVcsQ0FBQztBQUduRixPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFFNUI7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUV6Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsbUJBQW1CO0lBQ25CLCtFQUErRTtJQUMvRTs7Ozs7T0FLRztJQUNJLGlCQUFpQixDQUFDLElBQVksRUFBRSxLQUF1QjtRQUMxRCxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFDRDs7Ozs7O09BTUc7SUFDSSx3QkFBd0IsQ0FBQyxJQUFZLEVBQUUsR0FBVyxFQUFFLEtBQVU7UUFDakUsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxVQUFVLEdBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRyxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENB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