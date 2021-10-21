import { EEntType } from '../common';
/**
 * Given a list of entities, keep only the obects.
 * If the entities include collections, extract objects out of the collections.
 * Returns sets of objects.
 */
export function getObjSets(model, entities, ssid) {
    if (entities === null) {
        return model.modeldata.geom.snapshot.getAllEntSets(ssid);
    }
    const ent_sets = {
        pt: new Set(),
        pl: new Set(),
        pg: new Set(),
    };
    for (const [ent_type, ent_i] of entities) {
        if (ent_type === EEntType.PGON) {
            ent_sets.pt.add(ent_i);
        }
        else if (ent_type === EEntType.PLINE) {
            ent_sets.pl.add(ent_i);
        }
        else if (ent_type === EEntType.POINT) {
            ent_sets.pt.add(ent_i);
        }
        else if (ent_type === EEntType.COLL) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vaW8vY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQXlCLE1BQU0sV0FBVyxDQUFDO0FBRzVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQWMsRUFBRSxRQUF1QixFQUFFLElBQVk7SUFDNUUsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQ25CLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1RDtJQUNELE1BQU0sUUFBUSxHQUFhO1FBQ3ZCLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRTtRQUNiLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRTtRQUNiLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRTtLQUNoQixDQUFDO0lBQ0YsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUN0QyxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO2FBQU0sSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLEtBQUssRUFBRTtZQUNwQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMxQjthQUFNLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDcEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7YUFBTSxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQ25DLEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQy9FLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzNCO1lBQ0QsS0FBSyxNQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDakYsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDNUI7WUFDRCxLQUFLLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNqRixRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM1QjtTQUNKO0tBQ0o7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDIn0=