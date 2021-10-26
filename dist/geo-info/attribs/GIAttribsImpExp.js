import { EEntType } from '../common';
/**
 * Class for attributes. merge dump append
 */
export class GIAttribsImpExp {
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
    importGI(gi_attribs_data, renum_maps) {
        // positions
        for (const gi_attrib_data of gi_attribs_data.posis) {
            this._importEntAttribData(gi_attrib_data, EEntType.POSI, renum_maps.posis);
        }
        // vertices
        for (const gi_attrib_data of gi_attribs_data.verts) {
            this._importEntAttribData(gi_attrib_data, EEntType.VERT, renum_maps.verts);
        }
        // edges
        for (const gi_attrib_data of gi_attribs_data.edges) {
            this._importEntAttribData(gi_attrib_data, EEntType.EDGE, renum_maps.edges);
        }
        // wires
        for (const gi_attrib_data of gi_attribs_data.wires) {
            this._importEntAttribData(gi_attrib_data, EEntType.WIRE, renum_maps.wires);
        }
        // points
        for (const gi_attrib_data of gi_attribs_data.points) {
            this._importEntAttribData(gi_attrib_data, EEntType.POINT, renum_maps.points);
        }
        // plines
        for (const gi_attrib_data of gi_attribs_data.plines) {
            this._importEntAttribData(gi_attrib_data, EEntType.PLINE, renum_maps.plines);
        }
        // pgons
        for (const gi_attrib_data of gi_attribs_data.pgons) {
            this._importEntAttribData(gi_attrib_data, EEntType.PGON, renum_maps.pgons);
        }
        // colls
        for (const gi_attrib_data of gi_attribs_data.colls) {
            //
            // TODO
            //
            // What happens when collection with same name already exists
            // need to be merged ?
            //
            this._importEntAttribData(gi_attrib_data, EEntType.COLL, renum_maps.colls);
        }
        // model
        for (const [name, val] of gi_attribs_data.model) {
            this.modeldata.attribs.set.setModelAttribVal(name, val);
        }
    }
    /**
     * Returns the JSON data for this model.
     */
    exportGI(ent_sets, renum_maps) {
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
            const attrib_data = attrib.getJSONData(ent_sets.ps);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.posis);
                data.posis.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._v.forEach(attrib => {
            const attrib_data = attrib.getJSONData(ent_sets._v);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.verts);
                data.verts.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._e.forEach(attrib => {
            const attrib_data = attrib.getJSONData(ent_sets._e);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.edges);
                data.edges.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid)._w.forEach(attrib => {
            const attrib_data = attrib.getJSONData(ent_sets._w);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.wires);
                data.wires.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pt.forEach(attrib => {
            const attrib_data = attrib.getJSONData(ent_sets.pt);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.points);
                data.points.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pl.forEach(attrib => {
            const attrib_data = attrib.getJSONData(ent_sets.pl);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.plines);
                data.plines.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).pg.forEach(attrib => {
            const attrib_data = attrib.getJSONData(ent_sets.pg);
            if (attrib_data !== null) {
                this._remapEntAttribData(attrib_data, renum_maps.pgons);
                data.pgons.push(attrib_data);
            }
        });
        this.modeldata.attribs.attribs_maps.get(ssid).co.forEach(attrib => {
            const attrib_data = attrib.getJSONData(ent_sets.co);
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
     * @param gi_attrib_data
     * @param ent_type
     * @param renum_map
     */
    _importEntAttribData(gi_attrib_data, ent_type, renum_map) {
        // get or create the attrib
        this.modeldata.attribs.add.addEntAttrib(ent_type, gi_attrib_data.name, gi_attrib_data.data_type);
        // set all values for this attrib
        for (const [val, ents_i] of gi_attrib_data.data) {
            const ents2_i = ents_i.map(ent_i => renum_map.get(ent_i));
            this.modeldata.attribs.set.setEntsAttribVal(ent_type, ents2_i, gi_attrib_data.name, val);
        }
    }
    /**
     * Renumber the ent indexes in the data.
     *
     * @param gi_attrib_data
     * @param renum_map
     */
    _remapEntAttribData(gi_attrib_data, renum_map) {
        for (const a_data of gi_attrib_data.data) {
            a_data[1] = a_data[1].map(ent_i => renum_map.get(ent_i));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzSW1wRXhwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9nZW8taW5mby9hdHRyaWJzL0dJQXR0cmlic0ltcEV4cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXFDLFFBQVEsRUFBd0IsTUFBTSxXQUFXLENBQUM7QUFHOUY7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUV6Qjs7O1FBR0k7SUFDSCxZQUFZLFNBQXNCO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFDRDs7O09BR0c7SUFDSSxRQUFRLENBQUMsZUFBaUMsRUFBRSxVQUFzQjtRQUNyRSxZQUFZO1FBQ1osS0FBSyxNQUFNLGNBQWMsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxXQUFXO1FBQ1gsS0FBSyxNQUFNLGNBQWMsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxRQUFRO1FBQ1IsS0FBSyxNQUFNLGNBQWMsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxRQUFRO1FBQ1IsS0FBSyxNQUFNLGNBQWMsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxD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