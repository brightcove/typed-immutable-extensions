'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('typed-immutable'),
    Record = _require.Record,
    Typed = _require.Typed,
    typeOf = _require.typeOf,
    Any = _require.Any;

/**
 * Extends a record type and allows the addition of new fields
 * 
 * @param {Record} BaseRecord - Record to extend
 * @param {object} descriptor - Descriptor object of new fields to add
 * @param {string} [label] - Label for the new Record type
 * 
 * @example
 * const BaseValue = Record({
 *   type: String,
 * });
 * 
 * const StringValue = extend(BaseValue, {
 *   value: String,
 * });
 * 
 * const NumberValue = extend(BaseValue, {
 *   value: Number,
 * });
 */


function extend(BaseRecord, descriptor, label) {
  var _properties;

  if (!BaseRecord || typeof BaseRecord !== 'function' || !(BaseRecord.prototype instanceof Record)) {
    throw new TypeError('BaseRecord must be a Record type');
  }
  if (!descriptor || (typeof descriptor === 'undefined' ? 'undefined' : _typeof(descriptor)) !== "object") {
    throw TypeError('A descriptor of fields is required');
  }

  var type = Object.create(null);
  var entries = Object.entries(descriptor);
  if (!entries.length) {
    throw new TypeError('At least one field must be defined');
  }
  var properties = (_properties = {
    size: {
      value: BaseRecord.prototype.size + entries.length
    }
  }, _defineProperty(_properties, Typed.type, {
    value: type
  }), _defineProperty(_properties, Typed.label, {
    value: label
  }), _properties);

  Object.assign(type, BaseRecord.prototype[Typed.type]);

  var _loop = function _loop(key, value) {
    var fieldType = typeOf(value);

    if (fieldType) {
      type[key] = fieldType;
      properties[key] = {
        get: function get() {
          return this.get(key);
        },
        set: function set(value) {
          if (!this.__ownerID) {
            throw TypeError('Cannot set on an immutable record.');
          }
          this.set(key, value);
        },
        enumerable: true
      };
    } else {
      throw TypeError('Invalid field descriptor provided for "' + key + '" field');
    }
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var key = _ref2[0];
      var value = _ref2[1];

      _loop(key, value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var RecordType = function RecordType(structure) {
    return BaseRecord.call(this, structure);
  };
  properties.constructor = {
    value: RecordType
  };
  RecordType.prototype = Object.create(BaseRecord.prototype, properties);

  return RecordType;
}

/**
 * Defines an optional type, similar to typed-immutable's [Maybe]{@link https://github.com/typed-immutable/typed-immutable#maybe}, but provides extended options.
 * 
 * Benefits over typed-immutable's Maybe:
 * - Allows both `undefined` and `null` as values
 * - Allows defining a default value for when the value is `undefined`
 * - Extracts the default value from the Type parameter if one is defined
 * 
 * @param {*} Type - Type of the value
 * @param {*} [defaultValue] - Default value (must be `undefined`, `null`, or of the specified Type)
 * 
 * @example
 * const MyRecord = Record({
 *  //Required string
 *  id: String,
 *  //Required string with a default value
 *  name: 'Some Name',
 *  //Optional string - defaults to undefined
 *  value: Maybe(String),
 *  //Optional string with a default value
 *  type: Maybe(String, 'point'),
 *  //Optional string with a default value (extracted from the type)
 *  text: Maybe('Some Text'),
 *  //Optional string with a default value of null
 *  title: Maybe(String, null),
 *});
 */
function Maybe(Type, defaultValue) {
  var type = typeOf(Type);
  if (type === Any) {
    throw TypeError(Type + ' is not a valid type');
  }
  if (defaultValue != null) {
    defaultValue = type[Typed.read](defaultValue);
    if (defaultValue instanceof TypeError) {
      throw TypeError(defaultValue + ' is not nully nor of ' + type[Typed.typeName]() + ' type');
    }
  }
  if (typeof defaultValue === 'undefined' && typeof type[Typed.defaultValue] !== 'undefined') {
    defaultValue = type[Typed.defaultValue];
  }

  return Typed('Maybe(' + type[Typed.typeName]() + ')', function (value) {
    var result = void 0;
    if (value == null) {
      result = value;
    } else {
      result = type[Typed.read](value);
    }

    if (result instanceof TypeError) {
      return TypeError('"' + value + '" is not nully nor it is of ' + type[Typed.typeName]() + ' type');
    }
    return result;
  }, defaultValue);
}

/**
 * Restricts the values which can be set on a property.
 * 
 * @param {Array.<*>} enumValues - Array of possible values
 * @param {*} [defaultValue] - Default value (must be in the set of enumValues)
 * 
 * @example
 * const MyRecord = Record({
 *   //Restricts values to "text" and "image"
 *   type: Enum(['text', 'image']),
 *   //Restricts values to "left", "center" and "image" with a default value of "left" if the value is undefined
 *   alignment: Enum(['left', 'center', 'right'], 'left')
 * });
 */
function Enum(enumValues, defaultValue) {
  if (!Array.isArray(enumValues)) {
    throw new TypeError(enumValues + ' must be an array');
  }
  if (!enumValues.length) {
    throw new TypeError(enumValues + ' must contain elements');
  }
  var enumValueString = enumValues.join(', ');
  if (typeof defaultValue !== 'undefined' && !enumValues.includes(defaultValue)) {
    throw new TypeError(defaultValue + ' is not in the set {' + enumValueString + '}');
  }
  return Typed('Enum(' + enumValueString + ')', function (value) {
    if (!enumValues.includes(value)) {
      return new TypeError(value + ' is not in the set {' + enumValueString + '}');
    }
    return value;
  }, defaultValue);
}

/**
 * Chooses the type to use based on the value of a property.
 * 
 * @param {string} property - Property to use for determining the type
 * @param {object.<Record>} typeMap - Map of property values to types
 * @param {Record} [defaultType] - Default type when no property value is found in the typeMap
 * 
 * @example
 * const StringValue = Record({
 *   type: String,
 *   value: String,
 * });
 * 
 * const NumberValue = Record({
 *   type: String,
 *   value: Number,
 * });
 * 
 * const AnyValue = Record({
 *   type: String,
 *   value: Any,
 * });
 * 
 * const MyRecord = Record({
 *   //Chooses the Record type to use based on the "type" property value
 *   value: Discriminator('type', {
 *     'string': StringValue,
 *     'number': NumberValue,
 *   }),
 *   //Defaults to AnyValue if no matching type is found
 *   other: Discriminator('type', {
 *     'string': StringValue,
 *     'number': NumberValue,
 *   }, AnyValue),
 * });
 */
function Discriminator(property, typeMap, defaultType) {
  if (!property || typeof property !== 'string') {
    throw new TypeError(property + ' must be a string');
  }
  if (!typeMap || (typeof typeMap === 'undefined' ? 'undefined' : _typeof(typeMap)) !== 'object') {
    throw new TypeError(typeMap + ' must be an object');
  }
  if (!Object.keys(typeMap).length) {
    throw new TypeError(typeMap + ' must contain at least one type mapping');
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.entries(typeMap)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _ref3 = _step2.value;

      var _ref4 = _slicedToArray(_ref3, 2);

      var key = _ref4[0];
      var type = _ref4[1];

      if (!type || typeof type !== 'function' || !(type.prototype instanceof Record)) {
        throw new TypeError(key + ' type must be a record');
      }
      if (!(property in type.prototype)) {
        throw new TypeError(key + ' type must have a ' + property + ' property');
      }
      if (type.prototype[Typed.type][property] !== Typed.String.prototype) {
        throw new TypeError(key + '.' + property + ' must be a String type');
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (typeof defaultType !== 'undefined') {
    if (!defaultType || typeof defaultType !== 'function' || !(defaultType.prototype instanceof Record)) {
      throw new TypeError('default type must be a record');
    }
    if (!(property in defaultType.prototype)) {
      throw new TypeError('default type must have a ' + property + ' property');
    }
    if (defaultType.prototype[Typed.type][property] !== Typed.String.prototype) {
      throw new TypeError('default.' + property + ' must be a String type');
    }
  }
  return Typed('Discriminator(' + property + ')', function (value) {
    if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
      return new TypeError(value + ' is not an object');
    }
    if (!(property in value)) {
      return new TypeError(value + ' does not have a ' + property + ' property');
    }
    var type = typeMap[value[property]] || defaultType;
    if (typeof type === 'undefined') {
      return new TypeError(value[property] + ' is not in the set {' + Object.keys(typeMap).join(', ') + '}');
    }
    return value instanceof type ? value : new type(value);
  });
}

module.exports = {
  extend: extend,
  Maybe: Maybe,
  Enum: Enum,
  Discriminator: Discriminator
};