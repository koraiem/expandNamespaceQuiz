const proxyquire = require( 'proxyquire' );

describe( 'The ./lib/expandNamespaces function', ()=>{

  it( 'should keep paths without namespaces unchanged', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    } );

    const expected = './somePath';
    const actual   = expandNamespaces( expected );

    expect( actual ).to.equal( expected );

  } );

  it.skip( 'start writing tests here', ()=>{

  } );

} );
