import { EEntType } from '../common';
const eny_type_array = [
    EEntType.POSI,
    EEntType.VERT,
    EEntType.EDGE,
    EEntType.WIRE,
    EEntType.POINT,
    EEntType.PLINE,
    EEntType.PGON,
    EEntType.COLL,
    EEntType.MOD
];
const ent_type_strs = new Map([
    [EEntType.POSI, 'positions'],
    [EEntType.VERT, 'vertices'],
    [EEntType.EDGE, 'edges'],
    [EEntType.WIRE, 'wires'],
    [EEntType.POINT, 'points'],
    [EEntType.PLINE, 'polylines'],
    [EEntType.PGON, 'polygons'],
    [EEntType.COLL, 'collections'],
    [EEntType.MOD, 'model']
]);
/**
 * Class for attributes.
 */
export class GIAttribsCompare {
    modeldata;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzQ29tcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNDb21wYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sV0FBVyxDQUFDO0FBRzFELE1BQU0sY0FBYyxHQUFlO0lBQy9CLFFBQVEsQ0FBQyxJQUFJO0lBQ2IsUUFBUSxDQUFDLElBQUk7SUFDYixRQUFRLENBQUMsSUFBSTtJQUNiLFFBQVEsQ0FBQyxJQUFJO0lBQ2IsUUFBUSxDQUFDLEtBQUs7SUFDZCxRQUFRLENBQUMsS0FBSztJQUNkLFFBQVEsQ0FBQyxJQUFJO0lBQ2IsUUFBUSxDQUFDLElBQUk7SUFDYixRQUFRLENBQUMsR0FBRztDQUNmLENBQUM7QUFDRixNQUFNLGFBQWEsR0FBMEIsSUFBSSxHQUFHLENBQUM7SUFDakQsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztJQUM1QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO0lBQzNCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7SUFDeEIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztJQUN4QixDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO0lBQzFCLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUM7SUFDN0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztJQUMzQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDO0lBQzlCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7Q0FDMUIsQ0FBQyxDQUFDO0FBQ0g7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZ0JBQWdCO0lBQ2pCLFNBQVMsQ0FBYztJQUMvQjs7O1FBR0k7SUFDSixZQUFZLFNBQXNC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