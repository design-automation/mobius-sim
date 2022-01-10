"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjSets = void 0;
const common_1 = require("../common");
/**
 * Given a list of entities, keep only the obects.
 * If the entities include collections, extract objects out of the collections.
 * Returns sets of objects.
 */
function getObjSets(model, entities, ssid) {
    if (entities === null) {
        return model.modeldata.geom.snapshot.getAllEntSets(ssid);
    }
    const ent_sets = {
        pt: new Set(),
        pl: new Set(),
        pg: new Set(),
    };
    for (const [ent_type, ent_i] of entities) {
        if (ent_type === common_1.EEntType.PGON) {
            ent_sets.pt.add(ent_i);
        }
        else if (ent_type === common_1.EEntType.PLINE) {
            ent_sets.pl.add(ent_i);
        }
        else if (ent_type === common_1.EEntType.POINT) {
            ent_sets.pt.add(ent_i);
        }
        else if (ent_type === common_1.EEntType.COLL) {
            for (const pgon_i of model.modeldata.geom.nav_snapshot.navCollToPgon(ssid, ent_i)) {
                ent_sets.pg.add(pgon_i);
            }
            for (const pline_i of model.modeldata.geom.nav_snapshot.navCollToPline(ssid, ent_i)) {
                ent_sets.pl.add(pline_i);
            }
            for (const point_i of model.modeldata.geom.nav_snapshot.navCollToPoint(ssid, ent_i)) {
                ent_sets.pt.add(point_i);
            }
        }
    }
    return ent_sets;
}
exports.getObjSets = getObjSets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9pby9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQTREO0FBRzVEOzs7O0dBSUc7QUFDSCxTQUFnQixVQUFVLENBQUMsS0FBYyxFQUFFLFFBQXVCLEVBQUUsSUFBWTtJQUM1RSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDbkIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsTUFBTSxRQUFRLEdBQWE7UUFDdkIsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1FBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1FBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO0tBQ2hCLENBQUM7SUFDRixLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksUUFBUSxFQUFFO1FBQ3RDLElBQUksUUFBUSxLQUFLLGlCQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO2FBQU0sSUFBSSxRQUFRLEtBQUssaUJBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDcEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7YUFBTSxJQUFJLFFBQVEsS0FBSyxpQkFBUSxDQUFDLEtBQUssRUFBRTtZQUNwQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMxQjthQUFNLElBQUksUUFBUSxLQUFLLGlCQUFRLENBQUMsSUFBSSxFQUFFO1lBQ25DLEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQy9FLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzNCO1lBQ0QsS0FBSyxNQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDakYsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDNUI7WUFDRCxLQUFLLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNqRixRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM1QjtTQUNKO0tBQ0o7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDO0FBN0JELGdDQTZCQyJ9