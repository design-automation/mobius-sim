import { GIGeom } from './geom/GIGeom';
import { GIAttribs } from './attribs/GIAttribs';
import { EEntType, EAttribNames } from './common';
import { GIModelComparator } from './GIModelComparator';
import { GIModelThreejs } from './GIModelThreejs';
import { GIFuncsCommon } from './funcs/GIFuncsCommon';
import { GIFuncsMake } from './funcs/GIFuncsMake';
import { GIFuncsEdit } from './funcs/GIFuncsEdit';
import { GIFuncsModify } from './funcs/GIFuncsModify';
import { idMake } from './common_id_funcs';
/**
 * Geo-info model class.
 */
export class GIModelData {
    active_ssid = 0;
    _max_timestamp = 0;
    model;
    geom;
    attribs;
    comparator;
    threejs;
    debug = true;
    // functions
    funcs_common = new GIFuncsCommon(this);
    funcs_make = new GIFuncsMake(this);
    funcs_edit = new GIFuncsEdit(this);
    funcs_modify = new GIFuncsModify(this);
    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor(model) {
        this.model = model;
        this.geom = new GIGeom(this);
        this.attribs = new GIAttribs(this);
        this.comparator = new GIModelComparator(this);
        this.threejs = new GIModelThreejs(this);
        // functions
        this.funcs_common = new GIFuncsCommon(this);
        this.funcs_make = new GIFuncsMake(this);
        this.funcs_edit = new GIFuncsEdit(this);
        this.funcs_modify = new GIFuncsModify(this);
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
        renum_maps.points.forEach((new_ent_i, _) => ents.push([EEntType.POINT, new_ent_i]));
        renum_maps.plines.forEach((new_ent_i, _) => ents.push([EEntType.PLINE, new_ent_i]));
        renum_maps.pgons.forEach((new_ent_i, _) => ents.push([EEntType.PGON, new_ent_i]));
        renum_maps.colls.forEach((new_ent_i, _) => ents.push([EEntType.COLL, new_ent_i]));
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
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
                this.attribs.set.setEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP, ts);
                return;
            case EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach(pgon_i => {
                    this.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i, EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPline(ent_i).forEach(pline_i => {
                    this.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i, EAttribNames.TIMESTAMP, ts);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach(point_i => {
                    this.attribs.set.setEntAttribVal(EEntType.POINT, point_i, EAttribNames.TIMESTAMP, ts);
                });
                return;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
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
            case EEntType.POINT:
            case EEntType.PLINE:
            case EEntType.PGON:
                if (this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP) !== ts) {
                    // const obj_ts = this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP);
                    throw new Error('An object is being edited that was created in an upstream node. ' +
                        'Objects are immutable outside the node in which they are created. ' +
                        '<ul>' +
                        '<li>The object being edited is: "' + idMake(ent_type, ent_i) + '".</li>' +
                        '</ul>' +
                        'Possible fixes:' +
                        '<ul>' +
                        '<li>In this node, before editing, clone the object using the using the make.Clone() function.</li>' +
                        '</ul>');
                }
                return;
            case EEntType.COLL:
                // get the objects from the collection
                this.geom.nav.navCollToPgon(ent_i).forEach(pgon_i => {
                    this.getObjsCheckTs(EEntType.PGON, pgon_i);
                });
                this.geom.nav.navCollToPline(ent_i).forEach(pline_i => {
                    this.getObjsCheckTs(EEntType.PLINE, pline_i);
                });
                this.geom.nav.navCollToPoint(ent_i).forEach(point_i => {
                    this.getObjsCheckTs(EEntType.POINT, point_i);
                });
                return;
            case EEntType.WIRE:
            case EEntType.EDGE:
            case EEntType.VERT:
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
        if (ent_type >= EEntType.POINT && ent_type <= EEntType.PGON) {
            this.attribs.set.setEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP, this.active_ssid);
        }
    }
    /**
     * Get the timestamp of an entity.
     * @param posi_i
     */
    getEntTs(ent_type, ent_i) {
        if (ent_type < EEntType.POINT || ent_type > EEntType.PGON) {
            throw new Error('Get time stamp: Entity type is not valid.');
        }
        return this.attribs.get.getEntAttribVal(ent_type, ent_i, EAttribNames.TIMESTAMP);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbERhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL0dJTW9kZWxEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBa0IsUUFBUSxFQUFFLFlBQVksRUFBcUMsTUFBTSxVQUFVLENBQUM7QUFDckcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFeEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFM0M7O0dBRUc7QUFDSCxNQUFNLE9BQU8sV0FBVztJQUNiLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDZixjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLEtBQUssQ0FBVTtJQUNmLElBQUksQ0FBUztJQUNiLE9BQU8sQ0FBWTtJQUNuQixVQUFVLENBQW9CO0lBQzlCLE9BQU8sQ0FBaUI7SUFDeEIsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixZQUFZO0lBQ0wsWUFBWSxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLFVBQVUsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxVQUFVLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENB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