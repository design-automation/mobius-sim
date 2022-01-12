"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsPosis = void 0;
const vectors_1 = require("../../geom/vectors");
const common_1 = require("../common");
/**
 * Class for attributes.
 */
class GIAttribsPosis {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    /**
     * Shortcut for getting a coordinate from a posi_i
     * Shallow copy
     * @param posi_i
     */
    getPosiCoords(posi_i) {
        const ssid = this.modeldata.active_ssid;
        const result = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS).getEntVal(posi_i);
        return result;
    }
    /**
     * Shortcut for getting a coordinate from a numeric vertex index (i.e. this is not an ID)
     * Shallow copy
     * @param vert_i
     */
    getVertCoords(vert_i) {
        const ssid = this.modeldata.active_ssid;
        const posi_i = this.modeldata.geom.nav.navVertToPosi(vert_i);
        return this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS).getEntVal(posi_i);
    }
    /**
     * Shortcut for getting all the xyz coordinates from an ent_i
     * Shallow copy
     * @param posi_i
     */
    getEntCoords(ent_type, ent_i) {
        const ssid = this.modeldata.active_ssid;
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        const coords_map = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS);
        return posis_i.map(posi_i => coords_map.getEntVal(posi_i));
    }
    /**
     * Set the xyz position by index
     * @param index
     * @param value
     */
    setPosiCoords(index, xyz) {
        const ssid = this.modeldata.active_ssid;
        this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS).setEntVal(index, xyz);
    }
    /**
     * Move the xyz position by index
     * @param index
     * @param value
     */
    movePosiCoords(index, xyz) {
        const ssid = this.modeldata.active_ssid;
        const old_xyz = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS).getEntVal(index);
        const new_xyz = (0, vectors_1.vecAdd)(old_xyz, xyz); // create copy of xyz
        this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS).setEntVal(index, new_xyz);
    }
}
exports.GIAttribsPosis = GIAttribsPosis;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUG9zaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzUG9zaXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBQTRDO0FBQzVDLHNDQUF5RDtBQUl6RDs7R0FFRztBQUNILE1BQWEsY0FBYztJQUV4Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHFCQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBUyxDQUFDO1FBQ25ILE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQVMsQ0FBQztJQUMvRyxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxRQUFrQixFQUFFLEtBQWE7UUFDakQsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEYsTUFBTSxVQUFVLEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlHLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGFBQWEsQ0FBQyxLQUFhLEVBQUUsR0FBUztRQUN6QyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BHLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksY0FBYyxDQUFDLEtBQWEsRUFBRSxHQUFTO1FBQzFDLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQVMsQ0FBQztRQUN6SCxNQUFNLE9BQU8sR0FBUyxJQUFBLGdCQUFNLEVBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1FBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEcsQ0FBQztDQUNKO0FBNURELHdDQTREQyJ9