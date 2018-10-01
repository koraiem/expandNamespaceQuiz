const proxyquire     = require( 'proxyquire' );
// const AssertionError = require( 'assert' ).AssertionError;
/* not using AssertionError to catch the exact error string in the 3rd test */

describe( 'The ./lib/expandNamespaces function', ()=>{

  it( 'should keep paths without namespaces unchanged', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    } );

    const expected = './somePath';
    const actual   = expandNamespaces( expected );

    expect( actual ).to.equal( expected );

  } );


  it( 'Should return an error if existing namespaces are null', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    } );

    const expected  = '<universal>/somePath';
    
    expect( ()=>{

      expandNamespaces( expected );

    } ).to.throw( TypeError );

  } );


  it( 'Should return an error if new module namespace is not defined in existing namespaces', ()=>{

    const expandNamespace = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns( { namespaces:
{ universal: './universal/lib',
  actions:   './actions' }
      } )
    } );

    const expected = '<someNamespace>/somePath';
    
    expect( ()=>{

      expandNamespace( expected );

    } ).to.throw( 'namespace <someNamespace> is not defined.' );

  } );

  it( 'Should return the correct new relative path based on the expanded namespace', ()=>{

    const expandNamespace = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns( { namespaces:
{ universal: './universal/lib',
  actions:   './actions' }
      } )
    } );

    const callerPath = require( 'caller-path' );
    const mPath      = '<universal>/test/box';

    const expected = '..\\..\\..\\..\\universal\\lib\\test\\box';
    const actual   = expandNamespace( mPath, callerPath() );

    expect( actual ).to.equal( expected );

  } );

  it( 'Appends "./" to the relativePath if it doesn\'t start with it', ()=>{

    const expandNamespace = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns( { namespaces:
{ universal: './universal/lib',
  actions:   'actions' }
      } )
    } );

    const callerPath = require( 'caller-path' );
    const mPath      = '<actions>/test/square';

    const expected = '..\\..\\..\\..\\actions\\test\\square';
    const actual   = expandNamespace( mPath, callerPath() );

    expect( actual ).to.equal( expected );

  } );

} );
