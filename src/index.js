const { Record, Typed, typeOf, Any } = require('typed-immutable');

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
function Maybe (Type, defaultValue) {
  const type = typeOf(Type);
  if (type === Any) {
    throw TypeError(`${Type} is not a valid type`);
  }
  if (defaultValue != null) {
    defaultValue = type[Typed.read](defaultValue);
    if (defaultValue instanceof TypeError) {
      throw TypeError(`${defaultValue} is not nully nor of ${type[Typed.typeName]()} type`);
    }
  }
  if (typeof defaultValue === 'undefined' && typeof type[Typed.defaultValue] !== 'undefined') {
    defaultValue = type[Typed.defaultValue];
  }

  return Typed(`Maybe(${type[Typed.typeName]()})`, value => {
    let result;
    if (value == null) {
      result = value;
    } else {
      result = type[Typed.read](value);
    }

    if (result instanceof TypeError) {
      return TypeError(`"${value}" is not nully nor it is of ${type[Typed.typeName]()} type`);
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
function Enum (enumValues, defaultValue) {
  if (!Array.isArray(enumValues)) {
    throw new TypeError(`${enumValues} must be an array`);
  }
  if (!enumValues.length) {
    throw new TypeError(`${enumValues} must contain elements`);
  }
  const enumValueString = enumValues.join(', ');
  if (typeof defaultValue !== 'undefined' && !enumValues.includes(defaultValue)) {
    throw new TypeError(`${defaultValue} is not in the set {${enumValueString}}`);
  }
  return Typed(`Enum(${enumValueString})`, value => {
    if (!enumValues.includes(value)) {
      return new TypeError(`${value} is not in the set {${enumValueString}}`);
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
function Discriminator (property, typeMap, defaultType) {
  if (!property || typeof property !== 'string') {
    throw new TypeError(`${property} must be a string`);
  }
  if (!typeMap || typeof typeMap !== 'object') {
    throw new TypeError(`${typeMap} must be an object`);
  }
  if (!Object.keys(typeMap).length) {
    throw new TypeError(`${typeMap} must contain at least one type mapping`);
  }
  for (const [key, type] of Object.entries(typeMap)) {
    if (!type || typeof type !== 'function' || !(type.prototype instanceof Record)) {
      throw new TypeError(`${key} type must be a record`);
    }
    if (!(property in type.prototype)) {
      throw new TypeError(`${key} type must have a ${property} property`);
    }
    if (type.prototype[Typed.type][property] !== Typed.String.prototype) {
      throw new TypeError(`${key}.${property} must be a String type`);
    }
  }
  if (typeof defaultType !== 'undefined') {
    if (!defaultType || typeof defaultType !== 'function' || !(defaultType.prototype instanceof Record)) {
      throw new TypeError('default type must be a record');
    }
    if (!(property in defaultType.prototype)) {
      throw new TypeError(`default type must have a ${property} property`);
    }
    if (defaultType.prototype[Typed.type][property] !== Typed.String.prototype) {
      throw new TypeError(`default.${property} must be a String type`);
    }
  }
  return Typed(`Discriminator(${property})`, value => {
    if (!value || typeof value !== 'object') {
      return new TypeError(`${value} is not an object`);
    }
    if (!(property in value)) {
      return new TypeError(`${value} does not have a ${property} property`);
    }
    const type = typeMap[value[property]] || defaultType;
    if (typeof type === 'undefined') {
      return new TypeError(`${value[property]} is not in the set {${Object.keys(typeMap).join(', ')}}`);
    }
    return value instanceof type ? value : new type(value);
  });
}

module.exports = {
  Maybe,
  Enum,
  Discriminator,
};
