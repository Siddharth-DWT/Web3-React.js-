import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button,Row,Container,Form } from 'react-bootstrap';
import {} from 'dotenv/config'

import Web3 from 'web3';

import {Action_Type, Status_Type} from './common/Constant.js';

import './App.css';
import contract from './contracts/NFTCollectible.json';


function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState({status:null,message:'',actionType:''});
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [network, setNetwork] = useState("");

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install Metamask!");
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        initContractHandler(accounts[0])
      } else {
        console.log("No authorized account found");
      }
      // handle change account
      ethereum.on('accountsChanged', function (accounts) {
        setCurrentAccount(accounts[0]);
        initContractHandler(accounts[0])
        console.log(`Selected account changed to ${accounts[0]}`);
      });
    } catch (err) {
      console.log(err)
    }
    ethereum.on('networkChanged', async function  (net) {
      console.log("network changed",net);
      //  console.log(" currentAccount",currentAccount);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length !== 0) {
          setCurrentAccount(accounts[0]);
          initContractHandler(accounts[0])
      } else {
          console.log("No authorized account found");
      }
  }, false);
  };
 
  const initContractHandler = async () => {
     const { ethereum } = window;
    // attach provider
     const provider = new ethers.providers.Web3Provider(ethereum);
      let {name:network} = await provider.getNetwork();

      if(network !== process.env.REACT_APP_NETWORK){
        alert("Please select " + process.env.REACT_APP_NETWORK + " network");
        setNetwork("")
    }else{
        setNetwork(process.env.REACT_APP_NETWORK);
    }
  };
  

  const depositHandler = async () => {
    const { ethereum } = window;
    const web3 = new Web3(ethereum);

    const erc20Contract = new web3.eth.Contract(
      contract.abi,
      process.env.REACT_APP_CONTACT_ADDRESS,
      web3.get
    );
    if(!amount){
      setError(true);
      return
    }
    try{
      setError(false);
      setLoading({status: Status_Type.PENDING, message: 'Processing.... Please wait',actionType: Action_Type.MINT})
        
      let ethAmount = web3.utils.toWei(amount); // 2000 ETH
      let res = await erc20Contract.methods.deposit().send({
        value: ethAmount,
        from: currentAccount
      })
      setLoading({status: Status_Type.SUCCESS ,message:`Deposit  of ${amount} complete please see the transiction  <a target="_blank" rel="noreferrer" href=https://ropsten.etherscan.io/tx/${res}>here</a>`, actionType: Action_Type.MINT})
      console.log("----res---",res);
      setAmount('')
   }
    catch (e){
      console.log("error", e);
      setLoading({status: Status_Type.ERROR ,message:e.message, actionType: Action_Type.MINT})
   }
  }

  const withdrawHandler = async () => {
     
    const { ethereum } = window;
    const web3 = new Web3(ethereum);

    const erc20Contract = new web3.eth.Contract(
      contract.abi,
      process.env.REACT_APP_CONTACT_ADDRESS,
      web3.get
    );
    if(!amount){
      setError(true)
      return;
    }
    try{
      setError(false);
      setLoading({status: Status_Type.PENDING, message: 'Processing.... Please wait',actionType: Action_Type.MINT})
    let amountWith  = web3.utils.toWei(amount)
    let res = await erc20Contract.methods.withdraw(amountWith).send({from: currentAccount})
     setAmount('')
    console.log("----res---",res)
    setLoading({status: Status_Type.SUCCESS ,message:`Withdraw  of ${amount} complete please see the transiction  <a target="_blank" rel="noreferrer" href=https://ropsten.etherscan.io/tx/${res}>here</a>`, actionType: Action_Type.MINT})
     
    }
    catch(e){
      console.log("error", e);
      setLoading({status: Status_Type.ERROR ,message:e.message, actionType: Action_Type.MINT})
    }
  };  

  useEffect(() => {
    connectWalletHandler();
  }, [])
    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }
    return (
    <div className='main-app'>
      <h1>Withdraw/Deposit On Alpha Homora v2</h1>
        {currentAccount ?
        <>
        <h3>Selected Account:{currentAccount} </h3>
        <h4>Alpha Homora v2 Contract Hash:{process.env.REACT_APP_CONTACT_ADDRESS}</h4>
        {network === process.env.REACT_APP_NETWORK && <Container className="containerWrapper">
       
        <Form >
          <Form.Group className="mb-3" controlId="formBasicEmail" style={{width:'440px',marginLeft:'30%'}}>
            <Form.Control type="amount" isValid={amount && error} isInvalid={error} placeholder="Enter amount" value={amount} onChange={(elm)=>{setError(!elm.target.value);setAmount(elm.target.value)}}/>              
            <Form.Control.Feedback type="invalid">Please enter amount!</Form.Control.Feedback>
          </Form.Group>
        </Form>
        {loading.actionType === Action_Type.MINT  && loading.message ? <span style={loading.status === Status_Type.ERROR ? {color: 'red'} : {}} dangerouslySetInnerHTML={{__html: loading.message}}></span>:''}
          <Row className="customRow align-items-center justify-content-center" >
            <Button size="lg"  variant="primary" onClick={depositHandler} >Deposit</Button>
            <Button size="lg" variant="primary" onClick={withdrawHandler}>Withdraw</Button>
          </Row >
        </Container>}
        </> :connectWalletButton()}
    </div>
  )
}

export default App;
