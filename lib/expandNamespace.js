const path           = require( 'path' );
const assert         = require( 'assert' );
const loadNamespaces = require( './loadNamespaces' );

function expandNameSpace( modulePath, callerPath ){

// This function's purpose is to expand the namespace of the running app using the namespaces plugin
// modulePath is the path to the module we want to add to the namespace
// callerpath is the current path when the function was called

  const match = /<([^>]+)>/.exec( modulePath );
  // match extracts the namespace name using regex
  if( !( match && match[1] ) ) return modulePath;
  // if match is null or isn't a list object of at least 2 items (meaning it couldn't separate the namespace name),
  // function will exit returning modulePath as is

  const namespaceKey   = match[1];
  // otherwise we use the 2nd list element from match (namespace name) as key
  const { namespaces } = loadNamespaces();
  // loadNamespaces will invoke, getting the list of existing namespaces
  const namespacePath  = namespaces[ namespaceKey ];
  // will try to pull the namespace path out of the existing namespaces

  assert( namespacePath != null, `namespace <${ namespaceKey }> is not defined.` );
  // If the namespace doesn't have a registered path, function will say that namespace to be expanded isn't defined

  const fullModulePath = path.join( process.cwd(), namespacePath, modulePath.substr( match[0].length + 1 ) );
  // We form the full path to the module by joining the app's root path, the namespace path pulled using loadNamespaces(), and the new module path
  const relativePath   = path.relative( callerPath, fullModulePath );
  // A relative path is created by getting the difference from the full module path and the current callerPath.

  return relativePath.startsWith( '.' )
    ? relativePath
    : `./${ relativePath }`;
  // The relative path is returned and set as the current path

}

module.exports = expandNameSpace;
// Replace the exports expanded namespace in module, next time loadNamespaces will be invoked we will get the updated namespace
