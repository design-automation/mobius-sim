"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsSnapshot = void 0;
const common_1 = require("../common");
const GIAttribMapList_1 = require("../attrib_classes/GIAttribMapList");
const GIAttribMapNum_1 = require("../attrib_classes/GIAttribMapNum");
const GIAttribMapStr_1 = require("../attrib_classes/GIAttribMapStr");
/**
 * Class for attribute snapshot.
 */
class GIAttribsSnapshot {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    // ============================================================================
    // Start
    // ============================================================================
    /**
     *
     * @param ssid
     * @param include
     */
    addSnapshot(ssid, include) {
        // create new attribs maps for snapshot
        const attribs = {
            ps: new Map(),
            _v: new Map(),
            _e: new Map(),
            _w: new Map(),
            pt: new Map(),
            pl: new Map(),
            pg: new Map(),
            co: new Map(),
            mo: new Map()
        };
        this.modeldata.attribs.attribs_maps.set(ssid, attribs);
        // add attributes for built in types
        attribs.ps.set(common_1.EAttribNames.COORDS, new GIAttribMapList_1.GIAttribMapList(this.modeldata, common_1.EAttribNames.COORDS, common_1.EEntType.POSI, common_1.EAttribDataTypeStrs.LIST));
        attribs._v.set(common_1.EAttribNames.COLOR, new GIAttribMapList_1.GIAttribMapList(this.modeldata, common_1.EAttribNames.COLOR, common_1.EEntType.VERT, common_1.EAttribDataTypeStrs.LIST));
        attribs._v.set(common_1.EAttribNames.NORMAL, new GIAttribMapList_1.GIAttribMapList(this.modeldata, common_1.EAttribNames.NORMAL, common_1.EEntType.VERT, common_1.EAttribDataTypeStrs.LIST));
        // add attributes for time stamps
        attribs.pt.set(common_1.EAttribNames.TIMESTAMP, new GIAttribMapNum_1.GIAttribMapNum(this.modeldata, common_1.EAttribNames.TIMESTAMP, common_1.EEntType.POINT, common_1.EAttribDataTypeStrs.NUMBER));
        attribs.pl.set(common_1.EAttribNames.TIMESTAMP, new GIAttribMapNum_1.GIAttribMapNum(this.modeldata, common_1.EAttribNames.TIMESTAMP, common_1.EEntType.PLINE, common_1.EAttribDataTypeStrs.NUMBER));
        attribs.pg.set(common_1.EAttribNames.TIMESTAMP, new GIAttribMapNum_1.GIAttribMapNum(this.modeldata, common_1.EAttribNames.TIMESTAMP, common_1.EEntType.PGON, common_1.EAttribDataTypeStrs.NUMBER));
        // add attributes for collections
        attribs.co.set(common_1.EAttribNames.COLL_NAME, new GIAttribMapStr_1.GIAttribMapStr(this.modeldata, common_1.EAttribNames.COLL_NAME, common_1.EEntType.COLL, common_1.EAttribDataTypeStrs.STRING));
        // merge data
        if (include !== undefined) {
            // the first one we add with no conflict detection
            if (include.length > 0) {
                this.modeldata.attribs.merge.add(ssid, include[0]);
            }
            // everything after the first must be added with conflict detection
            if (include.length > 1) {
                for (let i = 1; i < include.length; i++) {
                    const exist_ssid = include[i];
                    this.modeldata.attribs.merge.merge(ssid, exist_ssid);
                }
            }
        }
    }
    // ============================================================================
    // Add
    // ============================================================================
    /**
     * Add attributes of ents from the specified snapshot to the current snapshot.
     * @param ssid ID of snapshot to copy attributes from.
     * @param ents ID of ents in both ssid and in the active snapshot
     */
    copyEntsToActiveSnapshot(from_ssid, ents) {
        const from_attrib_maps = this.modeldata.attribs.attribs_maps.get(from_ssid);
        for (const [ent_type, ent_i] of ents) {
            const attribs = from_attrib_maps[common_1.EEntTypeStr[ent_type]];
            attribs.forEach((attrib, attrib_name) => {
                const attrib_val = attrib.getEntVal(ent_i); // shallow copy
                if (attrib_val !== undefined) {
                    this.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ent_i, attrib_name, attrib_val);
                }
            });
        }
        from_attrib_maps.mo.forEach((val, name) => this.modeldata.attribs.set.setModelAttribVal(name, val));
    }
    // ============================================================================
    // Del
    // ============================================================================
    /**
     *
     * @param ssid
     */
    delSnapshot(ssid) {
        this.modeldata.attribs.attribs_maps.delete(ssid);
    }
    // ============================================================================
    // Debug
    // ============================================================================
    toStr(ssid) {
        return this.modeldata.attribs.toStr(ssid);
    }
}
exports.GIAttribsSnapshot = GIAttribsSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1NuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUF3STtBQUV4SSx1RUFBb0U7QUFDcEUscUVBQWtFO0FBQ2xFLHFFQUFrRTtBQUdsRTs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBRTNCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxRQUFRO0lBQ1IsK0VBQStFO0lBQy9FOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsSUFBWSxFQUFFLE9BQWtCO1FBQy9DLHVDQUF1QztRQUN2QyxNQUFNLE9BQU8sR0FBaUI7WUFDdEIsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1NBQ3BCLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RCxvQ0FBb0M7UUFDcEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJB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