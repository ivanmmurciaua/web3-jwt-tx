import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import ConnectMetamask from './ConnectWallet';

async function walletCallback(info){
  const payload = {
    address : info.address,
    r : info.slicedSignature[0],
    s : info.slicedSignature[1],
    v : info.slicedSignature[2]
  }
  console.log(payload)
  try{
    const res = await axios.post('http://localhost:3001/saveToS', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(res.data)
  }
  catch(e){
    console.error(e)
  }
}

ConnectMetamask(walletCallback)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
