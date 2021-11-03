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
        const [tri_verts_i, tri_select_map, vrmesh_tri_verts_i, vrmesh_tri_select_map, vrmesh_hidden_tri_verts_i, pgon_materials, pgon_material_groups, vrmesh_pgon_material_groups] = this.modeldata.geom.threejs.get3jsTris(ssid, vertex_map);
        // get the data for edges
        const [edge_verts_i, edge_select_map, vrmesh_edge_verts_i, vrmesh_edge_select_map, vrmesh_hidden_edge_verts_i, pline_materials, pline_material_groups, vrmesh_pline_material_groups] = this.modeldata.geom.threejs.get3jsEdges(ssid, vertex_map);
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
            vrmesh_pline_material_groups: vrmesh_pline_material_groups,
            pgon_materials: pgon_materials,
            pgon_material_groups: pgon_material_groups,
            vrmesh_pgon_material_groups: vrmesh_pgon_material_groups
        };
        // console.log("THREEJS DATA: ", data);
        return data;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbFRocmVlanMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWJzL2dlby1pbmZvL0dJTW9kZWxUaHJlZWpzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFJcEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQUd4Qjs7UUFFSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOztPQUVHO0lBQ0ssZUFBZTtRQUNuQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEUsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDeEI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0Q7O09BRUc7SUFDSSxVQUFVLENBQUMsSUFBWTtRQUMxQixzQ0FBc0M7UUFDdEMsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsR0FBc0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVILE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEdBQXNDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5SCxNQUFNLGNBQWMsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUYsSUFBSSxhQUFhLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDaEIsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUMxQztRQUNELG1CQUFtQjtRQUNuQixNQUFNLGFBQWEsR0FBYSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELDZCQUE2QjtRQUM3QixNQUFNLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFDOUIsa0JBQWtCLEVBQUUscUJBQXFCLEVBQ3pDLHlCQUF5QixFQUN6QixjQUFjLEVBQUUsb0JBQW9CLEVBQUUsMkJBQTJCLENBQUMsR0FPaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDL0QseUJBQXlCO1FBQ3pCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUNoQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFDM0MsMEJBQTBCLEVBQzFCLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSw0QkFBNEIsQ0FBQyxHQUtuRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNoRSwyQkFBMkI7UUFDM0IsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxHQUVqQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRSwyQ0FBMkM7UUFDM0MsTUFBTSxJQUFJLEdBQWE7WUFDbkIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsYUFBYSxFQUFFLGFBQWE7WUFDNUIsU0FBUyxFQUFFLFNBQVM7WUFDcEIsU0FBUyxFQUFFLFVBQVU7WUFDckIsU0FBUyxFQUFFLFVBQVU7WUFDckIsT0FBTyxFQUFFLGNBQWM7WUFDdkIsTUFBTSxFQUFFLGFBQWE7WUFFckIsYUFBYSxFQUFFLGFBQWE7WUFDNUIsZ0JBQWdCLEVBQUUsZ0JBQWdCO1lBRWxDLFlBQVksRUFBRSxZQUFZO1lBQzFCLGVBQWUsRUFBRSxlQUFlO1lBRWhDLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLGNBQWMsRUFBRSxjQUFjO1lBRTlCLG1CQUFtQixFQUFFLG1CQUFtQjtZQUN4QyxzQkFBc0IsRUFBRSxzQkFBc0I7WUFFOUMsa0JBQWtCLEVBQUUsa0JBQWtCO1lBQ3RDLHFCQUFxQixFQUFFLHFCQUFxQjtZQUU1Qyx5QkFBeUIsRUFBRSx5QkFBeUI7WUFDcEQsMEJBQTBCLEVBQUUsMEJBQTBCO1lBRXRELGVBQWUsRUFBRSxlQUFlO1lBQ2hDLHFCQUFxQixFQUFFLHFCQUFxQjtZQUM1Qyw0QkFBNEIsRUFBRSw0QkFBNEI7WUFFMUQsY0FBYyxFQUFFLGNBQWM7WUFDOUIsb0JBQW9CLEVBQUUsb0JBQW9CO1lBQzFDLDJCQUEyQixFQUFFLDJCQUEyQjtTQUMzRCxDQUFDO1FBQ0YsdUNBQXVDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSiJ9