import Web3 from "web3";
var ethUtil = require("ethereumjs-util");
var sigUtil = require("eth-sig-util");

export default class RPC {
  constructor(provider) {
    this.provider = provider;
  }

  async getChainId() {
    try {
      const web3 = new Web3(this.provider);

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId();

      return chainId.toString();
    } catch (error) {
      return error;
    }
  }

  async signMessage(address) {
    const web3 = new Web3(this.provider);
    try {
      const msgData = JSON.stringify({
        types: {
          // This refers to the domain the contract is hosted on.
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "verifyingContract", type: "address" },
          ],
          // Not an EIP712Domain definition.
          Employee: [
            { name: "id", type: "uint256" },
            { name: "name", type: "string" },
            { name: "address", type: "Address" },
          ],
          Address: [
            { name: "address", type: "string" },
            { name: "country", type: "string" },
            { name: "phoneNumber", type: "string" },
          ],
        },
        domain: {
          name: "AddEmployee",
          version: "1",
          verifyingContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          salt: "0x00000000000000000000000000000000000000000000000000000000005",
        },
        primaryType: "Employee",
        message: {
          id: 1111,
          name: "John",
          address: {
            address: "Infinity Loop 1",
            country: "USA",
            phoneNumber: "+123456789",
          },
        },
      });
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // var params = [address, msgData];
      // var method = "eth_signTypedData_v4";
      // web3.currentProvider.send(
      //   {
      //     method,
      //     params,
      //     address,
      //   },
      //   async function (err, result) {
      //     if (err) return console.dir(err);
      //     if (result.error) {
      //       console.log(result.error.message);
      //     }
      //     if (result.error) return console.error("ERROR", result);
      //     console.log("TYPED SIGNED:" + JSON.stringify(result.result));

      //     const recovered = sigUtil.recoverTypedSignature({
      //       data: JSON.parse(msgData),
      //       sig: result.result,
      //     });

      //     if (
      //       ethUtil.toChecksumAddress(recovered) ===
      //       ethUtil.toChecksumAddress(address)
      //     ) {
      //       console.log("Successfully ecRecovered signer as " + address);
      //     } else {
      //       console.log(
      //         "Failed to verify signer when comparing " +
      //           result.result +
      //           " to " +
      //           address
      //       );
      //     }
      //   }
      // );
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      const sig = await web3.currentProvider.request({
        method: "eth_signTypedData_v4",
        params: [address, msgData],
      });
      console.log("TYPED SIGNED:" + JSON.stringify(sig));
      const recovered = sigUtil.recoverTypedSignature({
        data: JSON.parse(msgData),
        sig,
      });

      if (
        ethUtil.toChecksumAddress(recovered) ===
        ethUtil.toChecksumAddress(address)
      ) {
        console.log("Successfully ecRecovered signer as " + address);
      } else {
        console.log(
          "Failed to verify signer when comparing " + sig + " to " + address
        );
      }
    } catch (er) {
      console.error(er?.message);
      return er;
    }
  }

  async getAccounts() {
    try {
      const web3 = new Web3(this.provider);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      return address;
    } catch (error) {
      return error;
    }
  }
  async getBalance() {
    try {
      const web3 = new Web3(this.provider);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address) // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error;
    }
  }

  async sendTransaction() {
    try {
      const web3 = new Web3(this.provider);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];
      console.log({ fromAddress });

      const destination = fromAddress;

      const amount = web3.utils.toWei("0.001"); // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: "0xbae1c94002eC7A007d13CF05A82744fc2A45b8AD",
        value: amount,
        // maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        // maxFeePerGas: "6000000000000", // Max fee per gas
      });

      return receipt;
    } catch (error) {
      return error;
    }
  }
  // async sendContractTransaction() {
  //   try {
  //     let tokenConstant;

  //     tokenConstant = {
  //       abi: [
  //         {
  //           inputs: [
  //             {
  //               internalType: "string",
  //               name: "name_",
  //               type: "string",
  //             },
  //             {
  //               internalType: "string",
  //               name: "symbol_",
  //               type: "string",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "constructor",
  //         },
  //         {
  //           anonymous: false,
  //           inputs: [
  //             {
  //               indexed: true,
  //               internalType: "address",
  //               name: "owner",
  //               type: "address",
  //             },
  //             {
  //               indexed: true,
  //               internalType: "address",
  //               name: "spender",
  //               type: "address",
  //             },
  //             {
  //               indexed: false,
  //               internalType: "uint256",
  //               name: "value",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "Approval",
  //           type: "event",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "spender",
  //               type: "address",
  //             },
  //             {
  //               internalType: "uint256",
  //               name: "amount",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "approve",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "function",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "uint256",
  //               name: "amount",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "burn",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "function",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "account",
  //               type: "address",
  //             },
  //             {
  //               internalType: "uint256",
  //               name: "amount",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "burnFrom",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "function",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "spender",
  //               type: "address",
  //             },
  //             {
  //               internalType: "uint256",
  //               name: "subtractedValue",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "decreaseAllowance",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "function",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "spender",
  //               type: "address",
  //             },
  //             {
  //               internalType: "uint256",
  //               name: "addedValue",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "increaseAllowance",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "function",
  //         },
  //         {
  //           anonymous: false,
  //           inputs: [
  //             {
  //               indexed: false,
  //               internalType: "address",
  //               name: "account",
  //               type: "address",
  //             },
  //           ],
  //           name: "Paused",
  //           type: "event",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "recipient",
  //               type: "address",
  //             },
  //             {
  //               internalType: "uint256",
  //               name: "amount",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "transfer",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "function",
  //         },
  //         {
  //           anonymous: false,
  //           inputs: [
  //             {
  //               indexed: true,
  //               internalType: "address",
  //               name: "from",
  //               type: "address",
  //             },
  //             {
  //               indexed: true,
  //               internalType: "address",
  //               name: "to",
  //               type: "address",
  //             },
  //             {
  //               indexed: false,
  //               internalType: "uint256",
  //               name: "value",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "Transfer",
  //           type: "event",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "sender",
  //               type: "address",
  //             },
  //             {
  //               internalType: "address",
  //               name: "recipient",
  //               type: "address",
  //             },
  //             {
  //               internalType: "uint256",
  //               name: "amount",
  //               type: "uint256",
  //             },
  //           ],
  //           name: "transferFrom",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "nonpayable",
  //           type: "function",
  //         },
  //         {
  //           anonymous: false,
  //           inputs: [
  //             {
  //               indexed: false,
  //               internalType: "address",
  //               name: "account",
  //               type: "address",
  //             },
  //           ],
  //           name: "Unpaused",
  //           type: "event",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "owner",
  //               type: "address",
  //             },
  //             {
  //               internalType: "address",
  //               name: "spender",
  //               type: "address",
  //             },
  //           ],
  //           name: "allowance",
  //           outputs: [
  //             {
  //               internalType: "uint256",
  //               name: "",
  //               type: "uint256",
  //             },
  //           ],
  //           stateMutability: "view",
  //           type: "function",
  //         },
  //         {
  //           inputs: [
  //             {
  //               internalType: "address",
  //               name: "account",
  //               type: "address",
  //             },
  //           ],
  //           name: "balanceOf",
  //           outputs: [
  //             {
  //               internalType: "uint256",
  //               name: "",
  //               type: "uint256",
  //             },
  //           ],
  //           stateMutability: "view",
  //           type: "function",
  //         },
  //         {
  //           inputs: [],
  //           name: "decimals",
  //           outputs: [
  //             {
  //               internalType: "uint8",
  //               name: "",
  //               type: "uint8",
  //             },
  //           ],
  //           stateMutability: "view",
  //           type: "function",
  //         },
  //         {
  //           inputs: [],
  //           name: "name",
  //           outputs: [
  //             {
  //               internalType: "string",
  //               name: "",
  //               type: "string",
  //             },
  //           ],
  //           stateMutability: "view",
  //           type: "function",
  //         },
  //         {
  //           inputs: [],
  //           name: "paused",
  //           outputs: [
  //             {
  //               internalType: "bool",
  //               name: "",
  //               type: "bool",
  //             },
  //           ],
  //           stateMutability: "view",
  //           type: "function",
  //         },
  //         {
  //           inputs: [],
  //           name: "symbol",
  //           outputs: [
  //             {
  //               internalType: "string",
  //               name: "",
  //               type: "string",
  //             },
  //           ],
  //           stateMutability: "view",
  //           type: "function",
  //         },
  //         {
  //           inputs: [],
  //           name: "totalSupply",
  //           outputs: [
  //             {
  //               internalType: "uint256",
  //               name: "",
  //               type: "uint256",
  //             },
  //           ],
  //           stateMutability: "view",
  //           type: "function",
  //         },
  //       ],
  //     };

  //     const web3 = new Web3(this.provider);

  //     var tokenContract = new web3.eth.Contract(
  //       tokenConstant.abi,
  //       "0x07920F6d18464E56Da438D1ffF38f125C8AB90dD"
  //     );

  //     // Get user's Ethereum public address
  //     const fromAddress = (await web3.eth.getAccounts())[0];

  //     //dsdf
  //     const response = await tokenContract.methods
  //       .approve(
  //         "0xd1d25EAc33401b97568869564ee4ba6e259DCB35",
  //         "100000000000000000000000000"
  //       )
  //       .send(
  //         {
  //           from: fromAddress,
  //         },
  //         function (error, transactionHash) {
  //           if (transactionHash) {
  //             console.log(transactionHash);

  //             // setApproveCase(3);
  //           } else {
  //             console.log(error);
  //           }
  //         }
  //       )
  //       .on("receipt", async function (receipt) {
  //         console.log(receipt);
  //       })
  //       .on("error", async function (error) {
  //         console.log(error);
  //       });
  //     // Submit transaction to the blockchain and wait for it to be mined
  //     //   const receipt = await web3.eth.sendTransaction({
  //     //     from: fromAddress,
  //     //     to: destination,
  //     //     value: amount,
  //     //     maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
  //     //     maxFeePerGas: "6000000000000", // Max fee per gas
  //     //   });

  //     return response;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async getPrivateKey() {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error;
    }
  }
}
