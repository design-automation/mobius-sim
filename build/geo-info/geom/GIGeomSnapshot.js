"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomSnapshot = void 0;
const vectors_1 = require("@libs/geom/vectors");
const common_1 = require("../common");
const common_func_1 = require("../common_func");
/**
 * Class for modifying plines.
 */
class GIGeomSnapshot {
    /**
     * Constructor
     */
    constructor(modeldata, geom_maps) {
        // ss_data -> ssid -> data for one snapshot
        this.ss_data = new Map();
        this.modeldata = modeldata;
        this._geom_maps = geom_maps;
    }
    // ============================================================================
    // Snapshot
    // ============================================================================
    /**
     * Create a new snapshot.
     * @param id Starts a new snapshot with the given ID.
     * @param include
     */
    addSnapshot(ssid, include) {
        const data = {
            ps: null, pt: null, pl: null, pg: null, co: null,
            pt_co: null, pl_co: null, pg_co: null,
            co_pt: null, co_pl: null, co_pg: null, co_ch: null, co_pa: null
        };
        // set the data
        this.ss_data.set(ssid, data);
        // create an empty snapshot
        data.ps = new Set();
        data.pt = new Set();
        data.pl = new Set();
        data.pg = new Set();
        data.co = new Set();
        // obj -> coll
        data.pt_co = new Map();
        data.pl_co = new Map();
        data.pg_co = new Map();
        // coll -> obj
        data.co_pt = new Map();
        data.co_pl = new Map();
        data.co_pg = new Map();
        // coll data
        data.co_ch = new Map();
        data.co_pa = new Map();
        // add subsequent ssids to the new snapshot
        if (include === undefined) {
            return;
        }
        for (const exist_ssid of include) {
            if (!this.ss_data.has(exist_ssid)) {
                throw new Error('The snapshot ID ' + exist_ssid + ' does not exist.');
            }
            this.ss_data.get(exist_ssid).ps.forEach(posi_i => data.ps.add(posi_i));
            this.ss_data.get(exist_ssid).pt.forEach(point_i => data.pt.add(point_i));
            this.ss_data.get(exist_ssid).pl.forEach(pline_i => data.pl.add(pline_i));
            this.ss_data.get(exist_ssid).pg.forEach(pgon_i => data.pg.add(pgon_i));
            this.ss_data.get(exist_ssid).co.forEach(coll_i => data.co.add(coll_i));
            // point -> colls
            (0, common_func_1.mapSetMerge)(this.ss_data.get(exist_ssid).pt_co, data.pt_co);
            // pline -> colls
            (0, common_func_1.mapSetMerge)(this.ss_data.get(exist_ssid).pl_co, data.pl_co);
            // pgon -> colls
            (0, common_func_1.mapSetMerge)(this.ss_data.get(exist_ssid).pg_co, data.pg_co);
            // coll -> points
            (0, common_func_1.mapSetMerge)(this.ss_data.get(exist_ssid).co_pt, data.co_pt);
            // coll -> plines
            (0, common_func_1.mapSetMerge)(this.ss_data.get(exist_ssid).co_pl, data.co_pl);
            // coll -> pgons
            (0, common_func_1.mapSetMerge)(this.ss_data.get(exist_ssid).co_pg, data.co_pg);
            // coll -> children
            (0, common_func_1.mapSetMerge)(this.ss_data.get(exist_ssid).co_ch, data.co_ch);
            // coll -> parent (check for conflict)
            this.ss_data.get(exist_ssid).co_pa.forEach((parent_i, coll_i) => {
                if (data.co_pa.has(coll_i)) {
                    if (data.co_pa.get(coll_i) !== parent_i) {
                        throw new Error('Error merging collection data');
                    }
                }
                else {
                    data.co_pa.set(coll_i, parent_i);
                }
            });
        }
    }
    /**
     * Delete a snapshot.
     * @param ssid Snapshot ID.
     */
    delSnapshot(ssid) {
        this.ss_data.delete(ssid);
    }
    // ============================================================================
    // Add
    // ============================================================================
    /**
     * Adds the ents to the active snapshot.
     * Called when executing a global function.
     * @param ent_type
     */
    copyEntsToActiveSnapshot(from_ssid, ents) {
        const from_data = this.ss_data.get(from_ssid);
        const to_data = this.ss_data.get(this.modeldata.active_ssid);
        const set_colls_i = new Set();
        for (const [ent_type, ent_i] of ents) {
            if (ent_type === common_1.EEntType.POSI || ent_type >= common_1.EEntType.POINT) {
                to_data[common_1.EEntTypeStr[ent_type]].add(ent_i);
                // handle collections
                if (ent_type === common_1.EEntType.COLL) {
                    set_colls_i.add(ent_i);
                    // point -> colls
                    (0, common_func_1.mapSetMerge)(from_data.pt_co, to_data.pt_co, from_data.co_pt.get(ent_i));
                    // pline -> colls
                    (0, common_func_1.mapSetMerge)(from_data.pl_co, to_data.pl_co, from_data.co_pl.get(ent_i));
                    // pgon -> colls
                    (0, common_func_1.mapSetMerge)(from_data.pg_co, to_data.pg_co, from_data.co_pg.get(ent_i));
                    // coll -> points
                    (0, common_func_1.mapSetMerge)(from_data.co_pt, to_data.co_pt, [ent_i]);
                    // coll -> plines
                    (0, common_func_1.mapSetMerge)(from_data.co_pl, to_data.co_pl, [ent_i]);
                    // coll -> pgons
                    (0, common_func_1.mapSetMerge)(from_data.co_pg, to_data.co_pg, [ent_i]);
                    // coll -> children
                    (0, common_func_1.mapSetMerge)(from_data.co_ch, to_data.co_ch, [ent_i]);
                }
            }
            else {
                throw new Error('Adding entity to snapshot: invalid entity type.');
            }
        }
        // hadle collection parents
        // make sure only to allow parent collections that actually exist
        set_colls_i.forEach(coll_i => {
            // check if the collection has a parent
            if (from_data.co_pa.has(coll_i)) {
                const parent_coll_i = from_data.co_pa.get(coll_i);
                // check if parent exists
                if (set_colls_i.has(parent_coll_i)) {
                    to_data.co_pa.set(coll_i, parent_coll_i);
                }
            }
        });
    }
    /**
     * Add a new ent.
     * If the ent is a collection, then it is assumed that this is a new empty collection.
     * @param ent_type
     * @param ent_i
     */
    addNewEnt(ssid, ent_type, ent_i) {
        const to_data = this.ss_data.get(ssid);
        if (ent_type === common_1.EEntType.POSI || ent_type >= common_1.EEntType.POINT) {
            to_data[common_1.EEntTypeStr[ent_type]].add(ent_i);
            // handle collections
            if (ent_type === common_1.EEntType.COLL) {
                // coll -> obj and children
                to_data.co_pt.set(ent_i, new Set());
                to_data.co_pl.set(ent_i, new Set());
                to_data.co_pg.set(ent_i, new Set());
                to_data.co_ch.set(ent_i, new Set());
            }
        }
        else {
            throw new Error('Adding new entity to snapshot: invalid entity type.');
        }
    }
    // ============================================================================
    // Query
    // ============================================================================
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    hasEnt(ssid, ent_type, ent_i) {
        switch (ent_type) {
            case common_1.EEntType.POSI:
            case common_1.EEntType.POINT:
            case common_1.EEntType.PLINE:
            case common_1.EEntType.PGON:
            case common_1.EEntType.COLL:
                const ent_set = this.ss_data.get(ssid)[common_1.EEntTypeStr[ent_type]];
                return ent_set.has(ent_i);
            case common_1.EEntType.VERT:
            case common_1.EEntType.EDGE:
            case common_1.EEntType.WIRE:
                if (!this.modeldata.geom.query.entExists(ent_type, ent_i)) {
                    return false;
                }
                const [obj_ent_type, obj_ent_i] = this.modeldata.geom.query.getTopoObj(ent_type, ent_i);
                return this.hasEnt(ssid, obj_ent_type, obj_ent_i);
            default:
                throw new Error('Entity type not recognised.');
        }
    }
    /**
     * Takes in a list of ents and filters out ents that do no exist in the snapshot specified by SSID.
     * Used by nav any to any
     *
     * @param ent_type
     * @param ents_i
     */
    filterEnts(ssid, ent_type, ents_i) {
        switch (ent_type) {
            case common_1.EEntType.POSI:
            case common_1.EEntType.POINT:
            case common_1.EEntType.PLINE:
            case common_1.EEntType.PGON:
            case common_1.EEntType.COLL:
                const ent_set = this.ss_data.get(ssid)[common_1.EEntTypeStr[ent_type]];
                return Array.from(ents_i.filter(ent_i => ent_set.has(ent_i)));
            case common_1.EEntType.VERT:
            case common_1.EEntType.EDGE:
            case common_1.EEntType.WIRE:
                return Array.from(ents_i.filter(ent_i => this.hasEnt(ssid, ent_type, ent_i)));
            default:
                throw new Error('Entity type not recognised.');
        }
    }
    // ============================================================================
    // Get
    // ============================================================================
    /**
     *
     * @param ent_type
     */
    numEnts(ssid, ent_type) {
        switch (ent_type) {
            case common_1.EEntType.POSI:
            case common_1.EEntType.POINT:
            case common_1.EEntType.PLINE:
            case common_1.EEntType.PGON:
            case common_1.EEntType.COLL:
                const ent_set = this.ss_data.get(ssid)[common_1.EEntTypeStr[ent_type]];
                return ent_set.size;
            default:
                return this.getEnts(ssid, ent_type).length;
        }
    }
    /**
     * Get sets of all the ps, pt, pl, pg, co in a snapshot.
     * @param ent_type
     */
    getAllEntSets(ssid) {
        const ent_sets = {
            ps: this.ss_data.get(ssid).ps,
            pt: this.ss_data.get(ssid).pt,
            pl: this.ss_data.get(ssid).pl,
            pg: this.ss_data.get(ssid).pg,
            co: this.ss_data.get(ssid).co,
        };
        return ent_sets;
    }
    /**
     * Get an array of all the ps, pt, pl, pg, co in a snapshot.
     * @param ssid
     */
    getAllEnts(ssid) {
        const ents = [];
        this.ss_data.get(ssid).ps.forEach(posi_i => ents.push([common_1.EEntType.POSI, posi_i]));
        this.ss_data.get(ssid).pt.forEach(point_i => ents.push([common_1.EEntType.POINT, point_i]));
        this.ss_data.get(ssid).pl.forEach(pline_i => ents.push([common_1.EEntType.PLINE, pline_i]));
        this.ss_data.get(ssid).pg.forEach(pgon_i => ents.push([common_1.EEntType.PGON, pgon_i]));
        this.ss_data.get(ssid).co.forEach(coll_i => ents.push([common_1.EEntType.COLL, coll_i]));
        return ents;
    }
    /**
     * Get an array of ent indexes in the snapshot.
     * @param ent_type
     */
    getEnts(ssid, ent_type) {
        switch (ent_type) {
            case common_1.EEntType.POSI:
            case common_1.EEntType.POINT:
            case common_1.EEntType.PLINE:
            case common_1.EEntType.PGON:
            case common_1.EEntType.COLL:
                const ent_set = this.ss_data.get(ssid)[common_1.EEntTypeStr[ent_type]];
                return Array.from(ent_set);
            default:
                if (ent_type === common_1.EEntType.VERT) {
                    const verts_i = [];
                    for (const point_i of this.ss_data.get(ssid).pt) {
                        verts_i.push(this.modeldata.geom.nav.navPointToVert(point_i));
                    }
                    for (const pline_i of this.ss_data.get(ssid).pl) {
                        for (const vert_i of this.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PLINE, pline_i)) {
                            verts_i.push(vert_i);
                        }
                    }
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const vert_i of this.modeldata.geom.nav.navAnyToVert(common_1.EEntType.PGON, pgon_i)) {
                            verts_i.push(vert_i);
                        }
                    }
                    return verts_i;
                }
                else if (ent_type === common_1.EEntType.EDGE) {
                    const edges_i = [];
                    for (const pline_i of this.ss_data.get(ssid).pl) {
                        for (const edge_i of this.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.PLINE, pline_i)) {
                            edges_i.push(edge_i);
                        }
                    }
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const edge_i of this.modeldata.geom.nav.navAnyToEdge(common_1.EEntType.PGON, pgon_i)) {
                            edges_i.push(edge_i);
                        }
                    }
                    return edges_i;
                }
                else if (ent_type === common_1.EEntType.WIRE) {
                    const wires_i = [];
                    for (const pline_i of this.ss_data.get(ssid).pl) {
                        wires_i.push(this.modeldata.geom.nav.navPlineToWire(pline_i));
                    }
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const wire_i of this.modeldata.geom.nav.navAnyToWire(common_1.EEntType.PGON, pgon_i)) {
                            wires_i.push(wire_i);
                        }
                    }
                    return wires_i;
                }
                else if (ent_type === common_1.EEntType.TRI) {
                    const tris_i = [];
                    for (const pgon_i of this.ss_data.get(ssid).pg) {
                        for (const tri_i of this.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
                            tris_i.push(tri_i);
                        }
                    }
                    return tris_i;
                }
                throw new Error('Entity type not recognised: "' + ent_type + '".' +
                    'Valid entity types are: "ps", "_v", "_e", "_w", "pt", "pl", "pg" and "co".');
        }
    }
    /**
     * Get an array of sub ents given an set of ents.
     * This can include topology.
     * @param ents
     */
    getSubEnts(ents_sets) {
        const ents_arr = [];
        ents_sets.ps.forEach(posi_i => ents_arr.push([common_1.EEntType.POSI, posi_i]));
        ents_sets.obj_ps.forEach(posi_i => ents_arr.push([common_1.EEntType.POSI, posi_i]));
        ents_sets.pt.forEach(point_i => ents_arr.push([common_1.EEntType.POINT, point_i]));
        ents_sets.pl.forEach(pline_i => ents_arr.push([common_1.EEntType.PLINE, pline_i]));
        ents_sets.pg.forEach(pgon_i => ents_arr.push([common_1.EEntType.PGON, pgon_i]));
        ents_sets.co.forEach(coll_i => ents_arr.push([common_1.EEntType.COLL, coll_i]));
        if (ents_sets.hasOwnProperty('_v')) {
            ents_sets._v.forEach(vert_i => ents_arr.push([common_1.EEntType.VERT, vert_i]));
        }
        if (ents_sets.hasOwnProperty('_e')) {
            ents_sets._e.forEach(vert_i => ents_arr.push([common_1.EEntType.EDGE, vert_i]));
        }
        if (ents_sets.hasOwnProperty('_w')) {
            ents_sets._w.forEach(vert_i => ents_arr.push([common_1.EEntType.WIRE, vert_i]));
        }
        return ents_arr;
    }
    /**
     * Returns sets of unique entity indexes, given an array of TEntTypeIdx.
     * \n
     * Used for deleting all entities and for adding global function entities to a snapshot.
     */
    getSubEntsSets(ssid, ents) {
        const ent_sets = {
            ps: new Set(),
            obj_ps: new Set(),
            pt: new Set(),
            pl: new Set(),
            pg: new Set(),
            co: new Set()
        };
        // process all the ents, but not posis of the ents, we will do that at the end
        for (const ent_arr of ents) {
            const [ent_type, ent_i] = ent_arr;
            if (ent_type === common_1.EEntType.COLL) {
                // get the descendants of this collection
                const coll_and_desc_i = this.modeldata.geom.nav_snapshot.navCollToCollDescendents(ssid, ent_i);
                coll_and_desc_i.splice(0, 0, ent_i); //  add parent coll to start of list
                // get all the objs
                for (const one_coll_i of coll_and_desc_i) {
                    for (const point_i of this.modeldata.geom.snapshot.getCollPoints(ssid, one_coll_i)) {
                        ent_sets.pt.add(point_i);
                    }
                    for (const pline_i of this.modeldata.geom.snapshot.getCollPlines(ssid, one_coll_i)) {
                        ent_sets.pl.add(pline_i);
                    }
                    for (const pgon_i of this.modeldata.geom.snapshot.getCollPgons(ssid, one_coll_i)) {
                        ent_sets.pg.add(pgon_i);
                    }
                    ent_sets.co.add(one_coll_i);
                }
            }
            else if (ent_type === common_1.EEntType.PGON) {
                ent_sets.pg.add(ent_i);
            }
            else if (ent_type === common_1.EEntType.PLINE) {
                ent_sets.pl.add(ent_i);
            }
            else if (ent_type === common_1.EEntType.POINT) {
                ent_sets.pt.add(ent_i);
            }
            else if (ent_type === common_1.EEntType.POSI) {
                ent_sets.ps.add(ent_i);
            }
        }
        // now get all the posis of the objs and add them to the list
        ent_sets.pt.forEach(point_i => {
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.POINT, point_i);
            posis_i.forEach(posi_i => {
                ent_sets.obj_ps.add(posi_i);
            });
        });
        ent_sets.pl.forEach(pline_i => {
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.PLINE, pline_i);
            posis_i.forEach(posi_i => {
                ent_sets.obj_ps.add(posi_i);
            });
        });
        ent_sets.pg.forEach(pgon_i => {
            const posis_i = this.modeldata.geom.nav.navAnyToPosi(common_1.EEntType.PGON, pgon_i);
            posis_i.forEach(posi_i => {
                ent_sets.obj_ps.add(posi_i);
            });
        });
        // return the result
        return ent_sets;
    }
    /**
     * Given sets of [ps, pt, pl, pg, co], get the sub ents and add create additional sets.
     * @param ent_sets
     */
    addTopoToSubEntsSets(ent_sets) {
        ent_sets._v = new Set();
        ent_sets._e = new Set();
        ent_sets._w = new Set();
        ent_sets._t = new Set();
        ent_sets.pt.forEach(point_i => {
            ent_sets._v.add(this.modeldata.geom.nav.navPointToVert(point_i));
        });
        ent_sets.pl.forEach(pline_i => {
            const wire_i = this.modeldata.geom.nav.navPlineToWire(pline_i);
            const edges_i = this.modeldata.geom.nav.navWireToEdge(wire_i);
            const verts_i = this.modeldata.geom.query.getWireVerts(wire_i);
            ent_sets._w.add(wire_i);
            edges_i.forEach(edge_i => ent_sets._e.add(edge_i));
            verts_i.forEach(vert_i => ent_sets._v.add(vert_i));
        });
        ent_sets.pg.forEach(pgon_i => {
            const wires_i = this.modeldata.geom.nav.navPgonToWire(pgon_i);
            wires_i.forEach(wire_i => {
                ent_sets._w.add(wire_i);
                const edges_i = this.modeldata.geom.nav.navWireToEdge(wire_i);
                const verts_i = this.modeldata.geom.query.getWireVerts(wire_i);
                edges_i.forEach(edge_i => ent_sets._e.add(edge_i));
                verts_i.forEach(vert_i => ent_sets._v.add(vert_i));
            });
            const tris_i = this.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
            tris_i.forEach(tri_i => ent_sets._t.add(tri_i));
        });
    }
    // ============================================================================
    // Delete geometry locally
    // ============================================================================
    /**
     *
     * @param ent_type
     * @param ent_i
     */
    delAllEnts(ssid) {
        this.ss_data.get(ssid).ps.clear();
        this.ss_data.get(ssid).pt.clear();
        this.ss_data.get(ssid).pl.clear();
        this.ss_data.get(ssid).pg.clear();
        this.ss_data.get(ssid).co.clear();
        this.ss_data.get(ssid).co_pt.clear();
        this.ss_data.get(ssid).co_pl.clear();
        this.ss_data.get(ssid).co_pg.clear();
        this.ss_data.get(ssid).co_ch.clear();
        this.ss_data.get(ssid).co_pa.clear();
    }
    /**
    * Delete ents
    * @param ent_sets
    */
    delEntSets(ssid, ent_sets) {
        this.delColls(ssid, Array.from(ent_sets.co));
        this.delPgons(ssid, Array.from(ent_sets.pg));
        this.delPlines(ssid, Array.from(ent_sets.pl));
        this.delPoints(ssid, Array.from(ent_sets.pt));
        this.delPosis(ssid, Array.from(ent_sets.ps));
        this.delUnusedPosis(ssid, Array.from(ent_sets.obj_ps));
    }
    /**
     * Invert ent sets
     * @param ent_sets
     */
    invertEntSets(ssid, ent_sets) {
        ent_sets.co = this._invertSet(this.ss_data.get(ssid).co, ent_sets.co);
        ent_sets.pg = this._invertSet(this.ss_data.get(ssid).pg, ent_sets.pg);
        ent_sets.pl = this._invertSet(this.ss_data.get(ssid).pl, ent_sets.pl);
        ent_sets.pt = this._invertSet(this.ss_data.get(ssid).pt, ent_sets.pt);
        // go through the posis
        // we get the inverse of the untion of ps and obj_ps
        // for this inverse set, we then sort into those that are used and those that are unused
        const new_set_ps = new Set();
        const new_set_obj_ps = new Set();
        for (const posi_i of this.ss_data.get(ssid).ps) {
            if (ent_sets.obj_ps.has(posi_i) || ent_sets.ps.has(posi_i)) {
                continue;
            }
            if (this.isPosiUnused(ssid, posi_i)) {
                new_set_ps.add(posi_i);
            }
            else {
                new_set_obj_ps.add(posi_i);
            }
        }
        ent_sets.ps = new_set_ps;
        ent_sets.obj_ps = new_set_obj_ps;
    }
    /**
     * Del unused posis, i.e posis that are not linked to any vertices.
     * @param posis_i
     */
    delUnusedPosis(ssid, posis_i) {
        // create array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        // loop
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) {
                continue;
            } // already deleted
            if (this.isPosiUnused(ssid, posi_i)) { // only delete posis with no verts
                this.ss_data.get(ssid).ps.delete(posi_i);
            }
        }
    }
    /**
     * Del posis.
     * This will delete any geometry connected to these posis, starting with the vertices
     * and working up the hierarchy.
     * @param posis_i
     */
    delPosis(ssid, posis_i) {
        // make array
        posis_i = (Array.isArray(posis_i)) ? posis_i : [posis_i];
        if (posis_i.length === 0) {
            return;
        }
        // delete the posis
        for (const posi_i of posis_i) {
            this.ss_data.get(ssid).ps.delete(posi_i);
        }
        // get all verts and sort them
        const points_i = [];
        const plines_verts = new Map();
        const pgons_verts = new Map();
        for (const posi_i of posis_i) {
            if (!this._geom_maps.up_posis_verts.has(posi_i)) {
                continue;
            } // already deleted
            for (const vert_i of this._geom_maps.up_posis_verts.get(posi_i)) {
                if (this._geom_maps.up_verts_points.has(vert_i)) {
                    points_i.push(this._geom_maps.up_verts_points.get(vert_i));
                }
                else {
                    // not we cannot check trianges, some pgons have no triangles
                    const edges_i = this._geom_maps.up_verts_edges.get(vert_i);
                    const wire_i = this._geom_maps.up_edges_wires.get(edges_i[0]);
                    if (this._geom_maps.up_wires_pgons.has(wire_i)) {
                        const pgon_i = this.modeldata.geom.nav.navAnyToPgon(common_1.EEntType.VERT, vert_i)[0];
                        if (pgons_verts.has(pgon_i)) {
                            pgons_verts.get(pgon_i).push(vert_i);
                        }
                        else {
                            pgons_verts.set(pgon_i, [vert_i]);
                        }
                    }
                    else {
                        const pline_i = this.modeldata.geom.nav.navAnyToPline(common_1.EEntType.VERT, vert_i)[0];
                        if (plines_verts.has(pline_i)) {
                            plines_verts.get(pline_i).push(vert_i);
                        }
                        else {
                            plines_verts.set(pline_i, [vert_i]);
                        }
                    }
                }
            }
        }
        // delete point vertices
        for (const point_i of points_i) {
            this.ss_data.get(ssid).pt.delete(point_i);
        }
        // delete pline vertices
        plines_verts.forEach((verts_i, pline_i) => {
            this.modeldata.geom.del_vert.delPlineVerts(pline_i, verts_i);
        });
        // delete pgon vertices
        pgons_verts.forEach((verts_i, pgon_i) => {
            this.modeldata.geom.del_vert.delPgonVerts(pgon_i, verts_i);
        });
    }
    /**
     * Del points.
     * Point attributes will also be deleted.
     * @param points_i
     */
    delPoints(ssid, points_i) {
        // make array
        points_i = (Array.isArray(points_i)) ? points_i : [points_i];
        if (points_i.length === 0) {
            return;
        }
        // delete the points
        for (const point_i of points_i) {
            this.ss_data.get(ssid).pt.delete(point_i);
            // remove the points from any collections
            const set_colls_i = this.ss_data.get(ssid).pt_co.get(point_i);
            if (set_colls_i !== undefined) {
                set_colls_i.forEach(coll_i => this.ss_data.get(ssid).co_pt.get(coll_i).delete(point_i));
            }
        }
    }
    /**
     * Del plines.
     * @param plines_i
     */
    delPlines(ssid, plines_i) {
        // make array
        plines_i = (Array.isArray(plines_i)) ? plines_i : [plines_i];
        if (plines_i.length === 0) {
            return;
        }
        // delete the plines
        for (const pline_i of plines_i) {
            this.ss_data.get(ssid).pl.delete(pline_i);
            // remove the plines from any collections
            const set_colls_i = this.ss_data.get(ssid).pl_co.get(pline_i);
            if (set_colls_i !== undefined) {
                set_colls_i.forEach(coll_i => this.ss_data.get(ssid).co_pl.get(coll_i).delete(pline_i));
            }
        }
    }
    /**
     * Del pgons.
     * @param pgons_i
     */
    delPgons(ssid, pgons_i, invert = false) {
        // make array
        pgons_i = (Array.isArray(pgons_i)) ? pgons_i : [pgons_i];
        if (pgons_i.length === 0) {
            return;
        }
        // delete the pgons
        for (const pgon_i of pgons_i) {
            this.ss_data.get(ssid).pg.delete(pgon_i);
            // remove the pgons from any collections
            const set_colls_i = this.ss_data.get(ssid).pg_co.get(pgon_i);
            if (set_colls_i !== undefined) {
                set_colls_i.forEach(coll_i => this.ss_data.get(ssid).co_pg.get(coll_i).delete(pgon_i));
            }
        }
    }
    /**
     * Delete a collection.
     * This does not delete any of the object in the collection.
     * Also, does not delete any positions.
     * @param colls_i The collections to delete
     */
    delColls(ssid, colls_i) {
        // make array
        colls_i = (Array.isArray(colls_i)) ? colls_i : [colls_i];
        if (colls_i.length === 0) {
            return;
        }
        // delete the colls
        for (const coll_i of colls_i) {
            // delete the coll
            this.ss_data.get(ssid).co.delete(coll_i);
            // remove the coll from points
            const set_points_i = this.ss_data.get(ssid).co_pt.get(coll_i);
            if (set_points_i !== undefined) {
                set_points_i.forEach(point_i => this.ss_data.get(ssid).pt_co.get(point_i).delete(coll_i));
            }
            // remove the coll from plines
            const set_plines_i = this.ss_data.get(ssid).co_pl.get(coll_i);
            if (set_plines_i !== undefined) {
                set_plines_i.forEach(pline_i => this.ss_data.get(ssid).pl_co.get(pline_i).delete(coll_i));
            }
            // remove the coll from pgons
            const set_pgons_i = this.ss_data.get(ssid).co_pg.get(coll_i);
            if (set_pgons_i !== undefined) {
                set_pgons_i.forEach(pgon_i => this.ss_data.get(ssid).pg_co.get(pgon_i).delete(coll_i));
            }
            // remove the coll from children (the children no longer have this coll as a parent)
            const set_childs_i = this.ss_data.get(ssid).co_ch.get(coll_i);
            if (set_childs_i !== undefined) {
                set_childs_i.forEach(child_i => this.ss_data.get(ssid).co_pa.delete(child_i));
            }
            // delete the other coll data
            this.ss_data.get(ssid).co_pt.delete(coll_i);
            this.ss_data.get(ssid).co_pl.delete(coll_i);
            this.ss_data.get(ssid).co_pg.delete(coll_i);
            this.ss_data.get(ssid).co_ch.delete(coll_i);
            this.ss_data.get(ssid).co_pa.delete(coll_i);
        }
    }
    // ============================================================================================
    // Get colls from entities
    // ============================================================================================
    /**
     * Get the collections of a point.
     * @param point_i
     */
    getPointColls(ssid, point_i) {
        if (this.ss_data.get(ssid).pt_co.has(point_i)) {
            return Array.from(this.ss_data.get(ssid).pt_co.get(point_i));
        }
        return [];
    }
    /**
     * Get the collections of a pline.
     * @param pline_i
     */
    getPlineColls(ssid, pline_i) {
        if (this.ss_data.get(ssid).pl_co.has(pline_i)) {
            return Array.from(this.ss_data.get(ssid).pl_co.get(pline_i));
        }
        return [];
    }
    /**
     * Get the collections of a pgon
     * @param pgon_i
     */
    getPgonColls(ssid, pgon_i) {
        if (this.ss_data.get(ssid).pg_co.has(pgon_i)) {
            return Array.from(this.ss_data.get(ssid).pg_co.get(pgon_i));
        }
        return [];
    }
    // ============================================================================================
    // Get entities from colls
    // ============================================================================================
    /**
     * Get the points of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollPoints(ssid, coll_i) {
        if (this.ss_data.get(ssid).co_pt.has(coll_i)) {
            return Array.from(this.ss_data.get(ssid).co_pt.get(coll_i));
        }
        return [];
    }
    /**
     * Get the plines of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollPlines(ssid, coll_i) {
        if (this.ss_data.get(ssid).co_pl.has(coll_i)) {
            return Array.from(this.ss_data.get(ssid).co_pl.get(coll_i));
        }
        return [];
    }
    /**
     * Get the pgons of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollPgons(ssid, coll_i) {
        if (this.ss_data.get(ssid).co_pg.has(coll_i)) {
            return Array.from(this.ss_data.get(ssid).co_pg.get(coll_i));
        }
        return [];
    }
    /**
     * Get the children collections of a collection.
     * Array is passed as copy.
     * @param coll_i
     */
    getCollChildren(ssid, coll_i) {
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            return Array.from(this.ss_data.get(ssid).co_ch.get(coll_i));
        }
        return [];
    }
    /**
     * Get the parent.
     * Undefined if there is no parent.
     * @param coll_i
     */
    getCollParent(ssid, coll_i) {
        return this.ss_data.get(ssid).co_pa.get(coll_i);
    }
    // ============================================================================================
    // Set parent
    // ============================================================================================
    /**
     * Set the parent for a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The index of the parent collection
     */
    setCollParent(ssid, coll_i, parent_coll_i) {
        // child -> parent
        this.ss_data.get(ssid).co_pa.set(coll_i, parent_coll_i);
        // parent -> child
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            this.ss_data.get(ssid).co_ch.get(parent_coll_i).add(coll_i);
        }
        else {
            this.ss_data.get(ssid).co_ch.set(parent_coll_i, new Set([coll_i]));
        }
    }
    // ============================================================================================
    // Add entities in colls
    // ============================================================================================
    /**
     * Set the points in a collection
     * @param coll_i The index of the collection
     * @param points_i
     */
    addCollPoints(ssid, coll_i, points_i) {
        points_i = Array.isArray(points_i) ? points_i : [points_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pt.has(coll_i)) {
            const set_points_i = this.ss_data.get(ssid).co_pt.get(coll_i);
            points_i.forEach(point_i => set_points_i.add(point_i));
        }
        else {
            this.ss_data.get(ssid).co_pt.set(coll_i, new Set(points_i));
        }
        // obj up to coll
        for (const point_i of points_i) {
            if (this.ss_data.get(ssid).pt_co.has(point_i)) {
                this.ss_data.get(ssid).pt_co.get(point_i).add(coll_i);
            }
            else {
                this.ss_data.get(ssid).pt_co.set(point_i, new Set([coll_i]));
            }
        }
    }
    /**
     * Set the plines in a collection
     * @param coll_i The index of the collection
     * @param plines_i
     */
    addCollPlines(ssid, coll_i, plines_i) {
        plines_i = Array.isArray(plines_i) ? plines_i : [plines_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pl.has(coll_i)) {
            const set_plines_i = this.ss_data.get(ssid).co_pl.get(coll_i);
            plines_i.forEach(pline_i => set_plines_i.add(pline_i));
        }
        else {
            this.ss_data.get(ssid).co_pl.set(coll_i, new Set(plines_i));
        }
        // obj up to coll
        for (const pline_i of plines_i) {
            if (this.ss_data.get(ssid).pl_co.has(pline_i)) {
                this.ss_data.get(ssid).pl_co.get(pline_i).add(coll_i);
            }
            else {
                this.ss_data.get(ssid).pl_co.set(pline_i, new Set([coll_i]));
            }
        }
    }
    /**
     * Set the pgons in a collection
     * @param coll_i The index of the collection
     * @param pgons_i
     */
    addCollPgons(ssid, coll_i, pgons_i) {
        pgons_i = Array.isArray(pgons_i) ? pgons_i : [pgons_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pg.has(coll_i)) {
            const set_pgons_i = this.ss_data.get(ssid).co_pg.get(coll_i);
            pgons_i.forEach(pgon_i => set_pgons_i.add(pgon_i));
        }
        else {
            this.ss_data.get(ssid).co_pg.set(coll_i, new Set(pgons_i));
        }
        // obj up to coll
        for (const pgon_i of pgons_i) {
            if (this.ss_data.get(ssid).pg_co.has(pgon_i)) {
                this.ss_data.get(ssid).pg_co.get(pgon_i).add(coll_i);
            }
            else {
                this.ss_data.get(ssid).pg_co.set(pgon_i, new Set([coll_i]));
            }
        }
    }
    /**
     * Set the child collections in a collection
     * @param coll_i The index of the collection
     * @param parent_coll_i The indicies of the child collections
     */
    addCollChildren(ssid, coll_i, childs_i) {
        childs_i = Array.isArray(childs_i) ? childs_i : [childs_i];
        // coll down to children
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            const set_childs_i = this.ss_data.get(ssid).co_ch.get(coll_i);
            childs_i.forEach(child_i => set_childs_i.add(child_i));
        }
        else {
            this.ss_data.get(ssid).co_ch.set(coll_i, new Set(childs_i));
        }
        // children up to coll
        for (const child_i of childs_i) {
            this.ss_data.get(ssid).co_pa.set(child_i, coll_i);
        }
    }
    // ============================================================================================
    // Remove entities in colls
    // ============================================================================================
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param points_i
     */
    remCollPoints(ssid, coll_i, points_i) {
        points_i = Array.isArray(points_i) ? points_i : [points_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pt.has(coll_i)) {
            const set_points_i = this.ss_data.get(ssid).co_pt.get(coll_i);
            for (const point_i of points_i) {
                set_points_i.delete(point_i);
                // obj up to coll
                this.ss_data.get(ssid).pg_co.get(point_i).delete(coll_i);
            }
        }
    }
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param plines_i
     */
    remCollPlines(ssid, coll_i, plines_i) {
        plines_i = Array.isArray(plines_i) ? plines_i : [plines_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pl.has(coll_i)) {
            const set_plines_i = this.ss_data.get(ssid).co_pl.get(coll_i);
            for (const pline_i of plines_i) {
                set_plines_i.delete(pline_i);
                // obj up to coll
                this.ss_data.get(ssid).pl_co.get(pline_i).delete(coll_i);
            }
        }
    }
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param pgons_i
     */
    remCollPgons(ssid, coll_i, pgons_i) {
        pgons_i = Array.isArray(pgons_i) ? pgons_i : [pgons_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_pg.has(coll_i)) {
            const set_pgons_i = this.ss_data.get(ssid).co_pg.get(coll_i);
            for (const pgon_i of pgons_i) {
                set_pgons_i.delete(pgon_i);
                // obj up to coll
                this.ss_data.get(ssid).pg_co.get(pgon_i).delete(coll_i);
            }
        }
    }
    /**
     * Remove objects from a collection.
     * If the objects are not in the collection, then no error is thrown.
     * Time stamp is not updated.
     * @param coll_i
     * @param child_colls_i
     */
    remCollChildren(ssid, coll_i, childs_i) {
        childs_i = Array.isArray(childs_i) ? childs_i : [childs_i];
        // coll down to obj
        if (this.ss_data.get(ssid).co_ch.has(coll_i)) {
            const set_childs_i = this.ss_data.get(ssid).co_ch.get(coll_i);
            for (const child_i of childs_i) {
                set_childs_i.delete(child_i);
                // obj up to coll
                this.ss_data.get(ssid).co_pa.delete(child_i);
            }
        }
    }
    // ============================================================================
    // Others
    // ============================================================================
    /**
     *
     * @param pgon_i
     */
    getPgonNormal(ssid, pgon_i) {
        const normal = [0, 0, 0];
        const tris_i = this.modeldata.geom._geom_maps.dn_pgons_tris.get(pgon_i);
        let count = 0;
        for (const tri_i of tris_i) {
            const posis_i = this._geom_maps.dn_tris_verts.get(tri_i).map(vert_i => this._geom_maps.dn_verts_posis.get(vert_i));
            const xyzs = posis_i.map(posi_i => this.modeldata.attribs.attribs_maps.get(ssid).ps.get(common_1.EAttribNames.COORDS).getEntVal(posi_i));
            const vec_a = (0, vectors_1.vecFromTo)(xyzs[0], xyzs[1]);
            const vec_b = (0, vectors_1.vecFromTo)(xyzs[0], xyzs[2]); // CCW
            const tri_normal = (0, vectors_1.vecCross)(vec_a, vec_b, true);
            if (!(tri_normal[0] === 0 && tri_normal[1] === 0 && tri_normal[2] === 0)) {
                count += 1;
                normal[0] += tri_normal[0];
                normal[1] += tri_normal[1];
                normal[2] += tri_normal[2];
            }
        }
        if (count === 0) {
            return [0, 0, 0];
        }
        return (0, vectors_1.vecDiv)(normal, count);
    }
    /**
     * Returns true if posis is used
     * @param point_i
     */
    isPosiUnused(ssid, posi_i) {
        const verts_i = this._geom_maps.up_posis_verts.get(posi_i);
        for (const vert_i of verts_i) {
            const [ent_type, ent_i] = this.modeldata.geom.query.getTopoObj(common_1.EEntType.VERT, vert_i);
            if (this.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i)) {
                return false;
            }
        }
        return true;
    }
    // ============================================================================
    // Private
    // ============================================================================
    _invertSet(ents_ss, selected) {
        const inverted = new Set();
        const set_selected = new Set(selected);
        for (const ent_i of ents_ss) {
            if (!set_selected.has(ent_i)) {
                inverted.add(ent_i);
            }
        }
        return inverted;
    }
    // ============================================================================
    // Debug
    // ============================================================================
    toStr(ssid) {
        // data.pt_co = new Map();
        // data.pl_co = new Map();
        // data.pg_co = new Map();
        // // coll -> obj
        // data.co_pt = new Map();
        // data.co_pl = new Map();
        // data.co_pg = new Map();
        // // coll data
        // data.co_ch = new Map();
        // data.co_pa = new Map();
        return JSON.stringify([
            'posis', Array.from(this.ss_data.get(ssid).ps),
            'points', Array.from(this.ss_data.get(ssid).pt),
            'plines', Array.from(this.ss_data.get(ssid).pl),
            'pgons', Array.from(this.ss_data.get(ssid).pg),
            'colls', Array.from(this.ss_data.get(ssid).co),
            'pt_co', this._mapSetToStr(this.ss_data.get(ssid).pt_co),
            'pl_co', this._mapSetToStr(this.ss_data.get(ssid).pl_co),
            'pg_co', this._mapSetToStr(this.ss_data.get(ssid).pg_co),
            'co_pt', this._mapSetToStr(this.ss_data.get(ssid).co_pt),
            'co_pl', this._mapSetToStr(this.ss_data.get(ssid).co_pl),
            'co_pg', this._mapSetToStr(this.ss_data.get(ssid).co_pg),
            'co_ch', this._mapSetToStr(this.ss_data.get(ssid).co_ch),
        ]) + '\n';
    }
    _mapSetToStr(map_set) {
        let result = '{';
        map_set.forEach((val_set, key) => {
            result = result + key + ':' + JSON.stringify(Array.from(val_set));
        });
        return result + '}';
    }
}
exports.GIGeomSnapshot = GIGeomSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL2dlb20vR0lHZW9tU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBQWlFO0FBQ2pFLHNDQUF1SDtBQUN2SCxnREFBNkM7QUFHN0M7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFLdkI7O09BRUc7SUFDSCxZQUFZLFNBQXNCLEVBQUUsU0FBb0I7UUFMeEQsMkNBQTJDO1FBQ25DLFlBQU8sR0FBK0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUtwRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsK0VBQStFO0lBQy9FLFdBQVc7SUFDWCwrRUFBK0U7SUFDL0U7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxJQUFZLEVBQUUsT0FBa0I7UUFDL0MsTUFBTSxJQUFJLEdBQWtCO1lBQ3hCLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUk7WUFDaEQsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJO1lBQ3JDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUk7U0FDbEUsQ0FBQztRQUNGLGVBQWU7UUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLEVBQUUsSUFBSSxDQUFFLENBQUM7UUFDL0IsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMs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QUFDLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBQzdFLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUM1RSxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBRSxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDNUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBQ3pFLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUN6RSxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUMvRyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FB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Q0ksVUFBVSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksYUFBYSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUNqRCxRQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0RSxRQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0RSxRQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFB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