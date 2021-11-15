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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9pby9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBeUIsTUFBTSxXQUFXLENBQUM7QUFHNUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxVQUFVLENBQUMsS0FBYyxFQUFFLFFBQXVCLEVBQUUsSUFBWTtJQUM1RSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDbkIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsTUFBTSxRQUFRLEdBQWE7UUFDdkIsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1FBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1FBQ2IsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO0tBQ2hCLENBQUM7SUFDRixLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksUUFBUSxFQUFFO1FBQ3RDLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7YUFBTSxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3BDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO2FBQU0sSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLEtBQUssRUFBRTtZQUNwQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMxQjthQUFNLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDbkMsS0FBSyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDL0UsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDM0I7WUFDRCxLQUFLLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNqRixRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM1QjtZQUNELEtBQUssTUFBTSxPQUFPLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pGLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVCO1NBQ0o7S0FDSjtJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUMifQ==