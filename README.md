# Welcome to UniOrders



## Features
The problem UniOrders solves
Currently to set a limit order on UniswapV3 , user must provide one token that he want to swap for and must keep an eye on the spot price to reach his desired price. Once the spot price passes his desired price, he must remove the liquidity before the spot price moves back in the range.

Our app automates the complete process starting from placing the limit order and removing the liquidity after processing it.
Token0 and Token1 are the tokens added by the user in the liquidity pool. The box below it shows the fee tier of the pool. The current price tab shows the current market price of the tokens.
The user enters the price at which he wants to provide his liquidity. Next, he has to enter the amount of tokens which he desires to be removed from the liquidity pool when the price reaches his desired price. He selects his order type in the dropdown menu below. The final step is Placing the limit order. It triggers our dApp to automatically check and execute the limit order processing.

After the place limit order is confirmed, the dApp confirms the metamask transaction. The inputs are passed to smart contracts which then places the limit order and sets the values. The sequencer starts to run. It fetches and checks for the values continuously. Once the condition set by the user is met, it processes the limit order and the user’s task is done.

![Screenshot from 2022-04-03 15-28-16](https://user-images.githubusercontent.com/76250660/161442744-c191fb47-0543-45f5-acf0-40414bc0c517.png)
![Screenshot from 2022-04-03 15-31-51](https://user-images.githubusercontent.com/76250660/161442747-cfaa90e0-292d-4617-b3fd-6683049cb3a0.png)
![Screenshot from 2022-04-03 15-36-06](https://user-images.githubusercontent.com/76250660/161442749-6aa5baf8-df3e-4c61-8063-087b4d76f749.png)


- ⚡️ The React Framework for Production [NextJs](https://https://nextjs.org//)
- 📦 [Hardhat](https://hardhat.org/) - Ethereum development environment for professionals
- 🦾 [TypeChain Hardhat plugin](https://github.com/ethereum-ts/TypeChain/tree/master/packages/hardhat) - Automatically generate TypeScript bindings for smartcontracts while using Hardhat.
- 🔥 [web3-react](https://github.com/NoahZinsmeister/web3-react/) - A simple, maximally extensible, dependency minimized framework for building modern Ethereum dApps
- 🎨 [daisyUI Tailwind CSS Components](https://daisyui.com/) - clean HTML with component classes
- 🎨 [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/) - standard for secure blockchain applications

## Install

```sh
yarn install
```

## Usage

```sh
yarn dev
```

## Run tests

```sh
yarn test
```

## Hardhat guideline

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile --network localhost
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy_greeter.ts --network localhost
node scripts/deploy.ts
npx eslint '**/*.ts'
npx eslint '**/*.ts' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

## Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
npx hardhat run --network ropsten scripts/deploy_greeter.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

## Contract upgrade

OpenZeppelin provides tooling for deploying and securing [upgradeable smart contracts](https://docs.openzeppelin.com/learn/upgrading-smart-contracts).

Smart contracts deployed using OpenZeppelin Upgrades Plugins can be upgraded to modify their code, while preserving their address, state, and balance. This allows you to iteratively add new features to your project, or fix any bugs you may find in production.

In this project, there are a 2 versions of contract: Box and BoxV2 which is improvement of Box. First deploy your contract:

```shell
npx hardhat run --network localhost scripts/deploy_upgradeable_box.ts
```

Then, deploy the upgrade smart contract

```shell
npx hardhat run --network localhost scripts/upgrade_box.ts
```
