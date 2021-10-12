"use strict";
/**
 * @author Mugen87 / https://github.com/Mugen87
 * Port from https://github.com/mapbox/earcut (v2.1.2)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Earcut = void 0;
const Earcut = {
    triangulate: function (data, holeIndices, dim) {
        dim = dim || 2;
        const hasHoles = holeIndices && holeIndices.length;
        const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
        let outerNode = linkedList(data, 0, outerLen, dim, true);
        const triangles = [];
        if (!outerNode) {
            return triangles;
        }
        let minX, minY, maxX, maxY, x, y, invSize;
        if (hasHoles) {
            outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
        }
        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];
            for (let i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) {
                    minX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y > maxY) {
                    maxY = y;
                }
            }
            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }
        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
        return triangles;
    }
};
exports.Earcut = Earcut;
// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    let i, last;
    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) {
            last = insertNode(i, data[i], data[i + 1], last);
        }
    }
    else {
        for (i = end - dim; i >= start; i -= dim) {
            last = insertNode(i, data[i], data[i + 1], last);
        }
    }
    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }
    return last;
}
// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) {
        return start;
    }
    if (!end) {
        end = start;
    }
    let p = start, again;
    do {
        again = false;
        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) {
                break;
            }
            again = true;
        }
        else {
            p = p.next;
        }
    } while (again || p !== end);
    return end;
}
// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) {
        return;
    }
    // interlink polygon nodes in z-order
    if (!pass && invSize) {
        indexCurve(ear, minX, minY, invSize);
    }
    let stop = ear, prev, next;
    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;
        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);
            removeNode(ear);
            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;
            continue;
        }
        ear = next;
        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
                // if this didn't work, try curing all small self-intersections locally
            }
            else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
                // as a last resort, try splitting the remaining polygon into two
            }
            else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }
            break;
        }
    }
}
// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    const a = ear.prev, b = ear, c = ear.next;
    if (area(a, b, c) >= 0) {
        return false;
    } // reflex, can't be an ear
    // now make sure we don't have other points inside the potential ear
    let p = ear.next.next;
    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) {
            return false;
        }
        p = p.next;
    }
    return true;
}
function isEarHashed(ear, minX, minY, invSize) {
    const a = ear.prev, b = ear, c = ear.next;
    if (area(a, b, c) >= 0) {
        return false;
    } // reflex, can't be an ear
    // triangle bbox; min & max are calculated like this for speed
    const minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x), minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y), maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x), maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);
    // z-order range for the current triangle bbox;
    const minZ = zOrder(minTX, minTY, minX, minY, invSize), maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
    // first look for points inside the triangle in increasing z-order
    let p = ear.nextZ;
    while (p && p.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) {
            return false;
        }
        p = p.nextZ;
    }
    // then look for points in decreasing z-order
    p = ear.prevZ;
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) {
            return false;
        }
        p = p.prevZ;
    }
    return true;
}
// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    let p = start;
    do {
        const a = p.prev, b = p.next.next;
        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);
            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);
            p = start = b;
        }
        p = p.next;
    } while (p !== start);
    return p;
}
// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    let a = start;
    do {
        let b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                let c = splitPolygon(a, b);
                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);
                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}
// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    let queue = [], i, len, start, end, list;
    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) {
            list.steiner = true;
        }
        queue.push(getLeftmost(list));
    }
    queue.sort(compareX);
    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }
    return outerNode;
}
function compareX(a, b) {
    return a.x - b.x;
}
// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        const b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}
// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    let p = outerNode;
    const hx = hole.x;
    const hy = hole.y;
    let qx = -Infinity;
    let m;
    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) {
                        return p;
                    }
                    if (hy === p.next.y) {
                        return p.next;
                    }
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);
    if (!m) {
        return null;
    }
    if (hx === qx) {
        return m.prev;
    } // hole touches outer segment; pick lower endpoint
    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point
    const stop = m;
    const mx = m.x;
    const my = m.y;
    let tanMin = Infinity;
    let tan;
    p = m.next;
    while (p !== stop) {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
            pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential
            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }
        p = p.next;
    }
    return m;
}
// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    let p = start;
    do {
        if (p.z === null) {
            p.z = zOrder(p.x, p.y, minX, minY, invSize);
        }
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);
    p.prevZ.nextZ = null;
    p.prevZ = null;
    sortLinked(p);
}
// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    let i, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;
        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) {
                    break;
                }
            }
            qSize = inSize;
            while (pSize > 0 || (qSize > 0 && q)) {
                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                }
                else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }
                if (tail) {
                    tail.nextZ = e;
                }
                else {
                    list = e;
                }
                e.prevZ = tail;
                tail = e;
            }
            p = q;
        }
        tail.nextZ = null;
        inSize *= 2;
    } while (numMerges > 1);
    return list;
}
// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;
    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;
    return x | (y << 1);
}
// find the leftmost node of a polygon ring
function getLeftmost(start) {
    let p = start, leftmost = start;
    do {
        if (p.x < leftmost.x) {
            leftmost = p;
        }
        p = p.next;
    } while (p !== start);
    return leftmost;
}
// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
        (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
        (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}
// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
        locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}
// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}
// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}
// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if ((equals(p1, q1) && equals(p2, q2)) ||
        (equals(p1, q2) && equals(p2, q1))) {
        return true;
    }
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
        area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}
// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    let p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
            intersects(p, p.next, a, b)) {
            return true;
        }
        p = p.next;
    } while (p !== a);
    return false;
}
// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}
// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    let p = a;
    let inside = false;
    const px = (a.x + b.x) / 2;
    const py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
            (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)) {
            inside = !inside;
        }
        p = p.next;
    } while (p !== a);
    return inside;
}
// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    const a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
    a.next = b;
    b.prev = a;
    a2.next = an;
    an.prev = a2;
    b2.next = a2;
    a2.prev = b2;
    bp.next = b2;
    b2.prev = bp;
    return b2;
}
// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    const p = new Node(i, x, y);
    if (!last) {
        p.prev = p;
        p.next = p;
    }
    else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}
function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    if (p.prevZ) {
        p.prevZ.nextZ = p.nextZ;
    }
    if (p.nextZ) {
        p.nextZ.prevZ = p.prevZ;
    }
}
function Node(i, x, y) {
    // vertice index in coordinates array
    this.i = i;
    // vertex coordinates
    this.x = x;
    this.y = y;
    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;
    // z-order curve value
    this.z = null;
    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;
    // indicates whether this is a steiner point
    this.steiner = false;
}
function signedArea(data, start, end, dim) {
    let sum = 0;
    for (let i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWFyY3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYnMvdHJpYW5ndWxhdGUvZWFyY3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7OztBQUVILE1BQU0sTUFBTSxHQUFHO0lBRVgsV0FBVyxFQUFFLFVBQVcsSUFBSSxFQUFFLFdBQVksRUFBRSxHQUFJO1FBRTVDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRWYsTUFBTSxRQUFRLEdBQUcsV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUUsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2pFLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFFLENBQUM7UUFDM0QsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXJCLElBQUssQ0FBRSxTQUFTLEVBQUc7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBRXhDLElBQUksSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDO1FBRTFDLElBQUssUUFBUSxFQUFHO1lBQUUsU0FBUyxHQUFHLGNBQWMsQ0FBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUUsQ0FBQztTQUFFO1FBRXBGLDZGQUE2RjtRQUU3RixJQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBRztZQUUxQixJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztZQUN4QixJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBRSxDQUFDLENB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Q0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFFakIsSUFBSyxJQUFJLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLEVBQUc7UUFBRSxPQUFPLEtBQUssQ0FBQztLQUFFLENBQUMsMEJBQTBCO0lBRXhFLDhEQUE4RDtJQUU5RCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLEVBQzNFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLEVBQ3pFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLEVBQ3pFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFFOUUsK0NBQStDO0lBRS9DLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFFLEVBQ3BELElBQUksR0FBRyxNQUFNLENBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBRSxDQUFDO0lBRXZELGtFQUFrRTtJQUVsRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBRWxCLE9BQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFHO1FBRXZCLElBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJO1lBQzdCLGVBQWUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUU7WUFDekQsSUFBSSxDQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEVBQUc7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBQzFELENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0tBRWY7SUFFRCw2Q0FBNkM7SUFFN0MsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFFZCxPQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRztRQUV2QixJQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSTtZQUM3QixlQUFlLENBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFO1lBQ3pELElBQUksQ0FBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxFQUFHO1lBQUUsT0FBTyxLQUFLLENBQUM7U0FBRTtRQUUxRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztLQUVmO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFFaEIsQ0FBQztBQUVELHVFQUF1RTtBQUV2RSxTQUFTLHNCQUFzQixDQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRztJQUVsRCxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7SUFFZCxHQUFHO1FBRUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFbEMsSUFBSyxDQUFFLE1BQU0sQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLElBQUksVUFBVSxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUUsSUFBSSxhQUFhLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxJQUFJLGFBQWEsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLEVBQUc7WUFFdkcsU0FBUyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBRSxDQUFDO1lBQzVCLFNBQVMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUUsQ0FBQztZQUM1QixTQUFTLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFFLENBQUM7WUFFNUIsNEJBQTRCO1lBRTVCLFVBQVUsQ0FBRSxDQUFDLENBQUUsQ0FBQztZQUNoQixVQUFVLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDO1lBRXJCLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBRWpCO1FBRUQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FFZCxRQUFTLENBQUMsS0FBSyxLQUFLLEVBQUc7SUFFeEIsT0FBTyxDQUFDLENBQUM7QUFFYixDQUFDO0FBRUQsb0VBQW9FO0FBRXBFLFNBQVMsV0FBVyxDQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTztJQUU1RCw4REFBOEQ7SUFFOUQsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBRWQsR0FBRztRQUVDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXBCLE9BQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUc7WUFFbkIsSUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksZUFBZSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsRUFBRztnQkFFMUMsMkNBQTJDO2dCQUUzQyxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO2dCQUU3Qix5Q0FBeUM7Z0JBRXpDLENBQUMsR0FBRyxZQUFZLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQztnQkFDOUIsQ0FBQyxHQUFHLFlBQVksQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDO2dCQUU5QiwwQkFBMEI7Z0JBRTFCLFlBQVksQ0FBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBRSxDQUFDO2dCQUN2RCxZQUFZLENBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUUsQ0FBQztnQkFDdkQsT0FBTzthQUVWO1lBRUQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FFZDtRQUVELENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBRWQsUUFBUyxDQUFDLEtBQUssS0FBSyxFQUFHO0FBRTVCLENBQUM7QUFFRCxxRkFBcUY7QUFFckYsU0FBUyxjQUFjLENBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsR0FBRztJQUV0RCxJQUFJLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztJQUV6QyxLQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUcsRUFBRztRQUVuRCxLQUFLLEdBQUcsV0FBVyxDQUFFLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBQztRQUMvQixHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzdELElBQUksR0FBRyxVQUFVLENBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBRSxDQUFDO1FBQ2xELElBQUssSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUc7WUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUFFO1FBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUUsV0FBVyxDQUFFLElBQUksQ0FBRSxDQUFFLENBQUM7S0FFckM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFFLFFBQVEsQ0FBRSxDQUFDO0lBRXZCLG1DQUFtQztJQUVuQyxLQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFHLEVBQUc7UUFFbEMsYUFBYSxDQUFFLEtBQUssQ0FBRSxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUUsQ0FBQztRQUN2QyxTQUFTLEdBQUcsWUFBWSxDQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFFLENBQUM7S0FFekQ7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUVyQixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUUsQ0FBQyxFQUFFLENBQUM7SUFFbkIsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFckIsQ0FBQztBQUVELHVGQUF1RjtBQUV2RixTQUFTLGFBQWEsQ0FBRSxJQUFJLEVBQUUsU0FBUztJQUVuQyxTQUFTLEdBQUcsY0FBYyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQztJQUU5QyxJQUFLLFNBQVMsRUFBRztRQUViLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBRSxTQUFTLEVBQUUsSUFBSSxDQUFFLENBQUM7UUFFMUMsWUFBWSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUM7S0FFN0I7QUFFTCxDQUFDO0FBRUQsK0VBQStFO0FBRS9FLFNBQVMsY0FBYyxDQUFFLElBQUksRUFBRSxTQUFTO0lBRXBDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNsQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEIsSUFBSSxFQUFFLEdBQUcsQ0FBRSxRQUFRLENBQUM7SUFDcEIsSUFBSSxDQUFDLENBQUM7SUFFTixrRkFBa0Y7SUFDbEYsc0VBQXNFO0lBRXRFLEdBQUc7UUFFQyxJQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFHO1lBRW5ELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBRXZFLElBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFHO2dCQUVyQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUVQLElBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRztvQkFFWixJQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFHO3dCQUFFLE9BQU8sQ0FBQyxDQUFDO3FCQUFFO29CQUMvQixJQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRzt3QkFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7cUJBQUU7aUJBRTVDO2dCQUVELENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFFbkM7U0FFSjtRQUVELENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBRWQsUUFBUyxDQUFDLEtBQUssU0FBUyxFQUFHO0lBRTVCLElBQUssQ0FBRSxDQUFDLEVBQUc7UUFBRSxPQUFPLElBQUksQ0FBQztLQUFFO0lBRTNCLElBQUssRUFBRSxLQUFLLEVBQUUsRUFBRztRQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztLQUFFLENBQUMsa0RBQWtEO0lBRXRGLHdGQUF3RjtJQUN4Riw0REFBNEQ7SUFDNUQsbUZBQW1GO0lBRW5GLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNmLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ3RCLElBQUksR0FBRyxDQUFDO0lBRVIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFWCxPQUFRLENBQUMsS0FBSyxJQUFJLEVBQUc7UUFFakIsSUFBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekIsZUFBZSxDQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsRUFBRztZQUVoRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLGFBQWE7WUFFeEQsSUFBSyxDQUFFLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBRSxHQUFHLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFFLElBQUksYUFBYSxDQUFFLENBQUMsRUFBRSxJQUFJLENBQUUsRUFBRztnQkFFbkYsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDTixNQUFNLEdBQUcsR0FBRyxDQUFDO2FBRWhCO1NBRUo7UUFFRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUVkO0lBRUQsT0FBTyxDQUFDLENBQUM7QUFFYixDQUFDO0FBRUQscUNBQXFDO0FBRXJDLFNBQVMsVUFBVSxDQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU87SUFFM0MsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBRWQsR0FBRztRQUVDLElBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUc7WUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUUsQ0FBQztTQUFFO1FBQ3RFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqQixDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDakIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FFZCxRQUFTLENBQUMsS0FBSyxLQUFLLEVBQUc7SUFFeEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBRWYsVUFBVSxDQUFFLENBQUMsQ0FBRSxDQUFDO0FBRXBCLENBQUM7QUFFRCxrREFBa0Q7QUFDbEQsdUVBQXVFO0FBRXZFLFNBQVMsVUFBVSxDQUFFLElBQUk7SUFFckIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFMUQsR0FBRztRQUVDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDVCxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFFZCxPQUFRLENBQUMsRUFBRztZQUVSLFNBQVMsRUFBRyxDQUFDO1lBQ2IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNOLEtBQUssR0FBRyxDQUFDLENBQUM7WUFFVixLQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUcsRUFBRztnQkFFNUIsS0FBSyxFQUFHLENBQUM7Z0JBQ1QsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ1osSUFBSyxDQUFFLENBQUMsRUFBRztvQkFBRSxNQUFNO2lCQUFFO2FBRXhCO1lBRUQsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUVmLE9BQVEsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFFLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFFLEVBQUc7Z0JBRXRDLElBQUssS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFFLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFFLEVBQUc7b0JBRXZELENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ04sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ1osS0FBSyxFQUFHLENBQUM7aUJBRVo7cUJBQU07b0JBRUgsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDTixDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDWixLQUFLLEVBQUcsQ0FBQztpQkFFWjtnQkFFRCxJQUFLLElBQUksRUFBRztvQkFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztpQkFBRTtxQkFBTTtvQkFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDO2lCQUFFO2dCQUVsRCxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDZixJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBRVo7WUFFRCxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBRVQ7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixNQUFNLElBQUksQ0FBQyxDQUFDO0tBRWYsUUFBUyxTQUFTLEdBQUcsQ0FBQyxFQUFHO0lBRTFCLE9BQU8sSUFBSSxDQUFDO0FBRWhCLENBQUM7QUFFRCw4RUFBOEU7QUFFOUUsU0FBUyxNQUFNLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU87SUFFdEMsZ0VBQWdFO0lBRWhFLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBRSxDQUFDLEdBQUcsSUFBSSxDQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ25DLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBRSxDQUFDLEdBQUcsSUFBSSxDQUFFLEdBQUcsT0FBTyxDQUFDO0lBRW5DLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBRSxHQUFHLFVBQVUsQ0FBQztJQUNwQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUUsR0FBRyxVQUFVLENBQUM7SUFDcEMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFFLEdBQUcsVUFBVSxDQUFDO0lBQ3BDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBRSxHQUFHLFVBQVUsQ0FBQztJQUVwQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUUsR0FBRyxVQUFVLENBQUM7SUFDcEMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFFLEdBQUcsVUFBVSxDQUFDO0lBQ3BDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBRSxHQUFHLFVBQVUsQ0FBQztJQUNwQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUUsR0FBRyxVQUFVLENBQUM7SUFFcEMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7QUFFMUIsQ0FBQztBQUVELDJDQUEyQztBQUUzQyxTQUFTLFdBQVcsQ0FBRSxLQUFLO0lBRXZCLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBRWhDLEdBQUc7UUFFQyxJQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRztZQUFFLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FBRTtRQUN6QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUVkLFFBQVMsQ0FBQyxLQUFLLEtBQUssRUFBRztJQUV4QixPQUFPLFFBQVEsQ0FBQztBQUVwQixDQUFDO0FBRUQsaURBQWlEO0FBRWpELFNBQVMsZUFBZSxDQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBRXBELE9BQU8sQ0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFFLEdBQUcsQ0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFFLEdBQUcsQ0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFFLEdBQUcsQ0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFFLElBQUksQ0FBQztRQUNoRSxDQUFFLEVBQUUsR0FBRyxFQUFFLENBQUUsR0FBRyxDQUFFLEVBQUUsR0FBRyxFQUFFLENBQUUsR0FBRyxDQUFFLEVBQUUsR0FBRyxFQUFFLENBQUUsR0FBRyxDQUFFLEVBQUUsR0FBRyxFQUFFLENBQUUsSUFBSSxDQUFDO1FBQzFELENBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBRSxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBRSxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBRSxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQztBQUVoRSxDQUFDO0FBRUQsb0ZBQW9GO0FBRXBGLFNBQVMsZUFBZSxDQUFFLENBQUMsRUFBRSxDQUFDO0lBRTFCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRTtRQUN0RSxhQUFhLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxJQUFJLGFBQWEsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLElBQUksWUFBWSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQztBQUUvRSxDQUFDO0FBRUQsNEJBQTRCO0FBRTVCLFNBQVMsSUFBSSxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUVsQixPQUFPLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7QUFFekUsQ0FBQztBQUVELGdDQUFnQztBQUVoQyxTQUFTLE1BQU0sQ0FBRSxFQUFFLEVBQUUsRUFBRTtJQUVuQixPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFMUMsQ0FBQztBQUVELGtDQUFrQztBQUVsQyxTQUFTLFVBQVUsQ0FBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBRS9CLElBQUssQ0FBRSxNQUFNLENBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBRSxJQUFJLE1BQU0sQ0FBRSxFQUFFLEVBQUUsRUFBRSxDQUFFLENBQUU7UUFDckMsQ0FBRSxNQUFNLENBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBRSxJQUFJLE1BQU0sQ0FBRSxFQUFFLEVBQUUsRUFBRSxDQUFFLENBQUUsRUFBRztRQUFFLE9BQU8sSUFBSSxDQUFDO0tBQUU7SUFFbkUsT0FBTyxJQUFJLENBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUUsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFFLEdBQUcsQ0FBQztRQUMzQyxJQUFJLENBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUUsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRW5FLENBQUM7QUFFRCw4REFBOEQ7QUFFOUQsU0FBUyxpQkFBaUIsQ0FBRSxDQUFDLEVBQUUsQ0FBQztJQUU1QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFVixHQUFHO1FBRUMsSUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkQsVUFBVSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsRUFBRztZQUU1QyxPQUFPLElBQUksQ0FBQztTQUVmO1FBRUQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FFZCxRQUFTLENBQUMsS0FBSyxDQUFDLEVBQUc7SUFFcEIsT0FBTyxLQUFLLENBQUM7QUFFakIsQ0FBQztBQUVELDREQUE0RDtBQUU1RCxTQUFTLGFBQWEsQ0FBRSxDQUFDLEVBQUUsQ0FBQztJQUV4QixPQUFPLElBQUksQ0FBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRTdELENBQUM7QUFFRCx3RUFBd0U7QUFFeEUsU0FBUyxZQUFZLENBQUUsQ0FBQyxFQUFFLENBQUM7SUFFdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ25CLE1BQU0sRUFBRSxHQUFHLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTdCLEdBQUc7UUFFQyxJQUFLLENBQUUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBRSxLQUFLLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFFLENBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMvQyxDQUFFLEVBQUUsR0FBRyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRSxFQUFHO1lBRXBGLE1BQU0sR0FBRyxDQUFFLE1BQU0sQ0FBQztTQUVyQjtRQUVELENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBRWQsUUFBUyxDQUFDLEtBQUssQ0FBQyxFQUFHO0lBRXBCLE9BQU8sTUFBTSxDQUFDO0FBRWxCLENBQUM7QUFFRCxnSEFBZ0g7QUFDaEgsMEZBQTBGO0FBRTFGLFNBQVMsWUFBWSxDQUFFLENBQUMsRUFBRSxDQUFDO0lBRXZCLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLEVBQ2hDLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxFQUM5QixFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFDWCxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVoQixDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBRVgsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDYixFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUViLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2IsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFFYixFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNiLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRWIsT0FBTyxFQUFFLENBQUM7QUFFZCxDQUFDO0FBRUQsNEZBQTRGO0FBRTVGLFNBQVMsVUFBVSxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7SUFFOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQztJQUU5QixJQUFLLENBQUUsSUFBSSxFQUFHO1FBRVYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztLQUVkO1NBQU07UUFFSCxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7S0FFakI7SUFFRCxPQUFPLENBQUMsQ0FBQztBQUViLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBRSxDQUFDO0lBRWxCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVyQixJQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUc7UUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0tBQUU7SUFDM0MsSUFBSyxDQUFDLENBQUMsS0FBSyxFQUFHO1FBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztLQUFFO0FBRS9DLENBQUM7QUFFRCxTQUFTLElBQUksQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFFbEIscUNBQXFDO0lBQ3JDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRVgscUJBQXFCO0lBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFWCxvREFBb0Q7SUFDcEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFFakIsc0JBQXNCO0lBQ3RCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRWQscUNBQXFDO0lBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBRWxCLDRDQUE0QztJQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUV6QixDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRztJQUV0QyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFFWixLQUFNLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUc7UUFFcEQsR0FBRyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBRSxHQUFHLENBQUUsSUFBSSxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFFLENBQUM7UUFDckUsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUVUO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFFZixDQUFDIn0=