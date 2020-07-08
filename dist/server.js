/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./handler.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./handler.ts":
/*!********************!*\
  !*** ./handler.ts ***!
  \********************/
/*! exports provided: main */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "main", function() { return main; });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_root_object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/root-object */ "./src/root-object.ts");
/* harmony import */ var _src_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/context */ "./src/context.ts");
/* harmony import */ var graphql_iso_date__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! graphql-iso-date */ "graphql-iso-date");
/* harmony import */ var graphql_iso_date__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(graphql_iso_date__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _src_schema_graphql__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./src/schema.graphql */ "./src/schema.graphql");
/* harmony import */ var _src_schema_graphql__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_src_schema_graphql__WEBPACK_IMPORTED_MODULE_5__);





///@ts-ignore

const main = async (event) => {
    const headers = {
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": true,
    };
    try {
        if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(event.body)) {
            throw new Error('ERROR: There was no request body present');
        }
        const body = JSON.parse(event.body);
        const variables = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["get"])(body, 'variables', {});
        if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEmpty"])(body.query) || !Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isString"])(body.query)) {
            throw new Error(`ERROR; There was not 'query' provided.`);
        }
        // Run the graphQL, i find it easier on the client if the request just fails 
        // if there are errors, so we'll map the 'errors' into an Error if it's non-empty
        const result = await Object(graphql__WEBPACK_IMPORTED_MODULE_0__["graphql"])(Object(graphql__WEBPACK_IMPORTED_MODULE_0__["buildASTSchema"])(_src_schema_graphql__WEBPACK_IMPORTED_MODULE_5___default.a), body.query, _src_root_object__WEBPACK_IMPORTED_MODULE_2__["root"], new _src_context__WEBPACK_IMPORTED_MODULE_3__["ServiceContext"](event), variables);
        /*if (Array.isArray(result.errors)) {
            const messages = result.errors.map((error:any) => {
                    if (isString(error.message))
                        return error.message;
                    return String(error);
                });
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    code: "GRAPHQL_FAILURE",
                    errors: messages
                })
            };

        } else if (isString(result.errors)) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    code: "GRAPHQL_FAILURE",
                    errors:[ String(result.errors) ]
                })
            }
        }*/
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };
    }
    catch (error) {
        let message = String(error);
        if (error instanceof Error)
            message = message.toString();
        else if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isString"])(error.message))
            message = error.message;
        const code = 'UNKNOWN_ERROR';
        return ({
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message,
                code
            })
        });
    }
};


/***/ }),

/***/ "./src/context.ts":
/*!************************!*\
  !*** ./src/context.ts ***!
  \************************/
/*! exports provided: ServiceContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceContext", function() { return ServiceContext; });
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-sdk */ "aws-sdk");
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_find_header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/find-header */ "./src/utils/find-header.ts");



const cognitoProvider = new aws_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.CognitoIdentityServiceProvider();
/**
 * Implementation of the service context.  Right now this extracts
 * the user infromation to provide authentication information.
 */
class ServiceContext {
    constructor(event) {
        this._token = null;
        this._user = null;
        this._checkedUser = false;
        // Check for our authorization header, if it's present store it
        // so we can use it later if necessary.
        const authorization = Object(_utils_find_header__WEBPACK_IMPORTED_MODULE_2__["findHeader"])(event.headers, 'authorization');
        if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isString"])(authorization) && authorization.startsWith('Bearer')) {
            this._token = authorization.substr(6).trim();
        }
    }
    // Intenral function which retrieves the user from the Congnito service
    // if it has not already been checked.
    async _getUser() {
        if (this._token && !this._checkedUser) {
            try {
                const params = { AccessToken: this._token };
                this._user = await cognitoProvider.getUser(params).promise();
            }
            catch (error) {
                this._user = null;
            }
            this._checkedUser = true;
        }
        return this._user;
    }
    /**
     * Returns true if we have an authenticated user
     */
    async isAuthenticated() {
        const user = await this._getUser();
        return (!Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(user) && Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isString"])(user.Username) && !Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEmpty"])(user.UserAttributes));
    }
    /**
     * Retrieves the user id for our user, returns null if we don't already
     * have an authenticated user, if we do it returns unique indentifier for
     * the specified user.
     */
    async getUserId() {
        const authenticated = await this.isAuthenticated();
        if (!authenticated || (this._user === null)) {
            throw new Error(`Unauthorized`);
        }
        const sub = this._user.UserAttributes.find((attr => attr.Name === 'sub'));
        if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(sub) || Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEmpty"])(sub.Value)) {
            throw new Error('Unauthorized');
        }
        return sub.Value;
    }
}


/***/ }),

/***/ "./src/models/index.ts":
/*!*****************************!*\
  !*** ./src/models/index.ts ***!
  \*****************************/
/*! exports provided: Note */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _note__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./note */ "./src/models/note.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Note", function() { return _note__WEBPACK_IMPORTED_MODULE_0__["Note"]; });




/***/ }),

/***/ "./src/models/note.ts":
/*!****************************!*\
  !*** ./src/models/note.ts ***!
  \****************************/
/*! exports provided: Note */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Note", function() { return Note; });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "uuid");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_0__);

class Note {
    constructor(user) {
        this.content = null;
        this.attachment = null;
        this.userId = user;
        this.noteId = Object(uuid__WEBPACK_IMPORTED_MODULE_0__["v4"])();
        this._createdAt = (new Date()).toJSON();
        this._updatedAt = this._createdAt;
    }
    get createdAt() {
        return new Date(this._createdAt);
    }
    get updatedAt() {
        return new Date(this._updatedAt);
    }
    setUpdate() {
        this._updatedAt = (new Date()).toJSON();
    }
}


/***/ }),

/***/ "./src/resolvers/create-note.ts":
/*!**************************************!*\
  !*** ./src/resolvers/create-note.ts ***!
  \**************************************/
/*! exports provided: createNote */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNote", function() { return createNote; });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ "./src/models/index.ts");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../storage */ "./src/storage/index.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);



const createNote = async ({ input }, context) => {
    const userId = await context.getUserId();
    if (!Object(lodash__WEBPACK_IMPORTED_MODULE_2__["isString"])(input.content))
        throw new Error(`The content of a note must be a string got: ${typeof input.content}`);
    const note = new _models__WEBPACK_IMPORTED_MODULE_0__["Note"](userId);
    note.content = input.content || null;
    note.attachment = input.attachment || null;
    console.log(note);
    return await _storage__WEBPACK_IMPORTED_MODULE_1__["NoteStore"].put(note);
};


/***/ }),

/***/ "./src/resolvers/delete-note.ts":
/*!**************************************!*\
  !*** ./src/resolvers/delete-note.ts ***!
  \**************************************/
/*! exports provided: deleteNote */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteNote", function() { return deleteNote; });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storage */ "./src/storage/index.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


const deleteNote = async ({ noteId }, context) => {
    const userId = context.getUserId();
    const note = await _storage__WEBPACK_IMPORTED_MODULE_0__["NoteStore"].get({
        Key: {
            userId,
            noteId
        }
    });
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(note)) {
        throw new Error(`Unable to locate note: ${userId}::${noteId}`);
    }
    return await _storage__WEBPACK_IMPORTED_MODULE_0__["NoteStore"].delete({
        Key: {
            userId,
            noteId
        }
    });
};


/***/ }),

/***/ "./src/resolvers/get-note.ts":
/*!***********************************!*\
  !*** ./src/resolvers/get-note.ts ***!
  \***********************************/
/*! exports provided: getNote */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNote", function() { return getNote; });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storage */ "./src/storage/index.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


const getNote = async ({ noteId }, context) => {
    const userId = await context.getUserId();
    if (!Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isString"])(noteId) || Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEmpty"])(noteId))
        throw new Error(`An invalid value for 'noteId' was provided: "${String(noteId)}"`);
    const note = await _storage__WEBPACK_IMPORTED_MODULE_0__["NoteStore"].get({
        Key: {
            userId,
            noteId
        }
    });
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(note))
        throw new Error(`Unable to locate note: ${userId}::${noteId}`);
    return note;
};


/***/ }),

/***/ "./src/resolvers/index.ts":
/*!********************************!*\
  !*** ./src/resolvers/index.ts ***!
  \********************************/
/*! exports provided: getNote, createNote, notes, updateNote, deleteNote */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _get_note__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-note */ "./src/resolvers/get-note.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getNote", function() { return _get_note__WEBPACK_IMPORTED_MODULE_0__["getNote"]; });

/* harmony import */ var _create_note__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-note */ "./src/resolvers/create-note.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createNote", function() { return _create_note__WEBPACK_IMPORTED_MODULE_1__["createNote"]; });

/* harmony import */ var _notes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./notes */ "./src/resolvers/notes.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "notes", function() { return _notes__WEBPACK_IMPORTED_MODULE_2__["notes"]; });

/* harmony import */ var _update_note__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./update-note */ "./src/resolvers/update-note.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "updateNote", function() { return _update_note__WEBPACK_IMPORTED_MODULE_3__["updateNote"]; });

/* harmony import */ var _delete_note__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./delete-note */ "./src/resolvers/delete-note.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deleteNote", function() { return _delete_note__WEBPACK_IMPORTED_MODULE_4__["deleteNote"]; });








/***/ }),

/***/ "./src/resolvers/notes.ts":
/*!********************************!*\
  !*** ./src/resolvers/notes.ts ***!
  \********************************/
/*! exports provided: notes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "notes", function() { return notes; });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storage */ "./src/storage/index.ts");

const notes = async (_, context) => {
    const userId = await context.getUserId();
    const notes = await _storage__WEBPACK_IMPORTED_MODULE_0__["NoteStore"].query({
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ':userId': userId
        }
    });
    console.log('notes', notes);
    return notes;
};


/***/ }),

/***/ "./src/resolvers/update-note.ts":
/*!**************************************!*\
  !*** ./src/resolvers/update-note.ts ***!
  \**************************************/
/*! exports provided: updateNote */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateNote", function() { return updateNote; });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storage */ "./src/storage/index.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


const updateNote = async ({ input, noteId }, context) => {
    const userId = await context.getUserId();
    const note = await _storage__WEBPACK_IMPORTED_MODULE_0__["NoteStore"].get({
        Key: {
            userId,
            noteId
        }
    });
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(note)) {
        throw new Error(`Unable to locate note: ${userId}::${noteId}`);
    }
    note.attachment = input.attachment || null;
    note.content = input.content || null;
    note.setUpdate();
    await _storage__WEBPACK_IMPORTED_MODULE_0__["NoteStore"].update({
        Key: {
            userId,
            noteId
        },
        UpdateExpression: `SET content = :content, #updated = :updated, attachment =  :attachment`,
        ExpressionAttributeNames: {
            '#updated': '_updatedAt'
        },
        ExpressionAttributeValues: {
            ':content': note.content,
            ':attachment': note.attachment,
            ':updated': note.updatedAt.toJSON()
        }
    });
    console.log(note);
    return note;
};


/***/ }),

/***/ "./src/root-object.ts":
/*!****************************!*\
  !*** ./src/root-object.ts ***!
  \****************************/
/*! exports provided: root */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "root", function() { return root; });
/* harmony import */ var _resolvers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./resolvers */ "./src/resolvers/index.ts");

const root = {
    createNote: _resolvers__WEBPACK_IMPORTED_MODULE_0__["createNote"],
    note: _resolvers__WEBPACK_IMPORTED_MODULE_0__["getNote"],
    notes: _resolvers__WEBPACK_IMPORTED_MODULE_0__["notes"],
    updateNote: _resolvers__WEBPACK_IMPORTED_MODULE_0__["updateNote"],
    deleteNote: _resolvers__WEBPACK_IMPORTED_MODULE_0__["deleteNote"]
};


/***/ }),

/***/ "./src/schema.graphql":
/*!****************************!*\
  !*** ./src/schema.graphql ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"DateTime"},"directives":[]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"NoteInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachment"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Note"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"noteId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attachment"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createdAt"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updatedAt"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"noteId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"notes"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateNote"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"noteId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteNote"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"noteId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]}],"loc":{"start":0,"end":431}};
    doc.loc.source = {"body":"scalar DateTime\n\ninput NoteInput {\n    content: String!\n    attachment: String\n}\n\ntype Note {\n    noteId: ID!\n    content: String!\n    attachment: String\n    createdAt: DateTime!\n    updatedAt: DateTime!\n    userId: ID!\n}\n\ntype Query {\n    note(noteId: ID!): Note\n    notes: [Note]!\n}\n\ntype Mutation {\n    createNote(input: NoteInput): Note\n    updateNote(noteId: ID!, input: NoteInput): Note\n    deleteNote(noteId: ID!): Boolean\n}","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ "./src/storage/index.ts":
/*!******************************!*\
  !*** ./src/storage/index.ts ***!
  \******************************/
/*! exports provided: NoteStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _note_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./note-storage */ "./src/storage/note-storage.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NoteStore", function() { return _note_storage__WEBPACK_IMPORTED_MODULE_0__["NoteStore"]; });




/***/ }),

/***/ "./src/storage/note-storage.ts":
/*!*************************************!*\
  !*** ./src/storage/note-storage.ts ***!
  \*************************************/
/*! exports provided: NoteStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoteStore", function() { return NoteStore; });
/* harmony import */ var _storage_t__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage-t */ "./src/storage/storage-t.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models */ "./src/models/index.ts");


class NoteStorage extends _storage_t__WEBPACK_IMPORTED_MODULE_0__["Storage"] {
    constructor() {
        super('notes', _models__WEBPACK_IMPORTED_MODULE_1__["Note"]);
    }
}
const NoteStore = new NoteStorage();


/***/ }),

/***/ "./src/storage/storage-t.ts":
/*!**********************************!*\
  !*** ./src/storage/storage-t.ts ***!
  \**********************************/
/*! exports provided: Storage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Storage", function() { return Storage; });
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-sdk */ "aws-sdk");
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


const dbClient = new aws_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.DynamoDB.DocumentClient();
class Storage {
    constructor(table, ctor) {
        this._table = table;
        this._ctor = ctor;
    }
    get(params) {
        return new Promise((resolve, reject) => {
            dbClient.get({
                ...params,
                TableName: this._table
            }).promise().then((result) => {
                console.log('result', result);
                if (!Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(result.Item)) {
                    resolve(Object.assign(new this._ctor(), result.Item));
                }
                else {
                    resolve(null);
                }
            }, reject);
        });
    }
    async put(object) {
        return new Promise((resolve, reject) => {
            dbClient.put({
                TableName: this._table,
                Item: object
            }).promise().then(() => resolve(object), reject);
        });
    }
    query(params) {
        return new Promise((resolve, reject) => {
            dbClient.query({
                ...params,
                TableName: this._table
            }).promise().then((result) => {
                console.log('result:', result);
                resolve(!Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isNil"])(result.Items) ?
                    result.Items.map((i) => Object.assign(new this._ctor(), i)) :
                    []);
            }, reject);
        });
    }
    update(params) {
        return new Promise((resolve, reject) => {
            dbClient.update({
                ...params,
                TableName: this._table
            }).promise().then(() => resolve(true), reject);
        });
    }
    delete(params) {
        return new Promise((resolve, reject) => {
            dbClient.delete({
                ...params,
                TableName: this._table
            }).promise().then(() => resolve(true), reject);
        });
    }
}


/***/ }),

/***/ "./src/utils/find-header.ts":
/*!**********************************!*\
  !*** ./src/utils/find-header.ts ***!
  \**********************************/
/*! exports provided: findHeader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findHeader", function() { return findHeader; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Searches the specified object (of http headers) for the specified header
 * which are case insenstive, while Javascript properties are not.
 *
 * @param headers The list of the headers (any case)
 * @param find The header to find (any case)
 */
const findHeader = (headers, find) => {
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_0__["isNil"])(headers))
        return null;
    const lcFind = find.toLowerCase();
    for (let header in headers) {
        if (header.toLowerCase() === lcFind)
            return headers[header];
    }
    return null;
};


/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-iso-date":
/*!***********************************!*\
  !*** external "graphql-iso-date" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-iso-date");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map