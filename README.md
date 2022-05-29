<p align="center">
    <h1 align="center">
        Semaphore NFT group
    </h1>
    <p align="center">Semaphore NFT onchain group open platform</p>
</p>

<br>
This is a page where you can create and join/leave Semaphore NFT on-chain groups.<br>
Users can join the Semaphore NFT group via holding NFT and can prove that they are the member of the group without revealing their identity. You can create a group with any type of NFT in your wallet, and once a group is created, other users holding that NFT can join the group.<br>
By generating a semaphore membership proof, members of the group can prove that they own the NFT without exposing their wallet address. If it is a mint NFT through Proof of Humanity certification, it can be used for apps that need to prevent sybil attacks like quadratic funding.
<br>
<br>

Semaphore NFT group page: https://nft-group.vercel.app/

Documents: https://nft-group-docs.vercel.app/

---

## contract
Deployed contracts
|                | Kovan                                                                                          |
| -------        | ---------------------------------------------------------------------------------------------- |
| Semaphore        | [0x1972...8793](https://kovan.etherscan.io/address/0x19722446e775d86f2585954961E23771d8758793) |

<br>
You need to deploy semphore contract first.<br>

Find more details in the [semaphore repo](https://github.com/semaphore-protocol/semaphore) and [semaphore docs](https://semaphore.appliedzkp.org/)

---

## Install

Clone this repository and install the dependencies:

```bash
git clone https://github.com/semaphore-onchain-group/nft-group.git
cd nft-group
yarn # or `npm i`
```

---

## Usage
Copy the .env.example file and rename it .env.

All environment variables need to be provided.

### Running test

```bash
yarn test
```

### Running page locally

run `yarn dev` (or `npm run dev`)
```bash
yarn dev
```