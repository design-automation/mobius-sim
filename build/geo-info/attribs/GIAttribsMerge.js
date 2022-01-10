"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsMerge = void 0;
const common_1 = require("../common");
const lodash_1 = __importDefault(require("lodash"));
/**
 * Class for mering attributes.
 */
class GIAttribsMerge {
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
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.POSI);
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.VERT);
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.EDGE);
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.WIRE);
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.POINT);
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.PLINE);
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.PGON);
        this._mergeEntAttribs(ssid, exist_ssid, common_1.EEntType.COLL);
        this._mergeModelAttribs(ssid, exist_ssid);
    }
    /**
     * Adds data to this model from another model.
     * The existing data in the model is not deleted - checks for conflicts.
     * @param model_data Attribute data from the other model.
     */
    add(ssid, exist_ssid) {
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.POSI);
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.VERT);
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.EDGE);
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.WIRE);
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.POINT);
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.PLINE);
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.PGON);
        this._addEntAttribs(ssid, exist_ssid, common_1.EEntType.COLL);
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
        const other_attribs = this.modeldata.attribs.attribs_maps.get(exist_ssid)[common_1.EEntTypeStr[common_1.EEntType.MOD]];
        const this_attribs = this.modeldata.attribs.attribs_maps.get(ssid)[common_1.EEntTypeStr[common_1.EEntType.MOD]];
        // TODO this is a hack to fix an error
        if (!(other_attribs instanceof Map)) {
            return;
        }
        // end of hack
        other_attribs.forEach((val, key) => {
            this_attribs.set(key, lodash_1.default.cloneDeep(val));
        });
    }
    /**
     * Merge attributes from another attribute map into this attribute map.
     * Conflict detection is performed.
     */
    _mergeEntAttribs(ssid, other_ssid, ent_type) {
        const other_attribs = this.modeldata.attribs.attribs_maps.get(other_ssid)[common_1.EEntTypeStr[ent_type]];
        const this_attribs = this.modeldata.attribs.attribs_maps.get(ssid)[common_1.EEntTypeStr[ent_type]];
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
        const other_attribs = this.modeldata.attribs.attribs_maps.get(other_ssid)[common_1.EEntTypeStr[ent_type]];
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
exports.GIAttribsMerge = GIAttribsMerge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzTWVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzTWVyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0NBQ3dFO0FBRXhFLG9EQUE0QjtBQUk1Qjs7R0FFRztBQUNILE1BQWEsY0FBYztJQUV4Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLElBQVksRUFBRSxVQUFrQjtRQUN6QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFRLENBQUMsSUFB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