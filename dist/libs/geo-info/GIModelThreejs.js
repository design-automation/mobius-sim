import { EEntType } from './common';
/**
 * Geo-info model class.
 */
export class GIModelThreejs {
    /**
      * Constructor
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    /**
     * Generate a default color if none exists.
     */
    _generateColors() {
        const colors = [];
        const num_ents = this.modeldata.geom.query.numEnts(EEntType.VERT);
        for (let index = 0; index < num_ents; index++) {
            colors.push(1, 1, 1);
        }
        return colors;
    }
    /**
     * Returns arrays for visualization in Threejs.
     */
    get3jsData(ssid) {
        // get the attribs at the vertex level
        const [posis_xyz, posis_map] = this.modeldata.attribs.threejs.get3jsSeqPosisCoords(ssid);
        const [vertex_xyz, vertex_map] = this.modeldata.attribs.threejs.get3jsSeqVertsCoords(ssid);
        const normals_values = this.modeldata.attribs.threejs.get3jsSeqVertsNormals(ssid);
        let colors_values = this.modeldata.attribs.threejs.get3jsSeqVertsColors(ssid);
        if (!colors_values) {
            colors_values = this._generateColors();
        }
        // get posi indices
        const posis_indices = Array.from(posis_map.values());
        // get the data for triangles
        const [tri_verts_i, tri_select_map, vrmesh_tri_verts_i, vrmesh_tri_select_map, vrmesh_hidden_tri_verts_i, pgon_materials, pgon_material_groups] = this.modeldata.geom.threejs.get3jsTris(ssid, vertex_map);
        // get the data for edges
        const [edge_verts_i, edge_select_map, vrmesh_edge_verts_i, vrmesh_edge_select_map, vrmesh_hidden_edge_verts_i, pline_materials, pline_material_groups] = this.modeldata.geom.threejs.get3jsEdges(ssid, vertex_map);
        // get the datas for points
        const [point_verts_i, point_select_map] = this.modeldata.geom.threejs.get3jsPoints(ssid, vertex_map);
        // return an object containing all the data
        const data = {
            posis_xyz: posis_xyz,
            posis_indices: posis_indices,
            posis_map: posis_map,
            verts_xyz: vertex_xyz,
            verts_map: vertex_map,
            normals: normals_values,
            colors: colors_values,
            point_indices: point_verts_i,
            point_select_map: point_select_map,
            edge_indices: edge_verts_i,
            edge_select_map: edge_select_map,
            tri_indices: tri_verts_i,
            tri_select_map: tri_select_map,
            vrmesh_edge_indices: vrmesh_edge_verts_i,
            vrmesh_edge_select_map: vrmesh_edge_select_map,
            vrmesh_tri_indices: vrmesh_tri_verts_i,
            vrmesh_tri_select_map: vrmesh_tri_select_map,
            vrmesh_hidden_tri_indices: vrmesh_hidden_tri_verts_i,
            vrmesh_hidden_edge_indices: vrmesh_hidden_edge_verts_i,
            pline_materials: pline_materials,
            pline_material_groups: pline_material_groups,
            pgon_materials: pgon_materials,
            pgon_material_groups: pgon_material_groups
        };
        // console.log("THREEJS DATA: ", data);
        return data;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbFRocmVlanMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9HSU1vZGVsVGhyZWVqcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBSXBDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUFHeEI7O1FBRUk7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7T0FFRztJQUNLLGVBQWU7UUFDbkIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNEOztPQUVHO0lBQ0ksVUFBVSxDQUFDLElBQVk7UUFDMUIsc0NBQXNDO1FBQ3RDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQXNDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1SCxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxHQUFzQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUgsTUFBTSxjQUFjLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVGLElBQUksYUFBYSxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2hCLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDMUM7UUFDRCxtQkFBbUI7UUFDbkIsTUFBTSxhQUFhLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMvRCw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLFdBQVcsRUFBRSxjQUFjLEVBQzlCLGtCQUFrQixFQUFFLHFCQUFxQixFQUN6Qyx5QkFBeUIsRUFDekIsY0FBYyxFQUFFLG9CQUFvQixDQUFDLEdBS25DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQy9ELHlCQUF5QjtRQUN6QixNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFDaEMsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQzNDLDBCQUEwQixFQUMxQixlQUFlLEVBQUUscUJBQXFCLENBQUMsR0FLckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEUsMkJBQTJCO1FBQzNCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsR0FFakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakUsMkNBQTJDO1FBQzNDLE1BQU0sSUFBSSxHQUFhO1lBQ25CLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLGFBQWEsRUFBRSxhQUFhO1lBQzVCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLE1BQU0sRUFBRSxhQUFhO1lBRXJCLGFBQWEsRUFBRSxhQUFhO1lBQzVCLGdCQUFnQixFQUFFLGdCQUFnQjtZQUVsQyxZQUFZLEVBQUUsWUFBWTtZQUMxQixlQUFlLEVBQUUsZUFBZTtZQUVoQyxXQUFXLEVBQUUsV0FBVztZQUN4QixjQUFjLEVBQUUsY0FBYztZQUU5QixtQkFBbUIsRUFBRSxtQkFBbUI7WUFDeEMsc0JBQXNCLEVBQUUsc0JBQXNCO1lBRTlDLGtCQUFrQixFQUFFLGtCQUFrQjtZQUN0QyxxQkFBcUIsRUFBRSxxQkFBcUI7WUFFNUMseUJBQXlCLEVBQUUseUJBQXlCO1lBQ3BELDBCQUEwQixFQUFFLDBCQUEwQjtZQUV0RCxlQUFlLEVBQUUsZUFBZTtZQUNoQyxxQkFBcUIsRUFBRSxxQkFBcUI7WUFDNUMsY0FBYyxFQUFFLGNBQWM7WUFDOUIsb0JBQW9CLEVBQUUsb0JBQW9CO1NBQzdDLENBQUM7UUFDRix1Q0FBdUM7UUFDdkMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKIn0=