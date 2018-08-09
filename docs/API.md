## Functions

<dl>
<dt><a href="#Maybe">Maybe(Type, [defaultValue])</a></dt>
<dd><p>Defines an optional type, similar to typed-immutable&#39;s <a href="https://github.com/typed-immutable/typed-immutable#maybe">Maybe</a>, but provides extended options.</p>
<p>Benefits over typed-immutable&#39;s Maybe:</p>
<ul>
<li>Allows both <code>undefined</code> and <code>null</code> as values</li>
<li>Allows defining a default value for when the value is <code>undefined</code></li>
<li>Extracts the default value from the Type parameter if one is defined</li>
</ul>
</dd>
<dt><a href="#Enum">Enum(enumValues, [defaultValue])</a></dt>
<dd><p>Restricts the values which can be set on a property.</p>
</dd>
<dt><a href="#Discriminator">Discriminator(property, typeMap, [defaultType])</a></dt>
<dd><p>Chooses the type to use based on the value of a property.</p>
</dd>
</dl>

<a name="Maybe"></a>

## Maybe(Type, [defaultValue])
Defines an optional type, similar to typed-immutable's [Maybe](https://github.com/typed-immutable/typed-immutable#maybe), but provides extended options.

Benefits over typed-immutable's Maybe:
- Allows both `undefined` and `null` as values
- Allows defining a default value for when the value is `undefined`
- Extracts the default value from the Type parameter if one is defined

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| Type | <code>\*</code> | Type of the value |
| [defaultValue] | <code>\*</code> | Default value (must be `undefined`, `null`, or of the specified Type) |

**Example**  
```js
const MyRecord = Record({
 //Required string
 id: String,
 //Required string with a default value
 name: 'Some Name',
 //Optional string - defaults to undefined
 value: Maybe(String),
 //Optional string with a default value
 type: Maybe(String, 'point'),
 //Optional string with a default value (extracted from the type)
 text: Maybe('Some Text'),
 //Optional string with a default value of null
 title: Maybe(String, null),
});
```
<a name="Enum"></a>

## Enum(enumValues, [defaultValue])
Restricts the values which can be set on a property.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| enumValues | <code>Array.&lt;\*&gt;</code> | Array of possible values |
| [defaultValue] | <code>\*</code> | Default value (must be in the set of enumValues) |

**Example**  
```js
const MyRecord = Record({
  //Restricts values to "text" and "image"
  type: Enum(['text', 'image']),
  //Restricts values to "left", "center" and "image" with a default value of "left" if the value is undefined
  alignment: Enum(['left', 'center', 'right'], 'left')
});
```
<a name="Discriminator"></a>

## Discriminator(property, typeMap, [defaultType])
Chooses the type to use based on the value of a property.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | Property to use for determining the type |
| typeMap | <code>object.&lt;Record&gt;</code> | Map of property values to types |
| [defaultType] | <code>Record</code> | Default type when no property value is found in the typeMap |

**Example**  
```js
const StringValue = Record({
  type: String,
  value: String,
});

const NumberValue = Record({
  type: String,
  value: Number,
});

const AnyValue = Record({
  type: String,
  value: Any,
});

const MyRecord = Record({
  //Chooses the Record type to use based on the "type" property value
  value: Discriminator('type', {
    'string': StringValue,
    'number': NumberValue,
  }),
  //Defaults to AnyValue if no matching type is found
  other: Discriminator('type', {
    'string': StringValue,
    'number': NumberValue,
  }, AnyValue),
});
```
