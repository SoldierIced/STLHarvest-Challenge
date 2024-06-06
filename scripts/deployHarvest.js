async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());

    const contractHavest = await ethers.getContractFactory("STLHarvest");
    const contract = await contractHavest.deploy(process.env.TOKEN_ADDRESS);
    console.log("contract address:", contract.address);

    await contract.deployed();
    console.log("contract deployed to:", contract.address);

    if (process.env.DEFAULT_NETWORK != "localhost") {
        // Verify the contract after deployment
        await hre.run("verify:verify", {
            address: contract.address,
            constructorArguments: [process.env.TOKEN_ADDRESS],
        });
    }
    //crear pool
    let tx = await contract.createPool();
    console.log(tx);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
