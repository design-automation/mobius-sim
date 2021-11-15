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
    /**
     * Constructor
     */
    // constructor(model_data?: IModelData) {
    constructor(model) {
        this.active_ssid = 0;
        this._max_timestamp = 0;
        this.debug = true;
        // functions
        this.funcs_common = new GIFuncsCommon(this);
        this.funcs_make = new GIFuncsMake(this);
        this.funcs_edit = new GIFuncsEdit(this);
        this.funcs_modify = new GIFuncsModify(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbERhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWJzL2dlby1pbmZvL0dJTW9kZWxEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBa0IsUUFBUSxFQUFFLFlBQVksRUFBcUMsTUFBTSxVQUFVLENBQUM7QUFDckcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFeEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFM0M7O0dBRUc7QUFDSCxNQUFNLE9BQU8sV0FBVztJQWNwQjs7T0FFRztJQUNILHlDQUF5QztJQUN6QyxZQUFZLEtBQWM7UUFqQm5CLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFNcEIsVUFBSyxHQUFHLElBQUksQ0FBQztRQUNwQixZQUFZO1FBQ0wsaUJBQVksR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxlQUFVLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsZUFBVSxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLGlCQUFZLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFB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