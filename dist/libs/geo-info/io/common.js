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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vaW8vY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHNDQUE0RDtBQUc1RDs7OztHQUlHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLEtBQWMsRUFBRSxRQUF1QixFQUFFLElBQVk7SUFDNUUsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQ25CLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1RDtJQUNELE1BQU0sUUFBUSxHQUFhO1FBQ3ZCLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRTtRQUNiLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRTtRQUNiLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRTtLQUNoQixDQUFDO0lBQ0YsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUN0QyxJQUFJLFFBQVEsS0FBSyxpQkFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMxQjthQUFNLElBQUksUUFBUSxLQUFLLGlCQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3BDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO2FBQU0sSUFBSSxRQUFRLEtBQUssaUJBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDcEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7YUFBTSxJQUFJLFFBQVEsS0FBSyxpQkFBUSxDQUFDLElBQUksRUFBRTtZQUNuQyxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUMvRSxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMzQjtZQUNELEtBQUssTUFBTSxPQUFPLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pGLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVCO1lBQ0QsS0FBSyxNQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDakYsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDNUI7U0FDSjtLQUNKO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQztBQTdCRCxnQ0E2QkMifQ==