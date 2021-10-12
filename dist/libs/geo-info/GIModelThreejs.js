"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIModelThreejs = void 0;
const common_1 = require("./common");
/**
 * Geo-info model class.
 */
class GIModelThreejs {
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
        const num_ents = this.modeldata.geom.query.numEnts(common_1.EEntType.VERT);
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
exports.GIModelThreejs = GIModelThreejs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbFRocmVlanMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9HSU1vZGVsVGhyZWVqcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBb0M7QUFJcEM7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFHeEI7O1FBRUk7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7T0FFRztJQUNLLGVBQWU7UUFDbkIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN4QjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDRDs7T0FFRztJQUNJLFVBQVUsQ0FBQyxJQUFZO1FBQzFCLHNDQUFzQztRQUN0QyxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxHQUFzQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUgsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBc0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlILE1BQU0sY0FBYyxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RixJQUFJLGFBQWEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNoQixhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzFDO1FBQ0QsbUJBQW1CO1FBQ25CLE1BQU0sYUFBYSxHQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDL0QsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxXQUFXLEVBQUUsY0FBYyxFQUM5QixrQkFBa0IsRUFBRSxxQkFBcUIsRUFDekMseUJBQXlCLEVBQ3pCLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxHQUtuQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMvRCx5QkFBeUI7UUFDekIsTUFBTSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQ2hDLG1CQUFtQixFQUFFLHNCQUFzQixFQUMzQywwQkFBMEIsRUFDMUIsZUFBZSxFQUFFLHFCQUFxQixDQUFDLEdBS3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLDJCQUEyQjtRQUMzQixNQUFNLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLEdBRWpDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pFLDJDQUEyQztRQUMzQyxNQUFNLElBQUksR0FBYTtZQUNuQixTQUFTLEVBQUUsU0FBUztZQUNwQixhQUFhLEVBQUUsYUFBYTtZQUM1QixTQUFTLEVBQUUsU0FBUztZQUNwQixTQUFTLEVBQUUsVUFBVTtZQUNyQixTQUFTLEVBQUUsVUFBVTtZQUNyQixPQUFPLEVBQUUsY0FBYztZQUN2QixNQUFNLEVBQUUsYUFBYTtZQUVyQixhQUFhLEVBQUUsYUFBYTtZQUM1QixnQkFBZ0IsRUFBRSxnQkFBZ0I7WUFFbEMsWUFBWSxFQUFFLFlBQVk7WUFDMUIsZUFBZSxFQUFFLGVBQWU7WUFFaEMsV0FBVyxFQUFFLFdBQVc7WUFDeEIsY0FBYyxFQUFFLGNBQWM7WUFFOUIsbUJBQW1CLEVBQUUsbUJBQW1CO1lBQ3hDLHNCQUFzQixFQUFFLHNCQUFzQjtZQUU5QyxrQkFBa0IsRUFBRSxrQkFBa0I7WUFDdEMscUJBQXFCLEVBQUUscUJBQXFCO1lBRTVDLHlCQUF5QixFQUFFLHlCQUF5QjtZQUNwRCwwQkFBMEIsRUFBRSwwQkFBMEI7WUFFdEQsZUFBZSxFQUFFLGVBQWU7WUFDaEMscUJBQXFCLEVBQUUscUJBQXFCO1lBQzVDLGNBQWMsRUFBRSxjQUFjO1lBQzlCLG9CQUFvQixFQUFFLG9CQUFvQjtTQUM3QyxDQUFDO1FBQ0YsdUNBQXVDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQTlGRCx3Q0E4RkMifQ==