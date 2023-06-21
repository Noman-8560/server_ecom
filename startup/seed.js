const { User } = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = async function () {
    let adminUser = await User.findOne({ _id: "6473cc92f14635393a91ca33" });
    
    if(!adminUser){
      adminUser = new User({_id:"6473cc92f14635393a91ca33", name: "Admin User", email:"admin@gmail.com", password:"Admin123", isAdmin: true});
      
      const salt = await bcrypt.genSalt(10);    
      adminUser.password = await bcrypt.hash(adminUser.password, salt);
      
      adminUser.save();
    }
  }