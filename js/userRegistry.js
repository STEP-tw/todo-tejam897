class UserRegistry {
  constructor(storagePath) {
    this.storagePath = storagePath;
    this.users = {};
  }
  loadUsers(){
    fs.readFile(this.storagePath,'utf8',function(err,data){
      if(err) throw err;
      if(data == '') return;
      let parsedDetails = JSON.parse(data);
      this.users = parsedDetails;
    })
  }
  addUser(userDetails){
    let userId = userDetails.userId;
    this.users[userId] = userDetails;
    let strigifiedDetails = JSON.stringify(this.users);
    fs.writeFile(this.storagePath,strigifiedDetails,'utf8',(err)=>{
      if (err) throw err
    })
  }
  getUserById(userId){
    return this.users[userId];
  }
}
module.exports = UserRegistry;
