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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZWRBcnJheVV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvVHlwZWRBcnJheVV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLE1BQU0sZUFBZSxHQUFHO0lBQ3BCLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE1BQU0sRUFBRSxJQUFJO0NBQ2YsQ0FBQztBQTBsQk8sMENBQWU7QUF4bEJ4Qjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxlQUFlLENBQUMsV0FBVyxHQUFHLFVBQVcsR0FBRyxFQUFFLE9BQU8sRUFBRSxZQUFZO0lBRWxFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUksRUFBRSxHQUFHLENBQUUsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFNUIsSUFBSSxLQUFLLEdBQUcsVUFBVyxDQUFDLEVBQUUsQ0FBQztRQUUxQixDQUFDLElBQUksT0FBTyxDQUFDO1FBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztRQUUzQixLQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUcsRUFBRztZQUVoQyxHQUFHLEdBQUcsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztZQUNuQixHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7WUFDNUIsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxHQUFHLENBQUM7U0FFbkI7SUFFRixDQUFDLENBQUM7SUFFRixJQUFJLENBQUMsRUFB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