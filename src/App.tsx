import { useEffect, useState } from 'react';
import Web3 from 'web3/dist/web3.min.js';
import { AbstractProvider } from 'web3-core';
import { AbiItem } from 'web3-utils';

import TWDFAbi from '../contracts/artifacts/TWDF_metadata.json';
import TWDFVaultAbi from '../contracts/artifacts/TWDFVault_metadata.json';

import './App.css';
import { checkConnection, isSupportWeb3 } from './wallet';
import { normalizeNum } from './utility';

function App() {
	const [count, setCount] = useState(0);
	const [address, setAddress] = useState('');
	const [totalSupply, setTotalSupply] = useState(0);
	const [myBallance, setMyBallance] = useState({ TWDF: 0, vTWDF: 0 });

	const connect = async () => {
		if (isSupportWeb3) {
			await window.ethereum?.request?.({ method: 'eth_requestAccounts' });
			const web3 = new Web3(window.ethereum as AbstractProvider);

			const account = web3.eth.accounts;
			//Get the current MetaMask selected/active wallet
			const walletAddress = account.givenProvider.selectedAddress;
			console.log(`Wallet: ${walletAddress}`);
			setAddress(walletAddress);

			const contract = new web3.eth.Contract(
				TWDFAbi.output.abi as AbiItem[],
				'0xe37Df5eAa40850b440a40e8E11C0d722142A0fBD',
			);

			const totalSupply = await contract.methods.totalSupply();

			console.log(totalSupply);
		} else {
			console.log('No wallet');
		}
	};

	useEffect(() => {
		const fetchAccount = async () => {
			const address = await checkConnection();
			console.log(address);
			setAddress(address);
		};

		fetchAccount();
	}, []);

	useEffect(() => {
		const getTWDF = async () => {
			if (address !== '') {
				const web3 = new Web3(window.ethereum as AbstractProvider);

				const contract = new web3.eth.Contract(
					TWDFAbi.output.abi as AbiItem[],
					'0xe37Df5eAa40850b440a40e8E11C0d722142A0fBD',
				);

				const total = await contract.methods.totalSupply().call();

				console.log(total);

				setTotalSupply(total);

				const balance = await contract.methods
					.balanceOf(web3.eth.accounts.givenProvider.selectedAddress)
					.call();

				setMyBallance(o => ({ ...o, TWDF: normalizeNum(balance) }));
			}
		};

		const getTWDFVault = async () => {
			if (address !== '') {
				const web3 = new Web3(window.ethereum as AbstractProvider);

				const contract = new web3.eth.Contract(
					TWDFVaultAbi.output.abi as AbiItem[],
					'0xe243ee6884f9f05bc38ca7e0206e3bd6aabbc5b0',
				);

				const total = await contract.methods.totalSupply().call();

				console.log(total);

				setTotalSupply(total);

				const balance = await contract.methods
					.balanceOf(web3.eth.accounts.givenProvider.selectedAddress)
					.call();

				setMyBallance(o => ({ ...o, vTWDF: normalizeNum(balance) }));
			}
		};

		getTWDF();
		getTWDFVault();
	}, [address]);

	return (
		<div className="App">
			{isSupportWeb3 && (
				<>
					{address === '' ? (
						<button onClick={connect}>Connect MetaMask</button>
					) : (
						<div className="address">Wallet: {address}</div>
					)}

					<div className="card">
						<h2>My Balance</h2>
						<div>TWDF: {myBallance.TWDF}</div>
						<div>vTWDF: {myBallance.vTWDF}</div>
					</div>
				</>
			)}
		</div>
	);
}

export default App;
