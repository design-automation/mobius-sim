"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIModelData = void 0;
const GIGeom_1 = require("./geom/GIGeom");
const GIAttribs_1 = require("./attribs/GIAttribs");
const common_1 = require("./common");
const GIModelComparator_1 = require("./GIModelComparator");
const GIModelThreejs_1 = require("./GIModelThreejs");
const GIFuncsCommon_1 = require("./funcs/GIFuncsCommon");
const GIFuncsMake_1 = require("./funcs/GIFuncsMake");
const GIFuncsEdit_1 = require("./funcs/GIFuncsEdit");
const GIFuncsModify_1 = require("./funcs/GIFuncsModify");
const common_id_funcs_1 = require("./common_id_funcs");
/**
 * Geo-info model class.
 */
class GIModelData {
    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor(model) {
        this.active_ssid = 0;
        this._max_timestamp = 0;
        this.debug = true;
        // functions
        this.funcs_common = new GIFuncsCommon_1.GIFuncsCommon(this);
        this.funcs_make = new GIFuncsMake_1.GIFuncsMake(this);
        this.funcs_edit = new GIFuncsEdit_1.GIFuncsEdit(this);
        this.funcs_modify = new GIFuncsModify_1.GIFuncsModify(this);
        this.model = model;
        this.geom = new GIGeom_1.GIGeom(this);
        this.attribs = new GIAttribs_1.GIAttribs(this);
        this.comparator = new GIModelComparator_1.GIModelComparator(this);
        this.threejs = new GIModelThreejs_1.GIModelThreejs(this);
        // functions
        this.funcs_common = new GIFuncsCommon_1.GIFuncsCommon(this);
        this.funcs_make = new GIFuncsMake_1.GIFuncsMake(this);
        this.funcs_edit = new GIFuncsEdit_1.GIFuncsEdit(this);
        this.funcs_modify = new GIFuncsModify_1.GIFuncsModify(this);
    }
    /**
     * Imports JSOn data into this model.
     * Eexisting data in the model is not affected.
     * @param model_data The JSON data.
     */
    importGI(model_data) {
        if (model_data.version !== '0.7') {
            if (model_data.version === undefined) {
                throw new Error('Importing GI data from with incorrect version.' +
                    'The data being imported was generated in an old version of Mobius Modeller.' +
                    'GI data should be generated using Mobius Modeller version 0.7.');
            }
            throw new Error('Importing GI data from with incorrect version.' +
                'The data being imported was generated in Mobius Modeller version ' + model_data.version + '.' +
                'GI data should be generated using Mobius Modeller version 0.7.');
        }
        // get the renum maps for the imprted data
        const renum_maps = this.geom.imp_exp.importGIRenum(model_data.geometry);
        // import the data
        this.geom.imp_exp.importGI(model_data.geometry, renum_maps);
        this.attribs.imp_exp.importGI(model_data.attributes, renum_maps);
        // get the new ents to return
        const ents = [];
        renum_maps.points.forEach((new_ent_i, _) => ents.push([common_1.EEntType.POINT, new_ent_i]));
        renum_maps.plines.forEach((new_ent_i, _) => ents.push([common_1.EEntType.PLINE, new_ent_i]));
        renum_maps.pgons.forEach((new_ent_i, _) => ents.push([common_1.EEntType.PGON, new_ent_i]));
        renum_maps.colls.forEach((new_ent_i, _) => ents.push([common_1.EEntType.COLL, new_ent_i]));
        // return the new ents that have been imported
        return ents;
    }
    /**
     * Exports the JSON data for this model.
     */
    exportGI(ents) {
        // get the ents to export
        let ent_sets;
        if (ents === null) {
            ent_sets = this.geom.snapshot.getAllEntSets(this.active_ssid);
        }
        else {
            ent_sets = this.geom.snapshot.getSubEntsSets(this.active_ssid, ents);
            // the getSubEntsSets() function creates two sets of posis
            // isolated posis and obj posis
            // in this case, we need a single list
            for (const posi_i of ent_sets.obj_ps) {
                ent_sets.ps.add(posi_i);
            }
        }
        this.geom.snapshot.addTopoToSubEntsSets(ent_sets);
        // get the renum maps
        const renum_maps = this.geom.imp_exp.exportGIRenum(ent_sets);
        return {
            type: 'GIJson',
            version: '0.7',
            geometry: this.geom.imp_exp.exportGI(ent_sets, renum_maps),
            attributes: this.attribs.imp_exp.exportGI(ent_sets, renum_maps)
        };
    }
    /**
     * Check model for internal consistency
     */
    check() {
        return this.geom.check.check();
    }
    /**
     * Compares two models.
     * Checks that every entity in this model also exists in the other model.
     * \n
     * This is the answer model.
     * The other model is the submitted model.
     * \n
     * Both models will be modified in the process.
     * \n
     * @param model The model to compare with.
     */
    compare(model, normalize, check_geom_equality, check_attrib_equality) {
        return this.comparator.compare(model, normalize, check_geom_equality, check_attrib_equality);
    }
    /**
     * Update time stamp of an object (point, pline, pgon)
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    getObjsUpdateTs(ent_type, ent_i) {
        const ts = this.active_ssid;
        switch (ent_type) {
            case common_1.EEntType.POINT:
            case common_1.EEntType.PLINE:
            case common_1.EEntType.PGON:
                this.attribs.set.setEntAttribVal(ent_type, ent_i, common_1.EAttribNames.TIMESTAMP, ts);
                return;
            case common_1.EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach(pgon_i => {
                    this.attribs.set.setEntAttribVal(common_1.EEntType.PGON, pgon_i, common_1.EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPline(ent_i).forEach(pline_i => {
                    this.attribs.set.setEntAttribVal(common_1.EEntType.PLINE, pline_i, common_1.EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach(point_i => {
                    this.attribs.set.setEntAttribVal(common_1.EEntType.POINT, point_i, common_1.EAttribNames.TIMESTAMP, ts);
                });
                return;
            case common_1.EEntType.WIRE:
            case common_1.EEntType.EDGE:
            case common_1.EEntType.VERT:
                // get the topo object
                const [ent2_type, ent2_i] = this.geom.query.getTopoObj(ent_type, ent_i);
                this.getObjsUpdateTs(ent2_type, ent2_i);
        }
    }
    /**
     * Check time stamp of an object (point, pline, pgon) is same as current time stamp
     * If the input entity is a topo entity or collection, then objects will be retrieved.
     * @param ent_type
     * @param ent_i
     */
    getObjsCheckTs(ent_type, ent_i) {
        const ts = this.active_ssid;
        switch (ent_type) {
            case common_1.EEntType.POINT:
            case common_1.EEntType.PLINE:
            case common_1.EEntType.PGON:
                if (this.attribs.get.getEntAttribVal(ent_type, ent_i, common_1.EAttribNames.TIMESTAMP) !== ts) {
                    // const obj_ts = this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP);
                    throw new Error('An object is being edited that was created in an upstream node. ' +
                        'Objects are immutable outside the node in which they are created. ' +
                        '<ul>' +
                        '<li>The object being edited is: "' + (0, common_id_funcs_1.idMake)(ent_type, ent_i) + '".</li>' +
                        '</ul>' +
                        'Possible fixes:' +
                        '<ul>' +
                        '<li>In this node, before editing, clone the object using the using the make.Clone() function.</li>' +
                        '</ul>');
                }
                return;
            case common_1.EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach(pgon_i => {
                    this.getObjsCheckTs(common_1.EEntType.PGON, pgon_i);
                });
                this.geom.nav.navCollToPline(ent_i).forEach(pline_i => {
                    this.getObjsCheckTs(common_1.EEntType.PLINE, pline_i);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach(point_i => {
                    this.getObjsCheckTs(common_1.EEntType.POINT, point_i);
                });
                return;
            case common_1.EEntType.WIRE:
            case common_1.EEntType.EDGE:
            case common_1.EEntType.VERT:
                // get the topo object
                const [ent2_type, ent2_i] = this.geom.query.getTopoObj(ent_type, ent_i);
                this.getObjsCheckTs(ent2_type, ent2_i);
        }
    }
    /**
     * Update time stamp of a object, or collection
     * Topo ents will throw an error
     * @param point_i
     */
    updateEntTs(ent_type, ent_i) {
        if (ent_type >= common_1.EEntType.POINT && ent_type <= common_1.EEntType.PGON) {
            this.attribs.set.setEntAttribVal(ent_type, ent_i, common_1.EAttribNames.TIMESTAMP, this.active_ssid);
        }
    }
    /**
     * Get the timestamp of an entity.
     * @param posi_i
     */
    getEntTs(ent_type, ent_i) {
        if (ent_type < common_1.EEntType.POINT || ent_type > common_1.EEntType.PGON) {
            throw new Error('Get time stamp: Entity type is not valid.');
        }
        return this.attribs.get.getEntAttribVal(ent_type, ent_i, common_1.EAttribNames.TIMESTAMP);
    }
    /**
     * Get the ID (integer) of the next snapshot.
     */
    nextSnapshot() {
        this._max_timestamp += 1;
        this.active_ssid = this._max_timestamp;
    }
    /**
     *
     */
    toStr(ssid) {
        return 'SSID = ' + ssid + '\n' +
            'GEOMETRY\n' + this.geom.snapshot.toStr(ssid) +
            'ATTRIBUTES\n' + this.attribs.snapshot.toStr(ssid);
    }
}
exports.GIModelData = GIModelData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbERhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGlicy9nZW8taW5mby9HSU1vZGVsRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBdUM7QUFDdkMsbURBQWdEO0FBQ2hELHFDQUFxRztBQUNyRywyREFBd0Q7QUFFeEQscURBQWtEO0FBQ2xELHlEQUFzRDtBQUN0RCxxREFBa0Q7QUFDbEQscURBQWtEO0FBQ2xELHlEQUFzRDtBQUN0RCx1REFBMkM7QUFFM0M7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFjcEI7O09BRUc7SUFDSCx5Q0FBeUM7SUFDekMsWUFBWSxLQUFjO1FBakJuQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNmLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBTXBCLFVBQUssR0FBRyxJQUFJLENBQUM7UUFDcEIsWUFBWTtRQUNMLGlCQUFZLEdBQUcsSUFBSSw2QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLGVBQVUsR0FBRyxJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsZUFBVSxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxpQkFBWSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQU0xQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxxQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxZQUFZO1FBQ1osSUFBSSxDQUFD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