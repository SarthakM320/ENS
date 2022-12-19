// scripts/deploy.js

const proxy = '0x74dA0119E5CeBcBd8Aecf7008D1dd84080E166B9'
async function main() {
    const BoxV2 = await ethers.getContractFactory("contracts/DomainV2.sol:ENS");
    console.log("Updating proxy");
    await upgrades.upgradeProxy(proxy,BoxV2)
    console.log(`ENS Proxy upgraded`)
  }
  
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });