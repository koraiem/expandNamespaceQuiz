const proxyquire     = require( 'proxyquire' );
const AssertionError = require( 'assert' ).AssertionError;

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

    const mPath  = '<universal>/somePath';
    
    expect( ()=>{

      expandNamespaces( mPath );

    } ).to.throw( TypeError );

  } );


  it( 'Should return an error if new module namespace is not defined in existing namespaces', ()=>{

    const loadNamespaces = require( '../lib/loadNamespaces' );
    
    const expandNamespace = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': loadNamespaces
    } );

    // const expandNamespaces = require( '../lib/expandNamespace','./loadNamespaces' );
    // const loadNamespaces   = require( './loadNamespaces' );
          
    // const AssertionError   = require( 'assertion-error' );

    const mPath  = '<bala7>/somePath';
    
    expect( ()=>{

      expandNamespace( mPath );

    } ).to.throw( AssertionError );

  } );

  it( 'Should return the correct new relative path based on the expanded namespace', ()=>{

    const loadNamespaces = require( '../lib/loadNamespaces' );
    
    const expandNamespace = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': loadNamespaces
    } );

    const callerPath = require( 'caller-path' );
    const mPath      = '<universal>/test/box';

    const expected = '..\\..\\..\\..\\universal\\lib\\test\\box';
    const actual   = expandNamespace( mPath, callerPath() );

    expect( actual ).to.equal( expected );

  } );

} );
