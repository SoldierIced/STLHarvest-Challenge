const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();
const TOKEN_ABI = require("../artifacts/contracts/STLToken.sol/STLToken.json")
const HARVEST_ABI = require("../artifacts/contracts/STLHarvest.sol/STLHarvest.json")
const app = express();
const port = process.env.PORT;
// Middleware
app.use(express.json());

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const response = (data, status = "success") => {
    return { response: data, status: status }
}
const tokenContract = new ethers.Contract(process.env.TOKEN_ADDRESS, TOKEN_ABI.abi, wallet);
const harvestContract = new ethers.Contract(process.env.HARVERST_ADDRESS, HARVEST_ABI.abi, wallet);

// app.get('/balance/:address', async (req, res) => {
//     try {
//         res.json({ wallet: process.env.PRIVATE_KEY });
//         return
//         const balance = await contract.balanceOf(req.params.address);
//         res.json({ balance: ethers.utils.formatUnits(balance, 18) });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


app.post('/deposit', async (req, res) => {
    try {
        let tx = await harvestContract.deposit(req.body.poolId, req.body.amount);
        console.log(tx);
        res.json(response(tx));
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
