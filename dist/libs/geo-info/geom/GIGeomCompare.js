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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tQ29tcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tQ29tcGFyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQWEsUUFBUSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBR2hEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFHdEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILE9BQU8sQ0FBQyxXQUFvQixFQUFFLE1BQXNEO1FBQ2hGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDL0QsTUFBTSxTQUFTLEdBQWU7WUFDMUIsUUFBUSxDQUFDLEtBQUs7WUFDZCxRQUFRLENBQUMsS0FBSztZQUNkLFFBQVEsQ0FBQyxJQUFJO1NBQ2hCLENBQUM7UUFDRixNQUFNLGFBQWEsR0FBMEIsSUFBSSxHQUFHLENBQUM7WUFDakQsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztZQUMxQixDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO1lBQzdCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7U0FDOUIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxhQUFhLEdBQWEsRUFBRSxDQUFDO1FBQ25DLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO1lBQzlCLDhDQUE4QztZQUM5QywyQ0FBMkM7WUFDM0MsTUFBTSxhQUFhLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxRSxNQUFNLGNBQWMsR0FBVyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xGLElBQUksYUFBYSxHQUFHLGNBQWMsRUFBRTtnQkFDaEMsYUFBYSxDQUFDLElBQUksQ0FBQztvQkFDZiwrQ0FBK0M7b0JBQy9DLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRztvQkFDakMsYUFBYSxHQUFHLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQyxHQUFHLG9CQUFvQjtpQkFDMUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoQjtpQkFBTSxJQUFJLGFBQWEsR0FBRyxjQUFjLEVBQUU7Z0JBQ3ZDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQ2YsZ0RBQWdEO29CQUNoRCxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUc7b0JBQ2pDLGFBQWEsR0FBRyxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUMsR0FBRyxrQkFBa0I7b0JBQ3JFLG9EQUFvRDtpQkFDdkQsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDYixrQ0FBa0M7Z0JBQ2xDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2FBQ3JCO2lCQUFNO2dCQUNILFVBQVU7YUFDYjtTQUNKO1FBQ0QsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1QixhQUFhLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDdkQ7UUFDRCxvQ0FBb0M7UUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0ksWUFBWSxDQUFDLE1BQWMsRUFBRSxPQUFpQjtRQUNqRCxNQUFNLFdBQVcsR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekUsTUFBTSxXQUFXLEdBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxXQUFXLENBQUMsSUFBSSxDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM1RCxDQUFDO0NBQ0oifQ==