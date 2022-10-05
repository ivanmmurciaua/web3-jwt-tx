# web3-jwt-tx
This is a repository to implements a complete solution based on ReactJS frontend + NodeJS relayer + Solidity Smart Contract to interact with blockchain with gasless policy.

## Usage

#### Before all, install node_modules dependencies in every component that is: root, hardhat folder and frontend folder

- Create .env file and write 2 variables: PROVIDER_URL y ADMIN_PRIVATE_KEY. The first one typically is `http://localhost:8545` and the second one is the private key of the relayer account (Account 0 in Hardhat).
- Start NodeJS server in root with `npm run server`
- Run Hardhat node in `./hardhat` with `npm run node`
- Deploy PointsCounter SC in `./hardhat` with `npm run deploy`
- And finally, in `./frontend` start your ReactJS app with `npm start`

Enjoy!
