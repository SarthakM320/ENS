const chai = require('chai');
const { expect } = require('chai');
const BN = require('bn.js');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));

describe('Trial Unit Test', () => {
    // before(async () => {
    //     const [owner, randomPerson] = await hre.ethers.getSigners();
    //     const domainContractFactory = await hre.ethers.getContractFactory('ENS');
    //     const domainContract = await domainContractFactory.deploy();
    //     await domainContract.deployed();   
    // });

    it('TestCases',async()=>{
        const [owner, randomPerson] = await hre.ethers.getSigners();
        const domainContractFactory = await hre.ethers.getContractFactory('ENS');
        const domainContract = await upgrades.deployProxy(domainContractFactory)
        await domainContract.deployed();

        // Adding a basic name to owner
        let txn = await domainContract.addENS('sarthak','imageHash');
        await txn.wait();

        //Checking if data is stored properly
        let [user, imageHash] = await domainContract.ensToAddress('sarthak');
        expect(user).to.equal(`${owner.address}`);
        expect(imageHash).to.equal('imageHash');

        //Checking if a non registered name is used
        [user, imageHash] = await domainContract.ensToAddress('sarth');
        expect(user).to.equal(`${await domainContract.nullAddress()}`);
        expect(imageHash).to.equal('');

        //Checking if name is returned properly from address
        expect(await domainContract.addressToName(owner.address)).to.equal('sarthak')
        expect(await domainContract.viewOwnerName(owner.address)).to.equal('sarthak')

        //checking if a blank name is returned when other non registered address is used
        expect(await domainContract.addressToName(randomPerson.address)).to.equal('')
        
        //Getting ImageHash from name and address
        expect(await domainContract['getImageHash(string)']('sarthak')).to.equal('imageHash')
        expect(await domainContract['getImageHash(address)'](owner.address)).to.equal('imageHash')

        try{
            console.log(`Image Hash(not registered) from name: ${await domainContract['getImageHash(string)']('sarth')}`) //should give an error
        }catch(error){
            expect(error)
        }
        try{
            console.log(`Image Hash(not registered) from address: ${await domainContract['getImageHash(address)'](randomPerson.address)}`)//should give an error
        }catch(error){
            expect(error)
        }

        //Trying to set a name that has already been set
        try{
            txn = await domainContract.connect(randomPerson).addENS('sarthak','1234');
            await txn.wait();
        }catch(error){
            expect(error)
        }

        //Setting a unique name
        txn = await domainContract.connect(randomPerson).addENS('sarth','1234');
        await txn.wait();

        //Checking if data is stored properly
        [user, imageHash] = await domainContract.ensToAddress('sarth');
        expect(user).to.equal(`${randomPerson.address}`);
        expect(imageHash).to.equal('1234');

        //Checking if changing name and imagehash is working properly
        txn = await domainContract.changeName('sar');
        await txn.wait();
        expect(await domainContract.addressToName(owner.address)).to.equal('sar')
        expect(await domainContract.viewOwnerName(owner.address)).to.equal('sar')

        txn = await domainContract.changeImageHash('123456789');
        await txn.wait();
        expect(await domainContract['getImageHash(string)']('sar')).to.equal('123456789')
        expect(await domainContract['getImageHash(address)'](owner.address)).to.equal('123456789')


    });
})