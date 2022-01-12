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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbERhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL0dJTW9kZWxEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUF1QztBQUN2QyxtREFBZ0Q7QUFDaEQscUNBQXFHO0FBQ3JHLDJEQUF3RDtBQUV4RCxxREFBa0Q7QUFDbEQseURBQXNEO0FBQ3RELHFEQUFrRDtBQUNsRCxxREFBa0Q7QUFDbEQseURBQXNEO0FBQ3RELHVEQUEyQztBQUUzQzs7R0FFRztBQUNILE1BQWEsV0FBVztJQWNwQjs7T0FFRztJQUNILHlDQUF5QztJQUN6QyxZQUFZLEtBQWM7UUFqQm5CLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFNcEIsVUFBSyxHQUFHLElBQUksQ0FBQztRQUNwQixZQUFZO1FBQ0wsaUJBQVksR0FBRyxJQUFJLDZCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsZUFBVSxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxlQUFVLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLGlCQUFZLEdBQUcsSUFBSSw2QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBTTFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLFlBQVk7UUFDWixJQUFJLENBQUMsWUFB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