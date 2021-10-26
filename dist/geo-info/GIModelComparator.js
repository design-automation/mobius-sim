import { EEntType, EEntTypeStr } from './common';
import { vecDot } from '../geom/vectors';
import { idMake } from './common_id_funcs';
/**
 * Geo-info model class.
 */
export class GIModelComparator {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0lNb2RlbENvbXBhcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWJzL2dlby1pbmZvL0dJTW9kZWxDb21wYXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQTBCLFdBQVcsRUFBZSxNQUFNLFVBQVUsQ0FBQztBQUN0RixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFFLE1BQU0sRUFBVyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGlCQUFpQjtJQUczQjs7UUFFSTtJQUNILFlBQVksS0FBa0I7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSxPQUFPLENBQUMsS0FBYyxFQUFFLFNBQWtCLEVBQUUsbUJBQTRCLEVBQUUscUJBQThCO1FBRzNHLDJCQUEyQjtRQUMzQixNQUFNLE1BQU0sR0FBa0UsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUM7UUFFNUgsd0VBQXdFO1FBQ3hFLElBQUksbUJBQW1CLEVBQUU7WUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDdEQ7UUFFRCx1RUFBdUU7UUFDdkUsSUFBSSxxQkFBcUIsRUFBRTtZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN6RDtRQUVELDJCQUEyQjtRQUMzQixJQUFJLFNBQVMsRUFBRTtZQUNYLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLEtB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