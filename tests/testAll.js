const decimals = 18;

const toInt = (balance) => {
    return Number(BigInt(balance.toString()) / BigInt((1 * 10 ** decimals)));
}
const ToBigInt = (amount) => {
    return BigInt(amount) * BigInt(1 * 10 ** 18);
}
const dd = (params) => {
    console.log("\x1b[35m", params, "\x1b[0m");
};
async function executeFunction(funcion) {
    try {
        await funcion();
    } catch (error) {
        let e = JSON.parse(JSON.stringify(error));
        console.log(e.error.reason);
    }
}
async function deposit(harvest, amount, poolId) {
    let tx = await harvest.deposit(poolId, ToBigInt(amount));
    dd("se depositan " + amount + " STL en el pool ID " + poolId)
    await tx.wait()
}
async function withdraw(harvest, tokencontract, poolId, wallet) {

    await executeFunction(async () => {
        let balance = await tokencontract.balanceOf(wallet)
        dd("claim wallet " + wallet);
        tx = await harvest.withDraw(poolId);
        await tx.wait()
        let balance2 = await tokencontract.balanceOf(wallet)
        console.log("balance antes : " + toInt(balance) + " despues " + toInt(balance2))
    })

}
async function main() {
    const TOKEN_ABI = require("../artifacts/contracts/STLToken.sol/STLToken.json")
    const HARVEST_ABI = require("../artifacts/contracts/STLHarvest.sol/STLHarvest.json")
    const walletAddress = process.env.WALLET_ADDRESS;
    const walletAddress2 = process.env.WALLET_ADDRESS2;
    const poolId = 0;
    let tx;
    let balance2;
    let amount;
    let provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const tokenContract1 = new ethers.Contract(process.env.TOKEN_ADDRESS, TOKEN_ABI.abi, wallet);
    const harvestContract1 = new ethers.Contract(process.env.HARVERST_ADDRESS, HARVEST_ABI.abi, wallet);
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY2, provider);
    let amountApprove = 2000;
    const tokenContract2 = new ethers.Contract(process.env.TOKEN_ADDRESS, TOKEN_ABI.abi, wallet);
    const harvestContract2 = new ethers.Contract(process.env.HARVERST_ADDRESS, HARVEST_ABI.abi, wallet);


    dd("empieza la prueba total, recuerde es necesario tener los 2 contratos creados");
    dd("-------------------------------------------------------------------------------")
    // await deposit(harvestContract1, 200, poolId)
    // let pool = await harvestContract1.findUserInPool(walletAddress, 0);

    // console.log(pool);

    // let pool = await harvestContract1._pools(0);
    // console.log(pool);
    // return
    try {
        console.log("se autoriza a la wallet 1 a mintear token");
        tx = await tokenContract1.grantRoleUse(walletAddress);
        await tx.wait();

    } catch (error) {
        let e = JSON.parse(JSON.stringify(error));
        console.log(e.error.reason);

    }

    console.log("se transfiere token a la wallet 2 para pruebas");
    tx = await tokenContract1.mint(walletAddress2, ToBigInt(1600))
    await tx.wait();
    console.log("se transfiere token a la wallet 2 para pruebas");
    tx = await tokenContract1.mint(walletAddress, ToBigInt(600))
    await tx.wait();

    let balance = await tokenContract1.balanceOf(walletAddress)
    console.log("balance del token STL de la wallet " + walletAddress + "(1) ", toInt(balance));
    balance = await tokenContract1.balanceOf(walletAddress2)
    console.log("balance del token STL de la wallet " + walletAddress2 + "(2) ", toInt(balance));
    dd("-------------------------------------------------------------------------------")
    dd("se ejecuta transaccion de approve wallet 1");
    amount = 100;
    tx = await tokenContract1.approve(harvestContract1.address, ToBigInt(amountApprove))
    await tx.wait()
    await deposit(harvestContract1, amount, poolId)


    dd("se ejecuta transaccion de approve wallet 2");
    amount = 300;
    tx = await tokenContract2.approve(harvestContract1.address, ToBigInt(amountApprove))
    await tx.wait()
    await deposit(harvestContract2, amount, poolId)
    dd("-------------------------------------------------------------------------------")

    amount = 200;
    dd("se cargan los rewards " + amount + " (en este caso de wallet 1 owner de los contratos)");
    tx = await harvestContract1.loadReward(poolId, ToBigInt(200))
    await tx.wait()
    dd("-------------------------------------------------------------------------------")

    await withdraw(harvestContract1, tokenContract1, poolId, walletAddress)

    await withdraw(harvestContract2, tokenContract2, poolId, walletAddress2)

    dd("-------------------------------------------------------------------------------")
    console.log("-----------------vuelta 2 -----------------")
    amount = 100;
    await deposit(harvestContract1, amount, poolId)
    amount = 200;
    dd("se cargan los rewards " + amount + " (en este caso de wallet 1 owner de los contratos)");
    tx = await harvestContract1.loadReward(poolId, ToBigInt(200))
    await tx.wait()
    dd("-------------------------------------------------------------------------------")
    amount = 300;
    await deposit(harvestContract2, amount, poolId)
    await withdraw(harvestContract1, tokenContract1, poolId, walletAddress)


    await withdraw(harvestContract2, tokenContract2, poolId, walletAddress2)


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
