"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomAdd = void 0;
const common_1 = require("../common");
const triangulate_1 = require("../../triangulate/triangulate");
const vectors_1 = require("../../geom/vectors");
/**
 * Class for geometry.
 */
class GIGeomAdd {
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
        this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.POSI, posi_i);
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
        this.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.POINT, point_i, common_1.EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.POINT, point_i);
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
        this.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.PLINE, pline_i, common_1.EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.PLINE, pline_i);
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
        this.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.PGON, pgon_i, common_1.EAttribNames.TIMESTAMP, this.modeldata.active_ssid);
        // snapshot
        this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.PGON, pgon_i);
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
        this.modeldata.geom.snapshot.addNewEnt(ssid, common_1.EEntType.COLL, coll_i);
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
        this.modeldata.attribs.posis.setPosiCoords(new_posi_i, (0, vectors_1.vecAdd)(xyz, move_vector));
        if (copy_attribs) {
            const attrib_names = this.modeldata.attribs.getAttribNames(common_1.EEntType.POSI);
            for (const attrib_name of attrib_names) {
                if (attrib_name !== 'xyz') {
                    const value = this.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.POSI, posi_i, attrib_name);
                    this.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.POSI, new_posi_i, attrib_name, value);
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
            const attrib_names = this.modeldata.attribs.getAttribNames(common_1.EEntType.POSI);
            for (const attrib_name of attrib_names) {
                const value = this.modeldata.attribs.get.getEntAttribVal(common_1.EEntType.POSI, posi_i, attrib_name);
                this.modeldata.attribs.set.setEntAttribVal(common_1.EEntType.POSI, new_posi_i, attrib_name, value);
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
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.POINT, old_point_i);
        const new_point_i = this.addPoint(posis_i[0]);
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(common_1.EEntType.POINT, old_point_i, new_point_i);
            const old_vert_i = this.modeldata.geom.nav.navPointToVert(old_point_i);
            const new_vert_i = this.modeldata.geom.nav.navPointToVert(new_point_i);
            this.modeldata.attribs.set.copyAttribs(common_1.EEntType.VERT, old_vert_i, new_vert_i);
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
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.PLINE, old_pline_i);
        const wire_i = this.modeldata.geom.nav.navPlineToWire(old_pline_i);
        const is_closed = this.modeldata.geom.query.isWireClosed(wire_i);
        const new_pline_i = this.addPline(posis_i, is_closed);
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(common_1.EEntType.PLINE, old_pline_i, new_pline_i);
            const old_topo = this.modeldata.geom.query.getObjTopo(common_1.EEntType.PLINE, old_pline_i);
            const new_topo = this.modeldata.geom.query.getObjTopo(common_1.EEntType.PLINE, new_pline_i);
            for (let i = 0; i < old_topo[0].length; i++) {
                this.modeldata.attribs.set.copyAttribs(common_1.EEntType.VERT, old_topo[0][i], new_topo[0][i]);
            }
            for (let i = 0; i < old_topo[1].length; i++) {
                this.modeldata.attribs.set.copyAttribs(common_1.EEntType.EDGE, old_topo[1][i], new_topo[1][i]);
            }
            for (let i = 0; i < old_topo[2].length; i++) {
                this.modeldata.attribs.set.copyAttribs(common_1.EEntType.WIRE, old_topo[2][i], new_topo[2][i]);
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
        const wires_i = this.modeldata.geom.nav.navAnyToWire(common_1.EEntType.PGON, old_pgon_i);
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wires_i[0]);
        let new_pgon_i;
        if (wires_i.length === 1) {
            new_pgon_i = this.addPgon(posis_i);
        }
        else {
            const holes_posis_i = [];
            for (let i = 1; i < wires_i.length; i++) {
                const hole_posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.WIRE, wires_i[i]);
                holes_posis_i.push(hole_posis_i);
            }
            new_pgon_i = this.addPgon(posis_i, holes_posis_i);
        }
        if (copy_attribs) {
            this.modeldata.attribs.set.copyAttribs(common_1.EEntType.PGON, old_pgon_i, new_pgon_i);
            const old_topo = this.modeldata.geom.query.getObjTopo(common_1.EEntType.PGON, old_pgon_i);
            const new_topo = this.modeldata.geom.query.getObjTopo(common_1.EEntType.PGON, new_pgon_i);
            for (let i = 0; i < old_topo[0].length; i++) {
                this.modeldata.attribs.set.copyAttribs(common_1.EEntType.VERT, old_topo[0][i], new_topo[0][i]);
            }
            for (let i = 0; i < old_topo[1].length; i++) {
                this.modeldata.attribs.set.copyAttribs(common_1.EEntType.EDGE, old_topo[1][i], new_topo[1][i]);
            }
            for (let i = 0; i < old_topo[2].length; i++) {
                this.modeldata.attribs.set.copyAttribs(common_1.EEntType.WIRE, old_topo[2][i], new_topo[2][i]);
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
            this.modeldata.attribs.set.copyAttribs(common_1.EEntType.COLL, old_coll_i, new_coll_i);
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
        const wire_verts_i = this.modeldata.geom.nav.navAnyToVert(common_1.EEntType.WIRE, wire_i);
        wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
        const wire_posis_i = wire_verts_i.map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
        const wire_coords = wire_posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
        // get the coords of the holes
        const all_hole_coords = [];
        if (hole_wires_i !== undefined) {
            for (const hole_wire_i of hole_wires_i) {
                const hole_wire_verts_i = this.modeldata.geom.nav.navAnyToVert(common_1.EEntType.WIRE, hole_wire_i);
                hole_wire_verts_i.forEach(wire_vert_i => all_verts_i.push(wire_vert_i));
                const hole_wire_posis_i = hole_wire_verts_i.map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
                const hole_wire_coords = hole_wire_posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
                all_hole_coords.push(hole_wire_coords);
            }
        }
        // create the triangles
        const tris_corners = (0, triangulate_1.triangulate)(wire_coords, all_hole_coords);
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
exports.GIGeomAdd = GIGeomAdd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vZ2VvbS9HSUdlb21BZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQW1HO0FBQ25HLCtEQUE0RDtBQUM1RCxnREFBNEM7QUFHNUM7O0dBRUc7QUFDSCxNQUFhLFNBQVM7SUFHbEI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxlQUFlO0lBQ2YsK0VBQStFO0lBQy9FOztPQUVHO0lBQ0ksT0FBTztRQUNWLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELHlDQUF5QztRQUN6QyxnREFBZ0Q7UUFDaEQsbUJBQW1CO1FBQ25CLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoRSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLFdBQVc7UUFDWCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRSx1QkFBdUI7UUFDdkIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFFBQVEsQ0FBQyxNQUFjO1FBQzFCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2hELGNBQWM7UUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMs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