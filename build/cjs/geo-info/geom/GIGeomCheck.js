"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomCheck = void 0;
/**
 * Class for geometry.
 */
class GIGeomCheck {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    /**
     * Checks geometry for internal consistency
     */
    check() {
        const errors = [];
        this._checkPosis().forEach(error => errors.push(error));
        this._checkVerts().forEach(error => errors.push(error));
        this._checkEdges().forEach(error => errors.push(error));
        this._checkWires().forEach(error => errors.push(error));
        // this._checkPgons2().forEach( error => errors.push(error) ); this used to be faces
        this._checkPoints().forEach(error => errors.push(error));
        this._checkPlines().forEach(error => errors.push(error));
        this._checkPgons().forEach(error => errors.push(error));
        this._checkEdgeOrder().forEach(error => errors.push(error));
        return errors;
    }
    /**
     * Checks geometry for internal consistency
     */
    _checkPosis() {
        const errors = [];
        this._geom_maps.up_posis_verts.forEach((verts_i, posi_i) => {
            // up
            if (verts_i === null) {
                errors.push('Posi ' + posi_i + ': null.');
                return;
            }
            // down
            for (const vert_i of verts_i) {
                const vert = this._geom_maps.dn_verts_posis.get(vert_i);
                if (vert === undefined) {
                    errors.push('Posi ' + posi_i + ': Vert->Posi undefined.');
                }
                if (vert === null) {
                    errors.push('Posi ' + posi_i + ': Vert->Posi null.');
                }
            }
        });
        return errors;
    }
    _checkVerts() {
        const errors = [];
        this._geom_maps.dn_verts_posis.forEach((vert, vert_i) => {
            // check the vert itself
            if (vert === null) {
                errors.push('Vert ' + vert_i + ': null.');
                return;
            } // deleted
            // check the position
            const posi_i = vert;
            // check that the position points up to this vertex
            const verts_i = this._geom_maps.up_posis_verts.get(posi_i);
            if (verts_i.indexOf(vert_i) === -1) {
                errors.push('Vert ' + vert_i + ': Posi->Vert index is missing.');
            }
            // check if the parent is a popint or edge
            const point_i = this._geom_maps.up_verts_points.get(vert_i);
            const edges_i = this._geom_maps.up_verts_edges.get(vert_i);
            if (point_i !== undefined && edges_i !== undefined) {
                errors.push('Vert ' + vert_i + ': Both Vert->Edge and Vert->Point.');
            }
            if (point_i !== undefined) {
                // up for points
                if (point_i === undefined) {
                    errors.push('Vert ' + vert_i + ': Vert->Point undefined.');
                    return;
                }
                if (point_i === null) {
                    errors.push('Vert ' + vert_i + ': Vert->Point null.');
                    return;
                }
                // down for points
                const point = this._geom_maps.dn_points_verts.get(point_i);
                if (point === undefined) {
                    errors.push('Vert ' + vert_i + ': Point->Vert undefined.');
                }
                if (point === null) {
                    errors.push('Vert ' + vert_i + ': Point->Vert null.');
                }
                // check this point points to this vertex
                if (point !== vert_i) {
                    errors.push('Vert ' + vert_i + ': Point->Vert index is incorrect.');
                }
            }
            else if (edges_i !== undefined) {
                // up for edges
                if (edges_i === undefined) {
                    errors.push('Vert ' + vert_i + ': Vert->Edge undefined.');
                    return;
                }
                if (edges_i === null) {
                    errors.push('Vert ' + vert_i + ': Vert->Edge null.');
                    return;
                }
                if (edges_i.length > 2) {
                    errors.push('Vert ' + vert_i + ': Vert->Edge has more than two edges.');
                }
                for (const edge_i of edges_i) {
                    if (edge_i === undefined) {
                        errors.push('Vert ' + vert_i + ': Vert->Edge undefined.');
                    }
                    if (edge_i === null) {
                        errors.push('Vert ' + vert_i + ': Vert->Edge null.');
                    }
                    // down for edges
                    const edge = this._geom_maps.dn_edges_verts.get(edge_i);
                    if (edge === undefined) {
                        errors.push('Vert ' + vert_i + ': Edge->Vert undefined.');
                    }
                    else if (edge === null) {
                        errors.push('Vert ' + vert_i + ': Edge->Vert null.');
                    }
                    else {
                        // check the egde points down to this vertex
                        if (edge.indexOf(vert_i) === -1) {
                            errors.push('Vert ' + vert_i + ': Edge->Vert index is missing.');
                        }
                    }
                }
            }
            else {
                errors.push('Vert ' + vert_i + ': Both Vert->Edge and Vert->Point undefined.');
            }
        });
        return errors;
    }
    _checkEdges() {
        const errors = [];
        this._geom_maps.dn_edges_verts.forEach((edge, edge_i) => {
            // check the edge itself
            if (edge === null) {
                errors.push('Edge ' + edge_i + ': null.');
                return;
            }
            if (edge.length > 2) {
                errors.push('Edge ' + edge_i + ': Edge has more than two vertices.');
            }
            // down from edge to vertices
            const verts_i = edge;
            for (const vert_i of verts_i) {
                // check the vertex
                if (vert_i === undefined) {
                    errors.push('Edge ' + edge_i + ': Edge->Vert undefined.');
                }
                else if (vert_i === null) {
                    errors.push('Edge ' + edge_i + ': Edge->Vert null.');
                }
                else {
                    // check the vert points up to this edge
                    const vert_edges_i = this._geom_maps.up_verts_edges.get(vert_i);
                    if (vert_edges_i.indexOf(edge_i) === -1) {
                        errors.push('Edge ' + edge_i + ': Vert->Edge index is missing.');
                    }
                }
            }
            // up from edge to wire
            const wire_i = this._geom_maps.up_edges_wires.get(edge_i);
            if (wire_i === undefined) {
                return;
            } // no wire, must be a point
            if (wire_i === null) {
                errors.push('Edge ' + edge_i + ': Edge->Wire null.');
            }
            // check the wire
            const wire = this._geom_maps.dn_wires_edges.get(wire_i);
            if (wire === undefined) {
                errors.push('Edge ' + edge_i + ': Wire->Edge undefined.');
            }
            else if (wire === null) {
                errors.push('Edge ' + edge_i + ': Wire->Edge null.');
            }
            else {
                // check the wire points down to this edge
                if (wire.indexOf(edge_i) === -1) {
                    errors.push('Edge ' + edge_i + ': Wire->Edge index is missing.');
                }
            }
        });
        return errors;
    }
    _checkWires() {
        const errors = [];
        this._geom_maps.dn_wires_edges.forEach((wire, wire_i) => {
            // check the wire itself
            if (wire === null) {
                errors.push('Wire ' + wire_i + ': null.');
                return;
            } // deleted
            // down from wire to edges
            const edges_i = wire;
            for (const edge_i of edges_i) {
                // check the edge
                if (edge_i === undefined) {
                    errors.push('Wire ' + wire_i + ': Wire->Edge undefined.');
                }
                else if (edge_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Edge null.');
                }
                else {
                    // check the edge points up to this wire
                    const edge_wire_i = this._geom_maps.up_edges_wires.get(edge_i);
                    if (edge_wire_i !== wire_i) {
                        errors.push('Wire ' + wire_i + ': Edge->Wire index is incorrect.');
                    }
                }
            }
            // up from wire to face or pline
            const pgon_i = this._geom_maps.up_wires_pgons.get(wire_i);
            const pline_i = this._geom_maps.up_wires_plines.get(wire_i);
            if (pgon_i !== undefined && pline_i !== undefined) {
                // errors.push('Wire ' + wire_i + ': Both Wire->Pgon and Wire->Pline.');
            }
            if (pgon_i !== undefined) {
                if (pgon_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Pgon null.');
                }
                // down from Pgon to wires (and tris)
                const pgon = this._geom_maps.dn_pgons_wires.get(pgon_i);
                if (pgon === undefined) {
                    errors.push('Wire ' + wire_i + ': Pgon->Wire undefined.');
                }
                else if (pgon === null) {
                    errors.push('Wire ' + wire_i + ': Pgon->Wire null.');
                }
                else {
                    // check that this face points down to the wire
                    if (pgon.indexOf(wire_i) === -1) {
                        errors.push('Wire ' + wire_i + ': Pgon->Wire index is missing.');
                    }
                }
            }
            else if (pline_i !== undefined) {
                if (pline_i === null) {
                    errors.push('Wire ' + wire_i + ': Wire->Pline null.');
                }
                // down from pline to wire
                const pline = this._geom_maps.dn_plines_wires.get(pline_i);
                if (pline === undefined) {
                    errors.push('Wire ' + wire_i + ': Pline->Wire undefined.');
                }
                else if (pline === null) {
                    errors.push('Wire ' + wire_i + ': Pline->Wire null.');
                }
                else {
                    // check that this pline points down to the wire
                    if (pline !== wire_i) {
                        errors.push('Wire ' + wire_i + ': Pline->Wire index is incorrect.');
                    }
                }
            }
            else {
                errors.push('Wire ' + wire_i + ': Both Wire->Face and Wire->Pline undefined.');
            }
        });
        return errors;
    }
    // private _checkPgons2(): string[] {
    //     const errors: string[] = [];
    //     this._geom_maps.dn_pgons_wires.forEach( (face, face_i) => {
    //         // check this face itself
    //         if (face === null) { errors.push('Face ' + face_i + ': null.'); return; } // deleted
    //         // down from face to wires
    //         const wires_i: number[] = face;
    //         for (const wire_i of wires_i) {
    //             // check the wire
    //             if (wire_i === undefined) {
    //                 errors.push('Face ' + face_i + ': Face->Wire undefined.');
    //             } else if (wire_i === null) {
    //                 errors.push('Face ' + face_i + ': Face->Wire null.');
    //             } else {
    //                 // check the wire points up to this face
    //                 const wire_face_i: number = this._geom_maps.up_wires_faces.get(wire_i);
    //                 if (wire_face_i !== face_i) {
    //                     errors.push('Face ' + face_i + ': Wire->Face index is incorrect.');
    //                 }
    //             }
    //         }
    //         // up from face to pgon
    //         const pgon_i: number = this._geom_maps.up_faces_pgons.get(face_i);
    //         if (pgon_i === undefined) {
    //             errors.push('Face ' + face_i + ': Face->Pgon undefined.');
    //         } else if (pgon_i === null) {
    //             errors.push('Face ' + face_i + ': Face->Pgon null.');
    //         }
    //         // down from pgon to face
    //         const pgon: TPgon = this._geom_maps.dn_pgons_faces.get(pgon_i);
    //         if (pgon === undefined) {
    //             errors.push('Face ' + face_i + ': Pgon->Face undefined.');
    //         } else if (pgon === null) {
    //             errors.push('Face ' + face_i + ': Pgon->Face null.');
    //         } else {
    //             // check that this pgon points down to this face
    //             if (pgon !== face_i) {
    //                 errors.push('Face ' + face_i + ': Pgon->Face index is incorrect.');
    //             }
    //         }
    //     });
    //     this._geom_maps.dn_faces_tris.forEach( (facetris, face_i) => {
    //         // check this face itself
    //         if (facetris === null) { errors.push('Face ' + face_i + ': null.'); return; } // deleted
    //         // down from face to triangles
    //         const tris_i: number[] = facetris;
    //         for (const tri_i of tris_i) {
    //             // check the wire
    //             if (tri_i === undefined) {
    //                 errors.push('Face ' + face_i + ': Face->Tri undefined.');
    //             } else if (tri_i === null) {
    //                 errors.push('Face ' + face_i + ': Face->Tri null.');
    //             } else {
    //                 // check the tri points up to this face
    //                 const tri_face_i: number = this._geom_maps.up_tris_faces.get(tri_i);
    //                 if (tri_face_i !== face_i) {
    //                     errors.push('Face ' + face_i + ': Tri->Face index is incorrect.');
    //                 }
    //             }
    //         }
    //     });
    //     return errors;
    // }
    _checkPoints() {
        const errors = [];
        this._geom_maps.dn_points_verts.forEach((point, point_i) => {
            // check the point itself
            if (point === null) {
                errors.push('Point ' + point_i + ': null.');
                return;
            } // deleted
            // down from point to vertex
            const vert_i = point;
            // check that the vertex points up to this point
            const vertex_point_i = this._geom_maps.up_verts_points.get(vert_i);
            if (vertex_point_i !== point_i) {
                errors.push('Point ' + point_i + ': Vertex->Point index is incorrect.');
            }
            // up from point to coll
            // TODO check collections
            // const colls_i: number[] = this._geom_maps.up_points_colls.get(point_i);
            // if (colls_i === undefined) { return; } // not in coll
            // for (const coll_i of colls_i) {
            //     if (coll_i === undefined) {
            //         errors.push('Point ' + point_i + ': Point->Coll undefined.');
            //     }
            //     if (coll_i === null) {
            //         errors.push('Point ' + point_i + ': Point->Coll null.');
            //     }
            //     // down from coll to points
            //     const coll_points: number[] = this._geom_maps.dn_colls_points.get(coll_i);
            //     if (coll_points === undefined) { errors.push('Point ' + point_i + ': Coll->Objs undefined.'); }
            //     if (coll_points === null) { errors.push('Point ' + point_i + ': Coll->Objs null.'); }
            //     if (coll_points.indexOf(point_i) === -1) {
            //         errors.push('Point ' + point_i + ': Coll->Point missing.');
            //     }
            // }
        });
        return errors;
    }
    _checkPlines() {
        const errors = [];
        this._geom_maps.dn_plines_wires.forEach((pline, pline_i) => {
            // check the pline itself
            if (pline === null) {
                errors.push('Pline ' + pline_i + ': null.');
                return;
            } // deleted
            // down from pline to wire
            const wire_i = pline;
            // check that the wire points up to this pline
            const wire_pline_i = this._geom_maps.up_wires_plines.get(wire_i);
            if (wire_pline_i !== pline_i) {
                errors.push('Pline ' + pline_i + ': Wire->Pline index is incorrect.');
            }
            // up from pline to coll
            // TODO check collections
            // const colls_i: number[] = this._geom_maps.up_plines_colls.get(pline_i);
            // if (colls_i === undefined) { return; } // not in coll
            // for (const coll_i of colls_i) {
            //     if (coll_i === undefined) {
            //         errors.push('Pline ' + pline_i + ': Pline->Coll undefined.');
            //     }
            //     if (coll_i === null) {
            //         errors.push('Pline ' + pline_i + ': Pline->Coll null.');
            //     }
            //     // down from coll to plines
            //     const coll_plines: number[] = this._geom_maps.dn_colls_plines.get(coll_i);
            //     if (coll_plines === undefined) { errors.push('Pline ' + pline_i + ': Coll->Objs undefined.'); }
            //     if (coll_plines === null) { errors.push('Pline ' + pline_i + ': Coll->Objs null.'); }
            //     if (coll_plines.indexOf(pline_i) === -1) {
            //         errors.push('Pline ' + pline_i + ': Coll->Pline missing.');
            //     }
            // }
        });
        return errors;
    }
    _checkPgons() {
        // TODO update this, see _checkPgons2()
        const errors = [];
        this._geom_maps.dn_pgons_wires.forEach((pgon, pgon_i) => {
            // check the pgon itself
            if (pgon === undefined) {
                return;
            }
            if (pgon === null) {
                errors.push('Pgon ' + pgon_i + ': null.');
                return;
            } // deleted
            // down from pgon to face
            // const face_i: number = pgon;
            // // check that the face points up to this pgon
            // const face_pgon_i: number = this._geom_maps.up_faces_pgons.get(face_i);
            // if (face_pgon_i !== pgon_i) {
            //     errors.push('Pgon ' + pgon_i + ': Face->Pgon index is incorrect.');
            // }
            // up from pgon to coll
            // TODO check collections
            // const colls_i: number[] = this._geom_maps.up_pgons_colls.get(pgon_i);
            // if (colls_i === undefined) { return; } // not in coll
            // for (const coll_i of colls_i) {
            //     if (coll_i === undefined) {
            //         errors.push('Pgon ' + pgon_i + ': Pgon->Coll undefined.');
            //     }
            //     if (coll_i === null) {
            //         errors.push('Pgon ' + pgon_i + ': Pgon->Coll null.');
            //     }
            //     // down from coll to pgons
            //     const coll_pgons: number[] = this._geom_maps.dn_colls_pgons.get(coll_i);
            //     if (coll_pgons === undefined) { errors.push('Pgon ' + pgon_i + ': Coll->Objs undefined.'); }
            //     if (coll_pgons === null) { errors.push('Pgon ' + pgon_i + ': Coll->Objs null.'); }
            //     if (coll_pgons.indexOf(pgon_i) === -1) {
            //         errors.push('Pgon ' + pgon_i + ': Coll->Pgon missing.');
            //     }
            // }
        });
        return errors;
    }
    _checkEdgeOrder() {
        const errors = [];
        this._geom_maps.dn_wires_edges.forEach((wire, wire_i) => {
            // down
            if (wire === null) {
                errors.push('Wire ' + wire_i + ': null.');
                return;
            }
            // check if this is closed or open
            const first_edge = this._geom_maps.dn_edges_verts.get(wire[0]);
            const first_vert_i = first_edge[0];
            const last_edge = this._geom_maps.dn_edges_verts.get(wire[wire.length - 1]);
            const last_vert_i = last_edge[1];
            const is_closed = (first_vert_i === last_vert_i);
            if (!is_closed) {
                if (this._geom_maps.up_verts_edges.get(first_edge[0]).length !== 1) {
                    errors.push('Open wire ' + wire_i + ': First vertex does not have one edge.');
                }
                if (this._geom_maps.up_verts_edges.get(last_edge[1]).length !== 1) {
                    errors.push('Open wire ' + wire_i + ': Last vertex does not have one edge.');
                }
            }
            // console.log("==== ==== ====")
            // console.log("WIRE i", wire_i, "WIRE", wire)
            // check the edges of each vertex
            for (const edge_i of wire) {
                const edge = this._geom_maps.dn_edges_verts.get(edge_i);
                const start_vert_i = edge[0];
                const end_vert_i = edge[1];
                // console.log("====")
                // console.log("EDGE i", edge_i, "EDGE", edge)
                // console.log("VERT START", start_vert_i)
                // console.log("VERT END", end_vert_i)
                let exp_num_edges_vert0 = 2;
                let exp_num_edges_vert1 = 2;
                let start_idx = 1;
                let end_idx = 0;
                if (!is_closed) {
                    if (edge_i === wire[0]) { // first edge
                        exp_num_edges_vert0 = 1;
                        start_idx = 0;
                    }
                    if (edge_i === wire[wire.length - 1]) { // last edge
                        exp_num_edges_vert1 = 1;
                        end_idx = 0;
                    }
                }
                // check the start vertex
                const start_vert_edges_i = this._geom_maps.up_verts_edges.get(start_vert_i);
                // console.log("START VERT EDGES", start_vert_edges_i)
                if (start_vert_edges_i.length !== exp_num_edges_vert0) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + start_vert_i +
                        ': Start vertex does not have correct number of edges.');
                }
                if (start_vert_edges_i[start_idx] !== edge_i) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + start_vert_i +
                        ': Vertex edges are in the wrong order.');
                }
                // check the end vertex
                const end_vert_edges_i = this._geom_maps.up_verts_edges.get(end_vert_i);
                // console.log("END VERT EDGES", end_vert_edges_i)
                if (end_vert_edges_i.length !== exp_num_edges_vert1) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + start_vert_i +
                        ': End vertex does not have correct number of edges.');
                }
                if (end_vert_edges_i[end_idx] !== edge_i) {
                    errors.push('Wire ' + wire_i + ' Edge ' + edge_i + ' Vert ' + end_vert_i +
                        ': Vertex edges are in the wrong order.');
                }
            }
        });
        return errors;
    }
}
exports.GIGeomCheck = GIGeomCheck;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tQ2hlY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tQ2hlY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUE7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFHcEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNEOztPQUVHO0lBQ0ksS0FBSztRQUNSLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDO1FBQzFELG9GQUFvRjtRQUNwRixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDO1FBQzNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUUsS0FB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