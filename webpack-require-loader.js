// Custom webpack loader to handle Rails-style //= require directives
// This preserves the original source files without modification

module.exports = function(source) {
  const requireRegex = /\/\/=\s*require\s+([^\n]+)/g;
  const requires = [];
  let match;
  
  // Extract all require directives
  while ((match = requireRegex.exec(source)) !== null) {
    requires.push(match[1].trim());
  }
  
  // If no requires found, return source as-is
  if (requires.length === 0) {
    return source;
  }
  
  // Build require statements
  const requireStatements = requires.map(req => {
    // Handle .js extension - add if missing
    let filePath = req;
    if (!filePath.endsWith('.js') && !filePath.endsWith('.js.erb')) {
      filePath += '.js';
    }
    // Remove .erb extension
    filePath = filePath.replace(/\.erb$/, '');
    // Convert to relative path
    if (!filePath.startsWith('./') && !filePath.startsWith('../')) {
      filePath = './' + filePath;
    }
    return `require('${filePath}');`;
  }).join('\n');
  
  // Remove original require directives and add actual requires at the top
  const cleanedSource = source.replace(/\/\/=\s*require[^\n]+\n/g, '');
  
  return requireStatements + '\n' + cleanedSource;
};
