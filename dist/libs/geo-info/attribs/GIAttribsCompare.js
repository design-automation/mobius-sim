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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzQ29tcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2F0dHJpYnMvR0lBdHRyaWJzQ29tcGFyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBMEQ7QUFHMUQsTUFBTSxjQUFjLEdBQWU7SUFDL0IsaUJBQVEsQ0FBQyxJQUFJO0lBQ2IsaUJBQVEsQ0FBQyxJQUFJO0lBQ2IsaUJBQVEsQ0FBQyxJQUFJO0lBQ2IsaUJBQVEsQ0FBQyxJQUFJO0lBQ2IsaUJBQVEsQ0FBQyxLQUFLO0lBQ2QsaUJBQVEsQ0FBQyxLQUFLO0lBQ2QsaUJBQVEsQ0FBQyxJQUFJO0lBQ2IsaUJBQVEsQ0FBQyxJQUFJO0lBQ2IsaUJBQVEsQ0FBQyxHQUFHO0NBQ2YsQ0FBQztBQUNGLE1BQU0sYUFBYSxHQUEwQixJQUFJLEdBQUcsQ0FBQztJQUNqRCxDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztJQUM1QixDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztJQUMzQixDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztJQUN4QixDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztJQUN4QixDQUFDLGlCQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztJQUMxQixDQUFDLGlCQUFRLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQztJQUM3QixDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztJQUMzQixDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQztJQUM5QixDQUFDLGlCQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztDQUMxQixDQUFDLENBQUM7QUFDSDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBRXpCOzs7UUFHSTtJQUNKLFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7Ozs7Ozs7O09BVUc7SUFDSSxPQUFPLENBQUMsV0FBb0IsRUFBRSxNQUFzRDtRQUN2RixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzVELGlEQUFpRDtRQUNqRCxtREFBbUQ7UUFDbkQsK0RBQStEO1FBQy9ELE1BQU0sZUFBZSxHQUFhLEVBQUUsQ0FBQztRQUNyQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxZQUFZLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEQsS0FBSyxNQUFNLFFBQVEsSUFBSSxjQUFjLEVBQUU7WUFDbkMsdUJBQXVCO1lBQ3ZCLE1BQU0sWUFBWSxHQUFXLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekQsTUFBTSxpQkFBaUIsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEYsTUFBTSxrQkFBa0IsR0FBYSxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUYsWUFBWSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUM5QyxvRUFBb0U7WUFDcEUsS0FBSyxNQUFNLGdCQUFnQixJQUFJLGlCQUFpQixFQUFFO2dCQUM5Qyw0QkFBNEI7Z0JBQzVCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxnQkFBZ0IsS0FBSyxLQUFLLElBQUksZ0JBQWdCLEtBQUssS0FBSyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDOUYsV0FBVyxHQUFHLElBQUksQ0FBQztpQkFDdEI7Z0JBQ0QsbUJBQW1CO2dCQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFO29CQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2lCQUFFO2dCQUN4QyxnQkFBZ0I7Z0JBQ2hCLElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUc7b0JBQ3RELE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ2hCLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLGdCQUFnQixHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztpQkFDckc7cUJBQU07b0JBQ0gscUJBQXFCO29CQUNyQixNQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBQy9FLE1BQU0sV0FBVyxHQUNiLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFDdEYscUJBQXFCO29CQUNyQixJQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7d0JBQzdCLE9BQU8sR0FBRyxLQUFLLENBQUM7d0JBQ2hCLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLGdCQUFnQixHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsZ0NBQWdDOzhCQUNsRyxTQUFTLEdBQUcsV0FBVyxHQUFHLHNCQUFzQixHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQztxQkFDaEY7eUJBQU07d0JBQ0gsbUJBQW1CO3dCQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFOzRCQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO3lCQUFFO3FCQUMzQztpQkFDSjthQUNKO1lBQ0QsZ0RBQWdEO1lBQ2hELDhDQUE4QztZQUM5Qyw4REFBOEQ7WUFDOUQsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFO2dCQUN0RCxNQUFNLGtCQUFrQixHQUFhLEVBQUUsQ0FBQztnQkFDeEMsS0FBSyxNQUFNLGlCQUFpQixJQUFJLGtCQUFrQixFQUFFO29CQUNoRCxJQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO3dCQUNyRCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztxQkFDOUM7aUJBQ0o7Z0JBQ0QsZUFBZSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxZQUFZLEdBQUcsZUFBZTtvQkFDekUsOENBQThDLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUMzRixrQ0FBa0M7Z0JBQ2xDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2FBQ3JCO2lCQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtnQkFDN0QsZUFBZSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQzlHO2lCQUFNO2dCQUNILFVBQVU7YUFDYjtTQUNKO1FBQ0QsSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM5QixlQUFlLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7U0FDMUU7UUFDRCxnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNKO0FBMUZELDRDQTBGQyJ9