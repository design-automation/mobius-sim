"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIGeomSnapshot = void 0;
const vectors_1 = require("../../../libs/geom/vectors");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lHZW9tU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9nZW9tL0dJR2VvbVNuYXBzaG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUF3RTtBQUN4RSxzQ0FBdUg7QUFDdkgsZ0RBQTZDO0FBRzdDOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBS3ZCOztPQUVHO0lBQ0gsWUFBWSxTQUFzQixFQUFFLFNBQW9CO1FBTHhELDJDQUEyQztRQUNuQyxZQUFPLEdBQStCLElBQUksR0FBRyxFQUFFLENBQUM7UUFLcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUNELCtFQUErRTtJQUMvRSxXQUFXO0lBQ1gsK0VBQStFO0lBQy9FOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsSUFBWSxFQUFFLE9BQWtCO1FBQy9DLE1BQU0sSUFBSSxHQUFrQjtZQUN4QixFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJO1lBQ2hELEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSTtZQUNyQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJO1NBQ2xFLENBQUM7UUFDRixlQUFlO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxFQUFFLElBQUksQ0FBRSxDQUFDO1FBQy9CLDJCQUEyQjtRQUMzQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFB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LElBQUksQ0FBQyxDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUM3RSxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBRSxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDNUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBQzVFLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUN6RSxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDekUsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUU7UUFDL0csSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxD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Q0FBQyxDQUFDO2FBQzFCO1NBQ0o7UUFDRCw2REFBNkQ7UUFDN0QsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsT0FBTyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxpQkFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN4RixPQUFPLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsT0FBTyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxpQkFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN4RixPQUFPLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFDLEVBQUU7WUFDMUIsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxpQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN0RixPQUFPLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FB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TUFHRTtJQUNJLFVBQVUsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNEOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDakQsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEUsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEUsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxD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