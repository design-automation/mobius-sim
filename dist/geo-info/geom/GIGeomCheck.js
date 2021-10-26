/**
 * Class for geometry.
 */
export class GIGeomCheck {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tQ2hlY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tQ2hlY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7O0dBRUc7QUFDSCxNQUFNLE9BQU8sV0FBVztJQUdwQjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0Q7O09BRUc7SUFDSSxLQUFLO1FBQ1IsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFFLENBQUM7UUFDMUQsb0ZBQW9GO1FBQ3BGLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBRSxLQUFL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