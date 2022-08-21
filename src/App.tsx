import { useEffect, useState } from 'react';
import Web3 from 'web3/dist/web3.min.js';
import { AbstractProvider } from 'web3-core';

import reactLogo from './assets/react.svg';
import './App.css';
import { checkConnection, isSupportWeb3 } from './wallet';

function App() {
	const [count, setCount] = useState(0);
	const [address, setAddress] = useState('');

	const connect = async () => {
		if (isSupportWeb3) {
			await window.ethereum?.request?.({ method: 'eth_requestAccounts' });
			const web3 = new Web3(window.ethereum as AbstractProvider);

			const account = web3.eth.accounts;
			//Get the current MetaMask selected/active wallet
			const walletAddress = account.givenProvider.selectedAddress;
			console.log(`Wallet: ${walletAddress}`);
			setAddress(walletAddress);
		} else {
			console.log('No wallet');
		}
	};

	useEffect(() => {
		const fetchAccount = async () => {
			const address = await checkConnection();
			setAddress(address);
		};

		fetchAccount();
	}, []);

	return (
		<div className="App">
			{isSupportWeb3 && (
				<>
					{address === '' ? (
						<button onClick={connect}>Connect MetaMask</button>
					) : (
						<div>Wallet: {address}</div>
					)}
				</>
			)}
		</div>
	);
}

export default App;
