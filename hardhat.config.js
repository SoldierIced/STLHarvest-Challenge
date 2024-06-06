require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const { INFURA_URL, PRIVATE_KEY, ETHERSCAN_API_KEY, DEFAULT_NETWORK, INFURA_APIKEY } = process.env;
const totalSupplyTask = require("./tasks/totalSupplyTask")
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.20",
    defaultNetwork: DEFAULT_NETWORK,
    networks: {
        hardhat: {},
        ropsten: {
            url: INFURA_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        rinkeby: {
            url: INFURA_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        mainnet: {
            url: INFURA_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        avax_fuji: {
            url: INFURA_URL,
            chainId: 43113,
            accounts: [PRIVATE_KEY],
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_APIKEY}`,
            accounts: [PRIVATE_KEY],
            chainId: 11155111
        },
        localhost: {
            url: process.env.INFURA_URL,
            chainId: 31337
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};

// Define la tarea totalSupply fuera del objeto de configuración
task("totalSupply", "Consulta y muestra el total de tokens entregados y cuantos hay en el contrato", totalSupplyTask);
