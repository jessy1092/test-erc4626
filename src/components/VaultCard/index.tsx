import { ChangeEvent, useState } from 'react';
import { useVault } from '../../models/vault';
import { useTWDFContract, useTWDFVaultContract, useWallet } from '../../models/wallet';

import './index.css';

interface VaultCardProperty {
	isActive: boolean;
	isNeedApprove: boolean;
	approve: () => Promise<void>;
	getTWDFAllowance: () => Promise<void>;
	getTWDFBalance: () => Promise<void>;
	deposit: (n: bigint) => Promise<void>;
	withdraw: (n: bigint) => Promise<void>;
	mint: (n: bigint) => Promise<void>;
	redeem: (n: bigint) => Promise<void>;
}

const VaultCard: React.FC<VaultCardProperty> = ({
	isActive,
	isNeedApprove,
	approve,
	getTWDFAllowance,
	getTWDFBalance,
	deposit,
	withdraw,
	mint,
	redeem,
}) => {
	const [actionAsset, setActionAsset] = useState<bigint>(0n);
	const [actionShare, setActionShare] = useState<bigint>(0n);
	const { totalAssets, totalSupply } = useVault();

	const onChangeAssets = (e: ChangeEvent<HTMLInputElement>) => {
		try {
			setActionAsset(BigInt(e.target.value));
		} catch (e) {
			console.log('Can not parse bigint');
		}
	};

	const onChangeShare = (e: ChangeEvent<HTMLInputElement>) => {
		try {
			setActionShare(BigInt(e.target.value));
		} catch (e) {
			console.log('Can not parse bigint');
		}
	};

	const onDeposit = async () => {
		await deposit(actionAsset);
		await Promise.all([getTWDFAllowance(), getTWDFBalance()]);
	};

	const onWithdraw = async () => {
		await withdraw(actionAsset);
		await Promise.all([getTWDFAllowance(), getTWDFBalance()]);
	};

	const onMint = async () => {
		await mint(actionShare);
		await Promise.all([getTWDFAllowance(), getTWDFBalance()]);
	};

	const onRedeem = async () => {
		await redeem(actionShare);
		await Promise.all([getTWDFAllowance(), getTWDFBalance()]);
	};

	return (
		<div className="vault-card">
			<h2>Vault</h2>
			{isActive && (
				<div className="action">
					<input
						type="text"
						placeholder="deposit/withdraw TWDF"
						value={actionAsset.toString()}
						onChange={onChangeAssets}
					></input>
					{isNeedApprove && <button onClick={approve}>Approve</button>}
					{!isNeedApprove && <button onClick={onDeposit}>Deposit</button>}
					<button onClick={onWithdraw}>withdraw</button>
				</div>
			)}
			{isActive && (
				<div className="action">
					<input
						type="text"
						placeholder="mint/redeem vTWDF"
						value={actionShare.toString()}
						onChange={onChangeShare}
					></input>
					{isNeedApprove && <button onClick={approve}>Approve</button>}
					{!isNeedApprove && <button onClick={onMint}>Mint</button>}
					<button onClick={onRedeem}>Redeem</button>
				</div>
			)}
			<div>Current TWDF in Vault: {totalAssets.toString()}</div>
			<div>Total vTWDF: {totalSupply.toString()}</div>
		</div>
	);
};

export default VaultCard;
