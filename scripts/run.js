const main = async() => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory('ENS');
    const domainContract = await upgrades.deployProxy(domainContractFactory,{initializer:'initialize'})
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract deployed by:", owner.address);

   

    let txn = await domainContract.addENS('sarthak','imageHash');
    await txn.wait();
    
    console.log(`${await domainContract.nullAddress()}`)
    console.log('Data (from mapping): ',await domainContract.ensToAddress('sarthak'));
    console.log('Data for a name that doesnot exist (from mapping): ',await domainContract.ensToAddress('sarth'));
    console.log(`Name (from mapping): ${await domainContract.addressToName(owner.address)}`);
    console.log(`Name (from function): ${await domainContract.viewOwnerName(owner.address)}`);
    console.log(`Name for an address that didnt register: ${await domainContract.addressToName(randomPerson.address)}`)
    console.log(`Image Hash from name: ${await domainContract['getImageHash(string)']('sarthak')}`)
    console.log(`Image Hash from address: ${await domainContract['getImageHash(address)'](owner.address)}`)
    console.log('Getting data for a user that doesnot exist')
    console.log()
    try{
        console.log(`Image Hash(not registered) from name: ${await domainContract['getImageHash(string)']('sarth')}`) //should give an error
    }catch(error){
        console.log(error)
    }
    try{
    console.log(`Image Hash(not registered) from address: ${await domainContract['getImageHash(address)'](randomPerson.address)}`)//should give an error
    }catch(error){
        console.log(error)
    }

    console.log(`Changing Name`)
    txn = await domainContract.changeName('sar');
    await txn.wait();
    console.log(`Name (from mapping): ${await domainContract.addressToName(owner.address)}`);
    console.log(`Name (from function): ${await domainContract.viewOwnerName(owner.address)}`);
    
    console.log(`Changing ImageHash`)
    txn = await domainContract.changeImageHash('123456789');
    await txn.wait();
    console.log('Transaction done')
    console.log(`Image Hash from name: ${await domainContract['getImageHash(string)']('sar')}`)
    console.log(`Image Hash from address: ${await domainContract['getImageHash(address)'](owner.address)}`)
    
}

const runMain = async() => {
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

runMain()