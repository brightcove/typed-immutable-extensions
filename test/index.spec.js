const { Record } = require('typed-immutable');
const { Maybe, Enum, Discriminator, extend } = require('../src');

describe('Maybe', () => {
  it('should throw when an invalid type is used', () => {
    expect(() => {
      Maybe({});
    }).to.throw(/is not a valid type/);
  });

  it('should throw when the default value is not of the specified type', () => {
    expect(() => {
      Maybe(String, 0);
    }).to.throw(/is not nully nor of String type/);
  });

  it('should allow an undefined value', () => {
    const ValueType = Record({
      value: Maybe(String),
    });
    const record = new ValueType();
    expect(record.value).to.be.undefined;
  });

  it('should allow a null value', () => {
    const ValueType = Record({
      value: Maybe(String),
    });

    const record = new ValueType({
      value: null,
    });
    expect(record.value).to.be.null;
  });

  it('should allow a value that matches the type', () => {
    const ValueType = Record({
      value: Maybe(String),
    });

    const record = new ValueType({
      value: 'foo',
    });
    expect(record.value).to.equal('foo');
  });

  it('should not allow a value that does not match the type', () => {
    const ValueType = Record({
      value: Maybe(String),
    });

    expect(() => {
      new ValueType({
        value: 0,
      });
    }).to.throw(/is not nully nor it is of String type/);
  });

  it('should allow setting a value that matches the type', () => {
    const ValueType = Record({
      value: Maybe(String),
    });
    let record = new ValueType();
    expect(record.value).to.be.undefined;
    record = record.set('value', 'foo');
    expect(record.value).to.equal('foo');
  });

  it('should allow setting a null value', () => {
    const ValueType = Record({
      value: Maybe(String),
    });
    let record = new ValueType();
    expect(record.value).to.be.undefined;
    record = record.set('value', null);
    expect(record.value).to.be.null;
  });

  it('should not allow setting a value that does not match the type', () => {
    const ValueType = Record({
      value: Maybe(String),
    });
    const record = new ValueType();
    expect(record.value).to.be.undefined;
    expect(() => {
      record.set('value', 0);
    }).to.throw(/is not nully nor it is of String type/);
  });
  
  it('should allow deleting a value', () => {
    const ValueType = Record({
      value: Maybe(String),
    });

    let record = new ValueType({
      value: 'foo',
    });
    expect(record.value).to.equal('foo');
    record = record.delete('value');
    expect(record.value).to.be.undefined;
  });

  it('should take the default value of the type if supplied', () => {
    const ValueType = Record({
      value: Maybe('foo'),
    });
    const record = new ValueType();
    expect(record.value).to.equal('foo');
  });

  it('should use the default value if supplied', () => {
    const ValueType = Record({
      value: Maybe(String, 'foo'),
    });
    const record = new ValueType();
    expect(record.value).to.equal('foo');
  });

  it('should take the supplied default value over the default value of the type', () => {
    const ValueType = Record({
      value: Maybe('bar', 'foo'),
    });
    const record = new ValueType();
    expect(record.value).to.equal('foo');
  });

  it('should reset to the default value if deleted', () => {
    const ValueType = Record({
      value: Maybe('foo'),
    });
    let record = new ValueType({
      value: 'bar',
    });
    expect(record.value).to.equal('bar');
    record = record.delete('value');
    expect(record.value).to.equal('foo');
  });
});

describe('Enum', () => {
  it('should throw if an array is not passed in', () => {
    expect(() => {
      Enum();
    }).to.throw(/must be an array/);
  });

  it('should throw if there are no elements in the array', () => {
    expect(() => {
      Enum([]);
    }).to.throw(/must contain elements/);
  });

  it('should throw if the default value is not in the set of values', () => {
    expect(() => {
      Enum(['foo', 'bar'], 'abc');
    }).to.throw(/abc is not in the set {foo, bar}/);
  });

  it('should throw for an undefined value which is not in the set', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar']),
    });
    expect(() => {
      new ValueType();
    }).to.throw(/undefined is not in the set {foo, bar}/);
  });

  it('should allow a value which is in the set', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar']),
    });

    const record = new ValueType({
      value: 'foo',
    });
    expect(record.value).to.equal('foo');
  });

  it('should not allow a value which is not in the set', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar']),
    });

    expect(() => {
      new ValueType({
        value: 'abc',
      });
    }).to.throw(/abc is not in the set {foo, bar}/);
  });

  it('should set the default value for undefined values', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar'], 'foo'),
    });
    const record = new ValueType();
    expect(record.value).to.equal('foo');
  });

  it('should allow setting a value which is in the set', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar']),
    });

    let record = new ValueType({
      value: 'foo',
    });
    expect(record.value).to.equal('foo');
    record = record.set('value', 'bar');
    expect(record.value).to.equal('bar');
  });
  
  it('should not allow setting a value which is not in the set', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar']),
    });

    const record = new ValueType({
      value: 'foo',
    });
    expect(record.value).to.equal('foo');
    expect(() => {
      record.set('value', 'abc');
    }).to.throw(/abc is not in the set {foo, bar}/);
  });

  it('should not allow deleting if the default value is not in the set', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar']),
    });

    const record = new ValueType({
      value: 'foo',
    });
    expect(record.value).to.equal('foo');
    expect(() => {
      record.delete('value');
    }).to.throw(/undefined is not in the set {foo, bar}/);
  });

  it('should allow deleting if the default value is in the set', () => {
    const ValueType = Record({
      value: Enum(['foo', 'bar'], 'bar'),
    });

    let record = new ValueType({
      value: 'foo',
    });
    expect(record.value).to.equal('foo');
    record = record.delete('value');
    expect(record.value).to.equal('bar');
  });
});

describe('Discriminator', () => {
  let A;
  let B;
  let C;

  beforeEach(() => {
    A = Record({
      type: String,
    });

    B = Record({
      type: String,
    });

    C = Record({
      type: String,
    });
  });

  it('should throw if the property is not specified', () => {
    expect(() => {
      Discriminator();
    }).to.throw(/undefined must be a string/);
  });

  it('should throw if the property is not a string', () => {
    expect(() => {
      Discriminator(0);
    }).to.throw(/0 must be a string/);
  });

  it('should throw if there is no typemap supplied', () => {
    expect(() => {
      Discriminator('type');
    }).to.throw(/undefined must be an object/);
  });

  it('should throw if there are no type mappings in the typemap', () => {
    expect(() => {
      Discriminator('type', {});
    }).to.throw(/must contain at least one type mapping/);
  });

  it('should throw if any of the type mappings are null', () => {
    expect(() => {
      Discriminator('type', {
        a: A,
        b: null,
      });
    }).to.throw(/b type must be a record/);
  });

  it('should throw if any of the type mappings are not classes', () => {
    expect(() => {
      Discriminator('type', {
        a: A,
        b: 'B',
      });
    }).to.throw(/b type must be a record/);
  });

  it('should throw if any of the type mappings are not records', () => {
    class D {}
    expect(() => {
      Discriminator('type', {
        a: A,
        b: D,
      });
    }).to.throw(/b type must be a record/);
  });

  it('should throw if any of the type mapping records do not have the specified property', () => {
    const D = Record({
      foo: String,
    });
    expect(() => {
      Discriminator('type', {
        a: A,
        b: D,
      });
    }).to.throw(/b type must have a type property/);
  });

  it('should throw if any of the type mapping records property type is not a String', () => {
    const D = Record({
      type: Number,
    });
    expect(() => {
      Discriminator('type', {
        a: A,
        b: D,
      });
    }).to.throw(/b.type must be a String type/);
  });

  it('should throw if the default type is null', () => {
    expect(() => {
      Discriminator('type', {
        a: A,
        b: B,
      }, null);
    }).to.throw(/default type must be a record/);
  });

  it('should throw if the default type is not a class', () => {
    expect(() => {
      Discriminator('type', {
        a: A,
        b: B,
      }, 'foo');
    }).to.throw(/default type must be a record/);
  });

  it('should throw if the default type is not a record', () => {
    class D {}
    expect(() => {
      Discriminator('type', {
        a: A,
        b: B,
      }, D);
    }).to.throw(/default type must be a record/);
  });

  it('should throw if the default type does not have the specified property', () => {
    const D = Record({
      foo: String,
    });
    expect(() => {
      Discriminator('type', {
        a: A,
        b: B,
      }, D);
    }).to.throw(/default type must have a type property/);
  });

  it('should throw if the default type property is not a String type', () => {
    const D = Record({
      type: Number,
    });
    expect(() => {
      Discriminator('type', {
        a: A,
        b: B,
      }, D);
    }).to.throw(/default.type must be a String type/);
  });

  it('should throw if no default value is set', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    expect(() => {
      new ValueType();
    }).to.throw(/undefined is not an object/);
  });
  
  it('should throw if the value passed in is not an object', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    expect(() => {
      new ValueType({
        value: 'foo',
      });
    }).to.throw(/foo is not an object/);
  });

  it('should throw if the value passed in does not have the specified property', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    expect(() => {
      new ValueType({
        value: {
          foo: 'bar',
        },
      });
    }).to.throw(/does not have a type property/);
  });

  it('should throw if the property is not in the typemap', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    expect(() => {
      new ValueType({
        value: {
          type: 'c',
        },
      });
    }).to.throw(/c is not in the set {a, b}/);
  });

  it('should select the correct type', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    const aRecord = new ValueType({
      value: {
        type: 'a',
      },
    });
    expect(aRecord.value).to.be.an.instanceOf(A);

    const bRecord = new ValueType({
      value: {
        type: 'b',
      },
    });
    expect(bRecord.value).to.be.an.instanceOf(B);
  });

  it('should select the default type if one is supplied and the type is not in the map', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }, C),
    });
    const record = new ValueType({
      value: {
        type: 'asdf',
      },
    });
    expect(record.value).to.be.an.instanceOf(C);
  });

  it('should allow setting the value', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    let record = new ValueType({
      value: {
        type: 'a',
      },
    });
    expect(record.value).to.be.an.instanceOf(A);
    record = record.set('value', {
      type: 'b',
    });
    expect(record.value).to.be.an.instanceOf(B);
  });

  it('should not allow deleting the value', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    const record = new ValueType({
      value: {
        type: 'a',
      },
    });
    expect(() => {
      record.delete('value');
    }).to.throw(/undefined is not an object/);
  });
  
  it('should allow setting records', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }),
    });
    let record = new ValueType({
      value: {
        type: 'a',
      },
    });
    expect(record.value).to.be.an.instanceOf(A);
    record = record.set('value', new B({
      type: 'b',
    }));
    expect(record.value).to.be.an.instanceOf(B);
  });

  it('should convert records of the wrong type', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
        c: C,
      }),
    });
    let record = new ValueType({
      value: {
        type: 'a',
      },
    });
    expect(record.value).to.be.an.instanceOf(A);
    record = record.set('value', new B({
      type: 'c',
    }));
    expect(record.value).to.be.an.instanceOf(C);
  });

  it('should allow setting in', () => {
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
        c: C,
      }),
    });
    let record = new ValueType({
      value: {
        type: 'a',
      },
    });
    expect(record.value).to.be.an.instanceOf(A);
    record = record.setIn(['value', 'type'], 'c');
    expect(record.value).to.be.an.instanceOf(C);
  });

  it('should work with subtypes of Records', () => {
    class D extends Record({
      type: String,
    }) {}
    const ValueType = Record({
      value: Discriminator('type', {
        a: A,
        b: B,
      }, D),
    });
    const record = new ValueType({
      value: {
        type: 'd',
      },
    });
    expect(record.value).to.be.an.instanceOf(D);
  });
});

describe('extend()', () => {
  let A;
  beforeEach(() => {
    A = Record({
      id: String,
    });
  });

  it('should throw if no base record is passed', () => {
    expect(() => {
      extend();
    }).to.throw(/BaseRecord must be a Record type/);
  });

  it('should throw if a non-class is passed for the base record', () => {
    expect(() => {
      extend('foo');
    }).to.throw(/BaseRecord must be a Record type/);
  });

  it('should throw if the base record is not a Record type', () => {
    class D {}
    expect(() => {
      extend(D);
    }).to.throw(/BaseRecord must be a Record type/);
  });

  it('should throw if no descriptor is passed in', () => {
    expect(() => {
      extend(A);
    }).to.throw(/A descriptor of fields is required/);
  });

  it('should throw if the field descriptor is not an object', () => {
    expect(() => {
      extend(A, 'foo');
    }).to.throw(/A descriptor of fields is required/);
  });

  it('should throw if no fields are defined in the descriptor object', () => {
    expect(() => {
      extend(A, {});
    }).to.throw(/At least one field must be defined/);
  });

  it('should throw if any of the field descriptors are nully', () => {
    expect(() => {
      extend(A, {
        value: null,
      });
    }).to.throw(/Invalid field descriptor provided for "value" field/);
  });

  it('should allow extending a record', () => {
    const B = extend(A, {
      value: String,
    });    
    const b = new B({
      id: '123',
      value: 'bar',
    });
    expect(b).to.be.an.instanceOf(B);
    expect(b).to.be.an.instanceOf(A);
    expect(b).to.be.an.instanceOf(Record.Type);
    expect(b.size).to.equal(2);
    expect(b.id).to.equal('123');
    expect(b.value).to.equal('bar');
  });

  it('should throw when a value is attempted to be set', () => {
    const B = extend(A, {
      value: String,
    });    
    const b = new B({
      id: '123',
      value: 'bar',
    });
    expect(() => {
      b.value = 'abc';
    }).to.throw(/Cannot set on an immutable record/);
  });

  it('should allow setting a value when the record is mutable', () => {
    const B = extend(A, {
      value: String,
    });    
    let b = new B({
      id: '123',
      value: 'bar',
    });
    const bMutable = b.asMutable();
    bMutable.value = 'abc';
    b = bMutable.asImmutable();
    expect(b).to.be.an.instanceOf(B);
    expect(b).to.be.an.instanceOf(A);
    expect(b.value).to.equal('abc');
  });
});