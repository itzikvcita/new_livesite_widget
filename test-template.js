const _ = require('lodash');

// Test the problematic template syntax - exactly as it appears in the source
const template1 = '<div id="livesite_engage_button" class="ls-font-family-T ls-font-size-T ls-zoom" dir="<%= data.rtl ? "rtl" : "ltr" %>">';
console.log('Testing template with nested double quotes (as in source):');
console.log('Template:', template1);
try {
  const compiled1 = _.template(template1);
  const result1 = compiled1({data: {rtl: true}});
  console.log('SUCCESS:', result1);
} catch(e) {
  console.log('ERROR:', e.message);
  console.log('Stack:', e.stack.split('\n').slice(0, 5).join('\n'));
}

// Test with single quotes inside (the fix)
const template2 = '<div id="livesite_engage_button" class="ls-font-family-T ls-font-size-T ls-zoom" dir="<%= data.rtl ? \'rtl\' : \'ltr\' %>">';
console.log('\nTesting template with single quotes inside (the fix):');
console.log('Template:', template2);
try {
  const compiled2 = _.template(template2);
  const result2 = compiled2({data: {rtl: true}});
  console.log('SUCCESS:', result2);
} catch(e) {
  console.log('ERROR:', e.message);
}
