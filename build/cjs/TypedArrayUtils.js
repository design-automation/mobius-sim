"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedArrayUtils = void 0;
const TypedArrayUtils = {
    quicksortIP: null,
    Kdtree: null
};
exports.TypedArrayUtils = TypedArrayUtils;
/**
 * In-place quicksort for typed arrays (e.g. for Float32Array)
 * provides fast sorting
 * useful e.g. for a custom shader and/or BufferGeometry
 *
 * @author Roman Bolzern <roman.bolzern@fhnw.ch>, 2013
 * @author I4DS http://www.fhnw.ch/i4ds, 2013
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 * Complexity: http://bigocheatsheet.com/ see Quicksort
 *
 * Example:
 * points: [x, y, z, x, y, z, x, y, z, ...]
 * eleSize: 3 //because of (x, y, z)
 * orderElement: 0 //order according to x
 */
TypedArrayUtils.quicksortIP = function (arr, eleSize, orderElement) {
    var stack = [];
    var sp = -1;
    var left = 0;
    var right = arr.length / eleSize - 1;
    var tmp = 0.0, x = 0, y = 0;
    var swapF = function (a, b) {
        a *= eleSize;
        b *= eleSize;
        for (y = 0; y < eleSize; y++) {
            tmp = arr[a + y];
            arr[a + y] = arr[b + y];
            arr[b + y] = tmp;
        }
    };
    var i, j, swap = new Float32Array(eleSize), temp = new Float32Array(eleSize);
    while (true) {
        if (right - left <= 25) {
            for (j = left + 1; j <= right; j++) {
                for (x = 0; x < eleSize; x++) {
                    swap[x] = arr[j * eleSize + x];
                }
                i = j - 1;
                while (i >= left && arr[i * eleSize + orderElement] > swap[orderElement]) {
                    for (x = 0; x < eleSize; x++) {
                        arr[(i + 1) * eleSize + x] = arr[i * eleSize + x];
                    }
                    i--;
                }
                for (x = 0; x < eleSize; x++) {
                    arr[(i + 1) * eleSize + x] = swap[x];
                }
            }
            if (sp == -1)
                break;
            right = stack[sp--]; //?
            left = stack[sp--];
        }
        else {
            var median = (left + right) >> 1;
            i = left + 1;
            j = right;
            swapF(median, i);
            if (arr[left * eleSize + orderElement] > arr[right * eleSize + orderElement]) {
                swapF(left, right);
            }
            if (arr[i * eleSize + orderElement] > arr[right * eleSize + orderElement]) {
                swapF(i, right);
            }
            if (arr[left * eleSize + orderElement] > arr[i * eleSize + orderElement]) {
                swapF(left, i);
            }
            for (x = 0; x < eleSize; x++) {
                temp[x] = arr[i * eleSize + x];
            }
            while (true) {
                do
                    i++;
                while (arr[i * eleSize + orderElement] < temp[orderElement]);
                do
                    j--;
                while (arr[j * eleSize + orderElement] > temp[orderElement]);
                if (j < i)
                    break;
                swapF(i, j);
            }
            for (x = 0; x < eleSize; x++) {
                arr[(left + 1) * eleSize + x] = arr[j * eleSize + x];
                arr[j * eleSize + x] = temp[x];
            }
            if (right - i + 1 >= j - left) {
                stack[++sp] = i;
                stack[++sp] = right;
                right = j - 1;
            }
            else {
                stack[++sp] = left;
                stack[++sp] = j - 1;
                left = i;
            }
        }
    }
    return arr;
};
/**
 * k-d Tree for typed arrays (e.g. for Float32Array), in-place
 * provides fast nearest neighbour search
 * useful e.g. for a custom shader and/or BufferGeometry, saves tons of memory
 * has no insert and remove, only buildup and neares neighbour search
 *
 * Based on https://github.com/ubilabs/kd-tree-javascript by Ubilabs
 *
 * @author Roman Bolzern <roman.bolzern@fhnw.ch>, 2013
 * @author I4DS http://www.fhnw.ch/i4ds, 2013
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 * Requires typed array quicksort
 *
 * Example:
 * points: [x, y, z, x, y, z, x, y, z, ...]
 * metric: function(a, b){	return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2); }  //Manhatten distance
 * eleSize: 3 //because of (x, y, z)
 *
 * Further information (including mathematical properties)
 * http://en.wikipedia.org/wiki/Binary_tree
 * http://en.wikipedia.org/wiki/K-d_tree
 *
 * If you want to further minimize memory usage, remove Node.depth and replace in search algorithm with a traversal to root node (see comments at TypedArrayUtils.Kdtree.prototype.Node)
 */
TypedArrayUtils.Kdtree = function (points, metric, eleSize) {
    var self = this;
    var maxDepth = 0;
    var getPointSet = function (points, pos) {
        return points.subarray(pos * eleSize, pos * eleSize + eleSize);
    };
    function buildTree(points, depth, parent, pos) {
        var dim = depth % eleSize, median, node, plength = points.length / eleSize;
        if (depth > maxDepth)
            maxDepth = depth;
        if (plength === 0)
            return null;
        if (plength === 1) {
            return new self.Node(getPointSet(points, 0), depth, parent, pos);
        }
        TypedArrayUtils.quicksortIP(points, eleSize, dim);
        median = Math.floor(plength / 2);
        node = new self.Node(getPointSet(points, median), depth, parent, median + pos);
        node.left = buildTree(points.subarray(0, median * eleSize), depth + 1, node, pos);
        node.right = buildTree(points.subarray((median + 1) * eleSize, points.length), depth + 1, node, pos + median + 1);
        return node;
    }
    this.root = buildTree(points, 0, null, 0);
    this.getMaxDepth = function () {
        return maxDepth;
    };
    this.nearest = function (point, maxNodes, maxDistance) {
        /* point: array of size eleSize
           maxNodes: max amount of nodes to return
           maxDistance: maximum distance to point result nodes should have
           condition (Not implemented): function to test node before it's added to the result list, e.g. test for view frustum
       */
        var i, result, bestNodes;
        bestNodes = new TypedArrayUtils.Kdtree.BinaryHeap(function (e) {
            return -e[1];
        });
        function nearestSearch(node) {
            var bestChild, dimension = node.depth % eleSize, ownDistance = metric(point, node.obj), linearDistance = 0, otherChild, i, linearPoint = [];
            function saveNode(node, distance) {
                bestNodes.push([node, distance]);
                if (bestNodes.size() > maxNodes) {
                    bestNodes.pop();
                }
            }
            for (i = 0; i < eleSize; i += 1) {
                if (i === node.depth % eleSize) {
                    linearPoint[i] = point[i];
                }
                else {
                    linearPoint[i] = node.obj[i];
                }
            }
            linearDistance = metric(linearPoint, node.obj);
            // if it's a leaf
            if (node.right === null && node.left === null) {
                if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
                    saveNode(node, ownDistance);
                }
                return;
            }
            if (node.right === null) {
                bestChild = node.left;
            }
            else if (node.left === null) {
                bestChild = node.right;
            }
            else {
                if (point[dimension] < node.obj[dimension]) {
                    bestChild = node.left;
                }
                else {
                    bestChild = node.right;
                }
            }
            // recursive search
            nearestSearch(bestChild);
            if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
                saveNode(node, ownDistance);
            }
            // if there's still room or the current distance is nearer than the best distance
            if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
                if (bestChild === node.left) {
                    otherChild = node.right;
                }
                else {
                    otherChild = node.left;
                }
                if (otherChild !== null) {
                    nearestSearch(otherChild);
                }
            }
        }
        if (maxDistance) {
            for (i = 0; i < maxNodes; i += 1) {
                bestNodes.push([null, maxDistance]);
            }
        }
        nearestSearch(self.root);
        result = [];
        for (i = 0; i < maxNodes; i += 1) {
            if (bestNodes.content[i][0]) {
                result.push([bestNodes.content[i][0], bestNodes.content[i][1]]);
            }
        }
        return result;
    };
};
/**
 * If you need to free up additional memory and agree with an additional O( log n ) traversal time you can get rid of "depth" and "pos" in Node:
 * Depth can be easily done by adding 1 for every parent (care: root node has depth 0, not 1)
 * Pos is a bit tricky: Assuming the tree is balanced (which is the case when after we built it up), perform the following steps:
 *   By traversing to the root store the path e.g. in a bit pattern (01001011, 0 is left, 1 is right)
 *   From buildTree we know that "median = Math.floor( plength / 2 );", therefore for each bit...
 *     0: amountOfNodesRelevantForUs = Math.floor( (pamountOfNodesRelevantForUs - 1) / 2 );
 *     1: amountOfNodesRelevantForUs = Math.ceil( (pamountOfNodesRelevantForUs - 1) / 2 );
 *        pos += Math.floor( (pamountOfNodesRelevantForUs - 1) / 2 );
 *     when recursion done, we still need to add all left children of target node:
 *        pos += Math.floor( (pamountOfNodesRelevantForUs - 1) / 2 );
 *        and I think you need to +1 for the current position, not sure.. depends, try it out ^^
 *
 * I experienced that for 200'000 nodes you can get rid of 4 MB memory each, leading to 8 MB memory saved.
 */
TypedArrayUtils.Kdtree.prototype.Node = function (obj, depth, parent, pos) {
    this.obj = obj;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.depth = depth;
    this.pos = pos;
};
/**
 * Binary heap implementation
 * @author http://eloquentjavascript.net/appendix2.htm
 */
TypedArrayUtils.Kdtree.BinaryHeap = function (scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
};
TypedArrayUtils.Kdtree.BinaryHeap.prototype = {
    push: function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    },
    pop: function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    },
    peek: function () {
        return this.content[0];
    },
    remove: function (node) {
        var len = this.content.length;
        // To remove a value, we must search through the array to find it.
        for (var i = 0; i < len; i++) {
            if (this.content[i] == node) {
                // When it is found, the process seen in 'pop' is repeated
                // to fill up the hole.
                var end = this.content.pop();
                if (i != len - 1) {
                    this.content[i] = end;
                    if (this.scoreFunction(end) < this.scoreFunction(node)) {
                        this.bubbleUp(i);
                    }
                    else {
                        this.sinkDown(i);
                    }
                }
                return;
            }
        }
        throw new Error("Node not found.");
    },
    size: function () {
        return this.content.length;
    },
    bubbleUp: function (n) {
        // Fetch the element that has to be moved.
        var element = this.content[n];
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1, parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            else {
                // Found a parent that is less, no need to move it further.
                break;
            }
        }
    },
    sinkDown: function (n) {
        // Look up the target element and its score.
        var length = this.content.length, element = this.content[n], elemScore = this.scoreFunction(element);
        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N], child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N], child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score))
                    swap = child2N;
            }
            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            else {
                // Otherwise, we are done.
                break;
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZWRBcnJheVV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGlicy9UeXBlZEFycmF5VXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsTUFBTSxlQUFlLEdBQUc7SUFDcEIsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLElBQUk7Q0FDZixDQUFDO0FBMGxCTywwQ0FBZTtBQXhsQnhCOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILGVBQWUsQ0FBQyxXQUFXLEdBQUcsVUFBVyxHQUFHLEVBQUUsT0FBTyxFQUFFLFlBQVk7SUFFbEUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsSUFBSSxFQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUM7SUFDYixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDYixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDckMsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU1QixJQUFJLEtBQUssR0FBRyxVQUFXLENBQUMsRUFBRSxDQUFDO1FBRTFCLENBQUMsSUFBSSxPQUFPLENBQUM7UUFBQyxDQUFDLElBQUksT0FBTyxDQUFDO1FBRTNCLEtBQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRyxFQUFHO1lBRWhDLEdBQUcsR0FBRyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO1lBQ25CLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztZQUM1QixHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBQztTQUVuQjtJQUVGLENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQyxFQUFFLENB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