"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsAdd = void 0;
const common_1 = require("../common");
const GIAttribMapBool_1 = require("../attrib_classes/GIAttribMapBool");
const GIAttribMapStr_1 = require("../attrib_classes/GIAttribMapStr");
const GIAttribMapNum_1 = require("../attrib_classes/GIAttribMapNum");
const GIAttribMapList_1 = require("../attrib_classes/GIAttribMapList");
const GIAttribMapDict_1 = require("../attrib_classes/GIAttribMapDict");
/**
 * Class for attributes.
 */
class GIAttribsAdd {
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
        if (ent_type === common_1.EEntType.MOD) {
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
        const attribs_maps_key = common_1.EEntTypeStr[ent_type];
        const attribs = this.modeldata.attribs.attribs_maps.get(ssid)[attribs_maps_key];
        let attrib;
        if (!attribs.has(name)) {
            if (data_type === common_1.EAttribDataTypeStrs.NUMBER) {
                attrib = new GIAttribMapNum_1.GIAttribMapNum(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === common_1.EAttribDataTypeStrs.STRING) {
                attrib = new GIAttribMapStr_1.GIAttribMapStr(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === common_1.EAttribDataTypeStrs.BOOLEAN) {
                attrib = new GIAttribMapBool_1.GIAttribMapBool(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === common_1.EAttribDataTypeStrs.LIST) {
                attrib = new GIAttribMapList_1.GIAttribMapList(this.modeldata, name, ent_type, data_type);
            }
            else if (data_type === common_1.EAttribDataTypeStrs.DICT) {
                attrib = new GIAttribMapDict_1.GIAttribMapDict(this.modeldata, name, ent_type, data_type);
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
exports.GIAttribsAdd = GIAttribsAdd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNBZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQXVFO0FBRXZFLHVFQUFvRTtBQUNwRSxxRUFBa0U7QUFDbEUscUVBQWtFO0FBQ2xFLHVFQUFvRTtBQUNwRSx1RUFBb0U7QUFHcEU7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUFFdEI7OztRQUdJO0lBQ0gsWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ0Q7Ozs7Ozs7Ozs7T0FVRztJQUNJLFNBQVMsQ0FBQyxRQUFrQixFQUFFLElBQVksRUFBRSxTQUE4QjtRQUM3RSxJQUFJLFFBQVEsS0FBSyxpQkFBUSxDQUFDLEdBQUcsRUFBRTtZQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0wsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxjQUFjLENBQUMsSUFBWTtRQUM5QixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEU7SUFDTCxDQUFDO0lBQ0Q7Ozs7Ozs7OztPQVNHO0lBQ0ksWUFBWSxDQUFDLFFBQWtCLEVBQUUsSUFBWSxFQUFFLFNBQThCO1FBQ2hGLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELE1BQU0sZ0JBQWdCLEdBQVcsb0JBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxNQUFNLE9BQU8sR0FBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2xHLElBQUksTUFBdUIsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixJQUFJLFNBQVMsS0FBSyw0QkFBbUIsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFDLE1BQU0sR0FBRyxJQUFJLCtCQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzFFO2lCQUFNLElBQUksU0FBUyxLQUFLLDRCQUFtQixDQUFDLE1BQU0sRUFBRTtnQkFDakQsTUFBTSxHQUFHLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDMUU7aUJBQU0sSUFBSSxTQUFTLEtBQUssNEJBQW1CLENBQUMsT0FBTyxFQUFFO2dCQUNsRCxNQUFNLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMzRTtpQkFBTSxJQUFJLFNBQVMsS0FBSyw0QkFBbUIsQ0FBQyxJQUFJLEVBQUU7Z0JBQy9DLE1BQU0sR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzNFO2lCQUFNLElBQUksU0FBUyxLQUFLLDRCQUFtQixDQUFDLElBQUksRUFBRTtnQkFDL0MsTUFBTSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDM0U7aUJBQU07Z0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2FBQ3pEO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDN0I7YUFBTTtZQUNILE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLFNBQVMsRUFBRTtnQkFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RkFBd0YsQ0FBQyxDQUFDO2FBQzdHO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0NBQ0o7QUE3RUQsb0NBNkVDIn0=