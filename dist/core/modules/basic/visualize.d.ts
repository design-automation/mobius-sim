/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 * @module
 */
import { GIModel } from '../../../libs/geo-info/GIModel';
import { TColor, TRay, TPlane, TBBox } from '../../../libs/geo-info/common';
import { TId } from '../../../libs/geo-info/common';
export declare enum _ESide {
    FRONT = "front",
    BACK = "back",
    BOTH = "both"
}
export declare enum _Ecolors {
    NO_VERT_COLORS = "none",
    VERT_COLORS = "apply_rgb"
}
/**
 * Sets color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param color The color, [0,0,0] is black, [1,1,1] is white.
 * @returns void
 */
export declare function Color(__model__: GIModel, entities: TId | TId[], color: TColor): void;
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use.
 * @returns void
 */
export declare function Gradient(__model__: GIModel, entities: TId | TId[], attrib: string | [string, number] | [string, string], range: number | [number, number], method: _EColorRampMethod): void;
export declare enum _EColorRampMethod {
    FALSE_COLOR = "false_color",
    BLACK_BODY = "black_body",
    WHITE_RED = "white_red",
    WHITE_GREEN = "white_green",
    WHITE_BLUE = "white_blue",
    BLUE_RED = "blue_red",
    GREEN_RED = "green_red",
    BLUE_GREEN = "blue_green",
    GREY_SCALE = "grey_scale",
    ORRD = "OrRd",
    PUBU = "PuBu",
    BUPU = "BuPu",
    ORANGES = "Oranges",
    BUGN = "BuGn",
    YLORBR = "YlOrBr",
    YLGN = "YlGn",
    REDS = "Reds",
    RDPU = "RdPu",
    GREENS = "Greens",
    YLGNBU = "YlGnBu",
    PURPLES = "Purples",
    GNBU = "GnBu",
    GREYS = "Greys",
    YLORRD = "YlOrRd",
    PURD = "PuRd",
    BLUES = "Blues",
    PUBUGN = "PuBuGn",
    VIRIDIS = "Viridis",
    SPECTRAL = "Spectral",
    RDYLGN = "RdYlGn",
    RDBU = "RdBu",
    PIYG = "PiYG",
    PRGN = "PRGn",
    RDYLBU = "RdYlBu",
    BRBG = "BrBG",
    RDGY = "RdGy",
    PUOR = "PuOr",
    SET2 = "Set2",
    ACCENT = "Accent",
    SET1 = "Set1",
    SET3 = "Set3",
    DARK2 = "Dark2",
    PAIRED = "Paired",
    PASTEL2 = "Pastel2",
    PASTEL1 = "Pastel1"
}
export declare enum _EEdgeMethod {
    VISIBLE = "visible",
    HIDDEN = "hidden"
}
/**
 * Controls how edges are visualized by setting the visibility of the edge.
 * \n
 * The method can either be 'visible' or 'hidden'.
 * 'visible' means that an edge line will be visible.
 * 'hidden' means that no edge lines will be visible.
 * \n
 * @param entities A list of edges, or other entities from which edges can be extracted.
 * @param method Enum, visible or hidden.
 * @returns void
 */
export declare function Edge(__model__: GIModel, entities: TId | TId[], method: _EEdgeMethod): void;
export declare enum _EMeshMethod {
    FACETED = "faceted",
    SMOOTH = "smooth"
}
/**
 * Controls how polygon meshes are visualized by creating normals on vertices.
 * \n
 * The method can either be 'faceted' or 'smooth'.
 * 'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
 * 'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.
 * \n
 * @param entities Vertices belonging to polygons, or entities from which polygon vertices can be extracted.
 * @param method Enum, the types of normals to create, faceted or smooth.
 * @returns void
 */
export declare function Mesh(__model__: GIModel, entities: TId | TId[], method: _EMeshMethod): void;
/**
 * Visualises a ray or a list of rays by creating a polyline with an arrow head.
 *
 * @param __model__
 * @param rays Polylines representing the ray or rays.
 * @param scale Scales the arrow head of the vector.
 * @returns entities, a line with an arrow head representing the ray.
 * @example ray1 = visualize.Ray([[1,2,3],[0,0,1]])
 */
export declare function Ray(__model__: GIModel, rays: TRay | TRay[], scale: number): TId[];
/**
 * Visualises a plane or a list of planes by creating polylines.
 *
 * @param __model__
 * @param plane A plane or a list of planes.
 * @returns Entities, a square plane polyline and three axis polyline.
 * @example plane1 = visualize.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export declare function Plane(__model__: GIModel, planes: TPlane | TPlane[], scale: number): TId[];
/**
 * Visualises a bounding box by adding geometry to the model.
 *
 * @param __model__
 * @param bboxes A list of lists.
 * @returns Entities, twelve polylines representing the box.
 * @example bbox1 = virtual.viBBox(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export declare function BBox(__model__: GIModel, bboxes: TBBox | TBBox): TId[];
