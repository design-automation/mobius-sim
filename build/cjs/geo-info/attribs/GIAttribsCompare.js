"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsCompare = void 0;
const common_1 = require("../common");
const eny_type_array = [
    common_1.EEntType.POSI,
    common_1.EEntType.VERT,
    common_1.EEntType.EDGE,
    common_1.EEntType.WIRE,
    common_1.EEntType.POINT,
    common_1.EEntType.PLINE,
    common_1.EEntType.PGON,
    common_1.EEntType.COLL,
    common_1.EEntType.MOD
];
const ent_type_strs = new Map([
    [common_1.EEntType.POSI, 'positions'],
    [common_1.EEntType.VERT, 'vertices'],
    [common_1.EEntType.EDGE, 'edges'],
    [common_1.EEntType.WIRE, 'wires'],
    [common_1.EEntType.POINT, 'points'],
    [common_1.EEntType.PLINE, 'polylines'],
    [common_1.EEntType.PGON, 'polygons'],
    [common_1.EEntType.COLL, 'collections'],
    [common_1.EEntType.MOD, 'model']
]);
/**
 * Class for attributes.
 */
class GIAttribsCompare {
    /**
      * Creates an object to store the attribute data.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    /**
     * Compares this model and another model.
     * \n
     * If check_equality=false, the max total score will be equal to the number of attributes in this model.
     * It checks that each attribute in this model exists in the other model. If it exists, 1 mark is assigned.
     * \n
     * If check_equality=true, the max score will be increased by 10, equal to the number of entity levels.
     * For each entity level, if the other model contains no additional attributes, then one mark is assigned.
     * \n
     * @param other_model The model to compare with.
     */
    compare(other_model, result) {
        result.comment.push('Comparing attribute names and types.');
        // compare all attributes except model attributes
        // check that this model is a subset of other model
        // all the attributes in this model must also be in other model
        const attrib_comments = [];
        let matches = true;
        const attrib_names = new Map();
        for (const ent_type of eny_type_array) {
            // get the attrib names
            const ent_type_str = ent_type_strs.get(ent_type);
            const this_attrib_names = this.modeldata.attribs.getAttribNames(ent_type);
            const other_attrib_names = other_model.modeldata.attribs.getAttribNames(ent_type);
            attrib_names.set(ent_type, this_attrib_names);
            // check that each attribute in this model exists in the other model
            for (const this_attrib_name of this_attrib_names) {
                // check is this is built in
                let is_built_in = false;
                if (this_attrib_name === 'xyz' || this_attrib_name === 'rgb' || this_attrib_name.startsWith('_')) {
                    is_built_in = true;
                }
                // update the total
                if (!is_built_in) {
                    result.total += 1;
                }
                // compare names
                if (other_attrib_names.indexOf(this_attrib_name) === -1) {
                    matches = false;
                    attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute is missing.');
                }
                else {
                    // get the data types
                    const data_type_1 = this.modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    const data_type_2 = other_model.modeldata.attribs.query.getAttribDataType(ent_type, this_attrib_name);
                    // compare data types
                    if (data_type_1 !== data_type_2) {
                        matches = false;
                        attrib_comments.push('The "' + this_attrib_name + '" ' + ent_type_str + ' attribute datatype is wrong. '
                            + 'It is "' + data_type_1 + '" but it should be "' + data_type_1 + '".');
                    }
                    else {
                        // update the score
                        if (!is_built_in) {
                            result.score += 1;
                        }
                    }
                }
            }
            // check if we have exact equality in attributes
            // total marks is not updated, we deduct marks
            // check that the other model does not have additional attribs
            if (other_attrib_names.length > this_attrib_names.length) {
                const additional_attribs = [];
                for (const other_attrib_name of other_attrib_names) {
                    if (this_attrib_names.indexOf(other_attrib_name) === -1) {
                        additional_attribs.push(other_attrib_name);
                    }
                }
                attrib_comments.push('There are additional ' + ent_type_str + ' attributes. ' +
                    'The following attributes are not required: [' + additional_attribs.join(',') + ']. ');
                // update the score, deduct 1 mark
                result.score -= 1;
            }
            else if (other_attrib_names.length < this_attrib_names.length) {
                attrib_comments.push('Mismatch: Model has too few entities of type: ' + ent_type_strs.get(ent_type) + '.');
            }
            else {
                // correct
            }
        }
        if (attrib_comments.length === 0) {
            attrib_comments.push('Attributes all match, both name and data type.');
        }
        // add to result
        result.comment.push(attrib_comments);
    }
}
exports.GIAttribsCompare = GIAttribsCompare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzQ29tcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNDb21wYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHNDQUEwRDtBQUcxRCxNQUFNLGNBQWMsR0FBZTtJQUMvQixpQkFBUSxDQUFDLElBQUk7SUFDYixpQkFBUSxDQUFDLElBQUk7SUFDYixpQkFBUSxDQUFDLElBQUk7SUFDYixpQkFBUSxDQUFDLElBQUk7SUFDYixpQkFBUSxDQUFDLEtBQUs7SUFDZCxpQkFBUSxDQUFDLEtBQUs7SUFDZCxpQkFBUSxDQUFDLElBQUk7SUFDYixpQkFBUSxDQUFDLElBQUk7SUFDYixpQkFBUSxDQUFDLEdBQUc7Q0FDZixDQUFDO0FBQ0YsTUFBTSxhQUFhLEdBQTBCLElBQUksR0FBRyxDQUFDO0lBQ2pELENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDO0lBQzVCLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO0lBQzNCLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO0lBQ3hCLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO0lBQ3hCLENBQUMsaUJBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO0lBQzFCLENBQUMsaUJBQVEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO0lBQzdCLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO0lBQzNCLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDO0lBQzlCLENBQUMsaUJBQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO0NBQzFCLENBQUMsQ0FBQztBQUNIOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFFekI7OztRQUdJO0lBQ0osWUFBWSxTQUFzQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFNB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