"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIAttribsImpExp = void 0;
const common_1 = require("../common");
/**
 * Class for attributes. merge dump append
 */
class GIAttribsImpExp {
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
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.POSI, renum_maps.posis);
        }
        // vertices
        for (const gi_attrib_data of gi_attribs_data.verts) {
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.VERT, renum_maps.verts);
        }
        // edges
        for (const gi_attrib_data of gi_attribs_data.edges) {
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.EDGE, renum_maps.edges);
        }
        // wires
        for (const gi_attrib_data of gi_attribs_data.wires) {
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.WIRE, renum_maps.wires);
        }
        // points
        for (const gi_attrib_data of gi_attribs_data.points) {
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.POINT, renum_maps.points);
        }
        // plines
        for (const gi_attrib_data of gi_attribs_data.plines) {
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.PLINE, renum_maps.plines);
        }
        // pgons
        for (const gi_attrib_data of gi_attribs_data.pgons) {
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.PGON, renum_maps.pgons);
        }
        // colls
        for (const gi_attrib_data of gi_attribs_data.colls) {
            //
            // TODO
            //
            // What happens when collection with same name already exists
            // need to be merged ?
            //
            this._importEntAttribData(gi_attrib_data, common_1.EEntType.COLL, renum_maps.colls);
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
exports.GIAttribsImpExp = GIAttribsImpExp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lBdHRyaWJzSW1wRXhwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9HSUF0dHJpYnNJbXBFeHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0NBQThGO0FBRzlGOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBRXpCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFFBQVEsQ0FBQyxlQUFpQyxFQUFFLFVBQXNCO1FBQ3JFLFlBQVk7UUFDWixLQUFLLE1BQU0sY0FBYyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUU7WUFDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsRUFBRSxpQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxXQUFXO1FBQ1gsS0FBSyxNQUFNLGNBQWMsSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsUUFBUTtRQUNSLEtBQUssTUFBTSxjQUFjLElBQUksZUFBZSxDQUFDLEtBQUssRUFBRTtZQUNoRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxFQUFFLGlCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5RTtRQUNELFFBQVE7UUFDUixLQUFLLE1BQU0sY0FBYyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUU7WUFDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsRUFBRSxpQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxT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