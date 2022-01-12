"use strict";
/**
 * @author fernandojsg / http://fernandojsg.com
 * @author Don McCurdy / https://www.donmccurdy.com
 * @author Takahiro / https://github.com/takahirox
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLTFExporter = void 0;
const three_1 = require("three");
//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------
var WEBGL_CONSTANTS = {
    POINTS: 0x0000,
    LINES: 0x0001,
    LINE_LOOP: 0x0002,
    LINE_STRIP: 0x0003,
    TRIANGLES: 0x0004,
    TRIANGLE_STRIP: 0x0005,
    TRIANGLE_FAN: 0x0006,
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT: 0x1403,
    FLOAT: 0x1406,
    UNSIGNED_INT: 0x1405,
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    NEAREST: 0x2600,
    LINEAR: 0x2601,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648,
    REPEAT: 10497
};
var THREE_TO_WEBGL = {};
THREE_TO_WEBGL[three_1.NearestFilter] = WEBGL_CONSTANTS.NEAREST;
THREE_TO_WEBGL[three_1.NearestMipmapNearestFilter] = WEBGL_CONSTANTS.NEAREST_MIPMAP_NEAREST;
THREE_TO_WEBGL[three_1.NearestMipmapLinearFilter] = WEBGL_CONSTANTS.NEAREST_MIPMAP_LINEAR;
THREE_TO_WEBGL[three_1.LinearFilter] = WEBGL_CONSTANTS.LINEAR;
THREE_TO_WEBGL[three_1.LinearMipmapNearestFilter] = WEBGL_CONSTANTS.LINEAR_MIPMAP_NEAREST;
THREE_TO_WEBGL[three_1.LinearMipmapLinearFilter] = WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
THREE_TO_WEBGL[three_1.ClampToEdgeWrapping] = WEBGL_CONSTANTS.CLAMP_TO_EDGE;
THREE_TO_WEBGL[three_1.RepeatWrapping] = WEBGL_CONSTANTS.REPEAT;
THREE_TO_WEBGL[three_1.MirroredRepeatWrapping] = WEBGL_CONSTANTS.MIRRORED_REPEAT;
var PATH_PROPERTIES = {
    scale: 'scale',
    position: 'translation',
    quaternion: 'rotation',
    morphTargetInfluences: 'weights'
};
//------------------------------------------------------------------------------
// GLTF Exporter
//------------------------------------------------------------------------------
var GLTFExporter = function () { };
exports.GLTFExporter = GLTFExporter;
GLTFExporter.prototype = {
    constructor: GLTFExporter,
    /**
     * Parse scenes and generate GLTF output
     * @param  {Scene or [THREE.Scenes]} input   Scene or Array of THREE.Scenes
     * @param  {Function} onDone  Callback on completed
     * @param  {Object} options options
     */
    parse: function (input, onDone, options) {
        var DEFAULT_OPTIONS = {
            binary: false,
            trs: false,
            onlyVisible: true,
            truncateDrawRange: true,
            embedImages: true,
            maxTextureSize: Infinity,
            animations: [],
            forceIndices: false,
            forcePowerOfTwoTextures: false,
            includeCustomExtensions: false
        };
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        if (options.animations.length > 0) {
            // Only TRS properties, and not matrices, may be targeted by animation.
            options.trs = true;
        }
        var outputJSON = {
            asset: {
                version: "2.0",
                generator: "GLTFExporter"
            }
        };
        var byteOffset = 0;
        var buffers = [];
        var pending = [];
        var nodeMap = new Map();
        var skins = [];
        var extensionsUsed = {};
        var cachedData = {
            meshes: new Map(),
            attributes: new Map(),
            attributesNormalized: new Map(),
            materials: new Map(),
            textures: new Map(),
            images: new Map()
        };
        var cachedCanvas;
        var uids = new Map();
        var uid = 0;
        /**
         * Assign and return a temporal unique id for an object
         * especially which doesn't have .uuid
         * @param  {Object} object
         * @return {Integer}
         */
        function getUID(object) {
            if (!uids.has(object))
                uids.set(object, uid++);
            return uids.get(object);
        }
        /**
         * Compare two arrays
         * @param  {Array} array1 Array 1 to compare
         * @param  {Array} array2 Array 2 to compare
         * @return {Boolean}        Returns true if both arrays are equal
         */
        function equalArray(array1, array2) {
            return (array1.length === array2.length) && array1.every(function (element, index) {
                return element === array2[index];
            });
        }
        /**
         * Converts a string to an ArrayBuffer.
         * @param  {string} text
         * @return {ArrayBuffer}
         */
        function stringToArrayBuffer(text) {
            if (window.TextEncoder !== undefined) {
                return new TextEncoder().encode(text).buffer;
            }
            var array = new Uint8Array(new ArrayBuffer(text.length));
            for (var i = 0, il = text.length; i < il; i++) {
                var value = text.charCodeAt(i);
                // Replacing multi-byte character with space(0x20).
                array[i] = value > 0xFF ? 0x20 : value;
            }
            return array.buffer;
        }
        /**
         * Get the min and max vectors from the given attribute
         * @param  {BufferAttribute} attribute Attribute to find the min/max in range from start to start + count
         * @param  {Integer} start
         * @param  {Integer} count
         * @return {Object} Object containing the `min` and `max` values (As an array of attribute.itemSize components)
         */
        function getMinMax(attribute, start, count) {
            var output = {
                min: new Array(attribute.itemSize).fill(Number.POSITIVE_INFINITY),
                max: new Array(attribute.itemSize).fill(Number.NEGATIVE_INFINITY)
            };
            for (var i = start; i < start + count; i++) {
                for (var a = 0; a < attribute.itemSize; a++) {
                    var value = attribute.array[i * attribute.itemSize + a];
                    output.min[a] = Math.min(output.min[a], value);
                    output.max[a] = Math.max(output.max[a], value);
                }
            }
            return output;
        }
        /**
         * Checks if image size is POT.
         *
         * @param {Image} image The image to be checked.
         * @returns {Boolean} Returns true if image size is POT.
         *
         */
        function isPowerOfTwo(image) {
            return three_1.Math.isPowerOfTwo(image.width) && three_1.Math.isPowerOfTwo(image.height);
        }
        /**
         * Checks if normal attribute values are normalized.
         *
         * @param {BufferAttribute} normal
         * @returns {Boolean}
         *
         */
        function isNormalizedNormalAttribute(normal) {
            if (cachedData.attributesNormalized.has(normal)) {
                return false;
            }
            var v = new three_1.Vector3();
            for (var i = 0, il = normal.count; i < il; i++) {
                // 0.0005 is from glTF-validator
                if (Math.abs(v.fromArray(normal.array, i * 3).length() - 1.0) > 0.0005)
                    return false;
            }
            return true;
        }
        /**
         * Creates normalized normal buffer attribute.
         *
         * @param {BufferAttribute} normal
         * @returns {BufferAttribute}
         *
         */
        function createNormalizedNormalAttribute(normal) {
            if (cachedData.attributesNormalized.has(normal)) {
                return cachedData.attributesNormalized.get(normal);
            }
            var attribute = normal.clone();
            var v = new three_1.Vector3();
            for (var i = 0, il = attribute.count; i < il; i++) {
                v.fromArray(attribute.array, i * 3);
                if (v.x === 0 && v.y === 0 && v.z === 0) {
                    // if values can't be normalized set (1, 0, 0)
                    v.setX(1.0);
                }
                else {
                    v.normalize();
                }
                v.toArray(attribute.array, i * 3);
            }
            cachedData.attributesNormalized.set(normal, attribute);
            return attribute;
        }
        /**
         * Get the required size + padding for a buffer, rounded to the next 4-byte boundary.
         * https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#data-alignment
         *
         * @param {Integer} bufferSize The size the original buffer.
         * @returns {Integer} new buffer size with required padding.
         *
         */
        function getPaddedBufferSize(bufferSize) {
            return Math.ceil(bufferSize / 4) * 4;
        }
        /**
         * Returns a buffer aligned to 4-byte boundary.
         *
         * @param {ArrayBuffer} arrayBuffer Buffer to pad
         * @param {Integer} paddingByte (Optional)
         * @returns {ArrayBuffer} The same buffer if it's already aligned to 4-byte boundary or a new buffer
         */
        function getPaddedArrayBuffer(arrayBuffer, paddingByte) {
            paddingByte = paddingByte || 0;
            var paddedLength = getPaddedBufferSize(arrayBuffer.byteLength);
            if (paddedLength !== arrayBuffer.byteLength) {
                var array = new Uint8Array(paddedLength);
                array.set(new Uint8Array(arrayBuffer));
                if (paddingByte !== 0) {
                    for (var i = arrayBuffer.byteLength; i < paddedLength; i++) {
                        array[i] = paddingByte;
                    }
                }
                return array.buffer;
            }
            return arrayBuffer;
        }
        /**
         * Serializes a userData.
         *
         * @param {THREE.Object3D|THREE.Material} object
         * @param {Object} gltfProperty
         */
        function serializeUserData(object, gltfProperty) {
            if (Object.keys(object.userData).length === 0) {
                return;
            }
            try {
                var json = JSON.parse(JSON.stringify(object.userData));
                if (options.includeCustomExtensions && json.gltfExtensions) {
                    if (gltfProperty.extensions === undefined) {
                        gltfProperty.extensions = {};
                    }
                    for (var extensionName in json.gltfExtensions) {
                        gltfProperty.extensions[extensionName] = json.gltfExtensions[extensionName];
                        extensionsUsed[extensionName] = true;
                    }
                    delete json.gltfExtensions;
                }
                if (Object.keys(json).length > 0) {
                    gltfProperty.extras = json;
                }
            }
            catch (error) {
                console.warn('THREE.GLTFExporter: userData of \'' + object.name + '\' ' +
                    'won\'t be serialized because of JSON.stringify error - ' + error.message);
            }
        }
        /**
         * Applies a texture transform, if present, to the map definition. Requires
         * the KHR_texture_transform extension.
         */
        function applyTextureTransform(mapDef, texture) {
            var didTransform = false;
            var transformDef = {};
            if (texture.offset.x !== 0 || texture.offset.y !== 0) {
                transformDef.offset = texture.offset.toArray();
                didTransform = true;
            }
            if (texture.rotation !== 0) {
                transformDef.rotation = texture.rotation;
                didTransform = true;
            }
            if (texture.repeat.x !== 1 || texture.repeat.y !== 1) {
                transformDef.scale = texture.repeat.toArray();
                didTransform = true;
            }
            if (didTransform) {
                mapDef.extensions = mapDef.extensions || {};
                mapDef.extensions['KHR_texture_transform'] = transformDef;
                extensionsUsed['KHR_texture_transform'] = true;
            }
        }
        /**
         * Process a buffer to append to the default one.
         * @param  {ArrayBuffer} buffer
         * @return {Integer}
         */
        function processBuffer(buffer) {
            if (!outputJSON.buffers) {
                outputJSON.buffers = [{ byteLength: 0 }];
            }
            // All buffers are merged before export.
            buffers.push(buffer);
            return 0;
        }
        /**
         * Process and generate a BufferView
         * @param  {BufferAttribute} attribute
         * @param  {number} componentType
         * @param  {number} start
         * @param  {number} count
         * @param  {number} target (Optional) Target usage of the BufferView
         * @return {Object}
         */
        function processBufferView(attribute, componentType, start, count, target) {
            if (!outputJSON.bufferViews) {
                outputJSON.bufferViews = [];
            }
            // Create a new dataview and dump the attribute's array into it
            var componentSize;
            if (componentType === WEBGL_CONSTANTS.UNSIGNED_BYTE) {
                componentSize = 1;
            }
            else if (componentType === WEBGL_CONSTANTS.UNSIGNED_SHORT) {
                componentSize = 2;
            }
            else {
                componentSize = 4;
            }
            var byteLength = getPaddedBufferSize(count * attribute.itemSize * componentSize);
            var dataView = new DataView(new ArrayBuffer(byteLength));
            var offset = 0;
            for (var i = start; i < start + count; i++) {
                for (var a = 0; a < attribute.itemSize; a++) {
                    // @TODO Fails on InterleavedBufferAttribute, and could probably be
                    // optimized for normal BufferAttribute.
                    var value = attribute.array[i * attribute.itemSize + a];
                    if (componentType === WEBGL_CONSTANTS.FLOAT) {
                        dataView.setFloat32(offset, value, true);
                    }
                    else if (componentType === WEBGL_CONSTANTS.UNSIGNED_INT) {
                        dataView.setUint32(offset, value, true);
                    }
                    else if (componentType === WEBGL_CONSTANTS.UNSIGNED_SHORT) {
                        dataView.setUint16(offset, value, true);
                    }
                    else if (componentType === WEBGL_CONSTANTS.UNSIGNED_BYTE) {
                        dataView.setUint8(offset, value);
                    }
                    offset += componentSize;
                }
            }
            var gltfBufferView = {
                buffer: processBuffer(dataView.buffer),
                byteOffset: byteOffset,
                byteLength: byteLength
            };
            if (target !== undefined)
                gltfBufferView.target = target;
            if (target === WEBGL_CONSTANTS.ARRAY_BUFFER) {
                // Only define byteStride for vertex attributes.
                gltfBufferView.byteStride = attribute.itemSize * componentSize;
            }
            byteOffset += byteLength;
            outputJSON.bufferViews.push(gltfBufferView);
            // @TODO Merge bufferViews where possible.
            var output = {
                id: outputJSON.bufferViews.length - 1,
                byteLength: 0
            };
            return output;
        }
        /**
         * Process and generate a BufferView from an image Blob.
         * @param {Blob} blob
         * @return {Promise<Integer>}
         */
        function processBufferViewImage(blob) {
            if (!outputJSON.bufferViews) {
                outputJSON.bufferViews = [];
            }
            return new Promise(function (resolve) {
                var reader = new window.FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = function () {
                    var buffer = getPaddedArrayBuffer(reader.result);
                    var bufferView = {
                        buffer: processBuffer(buffer),
                        byteOffset: byteOffset,
                        byteLength: buffer.byteLength
                    };
                    byteOffset += buffer.byteLength;
                    outputJSON.bufferViews.push(bufferView);
                    resolve(outputJSON.bufferViews.length - 1);
                };
            });
        }
        /**
         * Process attribute to generate an accessor
         * @param  {BufferAttribute} attribute Attribute to process
         * @param  {BufferGeometry} geometry (Optional) Geometry used for truncated draw range
         * @param  {Integer} start (Optional)
         * @param  {Integer} count (Optional)
         * @return {Integer}           Index of the processed accessor on the "accessors" array
         */
        function processAccessor(attribute, geometry, start, count) {
            var types = {
                1: 'SCALAR',
                2: 'VEC2',
                3: 'VEC3',
                4: 'VEC4',
                16: 'MAT4'
            };
            var componentType;
            // Detect the component type of the attribute array (float, uint or ushort)
            if (attribute.array.constructor === Float32Array) {
                componentType = WEBGL_CONSTANTS.FLOAT;
            }
            else if (attribute.array.constructor === Uint32Array) {
                componentType = WEBGL_CONSTANTS.UNSIGNED_INT;
            }
            else if (attribute.array.constructor === Uint16Array) {
                componentType = WEBGL_CONSTANTS.UNSIGNED_SHORT;
            }
            else if (attribute.array.constructor === Uint8Array) {
                componentType = WEBGL_CONSTANTS.UNSIGNED_BYTE;
            }
            else {
                throw new Error('THREE.GLTFExporter: Unsupported bufferAttribute component type.');
            }
            if (start === undefined)
                start = 0;
            if (count === undefined)
                count = attribute.count;
            // @TODO Indexed buffer geometry with drawRange not supported yet
            if (options.truncateDrawRange && geometry !== undefined && geometry.index === null) {
                var end = start + count;
                var end2 = geometry.drawRange.count === Infinity
                    ? attribute.count
                    : geometry.drawRange.start + geometry.drawRange.count;
                start = Math.max(start, geometry.drawRange.start);
                count = Math.min(end, end2) - start;
                if (count < 0)
                    count = 0;
            }
            // Skip creating an accessor if the attribute doesn't have data to export
            if (count === 0) {
                return null;
            }
            var minMax = getMinMax(attribute, start, count);
            var bufferViewTarget;
            // If geometry isn't provided, don't infer the target usage of the bufferView. For
            // animation samplers, target must not be set.
            if (geometry !== undefined) {
                bufferViewTarget = attribute === geometry.index ? WEBGL_CONSTANTS.ELEMENT_ARRAY_BUFFER : WEBGL_CONSTANTS.ARRAY_BUFFER;
            }
            var bufferView = processBufferView(attribute, componentType, start, count, bufferViewTarget);
            var gltfAccessor = {
                bufferView: bufferView.id,
                byteOffset: bufferView.byteOffset,
                componentType: componentType,
                count: count,
                max: minMax.max,
                min: minMax.min,
                type: types[attribute.itemSize]
            };
            if (!outputJSON.accessors) {
                outputJSON.accessors = [];
            }
            outputJSON.accessors.push(gltfAccessor);
            return outputJSON.accessors.length - 1;
        }
        /**
         * Process image
         * @param  {Image} image to process
         * @param  {Integer} format of the image (e.g. THREE.RGBFormat, RGBAFormat etc)
         * @param  {Boolean} flipY before writing out the image
         * @return {Integer}     Index of the processed texture in the "images" array
         */
        function processImage(image, format, flipY) {
            if (!cachedData.images.has(image)) {
                cachedData.images.set(image, {});
            }
            var cachedImages = cachedData.images.get(image);
            var mimeType = format === three_1.RGBAFormat ? 'image/png' : 'image/jpeg';
            var key = mimeType + ":flipY/" + flipY.toString();
            if (cachedImages[key] !== undefined) {
                return cachedImages[key];
            }
            if (!outputJSON.images) {
                outputJSON.images = [];
            }
            var gltfImage = { mimeType: mimeType };
            if (options.embedImages) {
                var canvas = cachedCanvas = cachedCanvas || document.createElement('canvas');
                canvas.width = Math.min(image.width, options.maxTextureSize);
                canvas.height = Math.min(image.height, options.maxTextureSize);
                if (options.forcePowerOfTwoTextures && !isPowerOfTwo(canvas)) {
                    console.warn('GLTFExporter: Resized non-power-of-two image.', image);
                    canvas.width = three_1.Math.floorPowerOfTwo(canvas.width);
                    canvas.height = three_1.Math.floorPowerOfTwo(canvas.height);
                }
                var ctx = canvas.getContext('2d');
                if (flipY === true) {
                    ctx.translate(0, canvas.height);
                    ctx.scale(1, -1);
                }
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                if (options.binary === true) {
                    pending.push(new Promise(function (resolve) {
                        canvas.toBlob(function (blob) {
                            processBufferViewImage(blob).then(function (bufferViewIndex) {
                                gltfImage.bufferView = bufferViewIndex;
                                resolve();
                            });
                        }, mimeType);
                    }));
                }
                else {
                    gltfImage.uri = canvas.toDataURL(mimeType);
                }
            }
            else {
                gltfImage.uri = image.src;
            }
            outputJSON.images.push(gltfImage);
            var index = outputJSON.images.length - 1;
            cachedImages[key] = index;
            return index;
        }
        /**
         * Process sampler
         * @param  {Texture} map Texture to process
         * @return {Integer}     Index of the processed texture in the "samplers" array
         */
        function processSampler(map) {
            if (!outputJSON.samplers) {
                outputJSON.samplers = [];
            }
            var gltfSampler = {
                magFilter: THREE_TO_WEBGL[map.magFilter],
                minFilter: THREE_TO_WEBGL[map.minFilter],
                wrapS: THREE_TO_WEBGL[map.wrapS],
                wrapT: THREE_TO_WEBGL[map.wrapT]
            };
            outputJSON.samplers.push(gltfSampler);
            return outputJSON.samplers.length - 1;
        }
        /**
         * Process texture
         * @param  {Texture} map Map to process
         * @return {Integer}     Index of the processed texture in the "textures" array
         */
        function processTexture(map) {
            if (cachedData.textures.has(map)) {
                return cachedData.textures.get(map);
            }
            if (!outputJSON.textures) {
                outputJSON.textures = [];
            }
            var gltfTexture = {
                sampler: processSampler(map),
                source: processImage(map.image, map.format, map.flipY)
            };
            if (map.name) {
                gltfTexture.name = map.name;
            }
            outputJSON.textures.push(gltfTexture);
            var index = outputJSON.textures.length - 1;
            cachedData.textures.set(map, index);
            return index;
        }
        /**
         * Process material
         * @param  {THREE.Material} material Material to process
         * @return {Integer}      Index of the processed material in the "materials" array
         */
        function processMaterial(material) {
            if (cachedData.materials.has(material)) {
                return cachedData.materials.get(material);
            }
            if (!outputJSON.materials) {
                outputJSON.materials = [];
            }
            if (material.isShaderMaterial && !material.isGLTFSpecularGlossinessMaterial) {
                console.warn('GLTFExporter: THREE.ShaderMaterial not supported.');
                return null;
            }
            // @QUESTION Should we avoid including any attribute that has the default value?
            var gltfMaterial = {
                pbrMetallicRoughness: {}
            };
            if (material.isMeshBasicMaterial) {
                gltfMaterial.extensions = { KHR_materials_unlit: {} };
                extensionsUsed['KHR_materials_unlit'] = true;
            }
            else if (material.isGLTFSpecularGlossinessMaterial) {
                gltfMaterial.extensions = { KHR_materials_pbrSpecularGlossiness: {} };
                extensionsUsed['KHR_materials_pbrSpecularGlossiness'] = true;
            }
            else if (!material.isMeshStandardMaterial) {
                console.warn('GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.');
            }
            // pbrMetallicRoughness.baseColorFactor
            var color = material.color.toArray().concat([material.opacity]);
            if (!equalArray(color, [1, 1, 1, 1])) {
                gltfMaterial.pbrMetallicRoughness.baseColorFactor = color;
            }
            if (material.isMeshStandardMaterial) {
                gltfMaterial.pbrMetallicRoughness.metallicFactor = material.metalness;
                gltfMaterial.pbrMetallicRoughness.roughnessFactor = material.roughness;
            }
            else if (material.isMeshBasicMaterial) {
                gltfMaterial.pbrMetallicRoughness.metallicFactor = 0.0;
                gltfMaterial.pbrMetallicRoughness.roughnessFactor = 0.9;
            }
            else {
                gltfMaterial.pbrMetallicRoughness.metallicFactor = 0.5;
                gltfMaterial.pbrMetallicRoughness.roughnessFactor = 0.5;
            }
            // pbrSpecularGlossiness diffuse, specular and glossiness factor
            if (material.isGLTFSpecularGlossinessMaterial) {
                if (gltfMaterial.pbrMetallicRoughness.baseColorFactor) {
                    gltfMaterial.extensions.KHR_materials_pbrSpecularGlossiness.diffuseFactor = gltfMaterial.pbrMetallicRoughness.baseColorFactor;
                }
                var specularFactor = [1, 1, 1];
                material.specular.toArray(specularFactor, 0);
                gltfMaterial.extensions.KHR_materials_pbrSpecularGlossiness.specularFactor = specularFactor;
                gltfMaterial.extensions.KHR_materials_pbrSpecularGlossiness.glossinessFactor = material.glossiness;
            }
            // pbrMetallicRoughness.metallicRoughnessTexture
            if (material.metalnessMap || material.roughnessMap) {
                if (material.metalnessMap === material.roughnessMap) {
                    var metalRoughMapDef = { index: processTexture(material.metalnessMap) };
                    applyTextureTransform(metalRoughMapDef, material.metalnessMap);
                    gltfMaterial.pbrMetallicRoughness.metallicRoughnessTexture = metalRoughMapDef;
                }
                else {
                    console.warn('THREE.GLTFExporter: Ignoring metalnessMap and roughnessMap because they are not the same Texture.');
                }
            }
            // pbrMetallicRoughness.baseColorTexture or pbrSpecularGlossiness diffuseTexture
            if (material.map) {
                var baseColorMapDef = { index: processTexture(material.map) };
                applyTextureTransform(baseColorMapDef, material.map);
                if (material.isGLTFSpecularGlossinessMaterial) {
                    gltfMaterial.extensions.KHR_materials_pbrSpecularGlossiness.diffuseTexture = baseColorMapDef;
                }
                gltfMaterial.pbrMetallicRoughness.baseColorTexture = baseColorMapDef;
            }
            // pbrSpecularGlossiness specular map
            if (material.isGLTFSpecularGlossinessMaterial && material.specularMap) {
                var specularMapDef = { index: processTexture(material.specularMap) };
                applyTextureTransform(specularMapDef, material.specularMap);
                gltfMaterial.extensions.KHR_materials_pbrSpecularGlossiness.specularGlossinessTexture = specularMapDef;
            }
            if (material.isMeshBasicMaterial ||
                material.isLineBasicMaterial ||
                material.isPointsMaterial) {
            }
            else {
                // emissiveFactor
                var emissive = material.emissive.clone().multiplyScalar(material.emissiveIntensity).toArray();
                if (!equalArray(emissive, [0, 0, 0])) {
                    gltfMaterial.emissiveFactor = emissive;
                }
                // emissiveTexture
                if (material.emissiveMap) {
                    var emissiveMapDef = { index: processTexture(material.emissiveMap) };
                    applyTextureTransform(emissiveMapDef, material.emissiveMap);
                    gltfMaterial.emissiveTexture = emissiveMapDef;
                }
            }
            // normalTexture
            if (material.normalMap) {
                var normalMapDef = { index: processTexture(material.normalMap) };
                if (material.normalScale && material.normalScale.x !== -1) {
                    if (material.normalScale.x !== material.normalScale.y) {
                        console.warn('THREE.GLTFExporter: Normal scale components are different, ignoring Y and exporting X.');
                    }
                    normalMapDef.scale = material.normalScale.x;
                }
                applyTextureTransform(normalMapDef, material.normalMap);
                gltfMaterial.normalTexture = normalMapDef;
            }
            // occlusionTexture
            if (material.aoMap) {
                var occlusionMapDef = {
                    index: processTexture(material.aoMap),
                    texCoord: 1
                };
                if (material.aoMapIntensity !== 1.0) {
                    occlusionMapDef.strength = material.aoMapIntensity;
                }
                applyTextureTransform(occlusionMapDef, material.aoMap);
                gltfMaterial.occlusionTexture = occlusionMapDef;
            }
            // alphaMode
            if (material.transparent) {
                gltfMaterial.alphaMode = 'BLEND';
            }
            else {
                if (material.alphaTest > 0.0) {
                    gltfMaterial.alphaMode = 'MASK';
                    gltfMaterial.alphaCutoff = material.alphaTest;
                }
            }
            // doubleSided
            if (material.side === three_1.DoubleSide) {
                gltfMaterial.doubleSided = true;
            }
            if (material.name !== '') {
                gltfMaterial.name = material.name;
            }
            serializeUserData(material, gltfMaterial);
            outputJSON.materials.push(gltfMaterial);
            var index = outputJSON.materials.length - 1;
            cachedData.materials.set(material, index);
            return index;
        }
        /**
         * Process mesh
         * @param  {THREE.Mesh} mesh Mesh to process
         * @return {Integer}      Index of the processed mesh in the "meshes" array
         */
        function processMesh(mesh) {
            var cacheKey = mesh.geometry.uuid + ':' + mesh.material.uuid;
            if (cachedData.meshes.has(cacheKey)) {
                return cachedData.meshes.get(cacheKey);
            }
            var geometry = mesh.geometry;
            var mode;
            // Use the correct mode
            if (mesh.isLineSegments) {
                mode = WEBGL_CONSTANTS.LINES;
            }
            else if (mesh.isLineLoop) {
                mode = WEBGL_CONSTANTS.LINE_LOOP;
            }
            else if (mesh.isLine) {
                mode = WEBGL_CONSTANTS.LINE_STRIP;
            }
            else if (mesh.isPoints) {
                mode = WEBGL_CONSTANTS.POINTS;
            }
            else {
                if (!geometry.isBufferGeometry) {
                    console.warn('GLTFExporter: Exporting THREE.Geometry will increase file size. Use BufferGeometry instead.');
                    var geometryTemp = new three_1.BufferGeometry();
                    geometryTemp.fromGeometry(geometry);
                    geometry = geometryTemp;
                }
                if (mesh.drawMode === three_1.TriangleFanDrawMode) {
                    console.warn('GLTFExporter: TriangleFanDrawMode and wireframe incompatible.');
                    mode = WEBGL_CONSTANTS.TRIANGLE_FAN;
                }
                else if (mesh.drawMode === three_1.TriangleStripDrawMode) {
                    mode = mesh.material.wireframe ? WEBGL_CONSTANTS.LINE_STRIP : WEBGL_CONSTANTS.TRIANGLE_STRIP;
                }
                else {
                    mode = mesh.material.wireframe ? WEBGL_CONSTANTS.LINES : WEBGL_CONSTANTS.TRIANGLES;
                }
            }
            var gltfMesh = {};
            var attributes = {};
            var primitives = [];
            var targets = [];
            // Conversion between attributes names in threejs and gltf spec
            var nameConversion = {
                uv: 'TEXCOORD_0',
                uv2: 'TEXCOORD_1',
                color: 'COLOR_0',
                skinWeight: 'WEIGHTS_0',
                skinIndex: 'JOINTS_0'
            };
            var originalNormal = geometry.getAttribute('normal');
            if (originalNormal !== undefined && !isNormalizedNormalAttribute(originalNormal)) {
                console.warn('THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one.');
                geometry.setAttribute('normal', createNormalizedNormalAttribute(originalNormal));
            }
            // @QUESTION Detect if .vertexColors = THREE.VertexColors?
            // For every attribute create an accessor
            var modifiedAttribute = null;
            for (var attributeName in geometry.attributes) {
                // Ignore morph target attributes, which are exported later.
                if (attributeName.substr(0, 5) === 'morph')
                    continue;
                var attribute = geometry.attributes[attributeName];
                attributeName = nameConversion[attributeName] || attributeName.toUpperCase();
                // Prefix all geometry attributes except the ones specifically
                // listed in the spec; non-spec attributes are considered custom.
                var validVertexAttributes = /^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/;
                if (!validVertexAttributes.test(attributeName)) {
                    attributeName = '_' + attributeName;
                }
                if (cachedData.attributes.has(getUID(attribute))) {
                    attributes[attributeName] = cachedData.attributes.get(getUID(attribute));
                    continue;
                }
                // JOINTS_0 must be UNSIGNED_BYTE or UNSIGNED_SHORT.
                modifiedAttribute = null;
                var array = attribute.array;
                if (attributeName === 'JOINTS_0' &&
                    !(array instanceof Uint16Array) &&
                    !(array instanceof Uint8Array)) {
                    console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.');
                    modifiedAttribute = new three_1.BufferAttribute(new Uint16Array(array), attribute.itemSize, attribute.normalized);
                }
                var accessor = processAccessor(modifiedAttribute || attribute, geometry);
                if (accessor !== null) {
                    attributes[attributeName] = accessor;
                    cachedData.attributes.set(getUID(attribute), accessor);
                }
            }
            if (originalNormal !== undefined)
                geometry.setAttribute('normal', originalNormal);
            // Skip if no exportable attributes found
            if (Object.keys(attributes).length === 0) {
                return null;
            }
            // Morph targets
            if (mesh.morphTargetInfluences !== undefined && mesh.morphTargetInfluences.length > 0) {
                var weights = [];
                var targetNames = [];
                var reverseDictionary = {};
                if (mesh.morphTargetDictionary !== undefined) {
                    for (var key in mesh.morphTargetDictionary) {
                        reverseDictionary[mesh.morphTargetDictionary[key]] = key;
                    }
                }
                for (var i = 0; i < mesh.morphTargetInfluences.length; ++i) {
                    var target = {};
                    var warned = false;
                    for (var attributeName in geometry.morphAttributes) {
                        // glTF 2.0 morph supports only POSITION/NORMAL/TANGENT.
                        // Three.js doesn't support TANGENT yet.
                        if (attributeName !== 'position' && attributeName !== 'normal') {
                            if (!warned) {
                                console.warn('GLTFExporter: Only POSITION and NORMAL morph are supported.');
                                warned = true;
                            }
                            continue;
                        }
                        var attribute = geometry.morphAttributes[attributeName][i];
                        var gltfAttributeName = attributeName.toUpperCase();
                        // Three.js morph attribute has absolute values while the one of glTF has relative values.
                        //
                        // glTF 2.0 Specification:
                        // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#morph-targets
                        var baseAttribute = geometry.attributes[attributeName];
                        if (cachedData.attributes.has(getUID(attribute))) {
                            target[gltfAttributeName] = cachedData.attributes.get(getUID(attribute));
                            continue;
                        }
                        // Clones attribute not to override
                        var relativeAttribute = attribute.clone();
                        for (var j = 0, jl = attribute.count; j < jl; j++) {
                            relativeAttribute.setXYZ(j, attribute.getX(j) - baseAttribute.getX(j), attribute.getY(j) - baseAttribute.getY(j), attribute.getZ(j) - baseAttribute.getZ(j));
                        }
                        target[gltfAttributeName] = processAccessor(relativeAttribute, geometry);
                        cachedData.attributes.set(getUID(baseAttribute), target[gltfAttributeName]);
                    }
                    targets.push(target);
                    weights.push(mesh.morphTargetInfluences[i]);
                    if (mesh.morphTargetDictionary !== undefined)
                        targetNames.push(reverseDictionary[i]);
                }
                gltfMesh.weights = weights;
                if (targetNames.length > 0) {
                    gltfMesh.extras = {};
                    gltfMesh.extras.targetNames = targetNames;
                }
            }
            var forceIndices = options.forceIndices;
            var isMultiMaterial = Array.isArray(mesh.material);
            if (isMultiMaterial && geometry.groups.length === 0)
                return null;
            if (!forceIndices && geometry.index === null && isMultiMaterial) {
                // temporal workaround.
                console.warn('THREE.GLTFExporter: Creating index for non-indexed multi-material mesh.');
                forceIndices = true;
            }
            var didForceIndices = false;
            if (geometry.index === null && forceIndices) {
                var indices = [];
                for (var i = 0, il = geometry.attributes.position.count; i < il; i++) {
                    indices[i] = i;
                }
                geometry.setIndex(indices);
                didForceIndices = true;
            }
            var materials = isMultiMaterial ? mesh.material : [mesh.material];
            var groups = isMultiMaterial ? geometry.groups : [{ materialIndex: 0, start: undefined, count: undefined }];
            for (var i = 0, il = groups.length; i < il; i++) {
                var primitive = {
                    mode: mode,
                    attributes: attributes,
                };
                serializeUserData(geometry, primitive);
                if (targets.length > 0)
                    primitive.targets = targets;
                if (geometry.index !== null) {
                    var cacheKey = getUID(geometry.index);
                    if (groups[i].start !== undefined || groups[i].count !== undefined) {
                        cacheKey += ':' + groups[i].start + ':' + groups[i].count;
                    }
                    if (cachedData.attributes.has(cacheKey)) {
                        primitive.indices = cachedData.attributes.get(cacheKey);
                    }
                    else {
                        primitive.indices = processAccessor(geometry.index, geometry, groups[i].start, groups[i].count);
                        cachedData.attributes.set(cacheKey, primitive.indices);
                    }
                    if (primitive.indices === null)
                        delete primitive.indices;
                }
                var material = processMaterial(materials[groups[i].materialIndex]);
                if (material !== null) {
                    primitive.material = material;
                }
                primitives.push(primitive);
            }
            if (didForceIndices) {
                geometry.setIndex(null);
            }
            gltfMesh.primitives = primitives;
            if (!outputJSON.meshes) {
                outputJSON.meshes = [];
            }
            outputJSON.meshes.push(gltfMesh);
            var index = outputJSON.meshes.length - 1;
            cachedData.meshes.set(cacheKey, index);
            return index;
        }
        /**
         * Process camera
         * @param  {THREE.Camera} camera Camera to process
         * @return {Integer}      Index of the processed mesh in the "camera" array
         */
        function processCamera(camera) {
            if (!outputJSON.cameras) {
                outputJSON.cameras = [];
            }
            var isOrtho = camera.isOrthographicCamera;
            var gltfCamera = {
                type: isOrtho ? 'orthographic' : 'perspective'
            };
            if (isOrtho) {
                gltfCamera.orthographic = {
                    xmag: camera.right * 2,
                    ymag: camera.top * 2,
                    zfar: camera.far <= 0 ? 0.001 : camera.far,
                    znear: camera.near < 0 ? 0 : camera.near
                };
            }
            else {
                gltfCamera.perspective = {
                    aspectRatio: camera.aspect,
                    yfov: three_1.Math.degToRad(camera.fov),
                    zfar: camera.far <= 0 ? 0.001 : camera.far,
                    znear: camera.near < 0 ? 0 : camera.near
                };
            }
            if (camera.name !== '') {
                gltfCamera.name = camera.type;
            }
            outputJSON.cameras.push(gltfCamera);
            return outputJSON.cameras.length - 1;
        }
        /**
         * Creates glTF animation entry from AnimationClip object.
         *
         * Status:
         * - Only properties listed in PATH_PROPERTIES may be animated.
         *
         * @param {THREE.AnimationClip} clip
         * @param {THREE.Object3D} root
         * @return {number}
         */
        function processAnimation(clip, root) {
            if (!outputJSON.animations) {
                outputJSON.animations = [];
            }
            clip = GLTFExporter.Utils.mergeMorphTargetTracks(clip.clone(), root);
            var tracks = clip.tracks;
            var channels = [];
            var samplers = [];
            for (var i = 0; i < tracks.length; ++i) {
                var track = tracks[i];
                var trackBinding = three_1.PropertyBinding.parseTrackName(track.name);
                var trackNode = three_1.PropertyBinding.findNode(root, trackBinding.nodeName);
                var trackProperty = PATH_PROPERTIES[trackBinding.propertyName];
                if (trackBinding.objectName === 'bones') {
                    if (trackNode.isSkinnedMesh === true) {
                        trackNode = trackNode.skeleton.getBoneByName(trackBinding.objectIndex);
                    }
                    else {
                        trackNode = undefined;
                    }
                }
                if (!trackNode || !trackProperty) {
                    console.warn('THREE.GLTFExporter: Could not export animation track "%s".', track.name);
                    return null;
                }
                var inputItemSize = 1;
                var outputItemSize = track.values.length / track.times.length;
                if (trackProperty === PATH_PROPERTIES.morphTargetInfluences) {
                    outputItemSize /= trackNode.morphTargetInfluences.length;
                }
                var interpolation;
                // @TODO export CubicInterpolant(InterpolateSmooth) as CUBICSPLINE
                // Detecting glTF cubic spline interpolant by checking factory method's special property
                // GLTFCubicSplineInterpolant is a custom interpolant and track doesn't return
                // valid value from .getInterpolation().
                if (track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline === true) {
                    interpolation = 'CUBICSPLINE';
                    // itemSize of CUBICSPLINE keyframe is 9
                    // (VEC3 * 3: inTangent, splineVertex, and outTangent)
                    // but needs to be stored as VEC3 so dividing by 3 here.
                    outputItemSize /= 3;
                }
                else if (track.getInterpolation() === three_1.InterpolateDiscrete) {
                    interpolation = 'STEP';
                }
                else {
                    interpolation = 'LINEAR';
                }
                samplers.push({
                    input: processAccessor(new three_1.BufferAttribute(track.times, inputItemSize)),
                    output: processAccessor(new three_1.BufferAttribute(track.values, outputItemSize)),
                    interpolation: interpolation
                });
                channels.push({
                    sampler: samplers.length - 1,
                    target: {
                        node: nodeMap.get(trackNode),
                        path: trackProperty
                    }
                });
            }
            outputJSON.animations.push({
                name: clip.name || 'clip_' + outputJSON.animations.length,
                samplers: samplers,
                channels: channels
            });
            return outputJSON.animations.length - 1;
        }
        function processSkin(object) {
            var node = outputJSON.nodes[nodeMap.get(object)];
            var skeleton = object.skeleton;
            var rootJoint = object.skeleton.bones[0];
            if (rootJoint === undefined)
                return null;
            var joints = [];
            var inverseBindMatrices = new Float32Array(skeleton.bones.length * 16);
            for (var i = 0; i < skeleton.bones.length; ++i) {
                joints.push(nodeMap.get(skeleton.bones[i]));
                skeleton.boneInverses[i].toArray(inverseBindMatrices, i * 16);
            }
            if (outputJSON.skins === undefined) {
                outputJSON.skins = [];
            }
            outputJSON.skins.push({
                inverseBindMatrices: processAccessor(new three_1.BufferAttribute(inverseBindMatrices, 16)),
                joints: joints,
                skeleton: nodeMap.get(rootJoint)
            });
            var skinIndex = node.skin = outputJSON.skins.length - 1;
            return skinIndex;
        }
        function processLight(light) {
            var lightDef = {};
            if (light.name)
                lightDef.name = light.name;
            lightDef.color = light.color.toArray();
            lightDef.intensity = light.intensity;
            if (light.isDirectionalLight) {
                lightDef.type = 'directional';
            }
            else if (light.isPointLight) {
                lightDef.type = 'point';
                if (light.distance > 0)
                    lightDef.range = light.distance;
            }
            else if (light.isSpotLight) {
                lightDef.type = 'spot';
                if (light.distance > 0)
                    lightDef.range = light.distance;
                lightDef.spot = {};
                lightDef.spot.innerConeAngle = (light.penumbra - 1.0) * light.angle * -1.0;
                lightDef.spot.outerConeAngle = light.angle;
            }
            if (light.decay !== undefined && light.decay !== 2) {
                console.warn('THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, '
                    + 'and expects light.decay=2.');
            }
            if (light.target
                && (light.target.parent !== light
                    || light.target.position.x !== 0
                    || light.target.position.y !== 0
                    || light.target.position.z !== -1)) {
                console.warn('THREE.GLTFExporter: Light direction may be lost. For best results, '
                    + 'make light.target a child of the light with position 0,0,-1.');
            }
            var lights = outputJSON.extensions['KHR_lights_punctual'].lights;
            lights.push(lightDef);
            return lights.length - 1;
        }
        /**
         * Process Object3D node
         * @param  {THREE.Object3D} node Object3D to processNode
         * @return {Integer}      Index of the node in the nodes list
         */
        function processNode(object) {
            if (!outputJSON.nodes) {
                outputJSON.nodes = [];
            }
            var gltfNode = {};
            if (options.trs) {
                var rotation = object.quaternion.toArray();
                var position = object.position.toArray();
                var scale = object.scale.toArray();
                if (!equalArray(rotation, [0, 0, 0, 1])) {
                    gltfNode.rotation = rotation;
                }
                if (!equalArray(position, [0, 0, 0])) {
                    gltfNode.translation = position;
                }
                if (!equalArray(scale, [1, 1, 1])) {
                    gltfNode.scale = scale;
                }
            }
            else {
                if (object.matrixAutoUpdate) {
                    object.updateMatrix();
                }
                if (!equalArray(object.matrix.elements, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])) {
                    gltfNode.matrix = object.matrix.elements;
                }
            }
            // We don't export empty strings name because it represents no-name in Three.js.
            if (object.name !== '') {
                gltfNode.name = String(object.name);
            }
            serializeUserData(object, gltfNode);
            if (object.isMesh || object.isLine || object.isPoints) {
                var mesh = processMesh(object);
                if (mesh !== null) {
                    gltfNode.mesh = mesh;
                }
            }
            else if (object.isCamera) {
                gltfNode.camera = processCamera(object);
            }
            else if (object.isDirectionalLight || object.isPointLight || object.isSpotLight) {
                if (!extensionsUsed['KHR_lights_punctual']) {
                    outputJSON.extensions = outputJSON.extensions || {};
                    outputJSON.extensions['KHR_lights_punctual'] = { lights: [] };
                    extensionsUsed['KHR_lights_punctual'] = true;
                }
                gltfNode.extensions = gltfNode.extensions || {};
                gltfNode.extensions['KHR_lights_punctual'] = { light: processLight(object) };
            }
            else if (object.isLight) {
                console.warn('THREE.GLTFExporter: Only directional, point, and spot lights are supported.', object);
                return null;
            }
            if (object.isSkinnedMesh) {
                skins.push(object);
            }
            if (object.children.length > 0) {
                var children = [];
                for (var i = 0, l = object.children.length; i < l; i++) {
                    var child = object.children[i];
                    if (child.visible || options.onlyVisible === false) {
                        var node = processNode(child);
                        if (node !== null) {
                            children.push(node);
                        }
                    }
                }
                if (children.length > 0) {
                    gltfNode.children = children;
                }
            }
            outputJSON.nodes.push(gltfNode);
            var nodeIndex = outputJSON.nodes.length - 1;
            nodeMap.set(object, nodeIndex);
            return nodeIndex;
        }
        /**
         * Process Scene
         * @param  {Scene} node Scene to process
         */
        function processScene(scene) {
            if (!outputJSON.scenes) {
                outputJSON.scenes = [];
                outputJSON.scene = 0;
            }
            var gltfScene = {
                nodes: []
            };
            if (scene.name !== '') {
                gltfScene.name = scene.name;
            }
            if (scene.userData && Object.keys(scene.userData).length > 0) {
                gltfScene.extras = serializeUserData(scene);
            }
            outputJSON.scenes.push(gltfScene);
            var nodes = [];
            for (var i = 0, l = scene.children.length; i < l; i++) {
                var child = scene.children[i];
                if (child.visible || options.onlyVisible === false) {
                    var node = processNode(child);
                    if (node !== null) {
                        nodes.push(node);
                    }
                }
            }
            if (nodes.length > 0) {
                gltfScene.nodes = nodes;
            }
            serializeUserData(scene, gltfScene);
        }
        /**
         * Creates a Scene to hold a list of objects and parse it
         * @param  {Array} objects List of objects to process
         */
        function processObjects(objects) {
            var scene = new three_1.Scene();
            scene.name = 'AuxScene';
            for (var i = 0; i < objects.length; i++) {
                // We push directly to children instead of calling `add` to prevent
                // modify the .parent and break its original scene and hierarchy
                scene.children.push(objects[i]);
            }
            processScene(scene);
        }
        function processInput(input) {
            input = input instanceof Array ? input : [input];
            var objectsWithoutScene = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i] instanceof three_1.Scene) {
                    processScene(input[i]);
                }
                else {
                    objectsWithoutScene.push(input[i]);
                }
            }
            if (objectsWithoutScene.length > 0) {
                processObjects(objectsWithoutScene);
            }
            for (var i = 0; i < skins.length; ++i) {
                processSkin(skins[i]);
            }
            for (var i = 0; i < options.animations.length; ++i) {
                processAnimation(options.animations[i], input[0]);
            }
        }
        processInput(input);
        Promise.all(pending).then(function () {
            // Merge buffers.
            var blob = new Blob(buffers, { type: 'application/octet-stream' });
            // Declare extensions.
            var extensionsUsedList = Object.keys(extensionsUsed);
            if (extensionsUsedList.length > 0)
                outputJSON.extensionsUsed = extensionsUsedList;
            if (outputJSON.buffers && outputJSON.buffers.length > 0) {
                // Update bytelength of the single buffer.
                outputJSON.buffers[0].byteLength = blob.size;
                var reader = new window.FileReader();
                if (options.binary === true) {
                    // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification
                    var GLB_HEADER_BYTES = 12;
                    var GLB_HEADER_MAGIC = 0x46546C67;
                    var GLB_VERSION = 2;
                    var GLB_CHUNK_PREFIX_BYTES = 8;
                    var GLB_CHUNK_TYPE_JSON = 0x4E4F534A;
                    var GLB_CHUNK_TYPE_BIN = 0x004E4942;
                    reader.readAsArrayBuffer(blob);
                    reader.onloadend = function () {
                        // Binary chunk.
                        var binaryChunk = getPaddedArrayBuffer(reader.result);
                        var binaryChunkPrefix = new DataView(new ArrayBuffer(GLB_CHUNK_PREFIX_BYTES));
                        binaryChunkPrefix.setUint32(0, binaryChunk.byteLength, true);
                        binaryChunkPrefix.setUint32(4, GLB_CHUNK_TYPE_BIN, true);
                        // JSON chunk.
                        var jsonChunk = getPaddedArrayBuffer(stringToArrayBuffer(JSON.stringify(outputJSON)), 0x20);
                        var jsonChunkPrefix = new DataView(new ArrayBuffer(GLB_CHUNK_PREFIX_BYTES));
                        jsonChunkPrefix.setUint32(0, jsonChunk.byteLength, true);
                        jsonChunkPrefix.setUint32(4, GLB_CHUNK_TYPE_JSON, true);
                        // GLB header.
                        var header = new ArrayBuffer(GLB_HEADER_BYTES);
                        var headerView = new DataView(header);
                        headerView.setUint32(0, GLB_HEADER_MAGIC, true);
                        headerView.setUint32(4, GLB_VERSION, true);
                        var totalByteLength = GLB_HEADER_BYTES
                            + jsonChunkPrefix.byteLength + jsonChunk.byteLength
                            + binaryChunkPrefix.byteLength + binaryChunk.byteLength;
                        headerView.setUint32(8, totalByteLength, true);
                        var glbBlob = new Blob([
                            header,
                            jsonChunkPrefix,
                            jsonChunk,
                            binaryChunkPrefix,
                            binaryChunk
                        ], { type: 'application/octet-stream' });
                        var glbReader = new window.FileReader();
                        glbReader.readAsArrayBuffer(glbBlob);
                        glbReader.onloadend = function () {
                            onDone(glbReader.result);
                        };
                    };
                }
                else {
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                        outputJSON.buffers[0].uri = base64data;
                        onDone(outputJSON);
                    };
                }
            }
            else {
                onDone(outputJSON);
            }
        });
    }
};
GLTFExporter.Utils = {
    insertKeyframe: function (track, time) {
        var tolerance = 0.001; // 1ms
        var valueSize = track.getValueSize();
        var times = new track.TimeBufferType(track.times.length + 1);
        var values = new track.ValueBufferType(track.values.length + valueSize);
        var interpolant = track.createInterpolant(new track.ValueBufferType(valueSize));
        var index;
        if (track.times.length === 0) {
            times[0] = time;
            for (var i = 0; i < valueSize; i++) {
                values[i] = 0;
            }
            index = 0;
        }
        else if (time < track.times[0]) {
            if (Math.abs(track.times[0] - time) < tolerance)
                return 0;
            times[0] = time;
            times.set(track.times, 1);
            values.set(interpolant.evaluate(time), 0);
            values.set(track.values, valueSize);
            index = 0;
        }
        else if (time > track.times[track.times.length - 1]) {
            if (Math.abs(track.times[track.times.length - 1] - time) < tolerance) {
                return track.times.length - 1;
            }
            times[times.length - 1] = time;
            times.set(track.times, 0);
            values.set(track.values, 0);
            values.set(interpolant.evaluate(time), track.values.length);
            index = times.length - 1;
        }
        else {
            for (var i = 0; i < track.times.length; i++) {
                if (Math.abs(track.times[i] - time) < tolerance)
                    return i;
                if (track.times[i] < time && track.times[i + 1] > time) {
                    times.set(track.times.slice(0, i + 1), 0);
                    times[i + 1] = time;
                    times.set(track.times.slice(i + 1), i + 2);
                    values.set(track.values.slice(0, (i + 1) * valueSize), 0);
                    values.set(interpolant.evaluate(time), (i + 1) * valueSize);
                    values.set(track.values.slice((i + 1) * valueSize), (i + 2) * valueSize);
                    index = i + 1;
                    break;
                }
            }
        }
        track.times = times;
        track.values = values;
        return index;
    },
    mergeMorphTargetTracks: function (clip, root) {
        var tracks = [];
        var mergedTracks = {};
        var sourceTracks = clip.tracks;
        for (var i = 0; i < sourceTracks.length; ++i) {
            var sourceTrack = sourceTracks[i];
            var sourceTrackBinding = three_1.PropertyBinding.parseTrackName(sourceTrack.name);
            var sourceTrackNode = three_1.PropertyBinding.findNode(root, sourceTrackBinding.nodeName);
            if (sourceTrackBinding.propertyName !== 'morphTargetInfluences' || sourceTrackBinding.propertyIndex === undefined) {
                // Tracks that don't affect morph targets, or that affect all morph targets together, can be left as-is.
                tracks.push(sourceTrack);
                continue;
            }
            if (sourceTrack.createInterpolant !== sourceTrack.InterpolantFactoryMethodDiscrete
                && sourceTrack.createInterpolant !== sourceTrack.InterpolantFactoryMethodLinear) {
                if (sourceTrack.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline) {
                    // This should never happen, because glTF morph target animations
                    // affect all targets already.
                    throw new Error('THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.');
                }
                console.warn('THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead.');
                sourceTrack = sourceTrack.clone();
                sourceTrack.setInterpolation(three_1.InterpolateLinear);
            }
            var targetCount = sourceTrackNode.morphTargetInfluences.length;
            var targetIndex = sourceTrackNode.morphTargetDictionary[sourceTrackBinding.propertyIndex];
            if (targetIndex === undefined) {
                throw new Error('THREE.GLTFExporter: Morph target name not found: ' + sourceTrackBinding.propertyIndex);
            }
            var mergedTrack;
            // If this is the first time we've seen this object, create a new
            // track to store merged keyframe data for each morph target.
            if (mergedTracks[sourceTrackNode.uuid] === undefined) {
                mergedTrack = sourceTrack.clone();
                var values = new mergedTrack.ValueBufferType(targetCount * mergedTrack.times.length);
                for (var j = 0; j < mergedTrack.times.length; j++) {
                    values[j * targetCount + targetIndex] = mergedTrack.values[j];
                }
                mergedTrack.name = '.morphTargetInfluences';
                mergedTrack.values = values;
                mergedTracks[sourceTrackNode.uuid] = mergedTrack;
                tracks.push(mergedTrack);
                continue;
            }
            var sourceInterpolant = sourceTrack.createInterpolant(new sourceTrack.ValueBufferType(1));
            mergedTrack = mergedTracks[sourceTrackNode.uuid];
            // For every existing keyframe of the merged track, write a (possibly
            // interpolated) value from the source track.
            for (var j = 0; j < mergedTrack.times.length; j++) {
                mergedTrack.values[j * targetCount + targetIndex] = sourceInterpolant.evaluate(mergedTrack.times[j]);
            }
            // For every existing keyframe of the source track, write a (possibly
            // new) keyframe to the merged track. Values from the previous loop may
            // be written again, but keyframes are de-duplicated.
            for (var j = 0; j < sourceTrack.times.length; j++) {
                var keyframeIndex = this.insertKeyframe(mergedTrack, sourceTrack.times[j]);
                mergedTrack.values[keyframeIndex * targetCount + targetIndex] = sourceTrack.values[j];
            }
        }
        clip.tracks = tracks;
        return clip;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0xURkV4cG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicy9nZW8taW5mby9pby9HTFRGRXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQUVILGlDQXNCZTtBQUVmLGdGQUFnRjtBQUNoRixZQUFZO0FBQ1osZ0ZBQWdGO0FBQ2hGLElBQUksZUFBZSxHQUFHO0lBQ3JCLE1BQU0sRUFBRSxNQUFNO0lBQ2QsS0FBSyxFQUFFLE1BQU07SUFDYixTQUFTLEVBQUUsTUFBTTtJQUNqQixVQUFVLEVBQUUsTUFBTTtJQUNsQixTQUFTLEVBQUUsTUFBTTtJQUNqQixjQUFjLEVBQUUsTUFBTTtJQUN0QixZQUFZLEVBQUUsTUFBTTtJQUVwQixhQUFhLEVBQUUsTUFBTTtJQUNyQixjQUFjLEVBQUUsTUFBTTtJQUN0QixLQUFLLEVBQUUsTUFBTTtJQUNiLFlBQVksRUFBRSxNQUFNO0lBQ3BCLFlBQVksRUFBRSxNQUFNO0lBQ3BCLG9CQUFvQixFQUFFLE1BQU07SUFFNUIsT0FBTyxFQUFFLE1BQU07SUFDZixNQUFNLEVBQUUsTUFBTTtJQUNkLHNCQUFzQixFQUFFLE1BQU07SUFDOUIscUJBQXFCLEVBQUUsTUFBTTtJQUM3QixxQkFBcUIsRUFBRSxNQUFNO0lBQzdCLG9CQUFvQixFQUFFLE1BQU07SUFFNUIsYUFBYSxFQUFFLEtBQUs7SUFDcEIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsTUFBTSxFQUFFLEtBQUs7Q0FDYixDQUFDO0FBRUYsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBRXhCLGNBQWMsQ0FBRSxxQkFBYSxDQUFFLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQztBQUMxRCxjQUFjLENBQUUsa0NBQTBCLENBQUUsR0FBRyxlQUFlLENBQUMsc0JBQXNCLENBQUM7QUFDdEYsY0FBYyxDQUFFLGlDQUF5QixDQUFFLEdBQUcsZUFBZSxDQUFDLHFCQUFxQixDQUFDO0FBQ3BGLGNBQWMs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SyxDQUFFLENBQUMsQ0FBRSxFQUFHO1lBRXJDLElBQUssSUFBSSxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBRSxHQUFHLFNBQVM7Z0JBQUcsT0FBTyxDQUFDLENBQUM7WUFFaEUsS0FBSyxDQUFFLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBQztZQUNsQixLQUFLLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLENBQUM7WUFFNUIsTUFBTSxDQUFDLEdBQUcsQ0FBRSxXQUFXLENBQUMsUUFBUSxDQUFFLElBQUksQ0FBRSxFQUFFLENBQUMsQ0FBRSxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUUsQ0FBQztZQUV0QyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBRVY7YUFBTSxJQUFLLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxFQUFHO1lBRTFELElBQUssSUFBSSxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBRSxHQUFHLFNBQVMsRUFBRztnQkFFM0UsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFFOUI7WUFFRCxLQUFLLENBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUM7WUFDakMsS0FBSyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBRSxDQUFDO1lBRTVCLE1BQU0sQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUUsQ0FBQztZQUM5QixNQUFNLENBQUMsR0FBRyxDQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUUsSUFBSSxDQUFF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