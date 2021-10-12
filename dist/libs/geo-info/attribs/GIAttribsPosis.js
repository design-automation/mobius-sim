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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUG9zaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic1Bvc2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUE0QztBQUM1QyxzQ0FBeUQ7QUFJekQ7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFFeEI7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQVMsQ0FBQztRQUNuSCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGFBQWEsQ0FBQyxNQUFjO1FBQy9CLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFTLENBQUM7SUFDL0csQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxZQUFZLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ2pELE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hGLE1BQU0sVUFBVSxHQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBUyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxhQUFhLENBQUMsS0FBYSxFQUFFLEdBQVM7UUFDekMsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHFCQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNwRyxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGNBQWMsQ0FBQyxLQUFhLEVBQUUsR0FBUztRQUMxQyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxNQUFNLE9BQU8sR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFTLENBQUM7UUFDekgsTUFBTSxPQUFPLEdBQVMsSUFBQSxnQkFBTSxFQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtRQUNqRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hHLENBQUM7Q0FDSjtBQTVERCx3Q0E0REMifQ==