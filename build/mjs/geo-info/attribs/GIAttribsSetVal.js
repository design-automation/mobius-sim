import { EAttribDataTypeStrs, EEntTypeStr } from '../common';
import lodash from 'lodash';
/**
 * Class for attributes.
 */
export class GIAttribsSetVal {
    modeldata;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzU2V0VmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1NldFZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsbUJBQW1CLEVBQWdCLFdBQVcsRUFBZSxNQUFNLFdBQVcsQ0FBQztBQUduRixPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFFNUI7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUNoQixTQUFTLENBQWM7SUFDaEM7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLG1CQUFtQjtJQUNuQiwrRUFBK0U7SUFDL0U7Ozs7O09BS0c7SUFDSSxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsS0FBdUI7UUFDMUQsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ0ksd0JBQXdCLENBQUMsSUFBWSxFQUFFLEdBQVcsRUFBRSxLQUFVO1FBQ2pFLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sVUFBVSxHQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEcsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQUUsTUFBTSxJQUFJLEtBQUss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