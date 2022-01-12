import { EEntType, EAttribDataTypeStrs, EEntTypeStr } from '../common';
import { GIAttribMapBool } from '../attrib_classes/GIAttribMapBool';
import { GIAttribMapStr } from '../attrib_classes/GIAttribMapStr';
import { GIAttribMapNum } from '../attrib_classes/GIAttribMapNum';
import { GIAttribMapList } from '../attrib_classes/GIAttribMapList';
import { GIAttribMapDict } from '../attrib_classes/GIAttribMapDict';
/**
 * Class for attributes.
 */
export class GIAttribsAdd {
    modeldata;
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    /**
     * Creates a new attribte, at either the model level or the entity level.
     * This function is call by var@att_name and by @att_name
     *
     * For entity attributes, if an attribute with the same name but different data_type already exists,
     * then an error is thrown.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     */
    addAttrib(ent_type, name, data_type) {
        if (ent_type === EEntType.MOD) {
            this.addModelAttrib(name);
            return null;
        }
        else {
            return this.addEntAttrib(ent_type, name, data_type);
        }
    }
    /**
     * Creates a new attribte at the model level
     *
     * @param name The name of the attribute.
     */
    addModelAttrib(name) {
        const ssid = this.modeldata.active_ssid;
        if (!this.modeldata.attribs.attribs_maps.get(ssid).mo.has(name)) {
            this.modeldata.attribs.attribs_maps.get(ssid).mo.set(name, null);
        }
    }
    /**
     * Creates a new attribte at an  entity level.
     *
     * For entity attributes, if an attribute with the same name but different data_type already exists,
     * then an error is thrown.
     *
     * @param ent_type The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     */
    addEntAttrib(ent_type, name, data_type) {
        const ssid = this.modeldata.active_ssid;
        const attribs_maps_key = EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        let attrib;
        if (!attribs.has(name)) {
            if (data_type === EAttribDataTypeStrs.NUMBER) {
                attrib = new GIAttribMapNum(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === EAttribDataTypeStrs.STRING) {
                attrib = new GIAttribMapStr(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === EAttribDataTypeStrs.BOOLEAN) {
                attrib = new GIAttribMapBool(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === EAttribDataTypeStrs.LIST) {
                attrib = new GIAttribMapList(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === EAttribDataTypeStrs.DICT) {
                attrib = new GIAttribMapDict(this.modeldata, name, ent_type, data_type);
            }
            else {
                throw new Error('Attribute datatype not recognised.');
            }
            attribs.set(name, attrib);
        }
        else {
            attrib = attribs.get(name);
            if (attrib.getDataType() !== data_type) {
                throw new Error('Attribute could not be created due to conflict with existing attribute with same name.');
            }
        }
        return attrib;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic0FkZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDcEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDcEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBR3BFOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFlBQVk7SUFDYixTQUFTLENBQWM7SUFDaEM7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0Q7Ozs7Ozs7Ozs7T0FVRztJQUNJLFNBQVMsQ0FBQyxRQUFrQixFQUFFLElBQVksRUFBRSxTQUE4QjtRQUM3RSxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDdkQ7SUFDTCxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGNBQWMsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELElBQUksQ0FBQyxJQUFJ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