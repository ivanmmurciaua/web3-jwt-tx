import { ethers } from "ethers";

const sliceSign = (signature) => {
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);

    return [r,s,v]
}

async function ConnectMetamask(callback) {
    console.log("Entra connect wallet")
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const [selectedAddress] = await provider.send("eth_requestAccounts");
  
    const nonce = parseInt(await provider.getTransactionCount(selectedAddress));
    const hashedAddress = ethers.utils.id(selectedAddress);
    const hashedNonce = ethers.utils.id(nonce);
    const tos = "Terms and conditions\nThis dApp is under development, signing this message you're accepting that you are in a beta tester program.\nIf you change device or delete cache, you'll need to sign this message again."
  
    const mess = `${tos} \n Address: ${hashedAddress} \n Nonce: ${hashedNonce}`
  
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [mess, selectedAddress],
    });

    console.log(signature)

    const slicedSignature = sliceSign(signature)

    callback({
        "address" : selectedAddress,
        "slicedSignature" : slicedSignature
    })
}

export default ConnectMetamask;