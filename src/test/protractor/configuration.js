exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // specs: ['exercise2.js']
    specs: ['spec1Login.js']
    // specs: ['spec1Login.js'],
    // specs: ['spec5.js'],
    // multiCapabilities: [{
    //     'browserName': 'firefox'
    //   }, {
    //     'browserName': 'chrome'
    //   }]
  };

// // conf.js
// exports.config = {
//     framework: 'jasmine',
//     seleniumAddress: 'http://localhost:4444/wd/hub',
//     specs: ['spec3.js'],
//     capabilities: {
//       browserName: 'firefox'
//     }
//   }