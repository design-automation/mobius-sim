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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQXdJO0FBRXhJLHVFQUFvRTtBQUNwRSxxRUFBa0U7QUFDbEUscUVBQWtFO0FBR2xFOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFFM0I7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLFFBQVE7SUFDUiwrRUFBK0U7SUFDL0U7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxJQUFZLEVBQUUsT0FBa0I7UUFDL0MsdUNBQXVDO1FBQ3ZDLE1BQU0sT0FBTyxHQUFpQjtZQUN0QixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7U0FDcEIsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELG9DQUFvQztRQUNwQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBWSxDQUFDLE1BQU0sRUFBRSxpQkFBUSxDQUFDLElBQUksRUFBRSw0QkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZJLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHFCQUFZLENBQUMsS0FBSyxFQUFFLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFCQUFZLENBQUMsS0FBSyxFQUFFLGlCQUFRLENBQUMsSUFBSSxFQUFFLDRCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckksT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQVksQ0FBQyxNQUFNLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsNEJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2SSxpQ0FBaUM7UUFDakMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQVksQ0FBQyxTQUFTLEVBQUUsaUJBQVEsQ0FBQyxLQUFLLEVBQUUsNEJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMvSSxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLCtCQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBWSxDQUFDLFNBQVMsRUFBRSxpQkFBUSxDQUFDLEtBQUssRUFBRSw0QkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9JLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHFCQUFZLENBQUMsU0FBUyxFQUFFLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFCQUFZLENBQUMsU0FBUyxFQUFFLGlCQUFRLENBQUMsSUFBSSxFQUFFLDRCQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUksaUNBQWlDO1FBQ2pDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHFCQUFZLENBQUMsU0FBUyxFQUFFLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFCQUFZLENBQUMsU0FBUyxFQUFFLGlCQUFRLENBQUMsSUFBSSxFQUFFLDRCQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUksYUFBYTtRQUNiLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixrREFBa0Q7WUFDbEQsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEQ7WUFDRCxtRUFBbUU7WUFDbkUsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JDLE1BQU0sVUFBVSxHQUFXLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ3hEO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsTUFBTTtJQUNOLCtFQUErRTtJQUMvRTs7OztPQUlHO0lBQ0ksd0JBQXdCLENBQUMsU0FBaUIsRUFBRSxJQUFtQjtRQUNsRSxNQUFNLGdCQUFnQixHQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFGLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDbEMsTUFBTSxPQUFPLEdBQWlDLGdCQUFnQixDQUFDLG9CQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0RixPQUFPLENBQUMsT0FBTyxDQUFFLENBQUMsTUFBdUIsRUFBRSxXQUFtQixFQUFFLEVBQUU7Z0JBQzlELE1BQU0sVUFBVSxHQUFxQixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZUFBZTtnQkFDN0UsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO29CQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQy9GO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUNELGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFFLENBQUM7SUFDMUcsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxNQUFNO0lBQ04sK0VBQStFO0lBQy9FOzs7T0FHRztJQUNJLFdBQVcsQ0FBQyxJQUFZO1FBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxRQUFRO0lBQ1IsK0VBQStFO0lBQ3hFLEtBQUssQ0FBQyxJQUFZO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDSjtBQTdGRCw4Q0E2RkMifQ==