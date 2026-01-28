const fs = require('fs');
const code = fs.readFileSync('dist/classic/livesite.min.js', 'utf8');

// Find all template calls in renderEngageButton, renderActiveEngage, and renderActionButtons
const functions = ['renderEngageButton', 'renderActiveEngage', 'renderActionButtons'];

functions.forEach(funcName => {
  console.log(`\n=== Checking ${funcName} ===`);
  const funcIdx = code.indexOf(funcName);
  if (funcIdx < 0) {
    console.log('Function not found');
    return;
  }
  
  const snippet = code.substring(funcIdx, funcIdx + 5000);
  const templateCalls = snippet.match(/i\.template\('[^']*(?:\\.[^']*)*'/g);
  
  if (!templateCalls || templateCalls.length === 0) {
    console.log('No template calls found');
    return;
  }
  
  templateCalls.forEach((call, idx) => {
    console.log(`\nTemplate call ${idx + 1}:`);
    console.log('Length:', call.length);
    console.log('First 300 chars:', call.substring(0, 300));
    
    // Check for problematic patterns
    if (call.match(/"[^"]*\?[^"]*"[^"]*:/)) {
      console.log('❌ FOUND NESTED DOUBLE QUOTES WITH TERNARY!');
      const match = call.match(/"[^"]*\?[^"]*"[^"]*:/);
      console.log('Problematic part:', match[0].substring(0, 200));
    }
    
    // Check dir attribute
    const dirMatch = call.match(/dir="[^"]*"/);
    if (dirMatch) {
      console.log('Dir attribute:', dirMatch[0]);
      if (dirMatch[0].includes('?') && dirMatch[0].match(/"[^"]*"[^"]*"/)) {
        console.log('❌ Dir has nested quotes!');
      }
    }
  });
});
