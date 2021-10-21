import { EAttribDataTypeStrs, EAttribNames, EEntType, EEntTypeStr } from '../common';
import { GIAttribMapList } from '../attrib_classes/GIAttribMapList';
import { GIAttribMapNum } from '../attrib_classes/GIAttribMapNum';
import { GIAttribMapStr } from '../attrib_classes/GIAttribMapStr';
/**
 * Class for attribute snapshot.
 */
export class GIAttribsSnapshot {
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
        attribs.ps.set(EAttribNames.COORDS, new GIAttribMapList(this.modeldata, EAttribNames.COORDS, EEntType.POSI, EAttribDataTypeStrs.LIST));
        attribs._v.set(EAttribNames.COLOR, new GIAttribMapList(this.modeldata, EAttribNames.COLOR, EEntType.VERT, EAttribDataTypeStrs.LIST));
        attribs._v.set(EAttribNames.NORMAL, new GIAttribMapList(this.modeldata, EAttribNames.NORMAL, EEntType.VERT, EAttribDataTypeStrs.LIST));
        // add attributes for time stamps
        attribs.pt.set(EAttribNames.TIMESTAMP, new GIAttribMapNum(this.modeldata, EAttribNames.TIMESTAMP, EEntType.POINT, EAttribDataTypeStrs.NUMBER));
        attribs.pl.set(EAttribNames.TIMESTAMP, new GIAttribMapNum(this.modeldata, EAttribNames.TIMESTAMP, EEntType.PLINE, EAttribDataTypeStrs.NUMBER));
        attribs.pg.set(EAttribNames.TIMESTAMP, new GIAttribMapNum(this.modeldata, EAttribNames.TIMESTAMP, EEntType.PGON, EAttribDataTypeStrs.NUMBER));
        // add attributes for collections
        attribs.co.set(EAttribNames.COLL_NAME, new GIAttribMapStr(this.modeldata, EAttribNames.COLL_NAME, EEntType.COLL, EAttribDataTypeStrs.STRING));
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
            const attribs = from_attrib_maps[EEntTypeStr[ent_type]];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1NuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBcUQsTUFBTSxXQUFXLENBQUM7QUFFeEksT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFHbEU7O0dBRUc7QUFDSCxNQUFNLE9BQU8saUJBQWlCO0lBRTNCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxRQUFRO0lBQ1IsK0VBQStFO0lBQy9FOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsSUFBWSxFQUFFLE9BQWtCO1FBQy9DLHVDQUF1QztRQUN2QyxNQUFNLE9BQU8sR0FBaUI7WUFDdEIsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1NBQ3BCLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZ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