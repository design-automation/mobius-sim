import { EEntType, EEntTypeStr } from '../common';
import lodash from 'lodash';
/**
 * Class for mering attributes.
 */
export class GIAttribsMerge {
    modeldata;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzTWVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzTWVyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFvQixRQUFRLEVBQ2pCLFdBQVcsRUFBeUIsTUFBTSxXQUFXLENBQUM7QUFFeEUsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBSTVCOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUFDZixTQUFTLENBQWM7SUFDaEM7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxJQUFZLEVBQUUsVUFBa0I7UUFDekMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FB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