var Page;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./page/source/index.ts":
/*!******************************!*\
  !*** ./page/source/index.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
/* eslint-disable no-console */
const web_database_identity_decorator_1 = __webpack_require__(/*! ../../source/web_database/layout/web-database-identity.decorator */ "./source/web_database/layout/web-database-identity.decorator.ts");
const web_database_index_decorator_1 = __webpack_require__(/*! ../../source/web_database/layout/web-database-index.decorator */ "./source/web_database/layout/web-database-index.decorator.ts");
const web_database_1 = __webpack_require__(/*! ../../source/web_database/web-database */ "./source/web_database/web-database.ts");
class TestTableOne {
  whatMyId() {
    return this.id;
  }
}
__decorate([(0, web_database_identity_decorator_1.WebDatabaseIdentity)(true), __metadata("design:type", Number)], TestTableOne.prototype, "id", void 0);
__decorate([(0, web_database_index_decorator_1.WebDatabaseIndex)(true), __metadata("design:type", String)], TestTableOne.prototype, "name", void 0);
__decorate([(0, web_database_index_decorator_1.WebDatabaseIndex)(), __metadata("design:type", Number)], TestTableOne.prototype, "price", void 0);
__decorate([(0, web_database_index_decorator_1.WebDatabaseIndex)(), __metadata("design:type", Array)], TestTableOne.prototype, "types", void 0);
class TestTableTwo {}
__decorate([(0, web_database_index_decorator_1.WebDatabaseIndex)(true), __metadata("design:type", String)], TestTableTwo.prototype, "nameThing", void 0);
(() => {
  const lDatabase = new web_database_1.WebDatabase('MainDB', [TestTableOne, TestTableTwo]);
  lDatabase.transaction([TestTableOne, TestTableTwo], 'readwrite', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (pTransaction) {
      const lTestTableOne = pTransaction.table(TestTableOne);
      const lTestTableTwo = pTransaction.table(TestTableTwo);
      yield lTestTableOne.clear();
      yield lTestTableTwo.clear();
      // Create random data.
      for (let lCounter = 0; lCounter < 100; lCounter++) {
        const lData = new TestTableOne();
        lData.name = Math.random().toString(16);
        lData.price = Math.random();
        lData.types = [1, 2, 3].slice(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
        lData.notIndexed = Math.random().toString(16);
        yield lTestTableOne.put(lData);
      }
      console.log(yield lTestTableOne.count(), yield lTestTableOne.getAll());
      console.log(yield lTestTableOne.where('types').is(2).and('price').between(0, 0.5).execute());
      // Create random data.
      for (let lCounter = 0; lCounter < 100; lCounter++) {
        const lData = new TestTableTwo();
        lData.nameThing = Math.random().toString(16);
        yield lTestTableTwo.put(lData);
      }
    });
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
})();

/***/ }),

/***/ "./source/web_database/layout/web-database-identity.decorator.ts":
/*!***********************************************************************!*\
  !*** ./source/web_database/layout/web-database-identity.decorator.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabaseIdentity = WebDatabaseIdentity;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const web_database_table_layout_1 = __webpack_require__(/*! ./web-database-table-layout */ "./source/web_database/layout/web-database-table-layout.ts");
// Needed for type metadata.
core_dependency_injection_1.Injector.Initialize();
/**
 * AtScript.
 * Add identity to table type.
 */
function WebDatabaseIdentity(pAutoIncrement) {
  return function (pTarget, pPropertyKey) {
    // Usually Class Prototype. Globaly.
    const lPrototype = pTarget;
    const lTableType = lPrototype.constructor;
    // Decorator can not be used on static propertys.
    if (typeof pTarget === 'function') {
      throw new core_1.Exception('Identity property can not be a static property.', WebDatabaseIdentity);
    }
    const lTableLayout = new web_database_table_layout_1.WebDatabaseTableLayout();
    // Add table type identity to layout.
    lTableLayout.setTableIdentity(lTableType, pPropertyKey, pAutoIncrement);
  };
}

/***/ }),

/***/ "./source/web_database/layout/web-database-index.decorator.ts":
/*!********************************************************************!*\
  !*** ./source/web_database/layout/web-database-index.decorator.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabaseIndex = WebDatabaseIndex;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const web_database_table_layout_1 = __webpack_require__(/*! ./web-database-table-layout */ "./source/web_database/layout/web-database-table-layout.ts");
/**
 * AtScript.
 * Add index to table type.
 * Indices with the same names are grouped.
 */
function WebDatabaseIndex(pUnique = false, pName) {
  return function (pTarget, pPropertyKey) {
    // Usually Class Prototype. Globaly.
    const lPrototype = pTarget;
    const lTableType = lPrototype.constructor;
    // Decorator can not be used on static propertys.
    if (typeof pTarget === 'function') {
      throw new core_1.Exception('Identity property can not be a static property.', WebDatabaseIndex);
    }
    const lTableLayout = new web_database_table_layout_1.WebDatabaseTableLayout();
    // Default the index name to the property key.
    const lIndexName = pName ?? pPropertyKey;
    // Add table type index to layout.
    lTableLayout.setTableIndex(lTableType, pPropertyKey, lIndexName, pUnique);
  };
}

/***/ }),

/***/ "./source/web_database/layout/web-database-table-layout.ts":
/*!*****************************************************************!*\
  !*** ./source/web_database/layout/web-database-table-layout.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabaseTableLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
/**
 * Singleton. Table layout and settings.
 */
class WebDatabaseTableLayout {
  /**
   * Constructor.
   */
  constructor() {
    if (WebDatabaseTableLayout.mInstance) {
      return WebDatabaseTableLayout.mInstance;
    }
    WebDatabaseTableLayout.mInstance = this;
    // Init lists.
    this.mTableConfigs = new core_1.Dictionary();
  }
  /**
   * Get table configuration of type.
   *
   * @param pType - Table type.
   *
   * @returns table type config.
   */
  configOf(pType) {
    // Table type is not initialized.
    if (!this.mTableConfigs.has(pType)) {
      throw new core_1.Exception('Table type not defined.', this);
    }
    const lTableConfiguration = this.mTableConfigs.get(pType);
    // Validate idenitiy. Must happend after decoration so all metadata of the table has been loaded.
    // Validate only when identity was user configurated.
    if (lTableConfiguration.identity.configurated) {
      // Type must be string or number.
      const lPropertyType = core_dependency_injection_1.Metadata.get(pType).getProperty(lTableConfiguration.identity.key).type;
      if (lPropertyType === null || lPropertyType !== String && lPropertyType !== Number) {
        throw new core_1.Exception('Identity property must be a number or string type', this);
      }
      // Auto incrementing identity must be a number.
      if (lTableConfiguration.identity.key && lPropertyType !== Number) {
        throw new core_1.Exception('Identity property with auto increment must be a number type', this);
      }
    }
    // Validate all indices.
    for (const lIndex of lTableConfiguration.indices.values()) {
      for (const lIndexKey of lIndex.keys) {
        // Type must be string or number.
        const lPropertyType = core_dependency_injection_1.Metadata.get(pType).getProperty(lIndexKey).type;
        if (lPropertyType === null) {
          throw new core_1.Exception('Index property must have a type', this);
        }
        // Disable multientry when any key is not a array.
        if (lPropertyType !== Array) {
          lIndex.options.multiEntity = false;
        }
      }
    }
    return lTableConfiguration;
  }
  /**
   * Set table type identity.
   *
   * @param pType - Table type.
   * @param pKey - Key of identity.
   * @param pAutoIncrement - Autoincrement identity.
   *
   * @throws {@link Exception} - When a identitfier for this type is already set.
   */
  setTableIdentity(pType, pKey, pAutoIncrement) {
    // Initialize table type.
    this.initializeTableType(pType);
    // Read table config and restrict to one identity.
    const lTableConfig = this.mTableConfigs.get(pType);
    if (lTableConfig.identity.configurated) {
      throw new core_1.Exception(`A table type can only have one identifier.`, this);
    }
    // Set table type identity.
    lTableConfig.identity = {
      key: pKey,
      autoIncrement: pAutoIncrement,
      configurated: true
    };
  }
  /**
   * Set table type identity.
   *
   * @param pType - Table type.
   * @param pKey - Key of identity.
   * @param pName - Index name.
   * @param pIsArray - Property is key.
   * @param pIsUnique - Index should be unique.
   */
  setTableIndex(pType, pKey, pName, pIsUnique) {
    // Initialize table type.
    this.initializeTableType(pType);
    // Read table config.
    const lTableConfig = this.mTableConfigs.get(pType);
    // Initialize index.
    let lIndexConfig = lTableConfig.indices.get(pName);
    if (!lIndexConfig) {
      // Set default configuration where anything is enabled.
      lIndexConfig = {
        name: pName,
        keys: new Array(),
        options: {
          unique: true,
          multiEntity: true
        }
      };
      // Link index to table config.
      lTableConfig.indices.set(pName, lIndexConfig);
    }
    // Add key to index.
    lIndexConfig.keys.push(pKey);
    // Disable multientiy when key is not a array or more than one key is set for the same index.
    if (lIndexConfig.keys.length > 1) {
      lIndexConfig.options.multiEntity = false;
    }
    // Index is not unique when one index is not unique.
    if (!pIsUnique) {
      lIndexConfig.options.unique = false;
    }
  }
  /**
   * Initialize table type.
   * Does nothing when the type is allready initialized.
   *
   * @param pType - Table type.
   */
  initializeTableType(pType) {
    // Table type is allready initialized.
    if (this.mTableConfigs.has(pType)) {
      return;
    }
    // Add type reference.
    this.mTableConfigs.set(pType, {
      // Set default identity key.
      identity: {
        key: '__ID__',
        autoIncrement: true,
        configurated: false
      },
      indices: new core_1.Dictionary()
    });
  }
}
exports.WebDatabaseTableLayout = WebDatabaseTableLayout;

/***/ }),

/***/ "./source/web_database/query/web-database-query-action.ts":
/*!****************************************************************!*\
  !*** ./source/web_database/query/web-database-query-action.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabaseQueryAction = void 0;
class WebDatabaseQueryAction {
  /**
   * Constructor.
   *
   * @param pActionCallback - Callback to send back action of query.
   * @param pQuery - Parent query.
   */
  constructor(pQuery, pActionCallback) {
    this.mActionCallback = pActionCallback;
    this.mDatabaseQuery = pQuery;
  }
  /**
   * Request rows with the value between lower and upper value.
   *
   * @param pLowerValue - Lower value.
   * @param pUpperValue - Upper value.
   *
   * @returns query.
   */
  between(pLowerValue, pUpperValue) {
    // Create database range action.
    const lAction = IDBKeyRange.bound(pLowerValue, pUpperValue, false, false);
    // Send action to parent query.
    this.mActionCallback(lAction);
    // Return parent query to chain another.
    return this.mDatabaseQuery;
  }
  /**
   * Request rows with the value greather than {@link pValue}.
   *
   * @param pValue - Value.
   *
   * @returns query.
   */
  greaterThan(pValue) {
    // Create database range action.
    const lAction = IDBKeyRange.lowerBound(pValue, false);
    // Send action to parent query.
    this.mActionCallback(lAction);
    // Return parent query to chain another.
    return this.mDatabaseQuery;
  }
  /**
   * Request rows with the exact value.
   *
   * @param pValue - Value.
   *
   * @returns query.
   */
  is(pValue) {
    // Create database range action.
    const lAction = IDBKeyRange.only(pValue);
    // Send action to parent query.
    this.mActionCallback(lAction);
    // Return parent query to chain another.
    return this.mDatabaseQuery;
  }
  /**
   * Request rows with the value lower than {@link pValue}.
   *
   * @param pValue - Value.
   *
   * @returns query.
   */
  lowerThan(pValue) {
    // Create database range action.
    const lAction = IDBKeyRange.upperBound(pValue, false);
    // Send action to parent query.
    this.mActionCallback(lAction);
    // Return parent query to chain another.
    return this.mDatabaseQuery;
  }
}
exports.WebDatabaseQueryAction = WebDatabaseQueryAction;

/***/ }),

/***/ "./source/web_database/query/web-database-query.ts":
/*!*********************************************************!*\
  !*** ./source/web_database/query/web-database-query.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabaseQuery = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const web_database_query_action_1 = __webpack_require__(/*! ./web-database-query-action */ "./source/web_database/query/web-database-query-action.ts");
class WebDatabaseQuery {
  /**
   * Constructor.
   *
   * @param pTable - Table of query.
   */
  constructor(pTable) {
    this.mTable = pTable;
    this.mQueryList = new Array();
  }
  /**
   * Chain database query with "AND".
   *
   * @param pIndexOrPropertyName - A index or a property name.
   *
   * @returns query action.
   */
  and(pIndexOrPropertyName) {
    // Create query part.
    const lPart = {
      indexKey: pIndexOrPropertyName,
      action: null,
      link: 'AND'
    };
    // Add part to query list.
    this.mQueryList.push(lPart);
    // Create query action that sets the action on a chained call.
    return new web_database_query_action_1.WebDatabaseQueryAction(this, pAction => {
      lPart.action = pAction;
    });
  }
  /**
   * Execute query and get all values.
   *
   * @returns filtered query result.
   */
  execute() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Must have queries.
      if (_this.mQueryList.length === 0) {
        throw new core_1.Exception('No queries specified.', _this);
      }
      // Devide queries into "AND" blocks.
      const lQueryBlockList = new Array();
      // Add first block.
      lQueryBlockList.push(new Array());
      // Assign every query into a block.
      for (const lQuery of _this.mQueryList) {
        // Create new block on any or chain.
        if (lQuery.link === 'OR') {
          lQueryBlockList.push(new Array());
        }
        // Add query to latest block.
        lQueryBlockList.at(-1).push(lQuery);
      }
      // Special solution for single query single block queries.
      // Not neet to filter or merge.
      if (lQueryBlockList.length === 1 && lQueryBlockList[0].length === 1) {
        // Read and convert single block.
        return _this.convertDataToTableType(yield _this.readQuery(lQueryBlockList[0][0]));
      }
      // Special solution for single block queries.
      // No need to merge.
      if (lQueryBlockList.length === 1) {
        const lQueryResult = yield _this.readQueryBlock(lQueryBlockList[0]);
        // Read and convert single block.
        return _this.convertDataToTableType(lQueryResult.values());
      }
      // Read all query blocks.
      const lQueryBlockResultList = new Set();
      for (const lQueryBlock of lQueryBlockList) {
        lQueryBlockResultList.add(yield _this.readQueryBlock(lQueryBlock));
      }
      // Find the greatest result set and use it as starting point.
      // Greater performance when you only need to merge 1 entry in a set of 100 instead.
      let lGreatestResultSet = null; // Will be set after the loop.
      for (const lQueryBlockResult of lQueryBlockResultList) {
        if (!lGreatestResultSet) {
          lGreatestResultSet = lQueryBlockResult;
          continue;
        }
        if (lGreatestResultSet.size < lQueryBlockResult.size) {
          lGreatestResultSet = lQueryBlockResult;
        }
      }
      // Remove the found set from iterator list.
      lQueryBlockResultList.delete(lGreatestResultSet);
      // Merge remaining block result into.
      for (const lQueryBlockResult of lQueryBlockResultList) {
        for (const lQueryResultItem of lQueryBlockResult) {
          lGreatestResultSet.set(...lQueryResultItem);
        }
      }
      // Convert merged block.
      return _this.convertDataToTableType(lGreatestResultSet.values());
    })();
  }
  /**
   * Chain database query with "OR".
   *
   * @param pIndexOrPropertyName - A index or a property name.
   *
   * @returns query action.
   */
  or(pIndexOrPropertyName) {
    // Create query part.
    const lPart = {
      indexKey: pIndexOrPropertyName,
      action: null,
      link: 'OR'
    };
    // Add part to query list.
    this.mQueryList.push(lPart);
    // Create query action that sets the action on a chained call.
    return new web_database_query_action_1.WebDatabaseQueryAction(this, pAction => {
      lPart.action = pAction;
    });
  }
  /**
   * Convert all data items into table type objects.
   *
   * @param pData - Data objects.
   *
   * @returns converted data list.
   */
  convertDataToTableType(pData) {
    const lResultList = new Array();
    // Convert each item into type.
    for (const lSourceObject of pData) {
      const lTargetObject = new this.mTable.tableType();
      for (const lKey of Object.keys(lSourceObject)) {
        lTargetObject[lKey] = lSourceObject[lKey];
      }
      lResultList.push(lTargetObject);
    }
    return lResultList;
  }
  /**
   * Read data from table filtered by query.
   * When query index does not exists, it uses a expensive cursor filter.
   *
   * @param pQuery - Query.
   *
   * @returns Filtered item list.
   */
  readQuery(pQuery) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // Query must have a action.
      if (!pQuery.action) {
        throw new core_1.Exception('Query has no assigned action.', _this2);
      }
      // Get table connection.
      const lTableConnection = _this2.mTable.transaction.transaction.objectStore(_this2.mTable.tableType.name);
      // Try to find index key.
      const lIndexName = (() => {
        const lIndexNameList = lTableConnection.indexNames;
        for (let lIndexNameListIndex = 0; lIndexNameListIndex < lIndexNameList.length; lIndexNameListIndex++) {
          const lIndexName = lIndexNameList[lIndexNameListIndex];
          if (lIndexName === pQuery.indexKey) {
            return lIndexName;
          }
        }
        return null;
      })();
      // When index was found, use index.
      if (lIndexName) {
        const lIndex = lTableConnection.index(lIndexName);
        // Execute read request with the set query action.
        const lRequest = lIndex.getAll(pQuery.action);
        return new Promise((pResolve, pReject) => {
          // Reject on error.
          lRequest.addEventListener('error', pEvent => {
            const lTarget = pEvent.target;
            pReject(new core_1.Exception(`Error fetching table.` + lTarget.error, _this2));
          });
          // Resolve on success.
          lRequest.addEventListener('success', pEvent => {
            // Read event target like a shithead.
            const lTarget = pEvent.target;
            pResolve(lTarget.result);
          });
        });
      }
      // When no index was found you fucked up.
      // Read anything and filter.
      const lCursorRequest = lTableConnection.openCursor();
      const lFiteredList = new Array();
      return new Promise((pResolve, pReject) => {
        // Reject on error.
        lCursorRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception(`Error fetching table.` + lTarget.error, _this2));
        });
        // Resolve on success.
        lCursorRequest.addEventListener('success', pEvent => {
          // Read event target like a shithead and resolve when cursor is eof.
          const lTarget = pEvent.target;
          const lCursorResult = lTarget.result;
          if (!lCursorResult) {
            pResolve(lFiteredList);
            return;
          }
          // Get value of filtered propery.
          const lFiltedValue = lCursorResult.value[pQuery.indexKey];
          // Append row when value is included in assigned action.
          if (pQuery.action.includes(lFiltedValue)) {
            lFiteredList.push(lCursorResult.value);
          }
          // Continue next value.
          lCursorResult.continue();
        });
      });
    })();
  }
  /**
   * Read the result of a query block.
   *
   * @param pBlock - Query block. Queries that are linked with an "AND"-Connection.
   *
   * return filtered query result.
   */
  readQueryBlock(pBlock) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      const lTableConnection = _this3.mTable.transaction.transaction.objectStore(_this3.mTable.tableType.name);
      // Read all queries in parallel.
      const lQueryResultRequestList = new Array();
      for (const lQuery of pBlock) {
        lQueryResultRequestList.push(_this3.readQuery(lQuery));
      }
      // Wait for all queries to finish.
      const lQueryResultList = yield Promise.all(lQueryResultRequestList);
      // Get key of identity, identity is allways set and a single key.
      const lIdentityKey = lTableConnection.keyPath;
      // Conver all result list into an identity map.
      const lIdentityMapList = new Array();
      for (const lQueryResult of lQueryResultList) {
        // Map each item with its identity.
        const lItemMap = new core_1.Dictionary();
        for (const lItem of lQueryResult) {
          lItemMap.set(lItem[lIdentityKey], lItem);
        }
        lIdentityMapList.push(lItemMap);
      }
      // Find the smallest identity set.
      let lSmallestItemSet = lIdentityMapList[0];
      for (const lIdentityMap of lIdentityMapList) {
        if (lIdentityMap.size < lSmallestItemSet.size) {
          lSmallestItemSet = lIdentityMap;
        }
      }
      // Remove smallest identity set from map list.
      lIdentityMapList.splice(lIdentityMapList.indexOf(lSmallestItemSet), 1);
      // Filter the smallest set for each remaining query.
      for (const lFilteringQuery of lIdentityMapList) {
        // Remove item from result list, when it does not exists in any other query result.
        for (const lResultItemKey of lSmallestItemSet.keys()) {
          if (!lFilteringQuery.has(lResultItemKey)) {
            lSmallestItemSet.delete(lResultItemKey);
          }
        }
      }
      return lSmallestItemSet;
    })();
  }
}
exports.WebDatabaseQuery = WebDatabaseQuery;

/***/ }),

/***/ "./source/web_database/web-database-table.ts":
/*!***************************************************!*\
  !*** ./source/web_database/web-database-table.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabaseTable = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const web_database_table_layout_1 = __webpack_require__(/*! ./layout/web-database-table-layout */ "./source/web_database/layout/web-database-table-layout.ts");
const web_database_query_1 = __webpack_require__(/*! ./query/web-database-query */ "./source/web_database/query/web-database-query.ts");
class WebDatabaseTable {
  /**
   * Get table type.
   */
  get tableType() {
    return this.mTableType;
  }
  /**
   * Get transaction.
   */
  get transaction() {
    return this.mTransaction;
  }
  /**
   * Constructor.
   *
   * @param pType - Table type.
   * @param pDatabase - Database.
   */
  constructor(pType, pTransaction) {
    this.mTableType = pType;
    this.mTransaction = pTransaction;
    this.mTableLayout = new web_database_table_layout_1.WebDatabaseTableLayout();
  }
  /**
   * Clear table data.
   */
  clear() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Get table connection.
      const lTable = _this.mTransaction.transaction.objectStore(_this.mTableType.name);
      // Clear data data.
      const lRequest = lTable.clear();
      // Wait for completion.
      return new Promise((pResolve, pReject) => {
        // Reject on error.
        lRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception(`Error clearing table data.` + lTarget.error, _this));
        });
        lRequest.addEventListener('success', () => {
          pResolve();
        });
      });
    })();
  }
  /**
   * Get row count of table.
   */
  count() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // Get table connection.
      const lTable = _this2.mTransaction.transaction.objectStore(_this2.mTableType.name);
      // Clear data data.
      const lRequest = lTable.count();
      // Wait for completion.
      return new Promise((pResolve, pReject) => {
        // Reject on error.
        lRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception(`Error counting table rows.` + lTarget.error, _this2));
        });
        // Resolve on success.
        lRequest.addEventListener('success', pEvent => {
          // Read event target like a shithead.
          const lTarget = pEvent.target;
          pResolve(lTarget.result);
        });
      });
    })();
  }
  /**
   * Delete data.
   *
   * @param pData - Data. Must be an instance of the table type.
   */
  delete(pData) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      // Validate data type.
      if (!(pData instanceof _this3.mTableType)) {
        throw new core_1.Exception(`Invalid data type.`, _this3);
      }
      // Get identity value from data.
      const lTableLayout = _this3.mTableLayout.configOf(_this3.mTableType);
      const lIdentityProperty = lTableLayout.identity.key;
      const lIdentityValue = pData[lIdentityProperty];
      // Get table connection.
      const lTable = _this3.mTransaction.transaction.objectStore(_this3.mTableType.name);
      // Delete data.
      const lRequest = lTable.delete(lIdentityValue);
      // Wait for completion.
      return new Promise((pResolve, pReject) => {
        // Reject on error.
        lRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception(`Error deleting data.` + lTarget.error, _this3));
        });
        // Resolve on success.
        lRequest.addEventListener('success', () => {
          pResolve();
        });
      });
    })();
  }
  /**
   * Get all table data. Can be limited by count.
   */
  getAll(pCount) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      // Get table connection.
      const lTable = _this4.mTransaction.transaction.objectStore(_this4.mTableType.name);
      // Clear data data.
      const lRequest = lTable.getAll(null, pCount);
      // Wait for completion.
      return new Promise((pResolve, pReject) => {
        // Reject on error.
        lRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception(`Error fetching table.` + lTarget.error, _this4));
        });
        // Resolve on success.
        lRequest.addEventListener('success', pEvent => {
          // Read event target like a shithead.
          const lTarget = pEvent.target;
          // Convert each item into type.
          const lResult = lTarget.result.map(pSourceObject => {
            const lTargetObject = new _this4.mTableType();
            for (const lKey of Object.keys(pSourceObject)) {
              lTargetObject[lKey] = pSourceObject[lKey];
            }
            return lTargetObject;
          });
          // Resolve converted data.
          pResolve(lResult);
        });
      });
    })();
  }
  /**
   * Put data.
   *
   * @param pData - Data. Must be an instance of the table type.
   */
  put(pData) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      // Validate data type.
      if (!(pData instanceof _this5.mTableType)) {
        throw new core_1.Exception(`Invalid data type.`, _this5);
      }
      // Get table connection.
      const lTable = _this5.mTransaction.transaction.objectStore(_this5.mTableType.name);
      // Put data.
      const lRequest = lTable.put(pData);
      // Wait for completion.
      return new Promise((pResolve, pReject) => {
        // Reject on error.
        lRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception(`Error put data.` + lTarget.error, _this5));
        });
        // Resolve on success.
        lRequest.addEventListener('success', pEvent => {
          // Get table layout.
          const lTableLayout = _this5.mTableLayout.configOf(_this5.mTableType);
          // Read event target like a shithead.
          const lTarget = pEvent.target;
          // Update object with the new identity when any identity is specified.
          const lIdentityProperty = lTableLayout.identity.key;
          pData[lIdentityProperty] = lTarget.result;
          pResolve();
        });
      });
    })();
  }
  /**
   * Create a new table query.
   *
   * @param pIndexOrPropertyName - A index or a property name.
   *
   * @returns a new chainable table query.
   */
  where(pIndexOrPropertyName) {
    return new web_database_query_1.WebDatabaseQuery(this).and(pIndexOrPropertyName);
  }
}
exports.WebDatabaseTable = WebDatabaseTable;

/***/ }),

/***/ "./source/web_database/web-database-transaction.ts":
/*!*********************************************************!*\
  !*** ./source/web_database/web-database-transaction.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabaseTransaction = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const web_database_table_1 = __webpack_require__(/*! ./web-database-table */ "./source/web_database/web-database-table.ts");
class WebDatabaseTransaction {
  /**
   * Underlying transaction.
   */
  get transaction() {
    if (!this.mState) {
      throw new core_1.Exception(`Transaction is closed. Transactions can't be used with asynchronous calls.`, this);
    }
    return this.mState;
  }
  /**
   * Constructor.
   *
   * @param pDatabase - Database-
   * @param pTables - Tables of transaction.
   * @param pMode - Transaction mode.
   */
  constructor(pDatabase, pTables, pMode) {
    this.mDatabase = pDatabase;
    this.mTableTypes = new Set(pTables);
    this.mMode = pMode;
    this.mState = null;
  }
  /**
   * Force commit transaction.
   */
  commit() {
    if (!this.mState) {
      return;
    }
    this.mState.commit();
  }
  /**
   * Open the transaction.
   */
  open() {
    var _this = this;
    return _asyncToGenerator(function* () {
      if (_this.mState) {
        return;
      }
      const lDatabaseConnection = yield _this.mDatabase.open();
      // Convert types into names.
      const lTableNames = Array.from(_this.mTableTypes).map(pTableType => {
        return pTableType.name;
      });
      _this.mState = lDatabaseConnection.transaction(lTableNames, _this.mMode);
      _this.mState.addEventListener('complete', () => {
        // Clear state on complete.
        _this.mState = null;
      });
    })();
  }
  /**
   * Get table of database.
   *
   * @param pType - Table type.
   *
   * @returns Table connection.
   */
  table(pType) {
    // Table type must exists in table.
    if (!this.mTableTypes.has(pType)) {
      throw new core_1.Exception('Table type not set for database.', this);
    }
    // Create table object with attached opened db.
    return new web_database_table_1.WebDatabaseTable(pType, this);
  }
}
exports.WebDatabaseTransaction = WebDatabaseTransaction;

/***/ }),

/***/ "./source/web_database/web-database.ts":
/*!*********************************************!*\
  !*** ./source/web_database/web-database.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebDatabase = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const web_database_table_layout_1 = __webpack_require__(/*! ./layout/web-database-table-layout */ "./source/web_database/layout/web-database-table-layout.ts");
const web_database_transaction_1 = __webpack_require__(/*! ./web-database-transaction */ "./source/web_database/web-database-transaction.ts");
class WebDatabase {
  static {
    this.ANONYMOUS_IDENTITIY_KEY = '__id__';
  }
  /**
   * Constructor.
   *
   * @param pName - Database name.
   * @param pTables - Database tables.
   */
  constructor(pName, pTables) {
    this.mDatabaseName = pName;
    this.mDatabaseConnection = null;
    this.mTableLayouts = new web_database_table_layout_1.WebDatabaseTableLayout();
    this.mTableTypes = new core_1.Dictionary();
    for (const lTableType of pTables) {
      this.mTableTypes.set(lTableType.name, lTableType);
    }
  }
  /**
   * Close current database connections.
   */
  close() {
    // Skip when it is already closed.
    if (this.mDatabaseConnection === null) {
      return;
    }
    // Close and clear database connection.
    this.mDatabaseConnection.close();
    this.mDatabaseConnection = null;
  }
  /**
   * Delete database and resolve on success.
   */
  delete() {
    var _this = this;
    return _asyncToGenerator(function* () {
      const lDeleteRequest = window.indexedDB.deleteDatabase(_this.mDatabaseName);
      return new Promise((pResolve, pReject) => {
        // Reject on error.
        lDeleteRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception('Error deleting database. ' + lTarget.error, _this));
        });
        // Databse delete success.
        lDeleteRequest.onsuccess = () => {
          pResolve();
        };
      });
    })();
  }
  /**
   * Open database connection.
   * Resolve once the connection is set.
   */
  open() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // Dont open another connection when one is open.
      if (_this2.mDatabaseConnection) {
        return _this2.mDatabaseConnection;
      }
      // Open db with current version. Read all object stores and all indices and compare.
      const lDatabaseUpdate = yield new Promise((pResolve, pReject) => {
        const lDatabaseUpdate = {
          version: 0,
          updateNeeded: false,
          tableUpdates: new Array()
        };
        // Open database with current version.
        const lOpenRequest = window.indexedDB.open(_this2.mDatabaseName);
        // Set defaults when no database exists.
        lOpenRequest.addEventListener('upgradeneeded', () => {
          // Empty update.
        });
        // Reject on block or error. 
        lOpenRequest.addEventListener('blocked', pEvent => {
          pReject(new core_1.Exception(`Database locked from another tab. Unable to update from "${pEvent.oldVersion}" to "${pEvent.newVersion}"`, _this2));
        });
        lOpenRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception('Error opening database. ' + lTarget.error, _this2));
        });
        // Save open state.
        lOpenRequest.addEventListener('success', pEvent => {
          const lDatabaseConnection = pEvent.target.result;
          // Set current loaded database version.
          lDatabaseUpdate.version = lDatabaseConnection.version;
          // Read current tables names and tables names that should be created.
          const lCurrentTableNames = new Set(Array.from(lDatabaseConnection.objectStoreNames));
          const lUncreatedTableNames = new Set(Array.from(_this2.mTableTypes.keys()));
          // Check current tables. When no tables exists, skip it, so no "Empty Transaction"-Error is thrown.
          if (lCurrentTableNames.size > 0) {
            // Open a read transaction to read current table configurations.
            const lReadTransaction = lDatabaseConnection.transaction([...lCurrentTableNames], 'readonly');
            // Read all existing databases. 
            for (const lTableName of lCurrentTableNames) {
              // Mark table as deleteable when it does not exists anymore.
              if (!lUncreatedTableNames.has(lTableName)) {
                lDatabaseUpdate.tableUpdates.push({
                  name: lTableName,
                  action: 'delete',
                  indices: []
                });
                continue;
              }
              // Read table configuration.
              const lTableConfiguration = _this2.mTableLayouts.configOf(_this2.mTableTypes.get(lTableName));
              // Open database table.
              const lTable = lReadTransaction.objectStore(lTableName);
              // Validate correct identity, update table when it differs.
              const lConfiguratedKeyPath = lTableConfiguration.identity.key;
              const lConfiguratedAutoIncrement = lTableConfiguration.identity.autoIncrement;
              if (lTable.keyPath !== lConfiguratedKeyPath || lTable.autoIncrement !== lConfiguratedAutoIncrement) {
                lDatabaseUpdate.tableUpdates.push({
                  name: lTableName,
                  action: 'delete',
                  indices: []
                });
                continue;
              }
              // Remove table from uncreated table list, so it doesnt get created again.
              lUncreatedTableNames.delete(lTableName);
              // Read current tables indeces and tables indecies that should be created.
              const lCurrentTableIndices = new Set(Array.from(lTable.indexNames));
              const lUncreatedTableIndices = new Set(Array.from(lTableConfiguration.indices.keys()));
              const lIndexUpdates = new Array();
              for (const lIndexName of lCurrentTableIndices) {
                // Mark index as deleteable when it does not exists anymore.
                if (!lUncreatedTableIndices.has(lIndexName)) {
                  lIndexUpdates.push({
                    name: lIndexName,
                    action: 'delete'
                  });
                  continue;
                }
                // Read current index
                const lCurrentIndex = lTable.index(lIndexName);
                const lIndexConfiguration = lTableConfiguration.indices.get(lIndexName);
                // Read index keys.
                const lCurrentIndexKey = Array.isArray(lCurrentIndex.keyPath) ? lCurrentIndex.keyPath.join(',') : lCurrentIndex.keyPath;
                const lConfiguratedIndexKey = lIndexConfiguration.keys.join(',');
                // Validate same index configuration. Delete the current index when it differs.
                if (lCurrentIndexKey !== lConfiguratedIndexKey || lCurrentIndex.multiEntry !== lIndexConfiguration.options.multiEntity || lCurrentIndex.unique !== lIndexConfiguration.options.unique) {
                  lIndexUpdates.push({
                    name: lIndexName,
                    action: 'delete'
                  });
                  continue;
                }
                // Remove index from uncreated index list, so it doesnt get created again.
                lUncreatedTableIndices.delete(lIndexName);
              }
              // Create all remaing missing indices.
              for (const lIndexName of lUncreatedTableIndices) {
                lIndexUpdates.push({
                  name: lIndexName,
                  action: 'create'
                });
              }
              // Add index update table update when any index is not created or must be deleted.
              if (lIndexUpdates.length > 0) {
                lDatabaseUpdate.tableUpdates.push({
                  name: lTableName,
                  action: 'none',
                  indices: lIndexUpdates
                });
                continue;
              }
            }
          }
          // Create all remaining tables.
          for (const lTableName of lUncreatedTableNames) {
            // Read table and index configuration.
            const lTableConfiguration = _this2.mTableLayouts.configOf(_this2.mTableTypes.get(lTableName));
            // Add all indices to the index update list.
            const lIndexUpdates = new Array();
            for (const lIndexName of lTableConfiguration.indices.keys()) {
              lIndexUpdates.push({
                name: lIndexName,
                action: 'create'
              });
            }
            // Add create table update to database update.
            lDatabaseUpdate.tableUpdates.push({
              name: lTableName,
              action: 'create',
              indices: lIndexUpdates
            });
          }
          // Check for any update.
          for (const lTableUpdate of lDatabaseUpdate.tableUpdates) {
            // Set database to need a update when any update should be made.
            if (lTableUpdate.action !== 'none' || lTableUpdate.indices.length > 0) {
              lDatabaseUpdate.updateNeeded = true;
              break;
            }
          }
          // Close connection before resolving.
          lDatabaseConnection.close();
          pResolve(lDatabaseUpdate);
        });
      });
      // Get current or next version when a update must be made.
      const lDatabaseVersion = lDatabaseUpdate.updateNeeded ? lDatabaseUpdate.version + 1 : lDatabaseUpdate.version;
      // Open database request.
      const lOpenRequest = window.indexedDB.open(_this2.mDatabaseName, lDatabaseVersion);
      return new Promise((pResolve, pReject) => {
        // Init tables on upgradeneeded.
        lOpenRequest.addEventListener('upgradeneeded', pEvent => {
          const lTarget = pEvent.target;
          const lDatabaseConnection = lTarget.result;
          const lDatabaseTransaction = lTarget.transaction;
          for (const lTableUpdate of lDatabaseUpdate.tableUpdates) {
            // Delete action.
            if (lTableUpdate.action === 'delete') {
              lDatabaseConnection.deleteObjectStore(lTableUpdate.name);
              continue;
            }
            // Read table configuration.
            const lTableType = _this2.mTableTypes.get(lTableUpdate.name);
            const lTableConfiguration = _this2.mTableLayouts.configOf(lTableType);
            // Create table with correct identity.
            if (lTableUpdate.action === 'create') {
              if (lTableConfiguration.identity) {
                lDatabaseConnection.createObjectStore(lTableUpdate.name, {
                  keyPath: lTableConfiguration.identity.key,
                  autoIncrement: lTableConfiguration.identity.autoIncrement
                });
              } else {
                // Create object store without an identity.
                lDatabaseConnection.createObjectStore(lTableUpdate.name);
              }
            }
            // Update indices.
            if (lTableUpdate.indices.length > 0) {
              const lTable = lDatabaseTransaction.objectStore(lTableUpdate.name);
              // Create indices.
              for (const lIndexUpdate of lTableUpdate.indices) {
                // Index delete action.
                if (lIndexUpdate.action === 'delete') {
                  lTable.deleteIndex(lIndexUpdate.name);
                  continue;
                }
                // Read index configuration.
                const lIndexConfiguration = lTableConfiguration.indices.get(lIndexUpdate.name);
                // Read single keys as string, so multientries are recognized as single key.
                const lIndexKeys = lIndexConfiguration.keys.length > 1 ? lIndexConfiguration.keys : lIndexConfiguration.keys[0];
                // Index create action.
                if (lIndexUpdate.action === 'create') {
                  lTable.createIndex(lIndexUpdate.name, lIndexKeys, {
                    unique: lIndexConfiguration.options.unique,
                    multiEntry: lIndexConfiguration.options.multiEntity
                  });
                  continue;
                }
              }
            }
          }
        });
        // Reject when update is blocked.
        lOpenRequest.addEventListener('blocked', pEvent => {
          pReject(new core_1.Exception(`Database locked from another tab. Unable to update from "${pEvent.oldVersion}" to "${pEvent.newVersion}"`, _this2));
        });
        // Reject on error.
        lOpenRequest.addEventListener('error', pEvent => {
          const lTarget = pEvent.target;
          pReject(new core_1.Exception('Error opening database. ' + lTarget.error, _this2));
        });
        // Save open state.
        lOpenRequest.addEventListener('success', pEvent => {
          // Save and resolve
          _this2.mDatabaseConnection = pEvent.target.result;
          pResolve(_this2.mDatabaseConnection);
        });
      });
    })();
  }
  /**
   * Create a synchron action where data can be read or written.
   *
   * @param pTables - Tabes for this transaction.
   * @param pAction - Action withing this transaction.
   */
  transaction(pTables, pMode, pAction) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      // Tables should exists.
      for (const lTableType of pTables) {
        if (!_this3.mTableTypes.has(lTableType.name)) {
          throw new core_1.Exception(`Table "${lTableType.name}" does not exists in this database.`, _this3);
        }
      }
      // Create and open transaction.
      const lTransaction = new web_database_transaction_1.WebDatabaseTransaction(_this3, pTables, pMode);
      yield lTransaction.open();
      // Call action within the transaction.
      // eslint-disable-next-line @typescript-eslint/await-thenable
      yield pAction(lTransaction);
      // Commit transaction.
      lTransaction.commit();
    })();
  }
}
exports.WebDatabase = WebDatabase;

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js":
/*!***********************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecorationReplacementHistory = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
/**
 * Decoration history keeps track of any class that was replaces through a decorator.
 *
 * @internal
 */
class DecorationReplacementHistory {
    static { this.mBackwardHistory = new core_1.Dictionary(); }
    /**
     * Add an decoration parent.
     *
     * @param pFromConstructor - Previous constructor.
     * @param pToConstructor - Changed / next construtor.
     */
    static add(pFromConstructor, pToConstructor) {
        DecorationReplacementHistory.mBackwardHistory.add(pToConstructor, pFromConstructor);
    }
    /**
     * Get the original constructor from a decorator replaced constructor.
     * Iterates through decoration history until it cant find any parent.
     *
     * @param pConstructor - Constructor with decorations.
     */
    static getOriginalOf(pConstructor) {
        let lCurrentConstructor;
        // Iterate over history as long as history can't go back.
        for (let lNextEntry = pConstructor; lNextEntry; lNextEntry = DecorationReplacementHistory.mBackwardHistory.get(lNextEntry)) {
            lCurrentConstructor = lNextEntry;
        }
        return lCurrentConstructor;
    }
}
exports.DecorationReplacementHistory = DecorationReplacementHistory;
//# sourceMappingURL=decoration-history.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decorator/add-metadata.decorator.js":
/*!******************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decorator/add-metadata.decorator.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddMetadata = AddMetadata;
const reflect_initializer_1 = __webpack_require__(/*! ../reflect/reflect-initializer */ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 *
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
function AddMetadata(pMetadataKey, pMetadataValue) {
    return (pTarget, pProperty) => {
        Reflect.metadata(pMetadataKey, pMetadataValue)(pTarget, pProperty);
    };
}
//# sourceMappingURL=add-metadata.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable-singleton.decorator.js":
/*!**************************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decorator/injectable-singleton.decorator.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InjectableSingleton = InjectableSingleton;
const inject_mode_1 = __webpack_require__(/*! ../enum/inject-mode */ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js");
const injection_1 = __webpack_require__(/*! ../injection/injection */ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js");
const reflect_initializer_1 = __webpack_require__(/*! ../reflect/reflect-initializer */ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 *
 * @param pConstructor - Constructor.
 */
function InjectableSingleton(pConstructor) {
    injection_1.Injection.registerInjectable(pConstructor, inject_mode_1.InjectMode.Singleton);
}
//# sourceMappingURL=injectable-singleton.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable.decorator.js":
/*!****************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decorator/injectable.decorator.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Injectable = Injectable;
const inject_mode_1 = __webpack_require__(/*! ../enum/inject-mode */ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js");
const reflect_initializer_1 = __webpack_require__(/*! ../reflect/reflect-initializer */ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js");
const injection_1 = __webpack_require__(/*! ../injection/injection */ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 *
 * @param pConstructor - Constructor.
 */
function Injectable(pConstructor) {
    injection_1.Injection.registerInjectable(pConstructor, inject_mode_1.InjectMode.Instanced);
}
//# sourceMappingURL=injectable.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js":
/*!**************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InjectMode = void 0;
/**
 * Injection modes.
 * Used to create new or reuse old instances of a object.
 */
var InjectMode;
(function (InjectMode) {
    /**
     * Only one instance of a class is constructed.
     * Any other object created from this class has the same reference.
     */
    InjectMode[InjectMode["Singleton"] = 1] = "Singleton";
    /**
     * Any new creation initializes a new instance.
     */
    InjectMode[InjectMode["Instanced"] = 2] = "Instanced";
})(InjectMode || (exports.InjectMode = InjectMode = {}));
//# sourceMappingURL=inject-mode.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/index.js":
/*!***************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecorationHistory = exports.Metadata = exports.Injection = exports.Injector = void 0;
// Injection
var injector_1 = __webpack_require__(/*! ./injector */ "../kartoffelgames.core.dependency_injection/library/source/injector.js");
Object.defineProperty(exports, "Injector", ({ enumerable: true, get: function () { return injector_1.Injector; } }));
var injection_1 = __webpack_require__(/*! ./injection/injection */ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js");
Object.defineProperty(exports, "Injection", ({ enumerable: true, get: function () { return injection_1.Injection; } }));
// Metadata
var metadata_1 = __webpack_require__(/*! ./metadata/metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
Object.defineProperty(exports, "Metadata", ({ enumerable: true, get: function () { return metadata_1.Metadata; } }));
// Decoration
var decoration_history_1 = __webpack_require__(/*! ./decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
Object.defineProperty(exports, "DecorationHistory", ({ enumerable: true, get: function () { return decoration_history_1.DecorationReplacementHistory; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js":
/*!*****************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/injection/injection.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Injection = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const inject_mode_1 = __webpack_require__(/*! ../enum/inject-mode */ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js");
const decoration_history_1 = __webpack_require__(/*! ../decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
const metadata_1 = __webpack_require__(/*! ../metadata/metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
/**
 * Injection configuration and creator.
 * Handes global injection configuration for replaced injections and creates new instances from injectable classes.
 *
 * @public
 */
class Injection {
    static { this.mInjectMode = new core_1.Dictionary(); }
    static { this.mInjectableConstructor = new core_1.Dictionary(); }
    static { this.mInjectableReplacement = new core_1.Dictionary(); }
    static { this.mSingletonMapping = new core_1.Dictionary(); }
    static createObject(pConstructor, pForceCreateOrLocalInjections, pLocalInjections) {
        // Decide between local injection or force creation parameter.
        const [lForceCreate, lLocalInjections] = (() => {
            if (typeof pForceCreateOrLocalInjections === 'object' && pForceCreateOrLocalInjections !== null) {
                return [false, pForceCreateOrLocalInjections];
            }
            return [!!pForceCreateOrLocalInjections, pLocalInjections ?? new core_1.Dictionary()];
        })();
        // Find constructor in decoration replacement history that was used for registering. Only root can be registered.
        const lRegisteredConstructor = decoration_history_1.DecorationReplacementHistory.getOriginalOf(pConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredConstructor)) {
            throw new core_1.Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, Injection);
        }
        // Get injection mode. Allways defaultsa to instanced, when force created.
        const lInjectionMode = !lForceCreate ? Injection.mInjectMode.get(lRegisteredConstructor) : inject_mode_1.InjectMode.Instanced;
        // Return cached singleton object if not forced to create a new one.
        if (!lForceCreate && lInjectionMode === inject_mode_1.InjectMode.Singleton && Injection.mSingletonMapping.has(lRegisteredConstructor)) {
            return Injection.mSingletonMapping.get(lRegisteredConstructor);
        }
        // Get constructor parameter type information and default to empty parameter list.
        let lParameterTypeList = metadata_1.Metadata.get(pConstructor).parameterTypes;
        if (lParameterTypeList === null) {
            lParameterTypeList = new Array();
        }
        // Create parameter.
        const lConstructorParameter = new Array();
        for (const lParameterType of lParameterTypeList) {
            let lParameterObject;
            // Check if parameter can be replaced with an local injection
            if (lInjectionMode !== inject_mode_1.InjectMode.Singleton && lLocalInjections.has(lParameterType)) {
                lParameterObject = lLocalInjections.get(lParameterType);
            }
            else {
                // Read original parameter type used as replacement key.
                const lOriginalParameterType = decoration_history_1.DecorationReplacementHistory.getOriginalOf(lParameterType);
                if (!Injection.mInjectableConstructor.has(lOriginalParameterType)) {
                    throw new core_1.Exception(`Parameter "${lParameterType.name}" of ${pConstructor.name} is not registered to be injectable.`, Injection);
                }
                // Try to find global replacement.
                let lParameterConstructor;
                if (Injection.mInjectableReplacement.has(lOriginalParameterType)) {
                    lParameterConstructor = Injection.mInjectableReplacement.get(lOriginalParameterType);
                }
                else {
                    lParameterConstructor = lParameterType;
                }
                // Proxy exception.
                try {
                    // Get injectable parameter.
                    lParameterObject = Injection.createObject(lParameterConstructor, lLocalInjections);
                }
                catch (pException) {
                    // Error is always an Exception.
                    const lException = pException;
                    throw new core_1.Exception(`Parameter "${lParameterType.name}" of ${pConstructor.name} is not injectable.\n` + lException.message, Injection);
                }
            }
            // Add parameter to construction parameter list.
            lConstructorParameter.push(lParameterObject);
        }
        // Create object.
        const lCreatedObject = new pConstructor(...lConstructorParameter);
        // Cache singleton objects but only if not forced to create.
        if (lInjectionMode === inject_mode_1.InjectMode.Singleton && !Injection.mSingletonMapping.has(lRegisteredConstructor)) {
            Injection.mSingletonMapping.add(lRegisteredConstructor, lCreatedObject);
        }
        return lCreatedObject;
    }
    /**
     * Register an constructor for injection.
     *
     * @remarks
     * Any constructor can be registred but only constructors that have a attached decorator of any kind are able to be injected.
     *
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    static registerInjectable(pConstructor, pMode) {
        // Find root constructor of decorated constructor to habe registered constructor allways available top down.
        const lBaseConstructor = decoration_history_1.DecorationReplacementHistory.getOriginalOf(pConstructor);
        // Map constructor.
        Injection.mInjectableConstructor.add(lBaseConstructor, pConstructor);
        Injection.mInjectMode.add(lBaseConstructor, pMode);
    }
    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both constructors must be registered with {@link registerInjectable}.
     *
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     *
     * @throws {@link Exception}
     * When a constructor is not registed with {@link registerInjectable}.
     */
    static replaceInjectable(pOriginalConstructor, pReplacementConstructor) {
        // Find original registered original. Only root can be registerd.
        const lRegisteredOriginal = decoration_history_1.DecorationReplacementHistory.getOriginalOf(pOriginalConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredOriginal)) {
            throw new core_1.Exception('Original constructor is not registered.', Injection);
        }
        // Find replacement registered original. Only root can be registered.
        const lRegisteredReplacement = decoration_history_1.DecorationReplacementHistory.getOriginalOf(pReplacementConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredReplacement)) {
            throw new core_1.Exception('Replacement constructor is not registered.', Injection);
        }
        // Register replacement.
        Injection.mInjectableReplacement.set(lRegisteredOriginal, pReplacementConstructor);
    }
}
exports.Injection = Injection;
//# sourceMappingURL=injection.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/injector.js":
/*!******************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/injector.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Injector = void 0;
const injectable_decorator_1 = __webpack_require__(/*! ./decorator/injectable.decorator */ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable.decorator.js");
const injectable_singleton_decorator_1 = __webpack_require__(/*! ./decorator/injectable-singleton.decorator */ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable-singleton.decorator.js");
const add_metadata_decorator_1 = __webpack_require__(/*! ./decorator/add-metadata.decorator */ "../kartoffelgames.core.dependency_injection/library/source/decorator/add-metadata.decorator.js");
const reflect_initializer_1 = __webpack_require__(/*! ./reflect/reflect-initializer */ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js");
class Injector {
    /**
     * AtScript.
     * Mark class to be injectable as an instanced object.
     *
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static { this.Injectable = injectable_decorator_1.Injectable; }
    /**
     * AtScript.
     * Mark class to be injectable as an singleton object.
     *
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static { this.InjectableSingleton = injectable_singleton_decorator_1.InjectableSingleton; }
    /**
     * AtScript.
     * Add metadata to class, method, accessor or property
     *
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static { this.Metadata = add_metadata_decorator_1.AddMetadata; }
    /**
     * Initialize reflection.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static { this.Initialize = () => {
        reflect_initializer_1.ReflectInitializer.initialize();
    }; }
}
exports.Injector = Injector;
//# sourceMappingURL=injector.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/metadata/base-metadata.js":
/*!********************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/metadata/base-metadata.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseMetadata = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const metadata_1 = __webpack_require__(/*! ./metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
/**
 * Base metadata information for classes and properties.
 */
class BaseMetadata {
    /**
     * Constructor where all metadata should be attached.
     */
    get injectionConstructor() {
        return this.mConstructor;
    }
    /**
     * Constructor.
     * Initialize lists.
     *
     * @param pConstructor - Constructor where all metadata should be attached.
     * @param pPropertyKey - Key of property where all metadata should be attached.
     */
    constructor(pConstructor, pPropertyKey) {
        this.mConstructor = pConstructor;
        this.mProperty = pPropertyKey;
        this.mCustomMetadata = new core_1.Dictionary();
    }
    /**
     * Get metadata of constructor or property from this and any parent inheritance.
     * List is empty if current and inherited items have no metadata.
     *
     * @param pMetadataKey - Metadata key.
     *
     * @typeParam T - Type of metadata value.
     *
     * @returns a array with all metadata set on all inherited parents.
     */
    getInheritedMetadata(pMetadataKey) {
        // Try to get parent metadata.
        const lParentClass = Object.getPrototypeOf(this.mConstructor);
        // Read parent metadata or create new metadata list when no inheritance was found.
        let lMetadataValueList;
        if (lParentClass) {
            let lMetadata = metadata_1.Metadata.get(lParentClass);
            if (this.mProperty !== null) {
                lMetadata = lMetadata.getProperty(this.mProperty);
            }
            lMetadataValueList = lMetadata.getInheritedMetadata(pMetadataKey);
        }
        else {
            lMetadataValueList = new Array();
        }
        // Read current metadata and add it to inherited metadata list.
        const lCurrentMetadata = this.getMetadata(pMetadataKey);
        if (lCurrentMetadata !== null) {
            lMetadataValueList.push(lCurrentMetadata);
        }
        return lMetadataValueList;
    }
    /**
     * Get metadata of constructor or property.
     *
     * @param pMetadataKey - Metadata key.
     *
     * @typeParam T - Expected type of metadata value.
     *
     * @returns set metadata or null when no metadata was attached.
     */
    getMetadata(pMetadataKey) {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }
    /**
     * Set metadata of constructor or property.
     *
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     *
     * @typeParam T - Type of metadata value.
     */
    setMetadata(pMetadataKey, pMetadataValue) {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}
exports.BaseMetadata = BaseMetadata;
//# sourceMappingURL=base-metadata.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/metadata/constructor-metadata.js":
/*!***************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/metadata/constructor-metadata.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConstructorMetadata = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const property_metadata_1 = __webpack_require__(/*! ./property-metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/property-metadata.js");
const base_metadata_1 = __webpack_require__(/*! ./base-metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/base-metadata.js");
/**
 * Constructor metadata.
 */
class ConstructorMetadata extends base_metadata_1.BaseMetadata {
    /**
     * Get parameter type information.
     */
    get parameterTypes() {
        return this.getMetadata('design:paramtypes');
    }
    /**
     * Constructor.
     * Initialize lists.
     *
     * @param pConstructor - Constructor where all metadata should be attached.
     */
    constructor(pConstructor) {
        super(pConstructor, null);
        this.mPropertyMetadata = new core_1.Dictionary();
    }
    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     *
     * @param pPropertyKey - Key of property.
     */
    getProperty(pPropertyKey) {
        // Create new property mapping when no mapping is found.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new property_metadata_1.PropertyMetadata(this.injectionConstructor, pPropertyKey));
        }
        return this.mPropertyMetadata.get(pPropertyKey);
    }
}
exports.ConstructorMetadata = ConstructorMetadata;
//# sourceMappingURL=constructor-metadata.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js":
/*!***************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Metadata = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const decoration_history_1 = __webpack_require__(/*! ../decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
const constructor_metadata_1 = __webpack_require__(/*! ./constructor-metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/constructor-metadata.js");
/**
 * Static.
 * Metadata storage.
 *
 * @public
 */
class Metadata {
    static { this.mConstructorMetadata = new core_1.Dictionary(); }
    /**
     * Get metadata of constructor.
     *
     * @param pConstructor - Constructor.
     *
     * @returns constructor metadata object of constructor.
     *
     * @example Adding a new and existing key.
     * ```TypeScript
     * @Injector.Metadata('key', 'value')
     * class Foo {
     *     @Injector.Metadata('key', 'value')
     *     public prop: number;
     * }
     *
     * const constructorMeta = Metadata.get(Foo).getMetadata('key');
     * const propertyMeta = Metadata.get(Foo).getProperty('prop').getMetadata('key');
     * ```
     */
    static get(pConstructor) {
        // Use root constructor to register metadata information.
        const lRegisteredConstructor = decoration_history_1.DecorationReplacementHistory.getOriginalOf(pConstructor);
        // Create new or read existing metadata.
        let lMetadata;
        if (this.mConstructorMetadata.has(lRegisteredConstructor)) {
            lMetadata = Metadata.mConstructorMetadata.get(lRegisteredConstructor);
        }
        else {
            lMetadata = new constructor_metadata_1.ConstructorMetadata(lRegisteredConstructor);
            Metadata.mConstructorMetadata.add(lRegisteredConstructor, lMetadata);
        }
        return lMetadata;
    }
}
exports.Metadata = Metadata;
//# sourceMappingURL=metadata.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/metadata/property-metadata.js":
/*!************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/metadata/property-metadata.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyMetadata = void 0;
const base_metadata_1 = __webpack_require__(/*! ./base-metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/base-metadata.js");
/**
 * Property metadata.
 */
class PropertyMetadata extends base_metadata_1.BaseMetadata {
    /**
     * Get parameter type information.
     */
    get parameterTypes() {
        return this.getMetadata('design:paramtypes');
    }
    /**
     * Get return type information.
     */
    get returnType() {
        return this.getMetadata('design:returntype');
    }
    /**
     * Get property type information.
     */
    get type() {
        return this.getMetadata('design:type');
    }
    /**
     * Constructor.
     * Initialize lists.
     *
     * @param pConstructor - Constructor where all metadata should be attached.
     * @param pPropertyKey - Key of property where all metadata should be attached.
     */
    constructor(pConstructor, pPropertyKey) {
        super(pConstructor, pPropertyKey);
    }
}
exports.PropertyMetadata = PropertyMetadata;
//# sourceMappingURL=property-metadata.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js":
/*!*************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReflectInitializer = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const decoration_history_1 = __webpack_require__(/*! ../decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
const metadata_1 = __webpack_require__(/*! ../metadata/metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
/**
 * Initializes global metadata reflection functionality of typescript.
 * Adds {@link Reflect.metadata} and {@link Reflect.decorate} function to the global {@link Reflect} object.
 * These functions are used by Typescript to inject type information on compile time.
 *
 * @internal
 */
class ReflectInitializer {
    static { this.mExported = false; }
    /**
     * Initializes global defintions for decorate and metadata into the Reflect object.
     */
    static initialize() {
        if (!ReflectInitializer.mExported) {
            ReflectInitializer.mExported = true;
            ReflectInitializer.export('decorate', ReflectInitializer.decorate);
            ReflectInitializer.export('metadata', ReflectInitializer.metadata);
        }
    }
    /**
     * Decorate class, method, parameter or property.
     *
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pDescriptor - Descriptor of member on member decorator.
     */
    static decorate(pDecoratorList, pTarget, pPropertyKey, pDescriptor) {
        let lDecoratorResult;
        if (pPropertyKey && pDescriptor) {
            // Decorate accessor, function. Returns new descriptor.
            lDecoratorResult = ReflectInitializer.decorateMethod(pDecoratorList, pTarget, pPropertyKey, pDescriptor);
        }
        else if (pPropertyKey && !pDescriptor) {
            // Decorate property or parameter. Has no return value.
            ReflectInitializer.decorateProperty(pDecoratorList, pTarget, pPropertyKey);
            lDecoratorResult = null; // Is ignored.
        }
        else { // Only target set.
            // Decorate class. Returns replacement class.
            lDecoratorResult = ReflectInitializer.decorateClass(pDecoratorList, pTarget);
        }
        return lDecoratorResult;
    }
    /**
     * Decorate class.
     *
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    static decorateClass(pDecoratorList, pConstructor) {
        let lCurrentConstrutor = pConstructor;
        // Run all metadata decorator first.
        for (const lDecorator of pDecoratorList) {
            if (lDecorator.isMetadata) {
                // Metadata decorator doesn't return values.
                lDecorator(pConstructor);
            }
        }
        // For each decorator included metadata decorator.
        for (const lDecorator of pDecoratorList) {
            // If the decorator was a metadata decorator use the original class as target.
            if (!lDecorator.isMetadata) {
                // Execute decorator.
                const lNewConstructor = lDecorator(pConstructor);
                // Check if decorator does return different class.
                if (!!lNewConstructor && lNewConstructor !== lCurrentConstrutor) {
                    if (typeof lNewConstructor === 'function') {
                        // Add changed construtor to the decoration history.
                        decoration_history_1.DecorationReplacementHistory.add(lCurrentConstrutor, lNewConstructor);
                        lCurrentConstrutor = lNewConstructor;
                    }
                    else {
                        throw new core_1.Exception('Constructor decorator does not return supported value.', lDecorator);
                    }
                }
            }
        }
        return lCurrentConstrutor;
    }
    /**
     * Decorate method or accessor.
     *
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator.
     * @param pDescriptor - Descriptor of property
     */
    static decorateMethod(pDecoratorList, pTarget, pPropertyKey, pDescriptor) {
        let lCurrentDescriptor = pDescriptor;
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator.
            const lDecoratedMember = lDecorator(pTarget, pPropertyKey, lCurrentDescriptor);
            // Check if decorator does return different PropertyDescriptor.
            if (lDecoratedMember) {
                if (typeof lDecoratedMember === 'object') {
                    lCurrentDescriptor = lDecoratedMember;
                }
                else {
                    throw new core_1.Exception('Member decorator does not return supported value.', lDecorator);
                }
            }
        }
        return lCurrentDescriptor;
    }
    /**
     * Decorate property or parameter.
     *
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator.
     */
    static decorateProperty(pDecoratorList, pTarget, pPropertyKey) {
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator. Doesn't return any value.
            lDecorator(pTarget, pPropertyKey, undefined); // Index number gets overriden for parameter decorator.
        }
    }
    /**
     * Export property into Reflect object.
     *
     * @param pKey - Key of property.
     * @param pValue - Value of property.
     */
    static export(pKey, pValue) {
        // Find root for accessing Reflect.
        /* istanbul ignore next */
        const lRoot = typeof window === 'object' ? window : __webpack_require__.g;
        // Set target as Reflect of root. (window or global).
        const lTarget = lRoot.Reflect;
        Object.defineProperty(lTarget, pKey, { configurable: true, writable: true, value: pValue });
    }
    /**
     * Entry point for Typescripts emitDecoratorMetadata data.
     *
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    static metadata(pMetadataKey, pMetadataValue) {
        /*
            Typescript injected metadata. __metadata is called as decorator and calls this metadata function.
            
           __metadata("design:type", Function), // Parameter Value
           __metadata("design:paramtypes", [Number, String]), // Function or Constructor Parameter
           __metadata("design:returntype", void 0) // Function return type.
        */
        const lResultDecorator = (pTarget, pProperty) => {
            // Get constructor from prototype if is an instanced member.
            let lConstructor;
            if (typeof pTarget !== 'function') {
                lConstructor = pTarget.constructor;
            }
            else {
                lConstructor = pTarget;
            }
            // Set metadata for property or class.
            if (pProperty) {
                metadata_1.Metadata.get(lConstructor).getProperty(pProperty).setMetadata(pMetadataKey, pMetadataValue);
            }
            else {
                metadata_1.Metadata.get(lConstructor).setMetadata(pMetadataKey, pMetadataValue);
            }
        };
        // Set as metadata constructor and return.
        lResultDecorator.isMetadata = true;
        return lResultDecorator;
    }
}
exports.ReflectInitializer = ReflectInitializer;
//# sourceMappingURL=reflect-initializer.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/algorithm/myers-diff.js":
/*!*********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/algorithm/myers-diff.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeState = exports.MyersDiff = void 0;
class MyersDiff {
    /**
     * Constructor.
     * @param pCompareFunction - Compare function to compare two items.
     */
    constructor(pCompareFunction) {
        this.mCompareFunction = pCompareFunction;
    }
    /**
     * Get differences of the two item lists.
     * @param pItemListA - Item list A.
     * @param pItemListB - Item list B.
     */
    differencesOf(pItemListA, pItemListB) {
        // Save farthest-right points with it histories.
        const lFrontierList = { 1: { x: 0, history: [] } };
        // "Convert" Zero index to One index.
        const lOneIndex = (pId) => pId - 1;
        const lLengthA = pItemListA.length;
        const lLengthB = pItemListB.length;
        let lHistoryList;
        let lX;
        for (let lD = 0; lD < lLengthA + lLengthB + 1; lD++) {
            for (let lK = -lD; lK < lD + 1; lK += 2) {
                // Check if next move goes down or right.
                const lGoesDown = (lK === -lD || (lK !== lD && lFrontierList[lK - 1].x < lFrontierList[lK + 1].x));
                // Get starting diagonal point.
                if (lGoesDown) {
                    const lNextFrontier = lFrontierList[lK + 1];
                    lX = lNextFrontier.x;
                    lHistoryList = lNextFrontier.history;
                }
                else {
                    const lNextFrontier = lFrontierList[lK - 1];
                    lX = lNextFrontier.x + 1;
                    lHistoryList = lNextFrontier.history;
                }
                // Copy history list.
                lHistoryList = lHistoryList.slice();
                let lY = lX - lK;
                // Only start tracking history on valid track. Staring point (0,0) should not be tracked.
                if (1 <= lY && lY <= lLengthB && lGoesDown) {
                    lHistoryList.push({ changeState: ChangeState.Insert, item: pItemListB[lOneIndex(lY)] });
                }
                else if (1 <= lX && lX <= lLengthA) {
                    lHistoryList.push({ changeState: ChangeState.Remove, item: pItemListA[lOneIndex(lX)] });
                }
                // Move diagonal as long as possible.
                while (lX < lLengthA && lY < lLengthB && this.mCompareFunction(pItemListA[lOneIndex(lX + 1)], pItemListB[lOneIndex(lY + 1)])) {
                    lX += 1;
                    lY += 1;
                    lHistoryList.push({ changeState: ChangeState.Keep, item: pItemListA[lOneIndex(lX)] });
                }
                // Check if in the bottom right. If not save frontier.
                if (lX >= lLengthA && lY >= lLengthB) {
                    // Return found history.
                    return lHistoryList;
                }
                else {
                    lFrontierList[lK] = { x: lX, history: lHistoryList };
                }
            }
        }
        // Empty array for typescript. This area is never reached.
        /* istanbul ignore next */
        return new Array();
    }
}
exports.MyersDiff = MyersDiff;
var ChangeState;
(function (ChangeState) {
    ChangeState[ChangeState["Remove"] = 1] = "Remove";
    ChangeState[ChangeState["Insert"] = 2] = "Insert";
    ChangeState[ChangeState["Keep"] = 3] = "Keep";
})(ChangeState || (exports.ChangeState = ChangeState = {}));
//# sourceMappingURL=myers-diff.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/data_container/dictionary.js":
/*!**************************************************************************!*\
  !*** ../kartoffelgames.core/library/source/data_container/dictionary.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dictionary = void 0;
const list_1 = __webpack_require__(/*! ./list */ "../kartoffelgames.core/library/source/data_container/list.js");
const exception_1 = __webpack_require__(/*! ../exception/exception */ "../kartoffelgames.core/library/source/exception/exception.js");
/**
 * Wrapper for {@link Map}.
 * Extended by {@link Dictionary.add}, {@link Dictionary.getAllKeysOfValue}, {@link Dictionary.getOrDefault} and {@link Dictionary.map}.
 *
 * @typeParam TKey - Type of objects defined for keys.
 * @typeParam TValue - Type of objects defined for values.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 *
 * @public
 */
class Dictionary extends Map {
    /**
     * Add value and key to dictionary.
     * Throws {@link Exception}  for any added dublicate key.
     *
     * @param pKey - Key of item.
     * @param pValue - value of item.
     *
     * @throws
     * On any dublicate key set,
     *
     * @example Adding a new and existing key.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.add('a', 4); // => OK
     * dictionary.add('a', 4); // => Fail: Dublicate key.
     * ```
     */
    add(pKey, pValue) {
        // Add value and key to containers.
        if (!this.has(pKey)) {
            this.set(pKey, pValue);
        }
        else {
            throw new exception_1.Exception("Can't add dublicate key to dictionary.", this);
        }
    }
    /**
     * Create new dicionary and add same keys and values.
     * @see {@link ICloneable.clone}
     *
     * @returns cloned dictionary with shallow copied key and value refernces.
     *
     * @example Clone and compare dictionary and dictionary items.
     * ```TypeScript
     * const dictionary = new Dictionary<string, object>();
     * dictionary.set('a', new Object());
     *
     * const clone = dictionary.clone();
     *
     * const areSame = dictionary === clone; // => False
     * const itemSame = dictionary.get('a') === clone.get('a'); // => True
     * ```
     */
    clone() {
        return new Dictionary(this);
    }
    /**
     * Get all keys that have the set value.
     *
     * @param pValue - Value.
     *
     * @returns all keys that hold the specified value.
     *
     * @example Get keys of a value.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     * dictionary.set('b', 2);
     * dictionary.set('c', 1);
     *
     * const keys = dictionary.getAllKeysOfValue(1); // => ['a', 'c']
     * ```
     */
    getAllKeysOfValue(pValue) {
        // Add entries iterator to list and filter for pValue = Value
        const lKeyValuesWithValue = [...this.entries()].filter((pItem) => {
            return pItem[1] === pValue;
        });
        // Get only keys of key values.
        const lKeysOfKeyValue = lKeyValuesWithValue.map((pItem) => {
            return pItem[0];
        });
        return lKeysOfKeyValue;
    }
    /**
     * Get item. If the key does not exists the default value gets returned.
     * @param pKey - Key of item.
     * @param pDefault - Default value if key was not found.
     *
     * @returns value of the key. If the key does not exists the default value gets returned.
     *
     * @example Get value or default from a existing and none existing key.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     *
     * const keyA = dictionary.getOrDefault('a', 22); // => 1
     * const keyZ = dictionary.getOrDefault('z', 22); // => 22
     * ```
     */
    getOrDefault(pKey, pDefault) {
        const lValue = this.get(pKey);
        if (typeof lValue !== 'undefined') {
            return lValue;
        }
        return pDefault;
    }
    /**
     * Maps information into new list.
     * @param pFunction - Mapping funktion.
     *
     * @typeParam T - Result type of mapping resolver function.
     *
     * @returns mapped data for each item.
     *
     * @example Remap all dictionary values by adding a number to all values.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     * dictionary.set('b', 2);
     *
     * const list = dictionary.map((key, value) => value + 1); //  => [2, 3]
     * ```
     */
    map(pFunction) {
        const lResultList = new list_1.List();
        for (const lKeyValuePair of this) {
            // Execute callback and add result to list.
            const lMappingResult = pFunction(lKeyValuePair[0], lKeyValuePair[1]);
            lResultList.push(lMappingResult);
        }
        return lResultList;
    }
}
exports.Dictionary = Dictionary;
//# sourceMappingURL=dictionary.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/data_container/list.js":
/*!********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/data_container/list.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.List = void 0;
/**
 * Wrapper for {@link Array}.
 *
 * @typeParam T - Type of items of list.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array}
 *
 * @public
 */
class List extends Array {
    /**
     * Create list and add items.
     * Prevents spread operator with number arrays to initialize array with length instead of item.
     *
     * @param pItemList - Items.
     *
     * @example Create new list with `newListWith` and failing creation with the native `Array` constructor.
     * ```TypeScript
     * const newList = List.newListWith<number>(...[3]); // => [3]
     * const newListWrong = new List<number>(...[3]);    // => [undefined, undefined, undefined]
     * ```
     */
    static newListWith(...pItemList) {
        const lNewList = new List();
        lNewList.push(...pItemList);
        return lNewList;
    }
    /**
     * Remove every item.
     *
     * @example Clear a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 2, 3);
     * list.clear();
     *
     * console.log(list.length); // => 0
     * ```
     */
    clear() {
        this.splice(0, this.length);
    }
    /**
     * Create new list and add same items.
     * @see {@link ICloneable.clone}
     *
     * @returns cloned list with shallow copied item refernces.
     *
     * @example Clone and compare list and list items.
     * ```TypeScript
     * const list = List.newListWith<object>(new Object());
     *
     * const clone = list.clone();
     *
     * const areSame = list === clone; // => False
     * const itemSame = list[0] === list[0]; // => True
     * ```
     */
    clone() {
        return List.newListWith(...this);
    }
    /**
     * Copy distinct values into new list.
     *
     * @returns new list instance with only distinct values.
     *
     * @example Create a new list with dublicates and create a new distinct list out of it.
     * ```TypeScript
     * const listWithDublicates = List.newListWith<number>(1, 1, 2, 3, 3);
     * const distinctList = listWithDublicates.distinct(); // => [1, 2, 3]
     * ```
     */
    distinct() {
        return List.newListWith(...new Set(this));
    }
    /**
     * Compares this array with the specified one.
     * Compares length and every item by reference and order.
     * Does only shallow compare item references.
     *
     * @param pArray - Array to compare.
     *
     * @returns true for equality.
     *
     * @example Compare two arrays with a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 3, 2);
     *
     * const isEqual = list.equals([1, 3, 2]) // => True
     * const isUnequal = list.equals([1, 2, 3]) // => False
     * ```
     */
    equals(pArray) {
        // Check if array are same, dont null and have same length.
        if (this === pArray) {
            return true;
        }
        else if (!pArray || this.length !== pArray.length) {
            return false;
        }
        // Check each item.
        for (let lIndex = 0; lIndex < this.length; ++lIndex) {
            if (this[lIndex] !== pArray[lIndex]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Removes the first appearence of a value.
     *
     * @param pValue - Target value to remove.
     *
     * @returns removed element. When no element was removed, undefined is returned instead.
     *
     * @example Remove a existing and a none existing item of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 3, 2);
     *
     * const removedElement = list.remove(1); // => 1
     * const noneExistingElement = list.remove(4); // => undefined
     * ```
     */
    remove(pValue) {
        const lFoundIndex = this.indexOf(pValue);
        // Only remove if found.
        if (lFoundIndex !== -1) {
            return this.splice(lFoundIndex, 1)[0];
        }
        return undefined;
    }
    /**
     * Replace first appearence of value.
     *
     * @param pOldValue - Target value to replace.
     * @param pNewValue - Replacement value.
     *
     * @returns replaced element. When no element was replaced, undefined is returned instead.
     *
     * @example Replace a existing and a none existing item of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 5, 3);
     *
     * const removedElement = list.replace(5, 2); // => 5
     * const noneExistingElement = list.replace(4, 3); // => undefined
     *
     * console.log(list); // => [1, 2, 3]
     * ```
     */
    replace(pOldValue, pNewValue) {
        const lFoundIndex = this.indexOf(pOldValue);
        // Only replace if found.
        if (lFoundIndex !== -1) {
            // Save old value and replace it with new value.
            const lOldValue = this[lFoundIndex];
            this[lFoundIndex] = pNewValue;
            return lOldValue;
        }
        return undefined;
    }
    /**
     * Returns a string representation of this list.
     * @override base objects {@link Array.toString}
     *
     * @returns string representation for this list.
     *
     * @example Output a string representation of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 2, 3);
     * console.log(list.toString()); // => [1, 2, 3]
     * ```
     */
    toString() {
        return `[${super.join(', ')}]`;
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/data_container/stack.js":
/*!*********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/data_container/stack.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Stack = void 0;
/**
 * Simple and fast stack implementation based on references.
 *
 * @public
 */
class Stack {
    /**
     * Get current stack size.
     */
    get size() {
        return this.mSize;
    }
    /**
     * Current top item of stack.
     * Returns undefined when no item is stacked.
     */
    get top() {
        // Undefined when no item is stacked.
        if (!this.mTopItem) {
            return undefined;
        }
        return this.mTopItem.value;
    }
    /**
     * Constructor.
     */
    constructor() {
        this.mTopItem = null;
        this.mSize = 0;
    }
    /**
     * Clones the references of all stack items into a new one.
     * Does only shallow copy.
     *
     * @returns The cloned stack.
     */
    clone() {
        const lClonedStack = new Stack();
        // Only thing that needs to be cloned is the current reference.
        lClonedStack.mTopItem = this.mTopItem;
        lClonedStack.mSize = this.mSize;
        return lClonedStack;
    }
    /**
     * Iterates over each stack entry in reversed (newest...oldest) order.
     *
     * @returns Generator.
     */
    *entries() {
        let lCurrentItem = this.mTopItem;
        while (lCurrentItem !== null) {
            yield lCurrentItem.value;
            lCurrentItem = lCurrentItem.previous;
        }
    }
    /**
     * Clear stack and get all stacked items in stack order.
     *
     * @returns All stacked values in top to down order.
     *
     * @example Flush Stack
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     *
     * // Flush all items. Clears stack.
     * const stackValues = stack.flush(); // => [3, 2, 1];
     * console.log(stack.top); // => undefined
     * ```
     */
    flush() {
        const lValueList = new Array();
        // Pop items as long as there are stack items.
        // Don't check poped value as next indicator as it can contain undefined.
        while (this.mTopItem) {
            lValueList.push(this.pop());
        }
        return lValueList;
    }
    /**
     * Removes the current top item of stack.
     * When no item is stacked nothing happends and undefined is returned.
     *
     * @returns Current top item. When no item was stacked, undefined is returned instead.
     *
     * @example Pop current top item.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     *
     * // Check current stacked top item before and after poping.
     * console.log(stack.top); // => 3
     * const stackValues = stack.pop(); // => 3;
     * console.log(stack.top); // => 2
     * ```
     */
    pop() {
        // Undefined when no item is stacked.
        if (!this.mTopItem) {
            return undefined;
        }
        // Buffer current top value.
        const lCurrentTopValue = this.mTopItem.value;
        // Replace current top item with previous stacked.
        this.mTopItem = this.mTopItem.previous;
        this.mSize--;
        return lCurrentTopValue;
    }
    /**
     * Push new value as top item of stack. Replaces the current top item.
     * @param pValue - Next value placed on top.
     *
     * @example Push next top item.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);

     *
     * // Check current stacked top item before and after pushing.
     * console.log(stack.top); // => 1
     * stack.push(2);
     * console.log(stack.top); // => 2
     * ```
     */
    push(pValue) {
        // Create new stack item with the current top item as reference. 
        const lNextItem = {
            previous: this.mTopItem,
            value: pValue
        };
        // Replace current top item with next.
        this.mTopItem = lNextItem;
        this.mSize++;
    }
    /**
     * Converts this stack into an array.
     * The first item in the array is the last item pushed into the stack.
     *
     * @returns The current stack as array.
     *
     * @example Stack into array.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     *
     * // Stack to array.
     * console.log(stack.toArray()); // => [3, 2, 1]
     * ```
     */
    toArray() {
        // Convert genertor into array.
        return [...this.entries()];
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/exception/exception.js":
/*!********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/exception/exception.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Exception = void 0;
/**
 * Extends {@link Error} by a {@link Exception.target} reference.
 *
 * @typeParam T - Exception target type.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 *
 * @public
 */
class Exception extends Error {
    /**
     * Target of exception.
     *
     * @readonly
     */
    get target() {
        return this.mTarget;
    }
    /**
     * Constructor.
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target of exception.
     */
    constructor(pMessage, pTarget) {
        super(pMessage);
        this.mTarget = pTarget;
    }
}
exports.Exception = Exception;
//# sourceMappingURL=exception.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/index.js":
/*!******************************************************!*\
  !*** ../kartoffelgames.core/library/source/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MyersDiff = exports.ChangeState = exports.TypeUtil = exports.EnumUtil = exports.Stack = exports.Exception = exports.List = exports.Dictionary = void 0;
/**
 * Library for data container and easier data access.
 *
 * @remarks
 * This package consists mostly of helper classes and storage types, aimed at reducing code redundance and improving clarity.
 *
 * @packageDocumentation
 */
// Container.
var dictionary_1 = __webpack_require__(/*! ./data_container/dictionary */ "../kartoffelgames.core/library/source/data_container/dictionary.js");
Object.defineProperty(exports, "Dictionary", ({ enumerable: true, get: function () { return dictionary_1.Dictionary; } }));
var list_1 = __webpack_require__(/*! ./data_container/list */ "../kartoffelgames.core/library/source/data_container/list.js");
Object.defineProperty(exports, "List", ({ enumerable: true, get: function () { return list_1.List; } }));
var exception_1 = __webpack_require__(/*! ./exception/exception */ "../kartoffelgames.core/library/source/exception/exception.js");
Object.defineProperty(exports, "Exception", ({ enumerable: true, get: function () { return exception_1.Exception; } }));
var stack_1 = __webpack_require__(/*! ./data_container/stack */ "../kartoffelgames.core/library/source/data_container/stack.js");
Object.defineProperty(exports, "Stack", ({ enumerable: true, get: function () { return stack_1.Stack; } }));
// Handler.
var enum_util_1 = __webpack_require__(/*! ./util/enum-util */ "../kartoffelgames.core/library/source/util/enum-util.js");
Object.defineProperty(exports, "EnumUtil", ({ enumerable: true, get: function () { return enum_util_1.EnumUtil; } }));
var type_util_1 = __webpack_require__(/*! ./util/type-util */ "../kartoffelgames.core/library/source/util/type-util.js");
Object.defineProperty(exports, "TypeUtil", ({ enumerable: true, get: function () { return type_util_1.TypeUtil; } }));
// Algorythms
var myers_diff_1 = __webpack_require__(/*! ./algorithm/myers-diff */ "../kartoffelgames.core/library/source/algorithm/myers-diff.js");
Object.defineProperty(exports, "ChangeState", ({ enumerable: true, get: function () { return myers_diff_1.ChangeState; } }));
Object.defineProperty(exports, "MyersDiff", ({ enumerable: true, get: function () { return myers_diff_1.MyersDiff; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/util/enum-util.js":
/*!***************************************************************!*\
  !*** ../kartoffelgames.core/library/source/util/enum-util.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnumUtil = void 0;
/**
 * Static helper type to read data from enum objects.
 *
 * @public
 */
class EnumUtil {
    /**
     * Infers value into enum type.
     * When the values can not be infered into the specified enum, undefined is returned.
     *
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     *
     * @typeParam T - Enum type the value should be infered into.
     *
     * @returns Infered `pValue` parameter or undefined when the value does not exists as the enums value.
     *
     * @example Try to cast two possible enum values.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const existingValue = EnumUtil.cast<MyEnum>(MyEnum, 1); // => MyEnum.Entry1
     * const noneExistingValue = EnumUtil.cast<MyEnum>(MyEnum, 5); // => undefined
     * ```
     */
    static cast(pEnum, pValue) {
        // Thats it... :)
        if (EnumUtil.exists(pEnum, pValue)) {
            return pValue;
        }
        else {
            return undefined;
        }
    }
    /**
     * Check value existence on a enum object.
     * Infers `pValue` parameter as enum type.
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     *
     * @typeParam T - Enum type the value should be infered into.
     *
     * @returns True when the value can be casted into enum.
     *
     * @example Check existence of one two possible enum values.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const existingValue = EnumUtil.exists(MyEnum, 1); // => True
     * const noneExistingValue = EnumUtil.exists(MyEnum, 5); // => False
     * ```
     */
    static exists(pEnum, pValue) {
        return EnumUtil.valuesOf(pEnum).includes(pValue);
    }
    /**
     * Return all keys of an enum as array.
     *
     * @param pEnum - typeof Enum object.
     *
     * @returns All enum key as array in defined order.
     *
     * @remarks
     * Does only work for number enums and should fail for mixed or string enums.
     *
     * @example Read enum names from custom enum object.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const enumNames = EnumUtil.namesOf(MyEnum); // => ['Entry1', 'Entry2']
     * ```
     */
    static namesOf(pEnum) {
        // Convert enum to key array.
        return Object.keys(pEnum).filter((pKey) => isNaN(Number(pKey)));
    }
    /**
     * Return all values of an enum as array.
     *
     * @param pEnum - typeof Enum object.
     *
     * @typeParam T - Enum value type.
     *
     * @returns All enum values as array in defined order.
     *
     * @example Read enum values from custom enum object.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const enumValues = EnumUtil.valuesOf(MyEnum); // => [1, 2]
     * ```
     */
    static valuesOf(pEnum) {
        const lEnumValues = new Array();
        // Convert enum to vaue array by iterating over all keys.
        for (const lKey of EnumUtil.namesOf(pEnum)) {
            lEnumValues.push(pEnum[lKey]);
        }
        return lEnumValues;
    }
}
exports.EnumUtil = EnumUtil;
//# sourceMappingURL=enum-util.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/util/type-util.js":
/*!***************************************************************!*\
  !*** ../kartoffelgames.core/library/source/util/type-util.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeUtil = void 0;
/**
 * Static helper type to read data from objects.
 *
 * @public
 */
class TypeUtil {
    /**
     * Get name of objects property.
     * @param pName - Property name.
     *
     * @typeParam T - Object with any string key property.
     *
     * @returns the name of property.
     *
     * @remarks
     * Acts more as a type safe way of accessing property names of a type.
     *
     * @example Read enum names from custom enum object.
     * ``` Typescript
     * class MyClass {
     *    public myProperty: number = 1;
     * }
     *
     * const propertyName = TypeUtil.nameOf<MyClass>('myProperty'); // => 'myProperty'
     * ```
     *
     * @experimental @alpha
     */
    static nameOf(pName) {
        return pName;
    }
}
exports.TypeUtil = TypeUtil;
//# sourceMappingURL=type-util.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./page/source/index.ts");
/******/ 	Page = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=page.js.map