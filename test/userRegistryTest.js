let chai = require('chai');
let assert = chai.assert;
let userRegistry = require('../js/userRegistry.js');

// let fs = {};
// fs.readFile(path,encoding,callBack){
//   if(path == 'users.json' && encoding == 'utf8'){
//     let data = '{'name':'teja','userId':'tejam'}';
//     callBack(null,data);
//     return;
//   }
//   callBack(err,null);
//   return;
// }
// 
// describe('userRegistry',()=>{
//   beforeEach(()=>{
//     registry = new userRegistry('users.json');
//   });
//   describe('loadUser()',()=>{
//     it('loads stored users details and sets users in regitsry',(done)=>{
//       registry.loadUsers();
//       assert.deepEqual(registry.users,{})
//     })
//   })
// })
