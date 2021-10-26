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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFxRCxNQUFNLFdBQVcsQ0FBQztBQUV4SSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDcEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUdsRTs7R0FFRztBQUNILE1BQU0sT0FBTyxpQkFBaUI7SUFFM0I7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLFFBQVE7SUFDUiwrRUFBK0U7SUFDL0U7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxJQUFZLEVBQUUsT0FBa0I7UUFDL0MsdUNBQXVDO1FBQ3ZDLE1BQU0sT0FBTyxHQUFpQjtZQUN0QixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7WUFDYixFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7U0FDcEIsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FB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