import React, { useCallback, useContext, useEffect, useState } from 'react';
import Web3 from 'web3/dist/web3.min.js';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

import TWDFAbi from '../../artifacts/contracts/erc20-twdf.sol/TWDF.json';
import TWDFVaultAbi from '../../artifacts/contracts/erc4626-twdf.sol/TWDFVault.json';

import { normalizeNum } from '../utility';

export const isSupportWeb3 =
	typeof window.ethereum !== 'undefined' && typeof window.ethereum.request !== 'undefined';

export const isConnected = false;

export const checkConnection = async () => {
	if (isSupportWeb3) {
		const account = await window.ethereum?.request?.({ method: 'eth_accounts' });

		if (typeof account !== 'undefined' && account[0]) {
			console.log(account[0]);

			return account[0];
		}

		return '';
	}
};

const TWDF_CONTRACT = '0xe37Df5eAa40850b440a40e8E11C0d722142A0fBD';
const TWDF_VAULT_CONTRACT = '0xe243ee6884f9f05bc38ca7e0206e3bd6aabbc5b0';

export const Wallet = React.createContext<null | Web3>(null);

export const useWallet = () => {
	const wallet = useContext(Wallet);

	return {
		isActive: wallet !== null,
		wallet,
	};
};

export const useTWDFContract = (myAddress: string) => {
	const { wallet } = useWallet();
	const [balance, setBalance] = useState<bigint>(0n);
	const [contract, setContract] = useState<null | Contract>(null);
	const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);

	const getBalance = useCallback(async () => {
		if (contract !== null) {
			console.log('Get Balance?');
			const newBalance = await contract.methods.balanceOf(myAddress).call();

			console.log(newBalance);

			setBalance(normalizeNum(BigInt(newBalance)));
		}
	}, [contract]);

	const getAllowance = useCallback(async () => {
		if (contract !== null) {
			console.log('Get Balance?');
			const newBalance = await contract.methods.allowance(myAddress, TWDF_VAULT_CONTRACT).call();

			console.log(newBalance);

			setIsNeedApprove(BigInt(newBalance) === 0n);
		}
	}, [contract, setBalance]);

	useEffect(() => {
		const getContract = async () => {
			if (wallet !== null) {
				const contract = new wallet.eth.Contract(TWDFAbi.abi as AbiItem[], TWDF_CONTRACT, {
					from: myAddress, // default from address
					gasPrice: '500000000',
				});
				setContract(contract);
			}
		};

		getContract();
	}, [wallet]);

	useEffect(() => {
		getBalance();
		getAllowance();
	}, [contract]);

	const mint = async () => {
		console.log('mint??????', contract);
		if (contract !== null) {
			const recipt = await contract.methods.mint(myAddress).send();

			console.log('mint finish', recipt);

			await getBalance();
		}
	};

	const approve = async () => {
		console.log('approve??????', contract);
		if (contract !== null) {
			const recipt = await contract.methods
				.approve(TWDF_VAULT_CONTRACT, balance * 10n ** 18n)
				.send();

			console.log('approve finish', recipt);

			await getAllowance();
		}
	};

	return { balance, contract, mint, approve, isNeedApprove, getAllowance, getBalance };
};

export const useTWDFVaultContract = (myAddress: string) => {
	const { wallet } = useWallet();
	const [balance, setBalance] = useState<bigint>(0n);
	const [totalAssets, setTotalAssets] = useState<bigint>(0n);
	const [contract, setContract] = useState<null | Contract>(null);

	const getBalance = useCallback(async () => {
		if (contract !== null) {
			console.log('Get Balance?');
			const newBalance = await contract.methods.balanceOf(myAddress).call();

			console.log(newBalance);

			setBalance(normalizeNum(BigInt(newBalance)));
		}
	}, [contract]);

	const getTotalAssets = useCallback(async () => {
		if (contract !== null) {
			console.log('Get total asset?');
			const newTotalAssets = await contract.methods.totalAssets().call();

			console.log(newTotalAssets);

			setTotalAssets(normalizeNum(BigInt(newTotalAssets)));
		}
	}, [contract]);

	const deposit = async (number: bigint) => {
		console.log('deposit??????', contract);
		if (contract !== null) {
			const recipt = await contract.methods.deposit(number * 10n ** 18n, myAddress).send();

			console.log('deposit finish', recipt);

			await getBalance();
		}
	};

	const withdraw = async (number: bigint) => {
		console.log('withdraw??????', contract);
		if (contract !== null) {
			const recipt = await contract.methods
				.withdraw(number * 10n ** 18n, myAddress, myAddress)
				.send();

			console.log('withdraw finish', recipt);

			await getBalance();
		}
	};

	useEffect(() => {
		const getContract = async () => {
			if (wallet !== null) {
				const contract = new wallet.eth.Contract(
					TWDFVaultAbi.abi as AbiItem[],
					TWDF_VAULT_CONTRACT,
					{
						from: myAddress, // default from address
						gasPrice: '500000000',
					},
				);

				setContract(contract);
			}
		};

		getContract();
	}, [wallet]);

	useEffect(() => {
		getBalance();
		getTotalAssets();
	}, [contract]);

	return { balance, contract, totalAssets, deposit, withdraw };
};
