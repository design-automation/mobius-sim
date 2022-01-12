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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic0FkZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBdUU7QUFFdkUsdUVBQW9FO0FBQ3BFLHFFQUFrRTtBQUNsRSxxRUFBa0U7QUFDbEUsdUVBQW9FO0FBQ3BFLHVFQUFvRTtBQUdwRTs7R0FFRztBQUNILE1BQWEsWUFBWTtJQUV0Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksU0FBUyxDQUFDLFFBQWtCLEVBQUUsSUFBWSxFQUFFLFNBQThCO1FBQzdFLElBQUksUUFBUSxLQUFLLGlCQUFRLENBQUMsR0FBRyxFQUFFO1lBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDdkQ7SUFDTCxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGNBQWMsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwRTtJQUNMLENBQUM7SUFDRDs7Ozs7Ozs7O09BU0c7SUFDSSxZQUFZLENBQUMsUUFBa0IsRUFBRSxJQUFZLEVBQUUsU0FBOEI7UUFDaEYsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQsTUFBTSxnQkFBZ0IsR0FBVyxvQkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sT0FBTyxHQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbEcsSUFBSSxNQUF1QixDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BCLElBQUksU0FBUyxLQUFLLDRCQUFtQixDQUFDLE1BQU0sRUFBRTtnQkFDMUMsTUFBTSxHQUFHLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDMUU7aUJBQU0sSUFBSSxTQUFTLEtBQUssNEJBQW1CLENBQUMsTUFBTSxFQUFFO2dCQUNqRCxNQUFNLEdBQUcsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMxRTtpQkFBTSxJQUFJLFNBQVMsS0FBSyw0QkFBbUIsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xELE1BQU0sR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzNFO2lCQUFNLElBQUksU0FBUyxLQUFLLDRCQUFtQixDQUFDLElBQUksRUFBRTtnQkFDL0MsTUFBTSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDM0U7aUJBQU0sSUFBSSxTQUFTLEtBQUssNEJBQW1CLENBQUMsSUFBSSxFQUFFO2dCQUMvQyxNQUFNLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMzRTtpQkFBTTtnQkFDSCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7YUFDekQ7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUM3QjthQUFNO1lBQ0gsTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssU0FBUyxFQUFFO2dCQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLHdGQUF3RixDQUFDLENBQUM7YUFDN0c7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQTdFRCxvQ0E2RUMifQ==