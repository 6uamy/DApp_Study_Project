import React, {Component} from 'react';
import './App.css';
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main.js';
import ParticleSettings from './ParticleSettings.js';

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    // web3 연결
    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if(window.web3) {
                window.web3 = new Web3(window.web3.currentProvider);
        } 
        else {
            window.alert('No ethereum browser detected! Check out MetaMask!');
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        this.setState({account: account[0]});
        const networkId = await web3.eth.net.getId();

        // Tether 계약 불러오기
        const tetherData = Tether.networks[networkId];
        if(tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            this.setState({tether});
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({tetherBalance: tetherBalance.toString()});
        } 
        else {
            window.alert('Error! Tether contract not deployed!');
        }

        // Reward 계약 불러오기
        const rwdData = RWD.networks[networkId];
        if(rwdData) {
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
            this.setState({rwd});
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
            this.setState({rwdBalance: rwdBalance.toString()});
        } 
        else {
            window.alert('Error! RWD contract not deployed!');
        }

        // Decentral Bank 계약 불러오기
        const decentralBankData = DecentralBank.networks[networkId];
        if(decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            this.setState({decentralBank});
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({stakingBalance: stakingBalance.toString()});
        } 
        else {
            window.alert('Error! DecentralBank contract not deployed!');
        }

        // 로딩 종료
        this.setState({loading: false});
    }
    
    // Tokens 예금 함수
    stakeTokens = (amount) => {
        this.setState({loading: true});
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        });
    });
    }

    // Unstaking tokens
    unstakeTokens = () => {
        this.setState({loading: true});
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        });
    }

    // Issue tokens
    issueTokens = () => {
        this.setState({loading: true})
        this.state.decentralBank.methods.issueTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        });
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x011',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    render() {
        let content
        // this.state.loading ? true일 경우 로딩 텍스트 false일 경우에 메인컨텐츠
        {this.state.loading ? content = 
        <p id='loader' className='text-center' style={{margin:'30px', color:'white'}}>
        LOADING PLEASE...</p> : content = 
        <Main
        tetherBalance = {this.state.tetherBalance}
        rwdBalance = {this.state.rwdBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
        issueTokens = {this.issueTokens}
        />}
        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                <ParticleSettings />
                </div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;

