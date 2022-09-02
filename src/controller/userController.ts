import { ObjectId } from "mongodb";
import { User } from "../models/user";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { contract_address, contract_abi } from "../contract/contract";

import { AbiItem } from "web3-utils";

import { ethers } from "ethers";

const levelList = [2, 3, 4, 6, 8, 12];
const levelMoney = [0.5, 1, 1.2, 3, 6, 100];

export const add_user = async (
  first: string,
  last: string,
  email: string,
  address: string,
  img: string
) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    const newUser = new User({
      first: first,
      last: last,
      email: email,
      address: address,
      invite: [],
      level: 0,
      img: img,
    });
    await newUser.save();
    const savedUser = await User.findOne({ email: email });
    return savedUser;
  } else {
    return 0;
  }
};

export const get_user = async (id: string) => {
  const user = await User.findOne({ _id: new ObjectId(id) });
  return user;
};

export const invite_user = async (
  first: string,
  last: string,
  email: string,
  address: string,
  img: string,
  inviteId: string
) => {
  const result: any = await add_user(first, last, email, address, img);
  const inviteUser = await get_user(inviteId);
  if (result) {
    inviteUser?.invite.push(result?._id);
    await User.findOneAndUpdate(
      { _id: new ObjectId(inviteId) },
      {
        invite: inviteUser?.invite,
      },
      { new: true }
    );
    return result;
  } else {
    return 0;
  }
};

export const update_level = async (level: number, id: string) => {
  const inviteUser = await get_user(id);
  if (inviteUser) {
    await User.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        level: level,
      },
      { new: true }
    );
    return 1;
  } else {
    return 0;
  }
};

export const get_Level = async (id: string) => {
  const web3 = createAlchemyWeb3(process.env.ALCHEMY_HTTP || "");
  const contract = new web3.eth.Contract(
    contract_abi as AbiItem[],
    contract_address
  );
  const user = await get_user(id);
  const invite_number = user?.invite.length || 0;

  let count = 0;
  for (let i = 0; i < invite_number; i++) {
    const invitedUser = await get_user(user?.invite[i]);
    const balance = await contract.methods
      .balanceOf(invitedUser?.address)
      .call();
    if (balance > 0) {
      count++;
    }
  }
  let j = 0;

  while (levelList[j] <= count) {
    j++;
  }

  return j;
};

export const get_mintedUser = async (id: string) => {
  const web3 = createAlchemyWeb3(process.env.ALCHEMY_HTTP || "");
  const contract = new web3.eth.Contract(
    contract_abi as AbiItem[],
    contract_address
  );
  const user = await get_user(id);
  const invite_number = user?.invite.length || 0;

  let count = 0;
  for (let i = 0; i < invite_number; i++) {
    const invitedUser = await get_user(user?.invite[i]);
    const balance = await contract.methods
      .balanceOf(invitedUser?.address)
      .call();
    if (balance > 0) {
      count++;
    }
  }
  return count;
};

export const claim = async (id: string) => {
  const user = await get_user(id);
  const address = user?.address || "";

  const level = await get_Level(id);

  const alchemyProvider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY || "";
  const signer = new ethers.Wallet(privateKey, alchemyProvider);
  // Contract
  const contract = new ethers.Contract(contract_address, contract_abi, signer);

  const withdrawTx = await contract.withdraw();

  let i = user?.level || 0;

  let amountInEther = 0;

  while (level > i) {
    amountInEther += levelMoney[i];
    i++;
  }
  if (amountInEther > 0) {
    if (withdrawTx) {
      let receiverAddress = address;

      let sendTx = {
        to: receiverAddress,
        value: ethers.utils.parseEther(amountInEther.toString()),
      };

      const resultTx = signer.sendTransaction(sendTx).then((txObj) => {
        return txObj.hash;
      });
      if (await update_level(level, id)) {
        return resultTx;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};
