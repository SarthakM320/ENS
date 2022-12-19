require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades")
const dotenv = require('dotenv');
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
    maticmum:{
      url:'https://polygon-mumbai.g.alchemy.com/v2/Xj3C3zMXfD6vlihC6c6_vMeDONR-DqnY',
      accounts:[`${process.env.PRIVATE_KEY}`]
    }
  },
  solidity: "0.8.10",
  etherscan:{
    apiKey:{
      goerli:'KW8H83RRKIPYFJIHJ3U9YJI39MP3G5QA5P',
      polygonMumbai:'T2FS7KE7MA99Z9CITR6Y9241NAXC4XTJH1'
    }
  }
};
