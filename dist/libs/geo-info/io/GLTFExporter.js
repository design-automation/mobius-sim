/**
 * @author fernandojsg / http://fernandojsg.com
 * @author Don McCurdy / https://www.donmccurdy.com
 * @author Takahiro / https://github.com/takahirox
 */
import { BufferAttribute, BufferGeometry, ClampToEdgeWrapping, DoubleSide, InterpolateDiscrete, InterpolateLinear, LinearFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, Math as _Math, MirroredRepeatWrapping, NearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, PropertyBinding, RGBAFormat, RepeatWrapping, Scene, TriangleFanDrawMode, TriangleStripDrawMode, Vector3 } from "three";
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
THREE_TO_WEBGL[NearestFilter] = WEBGL_CONSTANTS.NEAREST;
THREE_TO_WEBGL[NearestMipmapNearestFilter] = WEBGL_CONSTANTS.NEAREST_MIPMAP_NEAREST;
THREE_TO_WEBGL[NearestMipmapLinearFilter] = WEBGL_CONSTANTS.NEAREST_MIPMAP_LINEAR;
THREE_TO_WEBGL[LinearFilter] = WEBGL_CONSTANTS.LINEAR;
THREE_TO_WEBGL[LinearMipmapNearestFilter] = WEBGL_CONSTANTS.LINEAR_MIPMAP_NEAREST;
THREE_TO_WEBGL[LinearMipmapLinearFilter] = WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
THREE_TO_WEBGL[ClampToEdgeWrapping] = WEBGL_CONSTANTS.CLAMP_TO_EDGE;
THREE_TO_WEBGL[RepeatWrapping] = WEBGL_CONSTANTS.REPEAT;
THREE_TO_WEBGL[MirroredRepeatWrapping] = WEBGL_CONSTANTS.MIRRORED_REPEAT;
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
            return _Math.isPowerOfTwo(image.width) && _Math.isPowerOfTwo(image.height);
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
            var v = new Vector3();
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
            var v = new Vector3();
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
            var mimeType = format === RGBAFormat ? 'image/png' : 'image/jpeg';
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
                    canvas.width = _Math.floorPowerOfTwo(canvas.width);
                    canvas.height = _Math.floorPowerOfTwo(canvas.height);
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
            if (material.side === DoubleSide) {
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
                    var geometryTemp = new BufferGeometry();
                    geometryTemp.fromGeometry(geometry);
                    geometry = geometryTemp;
                }
                if (mesh.drawMode === TriangleFanDrawMode) {
                    console.warn('GLTFExporter: TriangleFanDrawMode and wireframe incompatible.');
                    mode = WEBGL_CONSTANTS.TRIANGLE_FAN;
                }
                else if (mesh.drawMode === TriangleStripDrawMode) {
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
                    modifiedAttribute = new BufferAttribute(new Uint16Array(array), attribute.itemSize, attribute.normalized);
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
                    yfov: _Math.degToRad(camera.fov),
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
                var trackBinding = PropertyBinding.parseTrackName(track.name);
                var trackNode = PropertyBinding.findNode(root, trackBinding.nodeName);
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
                else if (track.getInterpolation() === InterpolateDiscrete) {
                    interpolation = 'STEP';
                }
                else {
                    interpolation = 'LINEAR';
                }
                samplers.push({
                    input: processAccessor(new BufferAttribute(track.times, inputItemSize)),
                    output: processAccessor(new BufferAttribute(track.values, outputItemSize)),
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
                inverseBindMatrices: processAccessor(new BufferAttribute(inverseBindMatrices, 16)),
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
            var scene = new Scene();
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
                if (input[i] instanceof Scene) {
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
            var sourceTrackBinding = PropertyBinding.parseTrackName(sourceTrack.name);
            var sourceTrackNode = PropertyBinding.findNode(root, sourceTrackBinding.nodeName);
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
                sourceTrack.setInterpolation(InterpolateLinear);
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
export { GLTFExporter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0xURkV4cG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYnMvZ2VvLWluZm8vaW8vR0xURkV4cG9ydGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQ04sZUFBZSxFQUNmLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsVUFBVSxFQUNWLG1CQUFtQixFQUNuQixpQkFBaUIsRUFDakIsWUFBWSxFQUNaLHdCQUF3QixFQUN4Qix5QkFBeUIsRUFDekIsSUFBSSxJQUFJLEtBQUssRUFDYixzQkFBc0IsRUFDdEIsYUFBYSxFQUNiLHlCQUF5QixFQUN6QiwwQkFBMEIsRUFDMUIsZUFBZSxFQUNmLFVBQVUsRUFDVixjQUFjLEVBQ2QsS0FBSyxFQUNMLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsT0FBTyxFQUNQLE1BQU0sT0FBTyxDQUFDO0FBRWYsZ0ZBQWdGO0FBQ2hGLFlBQVk7QUFDWixnRkFBZ0Y7QUFDaEYsSUFBSSxlQUFlLEdBQUc7SUFDckIsTUFBTSxFQUFFLE1BQU07SUFDZCxLQUFLLEVBQUUsTUFBTTtJQUNiLFNBQVMsRUFBRSxNQUFNO0lBQ2pCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLFNBQVMsRUFBRSxNQUFNO0lBQ2pCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLFlBQVksRUFBRSxNQUFNO0lBRXBCLGFBQWEsRUFBRSxNQUFNO0lBQ3JCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLEtBQUssRUFBRSxNQUFNO0lBQ2IsWUFBWSxFQUFFLE1BQU07SUFDcEIsWUFBWSxFQUFFLE1BQU07SUFDcEIsb0JBQW9CLEVBQUUsTUFBTTtJQUU1QixPQUFPLEVBQUUsTUFBTTtJQUNmLE1BQU0sRUFBRSxNQUFNO0lBQ2Qsc0JBQXNCLEVBQUUsTUFBTTtJQUM5QixxQkFBcUIsRUFBRSxNQUFNO0lBQzdCLHFCQUFxQixFQUFFLE1BQU07SUFDN0Isb0JBQW9CLEVBQUUsTUFBTTtJQUU1Qixh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QU0sS0FBSyxDQUFDLEVBQUc7WUFFL0IsS0FBSyxDQUFFLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBQztZQUVsQixLQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRyxFQUFHO2dCQUV0QyxNQUFNLENBQUUsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDO2FBRWhCO1lBRUQsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUVWO2FBQU0sSUFBSyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUUsRUFBRztZQUVyQyxJQUFLLElBQUksQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUUsR0FBRyxTQUFTO2dCQUFHLE9BQU8sQ0FBQyxDQUFDO1lBRWhFLEtBQUssQ0FBRSxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUM7WUFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBRSxDQUFDO1lBRTVCLE1BQU0sQ0FBQyxHQUFHLENBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBRSxJQUFJLENBQUUsRUFBRSxDQUFDLENBQUUsQ0FBQztZQUM5QyxNQUFNLENBQUMsR0FBRyxDQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFFLENBQUM7WUFFdEMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUVWO2FBQU0sSUFBSyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsRUFBRztZQUUxRCxJQUFLLElBQUksQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUUsR0FBRyxTQUFTLEVBQUc7Z0JBRTNFLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FB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