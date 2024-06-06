async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());

    const Token = await ethers.getContractFactory("STLToken");
    const initialSupply = 1000;// 1,000,000 STL
    const token = await Token.deploy(initialSupply);
    console.log("Token address:", token.address);

    await token.deployed();
    console.log("Token deployed to:", token.address);

    if (process.env.DEFAULT_NETWORK != "localhost") {
        // Verify the contract after deployment
        await hre.run("verify:verify", {
            address: token.address,
            constructorArguments: [initialSupply],
        });
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
