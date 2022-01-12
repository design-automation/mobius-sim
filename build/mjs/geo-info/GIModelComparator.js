import { EEntType, EEntTypeStr } from './common';
import { vecDot } from '../geom/vectors';
import { idMake } from './common_id_funcs';
/**
 * Geo-info model class.
 */
export class GIModelComparator {
    modeldata;
    /**
      * Constructor
      */
    constructor(model) {
        this.modeldata = model;
    }
    /**
     * Compares two models.
     * Checks that every entity in this model also exists in the other model.
     * \n
     * Additional entitis in the other model will not affect the score.
     * Attributes at the model level are ignored except for the `material` attributes.
     * \n
     * For grading, this model is assumed to be the answer model, and the other model is assumed to be
     * the model submitted by the student.
     * \n
     * Both models will be modified in the process of cpmparing.
     * \n
     * @param model The model to compare with.
     */
    compare(model, normalize, check_geom_equality, check_attrib_equality) {
        // create the result object
        const result = { percent: 0, score: 0, total: 0, comment: [] };
        // check we have exact same number of positions, objects, and colletions
        if (check_geom_equality) {
            this.modeldata.geom.compare.compare(model, result);
        }
        // check that the attributes in this model all exist in the other model
        if (check_attrib_equality) {
            this.modeldata.attribs.compare.compare(model, result);
        }
        // normalize the two models
        if (normalize) {
            this.norm();
            model.modeldata.comparator.norm();
        }
        // compare objects
        let idx_maps = null;
        idx_maps = this.compareObjs(model, result);
        // check for common erros
        // SLOW....
        // this.checkForErrors(model, result, idx_maps);
        // compare colls
        this.compareColls(model, result, idx_maps);
        // compare the material attribs in the model
        this.compareModelAttribs(model, result);
        // Add a final msg
        if (result.score === result.total) {
            result.comment = ['RESULT: The two models match.'];
        }
        else {
            result.comment.push('RESULT: The two models do not match.');
        }
        // calculate percentage score
        result.percent = Math.round(result.score / result.total * 100);
        if (result.percent < 0) {
            result.percent = 0;
        }
        // html formatting
        let formatted_str = '';
        formatted_str += '<p><b>Percentage: ' + result.percent + '%</b></p>';
        formatted_str += '<p>Score: ' + result.score + '/' + result.total + '</p>';
        formatted_str += '<ul>';
        for (const comment of result.comment) {
            if (Array.isArray(comment)) {
                formatted_str += '<ul>';
                for (const sub_comment of comment) {
                    formatted_str += '<li>' + sub_comment + '</li>';
                }
                formatted_str += '</ul>';
            }
            else {
                formatted_str += '<li>' + comment + '</li>';
            }
        }
        formatted_str += '</ul>';
        result.comment = formatted_str;
        // return the result
        return result;
    }
    // ============================================================================
    // Private methods for normalizing
    // ============================================================================
    /**
     * Normalises the direction of open wires
     */
    norm() {
        const trans_padding = this.getTransPadding();
        this.normOpenWires(trans_padding);
        this.normClosedWires(trans_padding);
        this.normHoles(trans_padding);
    }
    /**
     * Get the min max posis
     */
    getTransPadding() {
        const ssid = this.modeldata.active_ssid;
        const precision = 1e4;
        const min = [Infinity, Infinity, Infinity];
        const max = [-Infinity, -Infinity, -Infinity];
        for (const posi_i of this.modeldata.geom.snapshot.getEnts(ssid, EEntType.POSI)) {
            const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
            if (xyz[0] < min[0]) {
                min[0] = xyz[0];
            }
            if (xyz[1] < min[1]) {
                min[1] = xyz[1];
            }
            if (xyz[2] < min[2]) {
                min[2] = xyz[2];
            }
            if (xyz[0] > max[0]) {
                max[0] = xyz[0];
            }
            if (xyz[1] > max[1]) {
                max[1] = xyz[1];
            }
            if (xyz[2] > max[2]) {
                max[2] = xyz[2];
            }
        }
        const trans_vec = [min[0] * -1, min[1] * -1, min[2] * -1];
        const trans_max = [max[0] + trans_vec[0], max[1] + trans_vec[1], max[2] + trans_vec[2]];
        const padding = [
            String(Math.round(trans_max[0] * precision)).length,
            String(Math.round(trans_max[1] * precision)).length,
            String(Math.round(trans_max[2] * precision)).length
        ];
        return [trans_vec, padding];
    }
    /**
     * Normalises the direction of open wires
     */
    normOpenWires(trans_padding) {
        const ssid = this.modeldata.active_ssid;
        for (const wire_i of this.modeldata.geom.snapshot.getEnts(ssid, EEntType.WIRE)) {
            if (!this.modeldata.geom.query.isWireClosed(wire_i)) {
                // an open wire can only start at the first or last vertex, but the order can be reversed
                const verts_i = this.modeldata.geom.nav.navAnyToVert(EEntType.WIRE, wire_i);
                const fprint_start = this.normXyzFprint(EEntType.VERT, verts_i[0], trans_padding);
                const fprint_end = this.normXyzFprint(EEntType.VERT, verts_i[verts_i.length - 1], trans_padding);
                if (fprint_start > fprint_end) {
                    this.modeldata.geom.edit_topo.reverse(wire_i);
                }
            }
        }
    }
    /**
     * Normalises the edge order of closed wires
     */
    normClosedWires(trans_padding) {
        const ssid = this.modeldata.active_ssid;
        for (const wire_i of this.modeldata.geom.snapshot.getEnts(ssid, EEntType.WIRE)) {
            if (this.modeldata.geom.query.isWireClosed(wire_i)) {
                // a closed wire can start at any edge
                const edges_i = this.modeldata.geom.nav.navAnyToEdge(EEntType.WIRE, wire_i);
                const fprints = [];
                for (let i = 0; i < edges_i.length; i++) {
                    const edge_i = edges_i[i];
                    fprints.push([this.normXyzFprint(EEntType.EDGE, edge_i, trans_padding), i]);
                }
                fprints.sort();
                this.modeldata.geom.edit_topo.shift(wire_i, fprints[0][1]);
                // if polyline, the direction can be any
                // so normalise direction
                if (this.modeldata.geom.nav.navWireToPline(wire_i) !== undefined) {
                    const normal = this.modeldata.geom.query.getWireNormal(wire_i);
                    let dot = vecDot(normal, [0, 0, 1]);
                    if (Math.abs(dot) < 1e-6) {
                        dot = vecDot(normal, [1, 0, 0]);
                    }
                    if (dot < 0) {
                        this.modeldata.geom.edit_topo.reverse(wire_i);
                    }
                }
            }
        }
    }
    /**
     * Normalises the order of holes in faces
     */
    normHoles(trans_padding) {
        const ssid = this.modeldata.active_ssid;
        for (const pgon_i of this.modeldata.geom.snapshot.getEnts(ssid, EEntType.PGON)) {
            const holes_i = this.modeldata.geom.query.getPgonHoles(pgon_i);
            if (holes_i.length > 0) {
                const fprints = [];
                for (const hole_i of holes_i) {
                    fprints.push([this.normXyzFprint(EEntType.WIRE, hole_i, trans_padding), hole_i]);
                }
                fprints.sort();
                const reordered_holes_i = fprints.map(fprint => fprint[1]);
                this.modeldata.geom.compare.setPgonHoles(pgon_i, reordered_holes_i);
            }
        }
    }
    /**
     * Round the xyz values, rounded to the precision level
     * \n
     * @param posi_i
     */
    normXyzFprint(ent_type, ent_i, trans_padding) {
        const precision = 1e4;
        // get the xyzs
        const fprints = [];
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            const xyz = this.modeldata.attribs.posis.getPosiCoords(posi_i);
            const fprint = [];
            for (let i = 0; i < 3; i++) {
                const xyz_round = Math.round((xyz[i] + trans_padding[0][i]) * precision);
                fprint.push(String(xyz_round).padStart(trans_padding[1][i], '0'));
            }
            fprints.push(fprint.join(','));
        }
        return fprints.join('|');
    }
    // ============================================================================
    // Private methods for comparing objs, colls
    // ============================================================================
    /**
     * For any entity, greate a string that concatenates all the xyz values of its positions.
     * \n
     * These strings will be used for sorting entities into a predictable order,
     * independent of the order in which the geometry was actually created.
     * \n
     * If there are multiple entities in exactly the same position, then the ordering may be unpredictable.
     * \n
     * @param ent_type
     * @param ent_i
     */
    xyzFprint(ent_type, ent_i, trans_vec = [0, 0, 0]) {
        const posis_i = this.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        const xyzs = posis_i.map(posi_i => this.modeldata.attribs.posis.getPosiCoords(posi_i));
        const fprints = xyzs.map(xyz => this.getAttribValFprint([
            xyz[0] + trans_vec[0],
            xyz[1] + trans_vec[1],
            xyz[2] + trans_vec[2]
        ]));
        return fprints.join('|');
    }
    /**
     * Compare the objects.
     * Check that every object in this model also exists in the other model.
     * \n
     * This will also check the following attributes:
     * For posis, it will check the xyz attribute.
     * For vertices, it will check the rgb attribute, if such an attribute exists in the answer model.
     * For polygons, it will check the material attribute, if such an attribute exists in the answer model.
     */
    compareObjs(other_model, result) {
        result.comment.push('Comparing objects in the two models.');
        const data_comments = [];
        // set attrib names to check when comparing objects and collections
        const attrib_names = new Map();
        attrib_names.set(EEntType.POSI, ['xyz']);
        if (this.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, 'rgb')) {
            attrib_names.set(EEntType.VERT, ['rgb']);
        }
        if (this.modeldata.attribs.query.hasEntAttrib(EEntType.PGON, 'material')) {
            attrib_names.set(EEntType.PGON, ['material']);
        }
        // points, polylines, polygons
        const obj_ent_types = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        const obj_ent_type_strs = new Map([
            [EEntType.POINT, 'points'],
            [EEntType.PLINE, 'polylines'],
            [EEntType.PGON, 'polygons']
        ]);
        // compare points, plines, pgons
        const this_to_com_idx_maps = new Map();
        const other_to_com_idx_maps = new Map();
        for (const obj_ent_type of obj_ent_types) {
            // create the two maps, and store them in the map of maps
            const this_to_com_idx_map = new Map();
            this_to_com_idx_maps.set(obj_ent_type, this_to_com_idx_map);
            const other_to_com_idx_map = new Map();
            other_to_com_idx_maps.set(obj_ent_type, other_to_com_idx_map);
            // get the fprints for this model
            const [this_fprints_arr, this_ents_i] = this.getEntsFprint(obj_ent_type, attrib_names);
            // check if we have any duplicates
            const fprints_set = new Set(this_fprints_arr.map(att_map => att_map.get('ps:xyz')));
            if (fprints_set.size !== this_fprints_arr.length) {
                // console.log(fprints_set, this_fprints_arr);
                const tmp_set = new Set();
                const dup_ent_ids = [];
                for (let i = 0; i < this_fprints_arr.length; i++) {
                    const tmp_str = this_fprints_arr[i].get('ps:xyz');
                    if (tmp_set.has(tmp_str)) {
                        const dup_ent_id = idMake(obj_ent_type, this_ents_i[i]);
                        dup_ent_ids.push(dup_ent_id);
                    }
                    tmp_set.add(tmp_str);
                }
                throw new Error('This model contains duplicate objects with the same XYZ coordinates. ' +
                    'Model comparison cannot be performed. <br>' +
                    'Duplicate objects: ' + JSON.stringify(dup_ent_ids, undefined, ' '));
            }
            // get the fprints for the other model
            const [other_fprints_arr, other_ents_i] = other_model.modeldata.comparator.getEntsFprint(obj_ent_type, attrib_names);
            // check that every entity in this model also exists in the other model
            let num_xyz_not_found = 0;
            const num_attribs_not_found = new Map();
            for (let com_idx = 0; com_idx < this_fprints_arr.length; com_idx++) {
                // increment the total by 1
                result.total += 1;
                // get this fprint, i.e. the one we are looking for in the other model
                const this_fprint = this_fprints_arr[com_idx].get('ps:xyz');
                const all_other_fprints = other_fprints_arr.map(att_map => att_map.get('ps:xyz'));
                // get this index and set the map
                const this_ent_i = this_ents_i[com_idx];
                this_to_com_idx_map.set(this_ent_i, com_idx);
                // for other...
                // get the index of this_fprint in the list of other_fprints
                const found_other_idx = all_other_fprints.indexOf(this_fprint);
                // update num_objs_not_found or update result.score
                if (found_other_idx === -1) {
                    num_xyz_not_found++;
                }
                else {
                    // check the attributes
                    const keys = Array.from(this_fprints_arr[com_idx].keys());
                    const ent_num_attribs = keys.length;
                    let ent_num_attribs_mismatch = 0;
                    for (const key of keys) {
                        if (key !== 'ps:xyz') {
                            if (!other_fprints_arr[found_other_idx].has(key) ||
                                this_fprints_arr[com_idx].get(key) !== other_fprints_arr[found_other_idx].get(key)) {
                                ent_num_attribs_mismatch += 1;
                                if (!num_attribs_not_found.has(key)) {
                                    num_attribs_not_found.set(key, 1);
                                }
                                else {
                                    num_attribs_not_found.set(key, num_attribs_not_found.get(key) + 1);
                                }
                            }
                        }
                    }
                    // we other index and set the map
                    const other_ent_i = other_ents_i[found_other_idx];
                    other_to_com_idx_map.set(other_ent_i, com_idx);
                    // update the score
                    const ent_num_attribs_match = ent_num_attribs - ent_num_attribs_mismatch;
                    result.score = result.score + (ent_num_attribs_match / ent_num_attribs);
                }
            }
            // write a msg
            if (this_fprints_arr.length > 0) {
                if (num_xyz_not_found > 0) {
                    data_comments.push('Mismatch: ' + num_xyz_not_found + ' ' +
                        obj_ent_type_strs.get(obj_ent_type) + ' entities could not be found.');
                }
                else {
                    data_comments.push('All ' +
                        obj_ent_type_strs.get(obj_ent_type) + ' entities have been found.');
                }
                for (const key of Array.from(num_attribs_not_found.keys())) {
                    data_comments.push('Mismatch in attribute data: ' + num_attribs_not_found.get(key) + ' ' +
                        obj_ent_type_strs.get(obj_ent_type) + ' entities had mismatched attribute data for: ' + key + '.');
                }
            }
        }
        // return result
        result.comment.push(data_comments);
        // return the maps, needed for comparing collections
        return [this_to_com_idx_maps, other_to_com_idx_maps];
    }
    /**
     * Compare the collections
     */
    compareColls(other_model, result, idx_maps) {
        result.comment.push('Comparing collections in the two models.');
        const data_comments = [];
        // set attrib names to check when comparing collections
        const attrib_names = []; // no attribs to check
        // get the maps
        const this_to_com_idx_maps = idx_maps[0];
        const other_to_com_idx_maps = idx_maps[1];
        // compare collections
        const this_colls_fprints = this.getCollFprints(this_to_com_idx_maps, attrib_names);
        // console.log('this_colls_fprints:', this_colls_fprints);
        const other_colls_fprints = other_model.modeldata.comparator.getCollFprints(other_to_com_idx_maps, attrib_names);
        // console.log('other_colls_fprints:', other_colls_fprints);
        // check that every collection in this model also exists in the other model
        let num_colls_not_found = 0;
        for (const this_colls_fprint of this_colls_fprints) {
            // increment the total score by 1
            result.total += 1;
            // look for this in other
            const found_other_idx = other_colls_fprints.indexOf(this_colls_fprint);
            // add mismatch comment or update score
            if (found_other_idx === -1) {
                num_colls_not_found++;
            }
            else {
                result.score += 1;
            }
        }
        if (num_colls_not_found > 0) {
            data_comments.push('Mismatch: ' + num_colls_not_found + ' collections could not be found.');
        }
        // add a comment if everything matches
        if (result.score === result.total) {
            data_comments.push('Match: The model contains all required entities and collections.');
        }
        // return result
        result.comment.push(data_comments);
    }
    /**
     * Compare the model attribs
     * At the moment, this seems to only compare the material attribute in the model
     */
    compareModelAttribs(other_model, result) {
        const ssid = this.modeldata.active_ssid;
        result.comment.push('Comparing model attributes in the two models.');
        const data_comments = [];
        // set attrib names to check when comparing objects and collections
        const attrib_names = [];
        if (this.modeldata.attribs.query.hasEntAttrib(EEntType.PGON, 'material')) {
            const pgons_i = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.PGON);
            const pgons_mats = this.modeldata.attribs.get.getEntAttribVal(EEntType.PGON, pgons_i, 'material');
            const mat_names = new Set(pgons_mats.flat());
            for (const mat_name of Array.from(mat_names)) {
                if (mat_name !== undefined) {
                    attrib_names.push(mat_name);
                }
            }
        }
        // compare model attributes
        for (const this_mod_attrib_name of attrib_names) {
            // increment the total by 1
            result.total += 1;
            // check if there is a match
            if (other_model.modeldata.attribs.query.hasModelAttrib(this_mod_attrib_name)) {
                const this_value = this.modeldata.attribs.get.getModelAttribVal(this_mod_attrib_name);
                const other_value = other_model.modeldata.attribs.get.getModelAttribVal(this_mod_attrib_name);
                const this_value_fp = this.getAttribValFprint(this_value);
                const other_value_fp = this.getAttribValFprint(other_value);
                if (this_value_fp === other_value_fp) {
                    // correct, so increment the score by 1
                    result.score += 1;
                }
                else {
                    data_comments.push('Mismatch: the value for model attribute "' + this_mod_attrib_name + '" is incorrect.');
                }
            }
            else {
                data_comments.push('Mismatch: model attribute "' + this_mod_attrib_name + '" not be found.');
            }
        }
        // add a comment if everything matches
        if (result.score === result.total) {
            data_comments.push('Match: The model conatins all required model attributes.');
        }
        // return result
        result.comment.push(data_comments);
    }
    /**
     * Check to see if there are any common errors.
     */
    checkForErrors(other_model, result, idx_maps) {
        const ssid = this.modeldata.active_ssid;
        // set precision of comparing vectors
        // this precision should be a little higher than the precision used in
        // getAttribValFprint()
        const precision = 1e6;
        // get the maps
        const this_to_com_idx_maps = idx_maps[0];
        const other_to_com_idx_maps = idx_maps[1];
        // points, polylines, polygons
        const obj_ent_types = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        const obj_ent_type_strs = new Map([
            [EEntType.POINT, 'points'],
            [EEntType.PLINE, 'polylines'],
            [EEntType.PGON, 'polygons']
        ]);
        // compare points, plines, pgons
        const trans_comments = [];
        for (const obj_ent_type of obj_ent_types) {
            // get all the ents in the other model against which nothing has been matched
            // note that this map will be undefined for each ent for which no match was found
            // at the same time, flip the map
            const com_idx_to_other_map = new Map();
            const other_ents_i = other_model.modeldata.geom.snapshot.getEnts(ssid, obj_ent_type);
            const other_mia_ents_i = [];
            for (const ent_i of other_ents_i) {
                const com_idx = other_to_com_idx_maps.get(obj_ent_type).get(ent_i);
                if (com_idx === undefined) {
                    other_mia_ents_i.push(ent_i);
                }
                else {
                    com_idx_to_other_map.set(com_idx, ent_i);
                }
            }
            // get all the ents in this model for which no match has been found in the other model
            // note that this map is never empty, it always contains a mapping for each ent, even when no match was found
            const this_ents_i = this.modeldata.geom.snapshot.getEnts(ssid, obj_ent_type);
            const this_mia_ents_i = [];
            for (const ent_i of this_ents_i) {
                const com_idx = this_to_com_idx_maps.get(obj_ent_type).get(ent_i);
                const other_ent_i = com_idx_to_other_map.get(com_idx);
                if (other_ent_i === undefined) {
                    this_mia_ents_i.push(ent_i);
                }
            }
            // check that we have enough ents in the otehr model, if nit, exit
            if (other_mia_ents_i.length < this_mia_ents_i.length) {
                return;
            }
            // for each this_mia_ents_i, we need to find the closest other_mia_ents_i, and save the unique trans vec
            const trans_vecs_counts = new Map();
            const flipped_trans_vecs_counts = new Map();
            for (const this_mia_ent_i of this_mia_ents_i) {
                let min_dist = Infinity;
                let min_trans_vec = null;
                const this_posis_i = this.modeldata.geom.nav.navAnyToPosi(obj_ent_type, this_mia_ent_i);
                let flipped = false;
                for (const other_mia_ent_i of other_mia_ents_i) {
                    const other_posis_i = other_model.modeldata.geom.nav.navAnyToPosi(obj_ent_type, other_mia_ent_i);
                    if (this_posis_i.length === other_posis_i.length) {
                        const this_xyz = this.modeldata.attribs.posis.getPosiCoords(this_posis_i[0]);
                        const other_xyz = other_model.modeldata.attribs.posis.getPosiCoords(other_posis_i[0]);
                        const trans_vec = [
                            other_xyz[0] - this_xyz[0],
                            other_xyz[1] - this_xyz[1],
                            other_xyz[2] - this_xyz[2]
                        ];
                        const this_fp = this.xyzFprint(obj_ent_type, this_mia_ent_i, trans_vec);
                        const other_fp = other_model.modeldata.comparator.xyzFprint(obj_ent_type, other_mia_ent_i);
                        if (this_fp === other_fp) {
                            const dist = Math.abs(trans_vec[0]) + Math.abs(trans_vec[1]) + Math.abs(trans_vec[2]);
                            if (dist < min_dist) {
                                min_dist = dist;
                                min_trans_vec = trans_vec;
                                flipped = false;
                            }
                        }
                        else if (obj_ent_type === EEntType.PGON) {
                            // flip the polygon
                            const this_flip_fps = this_fp.split('|');
                            this_flip_fps.push(this_flip_fps.shift());
                            this_flip_fps.reverse();
                            const this_flip_fp = this_flip_fps.join('|');
                            if (this_flip_fp === other_fp) {
                                const dist = Math.abs(trans_vec[0]) + Math.abs(trans_vec[1]) + Math.abs(trans_vec[2]);
                                if (dist < min_dist) {
                                    min_dist = dist;
                                    min_trans_vec = trans_vec;
                                    flipped = true;
                                }
                            }
                        }
                    }
                }
                // if we have found a match, save it
                if (min_trans_vec !== null) {
                    // round the coords
                    min_trans_vec = min_trans_vec.map(coord => Math.round(coord * precision) / precision);
                    // make a string as key
                    const min_trans_vec_str = JSON.stringify(min_trans_vec);
                    // save the count for this vec
                    if (flipped) {
                        if (!flipped_trans_vecs_counts.has(min_trans_vec_str)) {
                            flipped_trans_vecs_counts.set(min_trans_vec_str, 1);
                        }
                        else {
                            const count = flipped_trans_vecs_counts.get(min_trans_vec_str);
                            flipped_trans_vecs_counts.set(min_trans_vec_str, count + 1);
                        }
                    }
                    else {
                        if (!trans_vecs_counts.has(min_trans_vec_str)) {
                            trans_vecs_counts.set(min_trans_vec_str, 1);
                        }
                        else {
                            const count = trans_vecs_counts.get(min_trans_vec_str);
                            trans_vecs_counts.set(min_trans_vec_str, count + 1);
                        }
                    }
                }
            }
            flipped_trans_vecs_counts.forEach((count, min_trans_vec_str) => {
                if (count > 1) {
                    const comments = [
                        'It looks like there are certain polygon objects that have the correct shape but that are reversed.',
                        count + ' polygons have been found that seem like they should be reversed.'
                    ];
                    if (min_trans_vec_str !== '[0,0,0]') {
                        comments.concat([
                            'They also seem to be in the wrong location.',
                            'It seesm like they should be reversed and translated by the following vector:',
                            min_trans_vec_str + '.'
                        ]);
                    }
                    trans_comments.push(comments.join(' '));
                }
                else if (count === 1) {
                    const comments = [
                        'It looks like there is a polygon object that has the correct shape but that is reversed.'
                    ];
                    if (min_trans_vec_str !== '[0,0,0]') {
                        comments.concat([
                            'It also seems to be in the wrong location.',
                            'It seesm like it should be reversed and translated by the following vector:',
                            min_trans_vec_str + '.'
                        ]);
                    }
                    trans_comments.push(comments.join(' '));
                }
            });
            trans_vecs_counts.forEach((count, min_trans_vec_str) => {
                if (count > 1) {
                    trans_comments.push([
                        'It looks like there are certain',
                        obj_ent_type_strs.get(obj_ent_type),
                        'objects that have the correct shape but that are in the wrong location.',
                        count, obj_ent_type_strs.get(obj_ent_type),
                        'objects have been found that seem like they should be translated by the following vector:',
                        min_trans_vec_str + '.'
                    ].join(' '));
                }
                else if (count === 1) {
                    trans_comments.push([
                        'It looks like there is an',
                        obj_ent_type_strs.get(obj_ent_type),
                        'object that has the correct shape but that is in the wrong location.',
                        'It seems like the object should be translated by the following vector:',
                        min_trans_vec_str + '.'
                    ].join(' '));
                }
            });
        }
        // add some feedback
        if (trans_comments.length > 0) {
            result.comment.push('An analysis of the geometry suggests there might be some objects that are translated.');
            result.comment.push(trans_comments);
        }
    }
    // ============================================================================
    // Private methods for fprinting
    // ============================================================================
    /**
     * Get a fprint of all geometric entities of a certain type in the model.
     * This returns a fprint array, and the entity indexes
     * The two arrays are in the same order
     */
    getEntsFprint(ent_type, attrib_names) {
        const ssid = this.modeldata.active_ssid;
        const fprints = [];
        const ents_i = this.modeldata.geom.snapshot.getEnts(ssid, ent_type);
        for (const ent_i of ents_i) {
            fprints.push(this.getEntFprint(ent_type, ent_i, attrib_names));
        }
        // return the result, do not sort
        return [fprints, ents_i];
    }
    /**
     * Get a fprint of one geometric entity: point, polyline, polygon
     * Returns a map of strings.
     * Keys are attribtes, like this 'ps:xyz'.
     * Values are fprints, as strings.
     */
    getEntFprint(from_ent_type, index, attrib_names_map) {
        const fprints = new Map();
        // define topo entities for each obj (starts with posis and ends with objs)
        const topo_ent_types_map = new Map();
        topo_ent_types_map.set(EEntType.POINT, [EEntType.POSI, EEntType.VERT, EEntType.POINT]);
        topo_ent_types_map.set(EEntType.PLINE, [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.PLINE]);
        topo_ent_types_map.set(EEntType.PGON, [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE, EEntType.PGON]);
        // create fprints of topological entities
        for (const topo_ent_type of topo_ent_types_map.get(from_ent_type)) {
            const ent_type_str = EEntTypeStr[topo_ent_type];
            // get the attribute names array that will be used for matching
            const attrib_names = attrib_names_map.get(topo_ent_type);
            if (attrib_names !== undefined) {
                // sort the attrib names
                attrib_names.sort();
                const sub_ents_i = this.modeldata.geom.nav.navAnyToAny(from_ent_type, topo_ent_type, index);
                // for each attrib, make a fingerprint
                for (const attrib_name of attrib_names) {
                    if (this.modeldata.attribs.query.hasEntAttrib(topo_ent_type, attrib_name)) {
                        const topo_fprints = [];
                        for (const sub_ent_i of sub_ents_i) {
                            const attrib_value = this.modeldata.attribs.get.getEntAttribVal(topo_ent_type, sub_ent_i, attrib_name);
                            if (attrib_value !== null && attrib_value !== undefined) {
                                topo_fprints.push(this.getAttribValFprint(attrib_value));
                            }
                        }
                        fprints.set(ent_type_str + ':' + attrib_name, topo_fprints.join('#'));
                    }
                }
            }
        }
        // return the final fprint maps for the object
        // no need to sort, the order is predefined
        return fprints;
    }
    /**
     * Get one fprint for all collections
     */
    getCollFprints(com_idx_maps, attrib_names) {
        const ssid = this.modeldata.active_ssid;
        const fprints = [];
        // create the fprints for each collection
        const colls_i = this.modeldata.geom.snapshot.getEnts(ssid, EEntType.COLL);
        for (const coll_i of colls_i) {
            fprints.push(this.getCollFprint(coll_i, com_idx_maps, attrib_names));
        }
        // if there are no values for a certain entity type, e.g. no coll, then return []
        if (fprints.length === 0) {
            return [];
        }
        // before we sort, we need to save the original order, which will be required for the parent collection index
        const fprint_to_old_i_map = new Map();
        for (let i = 0; i < fprints.length; i++) {
            fprint_to_old_i_map.set(fprints[i], i);
        }
        // the fprints of the collections are sorted
        fprints.sort();
        // now we need to create a map from old index to new index
        const old_i_to_new_i_map = new Map();
        for (let i = 0; i < fprints.length; i++) {
            const old_i = fprint_to_old_i_map.get(fprints[i]);
            old_i_to_new_i_map.set(old_i, i);
        }
        // for each collection, we now add the parent id, using the new index
        for (let i = 0; i < fprints.length; i++) {
            const idx = fprint_to_old_i_map.get(fprints[i]);
            const coll_old_i = colls_i[idx];
            const coll_parent_old_i = this.modeldata.geom.nav.navCollToCollParent(coll_old_i);
            let parent_str = '';
            if (coll_parent_old_i === undefined) {
                parent_str = '.^';
            }
            else {
                const coll_parent_new_i = old_i_to_new_i_map.get(coll_parent_old_i);
                parent_str = coll_parent_new_i + '^';
            }
            fprints[i] = parent_str + fprints[i];
        }
        // return the result, an array of fprints
        return fprints;
    }
    /**
     * Get a fprint of one collection
     * Returns a string, something like 'a@b@c#[1,2,3]#[3,5,7]#[2,5,8]'
     */
    getCollFprint(coll_i, com_idx_maps, attrib_names) {
        const to_ent_types = [EEntType.POINT, EEntType.PLINE, EEntType.PGON];
        const fprints = [];
        const attribs_vals = [];
        // for each attrib, make a finderprint of the attrib value
        if (attrib_names !== undefined) {
            for (const attrib_name of attrib_names) {
                const attrib_value = this.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, attrib_name);
                if (attrib_value !== null && attrib_value !== undefined) {
                    attribs_vals.push(this.getAttribValFprint(attrib_value));
                }
            }
            fprints.push(attribs_vals.join('@'));
        }
        // get all the entities in this collection
        // mapping entity numbers means that we map to the equivalent entity numbers in the other model
        // we do this to ensure that, when comparing models, the entity numbers will match
        for (const to_ent_type of to_ent_types) {
            // get the map from ent_i to com_idx
            const com_idx_map = com_idx_maps.get(to_ent_type);
            // the the common indexes of the entities
            const ents_i = this.modeldata.geom.nav.navAnyToAny(EEntType.COLL, to_ent_type, coll_i);
            const com_idxs = [];
            for (const ent_i of ents_i) {
                const com_idx = com_idx_map.get(ent_i);
                com_idxs.push(com_idx);
            }
            // sort so that they are in standard order
            com_idxs.sort();
            // create a string
            fprints.push(JSON.stringify(com_idxs));
        }
        // return the final fprint string for the collection
        // no need to sort, the order is predefined
        return fprints.join('#');
    }
    /**
     * Get a fprint of an attribute value
     */
    getAttribValFprint(value) {
        const precision = 1e2;
        if (value === null) {
            return '.';
        }
        if (value === undefined) {
            return '.';
        }
        if (typeof value === 'number') {
            return String(Math.round(value * precision) / precision);
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'boolean') {
            return String(value);
        }
        if (Array.isArray(value)) {
            const fprints = [];
            for (const item of value) {
                const attrib_value = this.getAttribValFprint(item);
                fprints.push(attrib_value);
            }
            return fprints.join(',');
        }
        if (typeof value === 'object') {
            let fprint = '';
            const prop_names = Object.getOwnPropertyNames(value);
            prop_names.sort();
            for (const prop_name of prop_names) {
                const attrib_value = this.getAttribValFprint(value[prop_name]);
                fprint += prop_name + '=' + attrib_value;
            }
            return fprint;
        }
        throw new Error('Attribute value not recognised.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbENvbXBhcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2dlby1pbmZvL0dJTW9kZWxDb21wYXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQTBCLFdBQVcsRUFBZSxNQUFNLFVBQVUsQ0FBQztBQUN0RixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFFLE1BQU0sRUFBVyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGlCQUFpQjtJQUNsQixTQUFTLENBQWM7SUFFaEM7O1FBRUk7SUFDSCxZQUFZLEtBQWtCO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksT0FBTyxDQUFDLEtBQWMsRUFBRSxTQUFrQixFQUFFLG1CQUE0QixFQUFFLHFCQUE4QjtRQUczRywyQkFBMkI7UUFDM0IsTUFBTSxNQUFNLEdBQWtFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBRTVILHdFQUF3RTtRQUN4RSxJQUFJLG1CQUFtQixFQUFFO1lBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3REO1FBRUQsdUVBQXVFO1FBQ3ZFLElBQUkscUJBQXFCLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDekQ7UUFFRCwyQkFBMkI7UUFDM0IsSUFBSSxTQUFTLEVBQUU7WUFDWCxJQUFJLENBQUMsSUFB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