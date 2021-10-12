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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0xURkV4cG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vaW8vR0xURkV4cG9ydGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxpQ0FzQmU7QUFFZixnRkFBZ0Y7QUFDaEYsWUFBWTtBQUNaLGdGQUFnRjtBQUNoRixJQUFJLGVBQWUsR0FBRztJQUNyQixNQUFNLEVBQUUsTUFBTTtJQUNkLEtBQUssRUFBRSxNQUFNO0lBQ2IsU0FBUyxFQUFFLE1BQU07SUFDakIsVUFBVSxFQUFFLE1BQU07SUFDbEIsU0FBUyxFQUFFLE1BQU07SUFDakIsY0FBYyxFQUFFLE1BQU07SUFDdEIsWUFBWSxFQUFFLE1BQU07SUFFcEIsYUFBYSxFQUFFLE1BQU07SUFDckIsY0FBYyxFQUFFLE1BQU07SUFDdEIsS0FBSyxFQUFFLE1BQU07SUFDYixZQUFZLEVBQUUsTUFBTTtJQUNwQixZQUFZLEVBQUUsTUFBTTtJQUNwQixvQkFBb0IsRUFBRSxNQUFNO0lBRTVCLE9BQU8sRUFBRSxNQUFNO0lBQ2YsTUFBTSxFQUFFLE1BQU07SUFDZCxzQkFBc0IsRUFBRSxNQUFNO0lBQzlCLHFCQUFxQixFQUFFLE1BQU07SUFDN0IscUJBQXFCLEVBQUUsTUFBTTtJQUM3QixvQkFBb0IsRUFBRSxNQUFNO0lBRTVCLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLE1BQU0sRUFBRSxLQUFLO0NBQ2IsQ0FBQztBQUVGLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUV4QixjQUFjLENBQUUscUJBQWEsQ0FBRSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7QUFDMUQsY0FBYyxDQUFFLGtDQUEwQixDQUFFLEdBQUcsZUFBZSxDQUFDLHNCQUFzQixDQUFDO0FBQ3RGLGNBQWMsQ0FBRSxpQ0FBeUIsQ0FBRSxHQUFHLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQztBQUNwRixj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