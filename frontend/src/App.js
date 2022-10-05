import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { ethers } from "ethers";
import ConnectMetamask from './components/ConnectWallet';

import Contract from "./contracts/contract-address.json";
import ContractArtifact from "./contracts/contract.json";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  pointsSucessfullyIncremented, 
  sucessfullyRegister, 
  pointsNotIncremented, 
  notRegistered, 
  expiredToken, 
  invalidToken, 
  pointsRetrieved 
} from "./components/ToastMessages"

async function walletCallback(info){
  const payload = {
    address : info.address,
    r : info.slicedSignature[0],
    s : info.slicedSignature[1],
    v : info.slicedSignature[2]
  }

  try{
    const res = await axios.post('http://localhost:3001/saveToS', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    localStorage.setItem('jwt', res.data.token);
    sucessfullyRegister()

  }
  catch(e){
    console.error(e)
  }
}

const getPoints = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner(0);
    const contract = new ethers.Contract(
      Contract.contract,
      ContractArtifact.abi,
      signer
    );
    const tx = await contract.getPoints();
    pointsRetrieved(parseInt(tx))

  }
  catch(e){
    console.error(e)
  }
}

const incrementPoints = async () => {
  try{
    const jwt = localStorage.getItem('jwt');
    if(jwt){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner(0);
      const payload = {
        "address" : await signer.getAddress()
      }
      await axios.post('http://localhost:3001/incrementPoints', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : jwt
        }
      });
      pointsSucessfullyIncremented()
    }
    else{
      notRegistered()
    }
  }
  catch(e){
    if(e.response.data === "Expired token"){
      expiredToken()
      localStorage.removeItem('jwt');
    }
    else if (e.response.data === "Invalid token"){
      invalidToken()
      localStorage.removeItem('jwt');
    }
    else{
      pointsNotIncremented()
    }
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <br />
        <button onClick={() => ConnectMetamask(walletCallback)}>Connect wallet</button>
        <br />
        <button onClick={incrementPoints}>Increment Points</button>
        <br />
        <button onClick={getPoints}>Get points</button>
      </header>
    </div>
  );
}

export default App;
