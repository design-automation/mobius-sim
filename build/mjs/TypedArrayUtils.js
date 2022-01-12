const TypedArrayUtils = {
    quicksortIP: null,
    Kdtree: null
};
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
export { TypedArrayUtils };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZWRBcnJheVV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGlicy9UeXBlZEFycmF5VXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxlQUFlLEdBQUc7SUFDcEIsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLElBQUk7Q0FDZixDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsZUFBZSxDQUFDLFdBQVcsR0FBRyxVQUFXLEdBQUcsRUFBRSxPQUFPLEVBQUUsWUFBWTtJQUVsRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDZixJQUFJLEVBQUUsR0FBRyxDQUFFLENBQUMsQ0FBQztJQUNiLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNyQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRTVCLElBQUksS0FBSyxHQUFHLFVBQVcsQ0FBQyxFQUFFLENBQUM7UUFFMUIsQ0FBQyxJQUFJLE9BQU8sQ0FBQztRQUFDLENBQUMsSUFBSSxPQUFPLENBQUM7UUFFM0IsS0FBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFHLEVBQUc7WUFFaEMsR0FBRyxHQUFHLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7WUFDbkIsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO1lBQzVCLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFDO1NBRW5CO0lBRUYsQ0FBQyxDQUFDO0lBRUYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxJ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