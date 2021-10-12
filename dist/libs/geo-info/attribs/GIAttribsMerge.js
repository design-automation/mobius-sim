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
exports.GIAttribsMerge = void 0;
const common_1 = require("../common");
const lodash = __importStar(require("lodash"));
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
            this_attribs.set(key, lodash.cloneDeep(val));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzTWVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic01lcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FDd0U7QUFFeEUsK0NBQWlDO0FBSWpDOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBRXhCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsSUFBWSxFQUFFLFVBQWtCO1FBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksR0FBRyxDQUFDLElBQVksRUFBRSxVQUFrQjtRQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCwrRUFBK0U7SUFDL0Usa0JBQWtCO0lBQ2xCLCtFQUErRTtJQUMvRTs7Ozs7T0FLRztJQUNLLGtCQUFrQixDQUFDLElBQVksRUFBRSxVQUFrQjtRQUN2RCxNQUFNLGFBQWEsR0FBa0MsSUFBSSxDQUFD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