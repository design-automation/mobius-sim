import { EEntType, EEntTypeStr } from '../common';
import * as lodash from 'lodash';
/**
 * Class for mering attributes.
 */
export class GIAttribsMerge {
    /**
      * Creates an object...
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    merge(ssid, exist_ssid) {
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.POSI);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.VERT);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.EDGE);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.WIRE);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.POINT);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.PLINE);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.PGON);
        this._mergeEntAttribs(ssid, exist_ssid, EEntType.COLL);
        this._mergeModelAttribs(ssid, exist_ssid);
    }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    add(ssid, exist_ssid) {
        this._addEntAttribs(ssid, exist_ssid, EEntType.POSI);
        this._addEntAttribs(ssid, exist_ssid, EEntType.VERT);
        this._addEntAttribs(ssid, exist_ssid, EEntType.EDGE);
        this._addEntAttribs(ssid, exist_ssid, EEntType.WIRE);
        this._addEntAttribs(ssid, exist_ssid, EEntType.POINT);
        this._addEntAttribs(ssid, exist_ssid, EEntType.PLINE);
        this._addEntAttribs(ssid, exist_ssid, EEntType.PGON);
        this._addEntAttribs(ssid, exist_ssid, EEntType.COLL);
        this._mergeModelAttribs(ssid, exist_ssid);
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * From another model
     * The existing attributes are not deleted
     * Deep copy of attrib values
     * @param attribs_maps
     */
    _mergeModelAttribs(ssid, exist_ssid) {
        const other_attribs = this.modeldata.attribs.attribs_maps.get(exist_ssid)[EEntTypeStr[EEntType.MOD]];
        const this_attribs = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[EEntType.MOD]];
        // TODO this is a hack to fix an error
        if (!(other_attribs instanceof Map)) {
            return;
        }
        // end of hack
        other_attribs.forEach((val, key) => {
            this_attribs.set(key, lodash.cloneDeep(val));
        });
    }
    /**
     * Merge attributes from another attribute map into this attribute map.
     * Conflict detection is performed.
     */
    _mergeEntAttribs(ssid, other_ssid, ent_type) {
        const other_attribs = this.modeldata.attribs.attribs_maps.get(other_ssid)[EEntTypeStr[ent_type]];
        const this_attribs = this.modeldata.attribs.attribs_maps.get(ssid)[EEntTypeStr[ent_type]];
        other_attribs.forEach(other_attrib => {
            const other_ents_i = this.modeldata.geom.snapshot.filterEnts(other_ssid, ent_type, other_attrib.getEnts());
            if (other_ents_i.length > 0) {
                // get the name
                const name = other_attrib.getName();
                // get or create the attrib
                let this_attrib;
                if (!this_attribs.has(name)) {
                    this_attrib = this.modeldata.attribs.add.addEntAttrib(ent_type, name, other_attrib.getDataType());
                }
                else {
                    this_attrib = this_attribs.get(name);
                    if (this_attrib.getDataType() !== other_attrib.getDataType()) {
                        throw new Error('Merge Error: Cannot merge attributes with different data types.');
                    }
                }
                // merge
                this_attrib.mergeAttribMap(other_attrib, other_ents_i);
            }
        });
    }
    /**
     * Add attributes from another attribute map into this attribute map.
     * No conflict detection is performed.
     * This attribute map is assumed to be empty.
     * @param ssid
     * @param other_ssid
     * @param ent_type
     */
    _addEntAttribs(ssid, other_ssid, ent_type) {
        const other_attribs = this.modeldata.attribs.attribs_maps.get(other_ssid)[EEntTypeStr[ent_type]];
        other_attribs.forEach(other_attrib => {
            const other_ents_i = this.modeldata.geom.snapshot.filterEnts(other_ssid, ent_type, other_attrib.getEnts());
            if (other_ents_i.length > 0) {
                // get the name
                const name = other_attrib.getName();
                // get or create the attrib
                const this_attrib = this.modeldata.attribs.add.addEntAttrib(ent_type, name, other_attrib.getDataType());
                // merge
                this_attrib.addAttribMap(other_attrib, other_ents_i);
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzTWVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzTWVyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFvQixRQUFRLEVBQ2pCLFdBQVcsRUFBeUIsTUFBTSxXQUFXLENBQUM7QUFFeEUsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFJakM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQUV4Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLElBQVksRUFBRSxVQUFrQjtRQUN6QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQs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