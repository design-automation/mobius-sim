import { IAttribsSIMData, IAttribSIMData, EEntType, IEntSets, ISIMRenumMaps, TAttribDataTypes } from '../common';
import { GIModelData } from '../GIModelData';

/**
 * Class for attributes. merge dump append
 */
export class SIMAttribsImpExp {
    private modeldata: GIModelData;
   /**
     * Creates the object.
     * @param modeldata The JSON data
     */
    constructor(modeldata: GIModelData) {
        this.modeldata = modeldata;
    }
    /**
     * Imports JSON data from another model.
     * @param model_data Attribute data from the other model.
     */
    public importSIM(attribs_data: IAttribsSIMData, renum_maps: ISIMRenumMaps): void {
        // positions
        for (const attrib_data of attribs_data.posis) {
            this._importEntAttribData(attrib_data, EEntType.POSI, renum_maps.posis);
        }
        // vertices
        for (const attrib_data of attribs_data.verts) {
            this._importEntAttribData(attrib_data, EEntType.VERT, renum_maps.verts);
        }
        // edges
        for (const attrib_data of attribs_data.edges) {
            this._importEntAttribData(attrib_data, EEntType.EDGE, renum_maps.edges);
        }
        // wires
        for (const attrib_data of attribs_data.wires) {
            this._importEntAttribData(attrib_data, EEntType.WIRE, renum_maps.wires);
        }
        // points
        for (const attrib_data of attribs_data.points) {
            this._importEntAttribData(attrib_data, EEntType.POINT, renum_maps.points);
        }
        // plines
        for (const attrib_data of attribs_data.plines) {
            this._importEntAttribData(attrib_data, EEntType.PLINE, renum_maps.plines);
        }
        // pgons
        for (const attrib_data of attribs_data.pgons) {
            this._importEntAttribData(attrib_data, EEntType.PGON, renum_maps.pgons);
        }
        // colls
        for (const attrib_data of attribs_data.colls) {
            //
            // TODO
            //
            // What happens when collection with same name already exists
            // need to be merged ?
            //
            this._importEntAttribData(attrib_data, EEntType.COLL, renum_maps.colls);
        }
        // model
        for (const [name, val] of attribs_data.model) {
            this.modeldata.attribs.set.setModelAttribVal(name, val);
        }
    }
    /**
     * Returns the JSON data for this model.
     */
    public exportSIM(ent_sets: IEntSets, renum_maps: ISIMRenumMaps): IAttribsSIMData {
        const ssid: number = this.modeldata.active_ssid;
        const data: IAttribsSIMData = {
            posis: [],
            verts: [],
            edges: [],
            wires: [],
            points: [],
            plines: [],
            pgons: [],
            colls: [],
            model: []
        };
        this.modeldata.attribs.attribs_maps.get(ssid).ps.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets.ps);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.posis);
                data.posis.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._v.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets._v);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.verts);
                data.verts.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._e.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets._e);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.edges);
                data.edges.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._w.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets._w);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.wires);
                data.wires.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pt.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets.pt);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.points);
                data.points.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pl.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets.pl);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.plines);
                data.plines.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pg.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets.pg);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.pgons);
                data.pgons.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).co.forEach( attrib => {
            const attrib_data: IAttribSIMData = attrib.getSIMData(ent_sets.co);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.colls);
                data.colls.push(attrib_data);
            }
        });
        data.model = Array.from(this.modeldata.attribs.attribs_maps.get(ssid).mo);
        return data;
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Renumber the ent indexes in the data, and import the data into this model.
     *
     * @param attrib_data
     * @param ent_type
     * @param renum_map
     */
    private _importEntAttribData(attrib_data: IAttribSIMData, ent_type: EEntType, renum_map: Map<number, number>): void {
        // get or create the attrib
        this.modeldata.attribs.add.addEntAttrib(ent_type, attrib_data.name, attrib_data.data_type);
        // set all values for this attrib
        for (let i = 0; i < attrib_data.data_vals.length; i++) {
            const val: TAttribDataTypes = attrib_data.data_vals[i]; 
            const ents_i: number[] = attrib_data.data_ents[i];
            const ents2_i: number[] = ents_i.map( ent_i => renum_map.get(ent_i) );
            this.modeldata.attribs.set.setEntsAttribVal(ent_type, ents2_i, attrib_data.name, val);
        }
    }
    /**
     * Renumber the ent indexes in the data.
     *
     * @param attrib_data
     * @param renum_map
     */
    private _remapEntAttribData(attrib_data: IAttribSIMData, renum_map: Map<number, number>): void {
        for (let i = 0; i < attrib_data.data_ents.length; i++) {
            attrib_data.data_ents[i] = attrib_data.data_ents[i] .map(ent_i => renum_map.get(ent_i));
        }
    }
}
