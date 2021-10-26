import { EEntType } from '../common';
/**
 * Class for comparing the geometry in two models.
 */
export class GIGeomCompare {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Compares this model and another model.
     * \n
     * The max total score for this method is equal to 5.
     * It assigns 1 mark for for each entity type:
     * points, pline, pgons, and colelctions.
     * In each case, if the number of entities is equal, 1 mark is given.
     * \n
     * @param other_model The model to compare with.
     */
    compare(other_model, result) {
        result.comment.push('Comparing number of geometric entities.');
        const eny_types = [
            EEntType.POINT,
            EEntType.PLINE,
            EEntType.PGON
        ];
        const ent_type_strs = new Map([
            [EEntType.POINT, 'points'],
            [EEntType.PLINE, 'polylines'],
            [EEntType.PGON, 'polygons']
        ]);
        const geom_comments = [];
        for (const ent_type of eny_types) {
            // total marks is not updated, we deduct marks
            // get the number of entitoes in each model
            const this_num_ents = this.modeldata.geom.query.numEnts(ent_type);
            const other_num_ents = other_model.modeldata.geom.query.numEnts(ent_type);
            if (this_num_ents > other_num_ents) {
                geom_comments.push([
                    'Mismatch: Model has too few entities of type:',
                    ent_type_strs.get(ent_type) + '.',
                    'There were ' + (this_num_ents - other_num_ents) + ' missing entities.',
                ].join(' '));
            }
            else if (this_num_ents < other_num_ents) {
                geom_comments.push([
                    'Mismatch: Model has too many entities of type:',
                    ent_type_strs.get(ent_type) + '.',
                    'There were ' + (other_num_ents - this_num_ents) + ' extra entities.',
                    'A penalty of one mark was deducted from the score.'
                ].join(' '));
                // update the score, deduct 1 mark
                result.score -= 1;
            }
            else {
                // correct
            }
        }
        if (geom_comments.length === 0) {
            geom_comments.push('Number of entities all match.');
        }
        // update the comments in the result
        result.comment.push(geom_comments);
    }
    /**
     * Set the holes in a pgon by specifying a list of wires.
     * \n
     * This is a low level method used by the compare function to normalize hole order.
     * For making holes in faces, it is safer to use the cutFaceHoles method.
     */
    setPgonHoles(pgon_i, holes_i) {
        const old_wires_i = this._geom_maps.dn_pgons_wires.get(pgon_i);
        const new_wires_i = [old_wires_i[0]];
        for (let i = 0; i < holes_i.length; i++) {
            new_wires_i.push(holes_i[i]);
        }
        this._geom_maps.dn_pgons_wires.set(pgon_i, new_wires_i);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tQ29tcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21Db21wYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBYSxRQUFRLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFHaEQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sYUFBYTtJQUd0Qjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsT0FBTyxDQUFDLFdBQW9CLEVBQUUsTUFBc0Q7UUFDaEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUMvRCxNQUFNLFNBQVMsR0FBZTtZQUMxQixRQUFRLENBQUMsS0FBSztZQUNkLFFBQVEsQ0FBQyxLQUFLO1lBQ2QsUUFBUSxDQUFDLElBQUk7U0FDaEIsQ0FBQztRQUNGLE1BQU0sYUFBYSxHQUEwQixJQUFJLEdBQUcsQ0FBQztZQUNqRCxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO1lBQzFCLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUM7WUFDN0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztTQUM5QixDQUFDLENBQUM7UUFDSCxNQUFNLGFBQWEsR0FBYSxFQUFFLENBQUM7UUFDbkMsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7WUFDOUIsOENBQThDO1lBQzlDLDJDQUEyQztZQUMzQyxNQUFNLGFBQWEsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sY0FBYyxHQUFXLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEYsSUFBSSxhQUFhLEdBQUcsY0FBYyxFQUFFO2dCQUNoQyxhQUFhLENBQUMsSUFBSSxDQUFDO29CQUNmLCtDQUErQztvQkFDL0MsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHO29CQUNqQyxhQUFhLEdBQUcsQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDLEdBQUcsb0JBQW9CO2lCQUMxRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO2lCQUFNLElBQUksYUFBYSxHQUFHLGNBQWMsRUFBRTtnQkFDdkMsYUFBYSxDQUFDLElBQUksQ0FBQztvQkFDZixnREFBZ0Q7b0JBQ2hELGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRztvQkFDakMsYUFBYSxHQUFHLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQyxHQUFHLGtCQUFrQjtvQkFDckUsb0RBQW9EO2lCQUN2RCxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNiLGtDQUFrQztnQkFDbEMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7YUFDckI7aUJBQU07Z0JBQ0gsVUFBVTthQUNiO1NBQ0o7UUFDRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzVCLGFBQWEsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztTQUN2RDtRQUNELG9DQUFvQztRQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0Q7Ozs7O09BS0c7SUFDSSxZQUFZLENBQUMsTUFBYyxFQUFFLE9BQWlCO1FBQ2pELE1BQU0sV0FBVyxHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RSxNQUFNLFdBQVcsR0FBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLFdBQVcsQ0FBQyxJQUFJLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7U0FDbEM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FDSiJ9