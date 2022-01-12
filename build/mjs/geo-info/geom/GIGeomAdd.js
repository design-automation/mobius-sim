import { EEntType, EAttribNames } from '../common';
import { triangulate } from '../../triangulate/triangulate';
import { vecAdd } from '../../geom/vectors';
/**
 * Class for geometry.
 */
export class GIGeomAdd {
    modeldata;
    _geom_maps;
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Add geometry
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    addPosi() {
        const ssid = this.modeldata.active_ssid;
        // in this case, there are no down arrays
        // because posis are the bottom of the hierarchy
        // update up arrays
        const posi_i = this.modeldata.model.metadata.nextPosi();
        this._geom_maps.up_posis_verts.set(posi_i, []);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POSI, posi_i);
        // return entity number
        return posi_i;
    }
    /**
     * Adds a new point entity to the model.
     * @param posi_i The position for the point.
     */
    addPoint(posi_i) {
        const ssid = this.modeldata.active_ssid;
        // create vert
        const vert_i = this._addVertex(posi_i);
        // create point
        const point_i = this.modeldata.model.metadata.nextPoint();
        this._geom_maps.dn_points_verts.set(point_i, vert_i);
        this._geom_maps.up_verts_points.set(vert_i, point_i);
        // time stamp
        this.modeldata.attribs.set.setEntAttribVal(EEntType.POINT, point_i, EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.POINT, point_i);
        // return entity number
        return point_i;
    }
    /**
     * Adds a new pline entity to the model using numeric indices.
     * @param posis_i
     */
    addPline(posis_i, close = false) {
        const ssid = this.modeldata.active_ssid;
        // create verts, edges, wires
        const vert_i_arr = posis_i.map(posi_i => this._addVertex(posi_i));
        const edges_i_arr = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push(this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        if (close) {
            edges_i_arr.push(this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        }
        const wire_i = this._addWire(edges_i_arr, close);
        // create pline
        const pline_i = this.modeldata.model.metadata.nextPline();
        this._geom_maps.dn_plines_wires.set(pline_i, wire_i);
        this._geom_maps.up_wires_plines.set(wire_i, pline_i);
        // time stamp
        this.modeldata.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i, EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PLINE, pline_i);
        // return entity number
        return pline_i;
    }
    /**
     * Adds a new polygon + hole entity to the model using numeric indices.
     * @param posis_id
     */
    addPgon(posis_i, holes_posis_i) {
        const ssid = this.modeldata.active_ssid;
        const has_holes = (holes_posis_i !== undefined) && (holes_posis_i.length) ? true : false;
        // create verts, edges, wire for face
        const vert_i_arr = posis_i.map(posi_i => this._addVertex(posi_i));
        const edges_i_arr = [];
        for (let i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push(this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        edges_i_arr.push(this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        const wire_i = this._addWire(edges_i_arr, true);
        let pgon_i;
        if (has_holes) {
            // create verts, edges, wire for holes
            const holes_wires_i = [];
            for (const hole_posis_i of holes_posis_i) {
                const hole_vert_i_arr = hole_posis_i.map(posi_i => this._addVertex(posi_i));
                const hole_edges_i_arr = [];
                for (let i = 0; i < hole_vert_i_arr.length - 1; i++) {
                    hole_edges_i_arr.push(this._addEdge(hole_vert_i_arr[i], hole_vert_i_arr[i + 1]));
                }
                hole_edges_i_arr.push(this._addEdge(hole_vert_i_arr[hole_vert_i_arr.length - 1], hole_vert_i_arr[0]));
                const hole_wire_i = this._addWire(hole_edges_i_arr, true);
                holes_wires_i.push(hole_wire_i);
            }
            // create the new pgon with a hole
            pgon_i = this._addPgonWithHoles(wire_i, holes_wires_i);
        }
        else {
            // create the new pgon without a hole
            pgon_i = this._addPgonWithoutHoles(wire_i);
        }
        // time stamp
        this.modeldata.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i, EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.PGON, pgon_i);
        // return entity number
        return pgon_i;
    }
    /**
     * Adds a collection.
     * @param parent_i
     * @param points_i
     * @param plines_i
     * @param pgons_i
     */
    addColl() {
        const ssid = this.modeldata.active_ssid;
        // create collection
        const coll_i = this.modeldata.model.metadata.nextColl();
        this._geom_maps.colls.add(coll_i);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, EEntType.COLL, coll_i);
        // return entity number
        return coll_i;
    }
    // ============================================================================
    // Copy geometry
    // ============================================================================
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    copyMovePosi(posi_i, move_vector, copy_attribs) {
        const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
        const new_posi_i = this.addPosi();
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, vecAdd(xyz, move_vector));
        if (copy_attribs) {
            const attrib_names = this.modeldata.attribs.getAttribNames(EEntType.POSI);
            for (const attrib_name of attrib_names) {
                if (attrib_name !== 'xyz') {
                    const value = this.modeldata.attribs.get.getEntAttribVal(EEntType.POSI, posi_i, attrib_name);
                    this.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, new_posi_i, attrib_name, value);
                }
            }
        }
        return new_posi_i;
    }
    copyMovePosis(posis_i, move_vector, copy_attribs) {
        if (!Array.isArray(posis_i)) {
            return this.copyMovePosi(posis_i, move_vector, copy_attribs);
        }
        return posis_i.map(posi_i => this.copyMovePosi(posi_i, move_vector, copy_attribs));
    }
    /**
     * Copy positions.
     * @param posis_i
     * @param copy_attribs
     */
    copyPosi(posi_i, copy_attribs) {
        const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
        const new_posi_i = this.addPosi();
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, xyz);
        if (copy_attribs) {
            const attrib_names = this.modeldata.attribs.getAttribNames(EEntType.POSI);
            for (const attrib_name of attrib_names) {
                const value = this.modeldata.attribs.get.getEntAttribVal(EEntType.POSI, posi_i, attrib_name);
                this.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, new_posi_i, attrib_name, value);
            }
        }
        return new_posi_i;
    }
    copyPosis(posis_i, copy_attribs) {
        if (!Array.isArray(posis_i)) {
            return this.copyPosi(posis_i, copy_attribs);
        }
        return posis_i.map(posi_i => this.copyPosi(posi_i, copy_attribs));
    }
    /**
     * Copy points.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    copyPoint(old_point_i, copy_attribs) {
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.POINT, old_point_i);
        const new_point_i = this.addPoint(posis_i[0]);
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.POINT, old_point_i, new_point_i);
            const old_vert_i = this.modeldata.geom.nav.navPointToVert(old_point_i);
            const new_vert_i = this.modeldata.geom.nav.navPointToVert(new_point_i);
            this.modeldata.attribs.set.copyAttribs(EEntType.VERT, old_vert_i, new_vert_i);
        }
        // return the new point
        return new_point_i;
    }
    copyPoints(points_i, copy_attribs) {
        if (!Array.isArray(points_i)) {
            return this.copyPoint(points_i, copy_attribs);
        }
        return points_i.map(point_i => this.copyPoint(point_i, copy_attribs));
    }
    /**
     * Copy plines.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    copyPline(old_pline_i, copy_attribs) {
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, old_pline_i);
        const wire_i = this.modeldata.geom.nav.navPlineToWire(old_pline_i);
        const is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
        const new_pline_i = this.addPline(posis_i, is_closed);
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.PLINE, old_pline_i, new_pline_i);
            const old_topo = this.modeldata.geom.query.getObjTopo(EEntType.PLINE, old_pline_i);
            const new_topo = this.modeldata.geom.query.getObjTopo(EEntType.PLINE, new_pline_i);
            for (let i = 0; i < old_topo[0].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.VERT, old_topo[0][i], new_topo[0][i]);
            }
            for (let i = 0; i < old_topo[1].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.EDGE, old_topo[1][i], new_topo[1][i]);
            }
            for (let i = 0; i < old_topo[2].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.WIRE, old_topo[2][i], new_topo[2][i]);
            }
        }
        // return the new polyline
        return new_pline_i;
    }
    copyPlines(plines_i, copy_attribs) {
        if (!Array.isArray(plines_i)) {
            return this.copyPline(plines_i, copy_attribs);
        }
        return plines_i.map(pline_i => this.copyPline(pline_i, copy_attribs));
    }
    /**
     * Copy polygon.
     * TODO copy attribs of topo entities
     * @param index
     * @param copy_attribs
     */
    copyPgon(old_pgon_i, copy_attribs) {
        const wires_i = this.modeldata.geom.nav.navAnyToWire(EEntType.PGON, old_pgon_i);
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[0]);
        let new_pgon_i;
        if (wires_i.length === 1) {
            new_pgon_i = this.addPgon(posis_i);
        }
        else {
            const holes_posis_i = [];
            for (let i = 1; i < wires_i.length; i++) {
                const hole_posis_i = this.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wires_i[i]);
                holes_posis_i.push(hole_posis_i);
            }
            new_pgon_i = this.addPgon(posis_i, holes_posis_i);
        }
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.PGON, old_pgon_i, new_pgon_i);
            const old_topo = this.modeldata.geom.query.getObjTopo(EEntType.PGON, old_pgon_i);
            const new_topo = this.modeldata.geom.query.getObjTopo(EEntType.PGON, new_pgon_i);
            for (let i = 0; i < old_topo[0].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.VERT, old_topo[0][i], new_topo[0][i]);
            }
            for (let i = 0; i < old_topo[1].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.EDGE, old_topo[1][i], new_topo[1][i]);
            }
            for (let i = 0; i < old_topo[2].length; i++) {
                this.modeldata.attribs.set.copyAttribs(EEntType.WIRE, old_topo[2][i], new_topo[2][i]);
            }
        }
        // return the new polygon
        return new_pgon_i;
    }
    copyPgons(pgons_i, copy_attribs) {
        if (!Array.isArray(pgons_i)) {
            return this.copyPgon(pgons_i, copy_attribs);
        }
        return pgons_i.map(pgon_i => this.copyPgon(pgon_i, copy_attribs));
    }
    /**
      * Copy a collection
      * Also makes copies of all ents in the collection, and all sub collections.
      * @param ent_type
      * @param index
      * @param copy_posis
      * @param copy_attribs
      */
    copyColl(old_coll_i, copy_attribs) {
        const ssid = this.modeldata.active_ssid;
        // add the new collection
        const new_coll_i = this.addColl();
        // set the content
        const coll_points_i = this.copyPoints(this.modeldata.geom.snapshot.getCollPoints(ssid, old_coll_i), copy_attribs);
        if (coll_points_i !== undefined) {
            this.modeldata.geom.snapshot.addCollPoints(ssid, new_coll_i, coll_points_i);
        }
        const coll_plines_i = this.copyPlines(this.modeldata.geom.snapshot.getCollPlines(ssid, old_coll_i), copy_attribs);
        if (coll_plines_i !== undefined) {
            this.modeldata.geom.snapshot.addCollPlines(ssid, new_coll_i, coll_plines_i);
        }
        const coll_pgons_i = this.copyPgons(this.modeldata.geom.snapshot.getCollPgons(ssid, old_coll_i), copy_attribs);
        if (coll_pgons_i !== undefined) {
            this.modeldata.geom.snapshot.addCollPgons(ssid, new_coll_i, coll_pgons_i);
        }
        const coll_childs = this.copyColls(this.modeldata.geom.snapshot.getCollChildren(ssid, old_coll_i), copy_attribs);
        if (coll_childs !== undefined) {
            this.modeldata.geom.snapshot.addCollChildren(ssid, new_coll_i, coll_childs);
        }
        const coll_parent_i = this.modeldata.geom.snapshot.getCollParent(ssid, old_coll_i);
        if (coll_parent_i !== undefined) {
            this.modeldata.geom.snapshot.setCollParent(ssid, new_coll_i, coll_parent_i);
        }
        // TODO check for infinite loop when getting coll children
        //
        // copy the attributes from old collection to new collection
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(EEntType.COLL, old_coll_i, new_coll_i);
        }
        // return the new collection
        return new_coll_i;
    }
    copyColls(colls_i, copy_attribs) {
        if (!Array.isArray(colls_i)) {
            return this.copyColl(colls_i, copy_attribs);
        }
        return colls_i.map(coll_i => this.copyColl(coll_i, copy_attribs));
    }
    // ============================================================================
    // Methods to create pgons
    // ============================================================================
    /**
     * Adds a pgon and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    _addPgonWithoutHoles(wire_i) {
        // create the triangles
        const tris_i = this._addTris(wire_i);
        // create the wires
        const wires_i = [wire_i];
        // update down arrays
        const pgon_i = this.modeldata.model.metadata.nextPgon();
        this._geom_maps.dn_pgons_wires.set(pgon_i, wires_i);
        this._geom_maps.dn_pgons_tris.set(pgon_i, tris_i);
        // update up arrays
        this._geom_maps.up_wires_pgons.set(wire_i, pgon_i);
        tris_i.forEach(tri_i => this._geom_maps.up_tris_pgons.set(tri_i, pgon_i));
        // return the numeric index of the face
        return pgon_i;
    }
    /**
     * Adds a face with a hole and updates the arrays.
     * Wires are assumed to be closed!
     * This also calls addTris()
     * @param wire_i
     */
    _addPgonWithHoles(wire_i, holes_wires_i) {
        // create the triangles
        const tris_i = this._addTris(wire_i, holes_wires_i);
        // create the wires
        const wires_i = [wire_i].concat(holes_wires_i);
        // update down arrays
        const pgon_i = this.modeldata.model.metadata.nextPgon();
        this._geom_maps.dn_pgons_wires.set(pgon_i, wires_i);
        this._geom_maps.dn_pgons_tris.set(pgon_i, tris_i);
        // update up arrays
        wires_i.forEach(pgon_wire_i => this._geom_maps.up_wires_pgons.set(pgon_wire_i, pgon_i));
        tris_i.forEach(pgon_tri_i => this._geom_maps.up_tris_pgons.set(pgon_tri_i, pgon_i));
        // return the numeric index of the face
        return pgon_i;
    }
    // ============================================================================
    // Methods to create the topological entities
    // These methods have been made public for access from GIGeomModify
    // They should not be called externally, hence the underscore.
    // ============================================================================
    /**
     * Adds a vertex and updates the arrays.
     * @param posi_i
     */
    _addVertex(posi_i) {
        // update down arrays
        const vert_i = this.modeldata.model.metadata.nextVert();
        this._geom_maps.dn_verts_posis.set(vert_i, posi_i);
        // update up arrays
        this._geom_maps.up_posis_verts.get(posi_i).push(vert_i);
        // return the numeric index of the vertex
        return vert_i;
    }
    /**
     * Adds an edge from v1 to v2 and updates the up and down arrays.
     * Each vertex passed into this function can have zero or one edges.
     * The new edge is added to v1 and v2
     * Any existing edges are not affected
     * @param vert_i1
     * @param vert_i2
     */
    _addEdge(vert_i1, vert_i2) {
        // update down arrays
        const edge_i = this.modeldata.model.metadata.nextEdge();
        this._geom_maps.dn_edges_verts.set(edge_i, [vert_i1, vert_i2]);
        // assume there are three edges, prev, edge_i, next
        // for vert_i1, [prev, edge_i] or [edge_i]
        // update up arrays for the start vertex
        if (!this._geom_maps.up_verts_edges.has(vert_i1)) {
            this._geom_maps.up_verts_edges.set(vert_i1, []);
        }
        switch (this._geom_maps.up_verts_edges.get(vert_i1).length) {
            case 0:
                this._geom_maps.up_verts_edges.set(vert_i1, [edge_i]); // [edge_i]
                break;
            case 1:
                this._geom_maps.up_verts_edges.get(vert_i1)[1] = edge_i; // [prev, edge_i]
                break;
            case 2:
                throw new Error('Vertex must have just zero or one edges.');
            default:
                throw new Error('Vertex has wrong number of edges.');
        }
        // for vert_i2, [edge_i, next] or [edge_i]
        // update up arrays for the end vertex
        if (!this._geom_maps.up_verts_edges.has(vert_i2)) {
            this._geom_maps.up_verts_edges.set(vert_i2, []);
        }
        switch (this._geom_maps.up_verts_edges.get(vert_i2).length) {
            case 0:
                this._geom_maps.up_verts_edges.set(vert_i2, [edge_i]); // [edge_i]
                break;
            case 1:
                const next_edge_i = this._geom_maps.up_verts_edges.get(vert_i2)[0];
                this._geom_maps.up_verts_edges.set(vert_i2, [edge_i, next_edge_i]); // [edge_i, next]
                break;
            case 2:
                throw new Error('Vertex must have just zero or one edges.');
            default:
                throw new Error('Vertex has wrong number of edges.');
        }
        // return the numeric index of the edge
        return edge_i;
    }
    /**
     * Adds a wire and updates the arrays.
     * Edges are assumed to be sequential!
     * @param edges_i
     */
    _addWire(edges_i, close = false) {
        // update down arrays
        const wire_i = this.modeldata.model.metadata.nextWire();
        this._geom_maps.dn_wires_edges.set(wire_i, edges_i);
        // update up arrays
        edges_i.forEach(edge_i => this._geom_maps.up_edges_wires.set(edge_i, wire_i));
        // return the numeric index of the wire
        return wire_i;
    }
    /**
     * Adds trangles and updates the arrays.
     * Wires are assumed to be closed!
     * This updates the trie->verts and the verts->tris
     * This does not update the face to which this wire belongs!
     * @param wire_i
     */
    _addTris(wire_i, hole_wires_i) {
        // save all verts
        const all_verts_i = [];
        // get the coords of the outer perimeter edge
        const wire_verts_i = this.modeldata.geom.nav.navAnyToVert(EEntType.WIRE, wire_i);
        wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
        const wire_posis_i = wire_verts_i.map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
        const wire_coords = wire_posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
        // get the coords of the holes
        const all_hole_coords = [];
        if (hole_wires_i !== undefined) {
            for (const hole_wire_i of hole_wires_i) {
                const hole_wire_verts_i = this.modeldata.geom.nav.navAnyToVert(EEntType.WIRE, hole_wire_i);
                hole_wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
                const hole_wire_posis_i = hole_wire_verts_i.map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
                const hole_wire_coords = hole_wire_posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                all_hole_coords.push(hole_wire_coords);
            }
        }
        // create the triangles
        const tris_corners = triangulate(wire_coords, all_hole_coords);
        const tris_verts_i = tris_corners.map(tri_corners => tri_corners.map(corner => all_verts_i[corner]));
        // update down arrays, tris->verts
        const tris_i = [];
        for (const tri_verts_i of tris_verts_i) {
            const tri_i = this.modeldata.model.metadata.nextTri();
            this._geom_maps.dn_tris_verts.set(tri_i, tri_verts_i);
            tris_i.push(tri_i);
        }
        // update up arrays, verts->tris
        for (let i = 0; i < tris_verts_i.length; i++) {
            const tri_verts_i = tris_verts_i[i];
            const tri_i = tris_i[i];
            for (const tri_vert_i of tri_verts_i) {
                if (!this._geom_maps.up_verts_tris.has(tri_vert_i)) {
                    this._geom_maps.up_verts_tris.set(tri_vert_i, []);
                }
                this._geom_maps.up_verts_tris.get(tri_vert_i).push(tri_i);
            }
        }
        // return an array of numeric indices of the triangles
        return tris_i;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbUFkZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUEyQyxZQUFZLEVBQVMsTUFBTSxXQUFXLENBQUM7QUFDbkcsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzVELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUc1Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBQ1YsU0FBUyxDQUFjO0lBQ3ZCLFVBQVUsQ0FBWTtJQUM5Qjs7T0FFRztJQUNILFlBQVksU0FBc0IsRUFBRSxTQUFvQjtRQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLGVBQWU7SUFDZiwrRUFBK0U7SUFDL0U7O09BRUc7SUFDSSxPQUFPO1FBQ1YsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDaEQseUNBQXlDO1FBQ3pDLGdEQUFnRDtRQUNoRCxtQkFBbUI7UUFDbkIsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hFLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0MsV0FBVztRQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEUsdUJBQXVCO1FBQ3ZCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENB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