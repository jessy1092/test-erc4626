import { useEffect, useState } from 'react';
import Web3 from 'web3/dist/web3.min.js';
import { AbstractProvider } from 'web3-core';

import './App.css';

import Dashboard from './components/Dashboard';

import { checkConnection, isSupportWeb3, Wallet } from './models/wallet';

function App() {
	const [myWallet, setWallet] = useState<null | Web3>(null);
	const [address, setAddress] = useState('');

	const connect = async () => {
		if (isSupportWeb3) {
			await window.ethereum?.request?.({ method: 'eth_requestAccounts' });
			const web3 = new Web3(window.ethereum as AbstractProvider);

			setWallet(web3);

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
			console.log(address);
			setAddress(address);

			if (address !== '') {
				const web3 = new Web3(window.ethereum as AbstractProvider);

				setWallet(web3);
			}
		};

		fetchAccount();
	}, []);

	return (
		<Wallet.Provider value={myWallet}>
			<div className="App">
				{isSupportWeb3 && (
					<>
						{address === '' ? (
							<button className="address" onClick={connect}>
								Connect MetaMask
							</button>
						) : (
							<div className="address">Wallet: {address}</div>
						)}

						<Dashboard address={address}></Dashboard>
					</>
				)}
			</div>
		</Wallet.Provider>
	);
}

export default App;
