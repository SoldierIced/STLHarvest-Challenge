const { ethers } = require("ethers");

async function totalSupplyTask(_, { ethers }) {
    const STLToken = await ethers.getContractFactory('STLToken');
    const stlContract = await STLToken.attach(process.env.TOKEN_ADDRESS);
    let totalSupply = await stlContract.totalSupply();
    const decimals = await stlContract.decimals();
    totalSupply = (BigInt(totalSupply.toString()) / BigInt((1 * 10 ** decimals)));
    console.log('Total STL tokens held in the contract:', totalSupply);
    if (process.env.HARVERST_ADDRESS) {
        let totalInContractHarvest = await stlContract.balanceOf(process.env.HARVERST_ADDRESS);
        totalInContractHarvest = (BigInt(totalInContractHarvest.toString()) / BigInt((1 * 10 ** decimals)));
        console.log('Total STL tokens held in the contract:', totalInContractHarvest);
    }
    return totalSupply.toString();
}

module.exports = totalSupplyTask;
