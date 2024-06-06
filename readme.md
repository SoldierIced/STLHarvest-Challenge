# Proyecto de Node.js con Contratos Blockchain en Solidity

Este proyecto utiliza Node.js, Hardhat, y Solidity para desplegar y gestionar contratos inteligentes en la blockchain. Los contratos están diseñados para manejar un token específico (STL) y un sistema de recompensas.

## Tecnologías Utilizadas

- Node.js
- Hardhat
- JavaScript
- Solidity
- Docker
- Criptomonedas

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con la siguiente información (usa los valores reales correspondientes):

   ```env
         PRIVATE_KEY=""
         PRIVATE_KEY2=""
         WALLET_ADDRESS=""
         WALLET_ADDRESS2=""
         DEFAULT_NETWORK="sepolia"
         INFURA_URL="https://sepolia.infura.io/v3/"
         ETHERSCAN_API_KEY="9FP38GE4RM1Q8HHDGUJY2IBMR5IJUWID9D"
         INFURA_APIKEY=""
         PORT=3000
         #sepolia----address
         HARVERST_ADDRESS="0x7066eA1FfeAF6e4DA6479E6C1f144067C343F600"
         TOKEN_ADDRESS="0x56FCe2E8393e3362Ac0244c098c19443Fd5290ef"
   ```

## Despliegue de Contratos

1. Desplegar el contrato del token:

   ```bash
   npx hardhat run scripts/deployToken.js
   ```

   - Una vez ejecutado, agrega la dirección del contrato al archivo `.env` en la variable `TOKEN_ADDRESS`:

   ```env
   TOKEN_ADDRESS="DIRECCION_DEL_CONTRATO_DESPLEGADO"
   ```

2. Desplegar el contrato de recompensas:

   ```bash
   npx hardhat run scripts/deployHarvest.js
   ```

   - Agrega la dirección del contrato al archivo `.env` en la variable `HARVERST_ADDRESS`:

   ```env
   HARVERST_ADDRESS="DIRECCION_DEL_CONTRATO_DESPLEGADO"
   ```

## Prueba del Challenge

Puedes correr la prueba del challenge ejecutando el siguiente script:

```bash
npx hardhat run tests/testAll.js
```

## Verificación de Contratos

Si el `DEFAULT_NETWORK` no es `localhost`, los contratos se verificarán automáticamente utilizando Hardhat.

## Tareas de Hardhat

- Para mostrar el balance total minteado por el contrato del token y, si está cargado en el `.env`, también el balance del contrato de recompensas:

  ```bash
  npx hardhat totalSupply
  ```

## Información Adicional

- [Etherscan Sepolia Transaction](https://sepolia.etherscan.io/tx/0x284221267fef58c49c3da2ceb0ec7c21abec3c9e5041ed63f5c38fd8bad6108b)

## Contribución

Si deseas contribuir a este proyecto, por favor sigue los pasos a continuación:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios necesarios y haz commit (`git commit -am 'Agregar nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Crea un nuevo Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
