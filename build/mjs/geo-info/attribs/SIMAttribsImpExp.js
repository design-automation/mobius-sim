import { EEntType } from '../common';
/**
 * Class for attributes. merge dump append
 */
export class SIMAttribsImpExp {
    modeldata;
    /**
      * Creates the object.
      * @param modeldata The JSON data
      */
    constructor(modeldata) {
        this.modeldata = modeldata;
    }
    /**
     * Imports JSON data from another model.
     * @param model_data Attribute data from the other model.
     */
    importSIM(attribs_data, renum_maps) {
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
    exportSIM(ent_sets, renum_maps) {
        const ssid = this.modeldata.active_ssid;
        const data = {
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
        this.modeldata.attribs.attribs_maps.get(ssid).ps.forEach(attrib => {
            const attrib_data = attrib.getSIMData(ent_sets.ps);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.posis);
                data.posis.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._v.forEach(attrib => {
            const attrib_data = attrib.getSIMData(ent_sets._v);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.verts);
                data.verts.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._e.forEach(attrib => {
            const attrib_data = attrib.getSIMData(ent_sets._e);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.edges);
                data.edges.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._w.forEach(attrib => {
            const attrib_data = attrib.getSIMData(ent_sets._w);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.wires);
                data.wires.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pt.forEach(attrib => {
            if (attrib.getName()[0] !== '_') {
                const attrib_data = attrib.getSIMData(ent_sets.pt);
                if (attrib_data !== null) {
                    this._remapEntAttribData(attrib_data, renum_maps.points);
                    data.points.push(attrib_data);
                }
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pl.forEach(attrib => {
            if (attrib.getName()[0] !== '_') {
                const attrib_data = attrib.getSIMData(ent_sets.pl);
                if (attrib_data !== null) {
                    this._remapEntAttribData(attrib_data, renum_maps.plines);
                    data.plines.push(attrib_data);
                }
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pg.forEach(attrib => {
            if (attrib.getName()[0] !== '_') {
                const attrib_data = attrib.getSIMData(ent_sets.pg);
                if (attrib_data !== null) {
                    this._remapEntAttribData(attrib_data, renum_maps.pgons);
                    data.pgons.push(attrib_data);
                }
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).co.forEach(attrib => {
            if (attrib.getName()[0] !== '_') {
                const attrib_data = attrib.getSIMData(ent_sets.co);
                if (attrib_data !== null) {
                    this._remapEntAttribData(attrib_data, renum_maps.colls);
                    data.colls.push(attrib_data);
                }
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
    _importEntAttribData(attrib_data, ent_type, renum_map) {
        // get or create the attrib
        this.modeldata.attribs.add.addEntAttrib(ent_type, attrib_data.name, attrib_data.data_type);
        // set all values for this attrib
        for (let i = 0; i < attrib_data.data_vals.length; i++) {
            const val = attrib_data.data_vals[i];
            const ents_i = attrib_data.data_ents[i];
            const ents2_i = ents_i.map(ent_i => renum_map.get(ent_i));
            this.modeldata.attribs.set.setEntsAttribVal(ent_type, ents2_i, attrib_data.name, val);
        }
    }
    /**
     * Renumber the ent indexes in the data.
     *
     * @param attrib_data
     * @param renum_map
     */
    _remapEntAttribData(attrib_data, renum_map) {
        for (let i = 0; i < attrib_data.data_ents.length; i++) {
            attrib_data.data_ents[i] = attrib_data.data_ents[i].map(ent_i => renum_map.get(ent_i));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU0lNQXR0cmlic0ltcEV4cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9TSU1BdHRyaWJzSW1wRXhwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBbUMsUUFBUSxFQUE2QyxNQUFNLFdBQVcsQ0FBQztBQUdqSDs7R0FFRztBQUNILE1BQU0sT0FBTyxnQkFBZ0I7SUFDakIsU0FBUyxDQUFjO0lBQ2hDOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFNBQVMsQ0FBQyxZQUE2QixFQUFFLFVBQXlCO1FBQ3JFLFlBQVk7UUFDWixLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzRTtRQUNELFdBQVc7UUFDWCxLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzRTtRQUNELFFBQVE7UUFDUixLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzRTtRQUNELFFBQVE7UUFDUixLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFB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