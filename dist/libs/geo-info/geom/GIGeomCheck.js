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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tQ2hlY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbUNoZWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBR3BCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFDRDs7T0FFRztJQUNJLEtBQUs7UUFDUixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQztRQUMxRCxvRkFBb0Y7UUFDcEYsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQztRQUMzRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFF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