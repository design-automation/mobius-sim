import { vecAdd } from '../../geom/vectors';
import { EAttribNames } from '../common';
/**
 * Class for attributes.
 */
export class GIAttribsPosis {
    modeldata;
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
        const result = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(posi_i);
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
        return this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(posi_i);
    }
    /**
     * Shortcut for getting all the xyz coordinates from an ent_i
     * Shallow copy
     * @param posi_i
     */
    getEntCoords(ent_type, ent_i) {
        const ssid = this.modeldata.active_ssid;
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        const coords_map = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS);
        return posis_i.map(posi_i => coords_map.getEntVal(posi_i));
    }
    /**
     * Set the xyz position by index
     * @param index
     * @param value
     */
    setPosiCoords(index, xyz) {
        const ssid = this.modeldata.active_ssid;
        this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).setEntVal(index, xyz);
    }
    /**
     * Move the xyz position by index
     * @param index
     * @param value
     */
    movePosiCoords(index, xyz) {
        const ssid = this.modeldata.active_ssid;
        const old_xyz = this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).getEntVal(index);
        const new_xyz = vecAdd(old_xyz, xyz); // create copy of xyz
        this.modeldata.attribs.attribs_maps.get(ssid).ps.get(EAttribNames.COORDS).setEntVal(index, new_xyz);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzUG9zaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzUG9zaXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzVDLE9BQU8sRUFBUSxZQUFZLEVBQVksTUFBTSxXQUFXLENBQUM7QUFJekQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQUNmLFNBQVMsQ0FBYztJQUNoQzs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksYUFBYSxDQUFDLE1BQWM7UUFDL0IsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFTLENBQUM7UUFDbkgsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxhQUFhLENBQUMsTUFBYztRQUMvQixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFTLENBQUM7SUFDL0csQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxZQUFZLENBQUMsUUFBa0IsRUFBRSxLQUFhO1FBQ2pELE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hGLE1BQU0sVUFBVSxHQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlHLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGFBQWEsQ0FBQyxLQUFhLEVBQUUsR0FBUztRQUN6QyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxjQUFjLENBQUMsS0FBYSxFQUFFLEdBQVM7UUFDMUMsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFTLENBQUM7UUFDekgsTUFBTSxPQUFPLEdBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtRQUNqRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEcsQ0FBQztDQUNKIn0=