(() => {
  // packages/kartoffelgames.core/source/algorithm/a-star.ts
  var Astar = class {
    start(pStart, pEnd) {
      const lOpenNodes = new Array();
      const lOpenNodesSet = /* @__PURE__ */ new Set();
      lOpenNodes.push(pStart);
      lOpenNodesSet.add(pStart);
      const lNodePathCost = /* @__PURE__ */ new Map();
      lNodePathCost.set(pStart, 0);
      const lNodePathCostGuess = /* @__PURE__ */ new Map();
      lNodePathCostGuess.set(pStart, this.heuristic(pStart, pEnd));
      const lBestParentNodeMap = /* @__PURE__ */ new Map();
      const lProcessedNodes = new Array();
      while (lOpenNodes.length !== 0) {
        const lCurrentNode = lOpenNodes.pop();
        lOpenNodesSet.delete(lCurrentNode);
        lProcessedNodes.push(lCurrentNode);
        if (this.nodesAreEqual(lCurrentNode, pEnd)) {
          return {
            path: this.rebuildPath(lCurrentNode, lBestParentNodeMap),
            processedNodes: lProcessedNodes
          };
        }
        for (const lNeighbor of this.neighborNodes(lCurrentNode)) {
          const lTentativePathCost = (lNodePathCost.get(lCurrentNode) ?? Number.MAX_SAFE_INTEGER) + this.costOfTraversal(lNeighbor, lCurrentNode);
          const lNeighborPathCost = lNodePathCost.get(lNeighbor) ?? Number.MAX_SAFE_INTEGER;
          if (lTentativePathCost >= lNeighborPathCost) {
            continue;
          }
          lBestParentNodeMap.set(lNeighbor, lCurrentNode);
          lNodePathCost.set(lNeighbor, lTentativePathCost);
          lNodePathCostGuess.set(lNeighbor, lTentativePathCost + this.heuristic(lNeighbor, pEnd));
          if (!lOpenNodesSet.has(lNeighbor)) {
            lOpenNodesSet.add(lNeighbor);
            this.insertNodeSorted(lOpenNodes, lNeighbor, lNodePathCostGuess);
          }
        }
      }
      return {
        path: new Array(),
        processedNodes: lProcessedNodes
      };
    }
    /**
       * Add node into an array in order from highest to lowest cost where the highest cost is on index [0].
       * 
       * @param pTargetArray - Target array.
       * @param pNode - Node to add.
       * @param pCostMapping - The cost mapping for each node.
       */
    insertNodeSorted(pTargetArray, pNode, pCostMapping) {
      const lNodeCost = pCostMapping.get(pNode) ?? Number.MAX_SAFE_INTEGER;
      const lCostOfIndex = (pIndex) => {
        return pCostMapping.get(pTargetArray[pIndex]) ?? Number.MAX_SAFE_INTEGER;
      };
      const lTargetIndex = (() => {
        if (pTargetArray.length === 0 || lNodeCost > lCostOfIndex(0)) {
          return 0;
        }
        if (lNodeCost < lCostOfIndex(pTargetArray.length - 1)) {
          return pTargetArray.length;
        }
        let lMinIndex = 0;
        let lMaxIndex = pTargetArray.length - 1;
        while (lMinIndex <= lMaxIndex) {
          const lCenterIndex = lMaxIndex + lMinIndex >> 1;
          if (lNodeCost < lCostOfIndex(lCenterIndex)) {
            lMinIndex = lCenterIndex + 1;
          } else if (lNodeCost > lCostOfIndex(lCenterIndex)) {
            lMaxIndex = lCenterIndex - 1;
          } else {
            return lCenterIndex;
          }
        }
        return -lMinIndex - 1;
      })();
      pTargetArray.splice(lTargetIndex, 0, pNode);
    }
    /**
       * Rebuild path back until start.
       * 
       * @param pEndNode - End node of path.
       * @param pParentMap - Backwards mapping of node to parent for each traversed node.
       * 
       * @returns the path from start to end. 
       */
    rebuildPath(pEndNode, pParentMap) {
      const lReversePath = new Array();
      let lCurrentNode = pEndNode;
      do {
        lReversePath.push(lCurrentNode);
      } while (!!(lCurrentNode = pParentMap.get(lCurrentNode)));
      return lReversePath.reverse();
    }
  };

  // packages/kartoffelgames.core/page/source/index.ts
  var PageAstar = class extends Astar {
    mCostOfTraversal;
    mHeuristic;
    mNodeMap;
    mObstacleKeys;
    /**
       * Create a page astar instance.
       *
       * @param pParameter - Astar configuration.
       */
    constructor(pParameter) {
      super();
      this.mCostOfTraversal = pParameter.costOfTraversal;
      this.mHeuristic = pParameter.heuristic;
      this.mNodeMap = pParameter.nodeMap;
      this.mObstacleKeys = pParameter.obstacleKeys;
    }
    /**
       * Calculate traversal cost between two neighbor nodes.
       *
       * @param pNode - Target node.
       * @param pCurrentNode - Current node.
       *
       * @returns Traversal cost.
       */
    costOfTraversal(pNode, pCurrentNode) {
      return this.mCostOfTraversal(pNode, pCurrentNode);
    }
    /**
       * Calculate the heuristic between two nodes.
       *
       * @param pCurrentNode - Current node.
       * @param pEndNode - End node.
       *
       * @returns Heuristic cost.
       */
    heuristic(pCurrentNode, pEndNode) {
      return this.mHeuristic(pCurrentNode, pEndNode);
    }
    /**
       * Get walkable neighbor nodes.
       *
       * @param pNode - Source node.
       *
       * @returns Neighbor nodes.
       */
    neighborNodes(pNode) {
      const lNeighborNodes = new Array();
      const lNeighborCoordinates = [
        {
          x: pNode.x,
          y: pNode.y - 1
        },
        {
          x: pNode.x - 1,
          y: pNode.y
        },
        {
          x: pNode.x + 1,
          y: pNode.y
        },
        {
          x: pNode.x,
          y: pNode.y + 1
        }
      ];
      for (const lCoordinate of lNeighborCoordinates) {
        const lKey = AstarGrid.nodeKey(lCoordinate);
        if (lCoordinate.x < 0 || lCoordinate.x >= AstarGrid.GRID_SIZE || lCoordinate.y < 0 || lCoordinate.y >= AstarGrid.GRID_SIZE || this.mObstacleKeys.has(lKey)) {
          continue;
        }
        let lNode = this.mNodeMap.get(lKey);
        if (!lNode) {
          lNode = lCoordinate;
          this.mNodeMap.set(lKey, lNode);
        }
        lNeighborNodes.push(lNode);
      }
      return lNeighborNodes;
    }
    /**
       * Compare two nodes by coordinate.
       *
       * @param pNodeA - First node.
       * @param pNodeB - Second node.
       *
       * @returns True when both nodes share coordinates.
       */
    nodesAreEqual(pNodeA, pNodeB) {
      return pNodeA.x === pNodeB.x && pNodeA.y === pNodeB.y;
    }
  };
  var AstarGrid = class _AstarGrid {
    static COST_OF_TRAVERSAL_CODE = "return 1;";
    static GRID_SIZE = 51;
    static HEURISTIC_CODE = "return Math.abs(currentNode.x - endNode.x) + Math.abs(currentNode.y - endNode.y);";
    /**
       * Build the stable key of a node.
       *
       * @param pNode - Source node.
       *
       * @returns Node key.
       */
    static nodeKey(pNode) {
      return `${pNode.x}|${pNode.y}`;
    }
    mCellElements;
    mCostOfTraversalFunction;
    mDragObstacleState;
    mEndNode;
    mGridElement;
    mHeuristicFunction;
    mObstacleKeys;
    mStartNode;
    /**
       * Create a rendered astar grid.
       *
       * @param pGridElement - Grid root element.
       * @param pCostOfTraversalElement - Cost editor element.
       * @param pHeuristicElement - Heuristic editor element.
       */
    constructor(pGridElement, pCostOfTraversalElement, pHeuristicElement) {
      this.mCellElements = /* @__PURE__ */ new Map();
      this.mCostOfTraversalFunction = this.compileTraversalCost(_AstarGrid.COST_OF_TRAVERSAL_CODE);
      this.mDragObstacleState = void 0;
      this.mEndNode = {
        x: 50,
        y: 25
      };
      this.mGridElement = pGridElement;
      this.mHeuristicFunction = this.compileHeuristic(_AstarGrid.HEURISTIC_CODE);
      this.mObstacleKeys = /* @__PURE__ */ new Set();
      this.mStartNode = {
        x: 0,
        y: 25
      };
      pCostOfTraversalElement.value = _AstarGrid.COST_OF_TRAVERSAL_CODE;
      pHeuristicElement.value = _AstarGrid.HEURISTIC_CODE;
      pCostOfTraversalElement.addEventListener("change", () => {
        this.mCostOfTraversalFunction = this.compileTraversalCost(pCostOfTraversalElement.value);
        this.renderPath();
      });
      pHeuristicElement.addEventListener("change", () => {
        this.mHeuristicFunction = this.compileHeuristic(pHeuristicElement.value);
        this.renderPath();
      });
      document.addEventListener("pointerup", () => {
        this.mDragObstacleState = void 0;
      });
      document.addEventListener("pointercancel", () => {
        this.mDragObstacleState = void 0;
      });
      this.renderGrid();
      this.renderPath();
    }
    /**
       * Compile heuristic editor code.
       *
       * @param pCode - Function body code.
       *
       * @returns Compiled heuristic function.
       */
    compileHeuristic(pCode) {
      return Function("currentNode", "endNode", pCode);
    }
    /**
       * Compile traversal cost editor code.
       *
       * @param pCode - Function body code.
       *
       * @returns Compiled traversal cost function.
       */
    compileTraversalCost(pCode) {
      return Function("node", "currentNode", pCode);
    }
    /**
       * Create an interactive grid cell.
       *
       * @param pNode - Node represented by the cell.
       *
       * @returns Created cell element.
       */
    createCell(pNode) {
      const lCellElement = document.createElement("button");
      lCellElement.className = "astar-page__grid-cell";
      lCellElement.type = "button";
      lCellElement.dataset["key"] = _AstarGrid.nodeKey(pNode);
      lCellElement.addEventListener("pointerdown", (pEvent) => {
        if (pEvent.button !== 0 || this.nodesAreEqual(pNode, this.mStartNode) || this.nodesAreEqual(pNode, this.mEndNode)) {
          return;
        }
        pEvent.preventDefault();
        this.mDragObstacleState = !this.mObstacleKeys.has(_AstarGrid.nodeKey(pNode));
        this.setObstacle(pNode, this.mDragObstacleState);
      });
      lCellElement.addEventListener("pointerenter", (pEvent) => {
        if (this.mDragObstacleState === void 0) {
          return;
        }
        if ((pEvent.buttons & 1) !== 1) {
          this.mDragObstacleState = void 0;
          return;
        }
        this.setObstacle(pNode, this.mDragObstacleState);
      });
      return lCellElement;
    }
    /**
       * Compare two nodes by coordinate.
       *
       * @param pNodeA - First node.
       * @param pNodeB - Second node.
       *
       * @returns True when both nodes share coordinates.
       */
    nodesAreEqual(pNodeA, pNodeB) {
      return pNodeA.x === pNodeB.x && pNodeA.y === pNodeB.y;
    }
    /**
       * Calculate the processed cell lightness.
       *
       * @param pProcessedCount - Amount of processing passes.
       *
       * @returns CSS lightness value.
       */
    processedLightness(pProcessedCount) {
      return `${Math.max(34, 66 - (pProcessedCount - 1) * 10)}%`;
    }
    /**
       * Render the static grid cells.
       */
    renderGrid() {
      for (let lY = 0; lY < _AstarGrid.GRID_SIZE; lY++) {
        for (let lX = 0; lX < _AstarGrid.GRID_SIZE; lX++) {
          const lNode = {
            x: lX,
            y: lY
          };
          const lCellElement = this.createCell(lNode);
          this.mCellElements.set(_AstarGrid.nodeKey(lNode), lCellElement);
          this.mGridElement.appendChild(lCellElement);
        }
      }
    }
    /**
       * Run Astar and update cell states.
       */
    renderPath() {
      const lNodeMap = /* @__PURE__ */ new Map();
      lNodeMap.set(_AstarGrid.nodeKey(this.mStartNode), this.mStartNode);
      lNodeMap.set(_AstarGrid.nodeKey(this.mEndNode), this.mEndNode);
      const lAstar = new PageAstar({
        costOfTraversal: this.mCostOfTraversalFunction,
        heuristic: this.mHeuristicFunction,
        nodeMap: lNodeMap,
        obstacleKeys: this.mObstacleKeys
      });
      const lResult = lAstar.start(this.mStartNode, this.mEndNode);
      const lPathKeys = new Set(lResult.path.map((pNode) => _AstarGrid.nodeKey(pNode)));
      const lProcessedCounts = /* @__PURE__ */ new Map();
      for (const lProcessedNode of lResult.processedNodes) {
        const lKey = _AstarGrid.nodeKey(lProcessedNode);
        lProcessedCounts.set(lKey, (lProcessedCounts.get(lKey) ?? 0) + 1);
      }
      for (const [lKey, lCellElement] of this.mCellElements.entries()) {
        const lProcessedCount = lProcessedCounts.get(lKey) ?? 0;
        lCellElement.classList.toggle("astar-page__grid-cell--blocked", this.mObstacleKeys.has(lKey));
        lCellElement.classList.toggle("astar-page__grid-cell--end", lKey === _AstarGrid.nodeKey(this.mEndNode));
        lCellElement.classList.toggle("astar-page__grid-cell--path", lPathKeys.has(lKey));
        lCellElement.classList.toggle("astar-page__grid-cell--processed", lProcessedCount > 0);
        lCellElement.classList.toggle("astar-page__grid-cell--start", lKey === _AstarGrid.nodeKey(this.mStartNode));
        lCellElement.style.setProperty("--processed-lightness", this.processedLightness(lProcessedCount));
      }
    }
    /**
       * Set obstacle state for one node.
       *
       * @param pNode - Target node.
       * @param pIsObstacle - New obstacle state.
       */
    setObstacle(pNode, pIsObstacle) {
      const lKey = _AstarGrid.nodeKey(pNode);
      if (this.nodesAreEqual(pNode, this.mStartNode) || this.nodesAreEqual(pNode, this.mEndNode) || this.mObstacleKeys.has(lKey) === pIsObstacle) {
        return;
      }
      if (pIsObstacle) {
        this.mObstacleKeys.add(lKey);
      } else {
        this.mObstacleKeys.delete(lKey);
      }
      this.renderPath();
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    new AstarGrid(document.querySelector(".astar-page__grid"), document.querySelector("#cost-of-traversal"), document.querySelector("#heuristic"));
  });
})();
//# sourceMappingURL=page.js.map
