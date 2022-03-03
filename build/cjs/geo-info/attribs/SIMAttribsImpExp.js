"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMAttribsImpExp = void 0;
const common_1 = require("../common");
/**
 * Class for attributes. merge dump append
 */
class SIMAttribsImpExp {
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
            this._importEntAttribData(attrib_data, common_1.EEntType.POSI, renum_maps.posis);
        }
        // vertices
        for (const attrib_data of attribs_data.verts) {
            this._importEntAttribData(attrib_data, common_1.EEntType.VERT, renum_maps.verts);
        }
        // edges
        for (const attrib_data of attribs_data.edges) {
            this._importEntAttribData(attrib_data, common_1.EEntType.EDGE, renum_maps.edges);
        }
        // wires
        for (const attrib_data of attribs_data.wires) {
            this._importEntAttribData(attrib_data, common_1.EEntType.WIRE, renum_maps.wires);
        }
        // points
        for (const attrib_data of attribs_data.points) {
            this._importEntAttribData(attrib_data, common_1.EEntType.POINT, renum_maps.points);
        }
        // plines
        for (const attrib_data of attribs_data.plines) {
            this._importEntAttribData(attrib_data, common_1.EEntType.PLINE, renum_maps.plines);
        }
        // pgons
        for (const attrib_data of attribs_data.pgons) {
            this._importEntAttribData(attrib_data, common_1.EEntType.PGON, renum_maps.pgons);
        }
        // colls
        for (const attrib_data of attribs_data.colls) {
            //
            // TODO
            //
            // What happens when collection with same name already exists
            // need to be merged ?
            //
            this._importEntAttribData(attrib_data, common_1.EEntType.COLL, renum_maps.colls);
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
        for (let i = 0; i < attrib_data.values.length; i++) {
            const val = attrib_data.values[i];
            const ents_i = attrib_data.entities[i];
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
        for (let i = 0; i < attrib_data.entities.length; i++) {
            attrib_data.entities[i] = attrib_data.entities[i].map(ent_i => renum_map.get(ent_i));
        }
    }
}
exports.SIMAttribsImpExp = SIMAttribsImpExp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU0lNQXR0cmlic0ltcEV4cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYnMvZ2VvLWluZm8vYXR0cmlicy9TSU1BdHRyaWJzSW1wRXhwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFpSDtBQUdqSDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBRTFCOzs7UUFHSTtJQUNILFlBQVksU0FBc0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNEOzs7T0FHRztJQUNJLFNBQVMsQ0FBQyxZQUE2QixFQUFFLFVBQXlCO1FBQ3JFLFlBQVk7UUFDWixLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxpQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0U7UUFDRCxXQUFXO1FBQ1gsS0FBSyxNQUFNLFdBQVcsSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFO1lBQzFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsaUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsUUFBUTtRQUNSLEtBQUssTUFBTSxXQUFXLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRTtZQUMxQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLGlCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzRTtRQUNELFFBQVE7UUFDUixLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxpQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0U7UUFDRCxT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