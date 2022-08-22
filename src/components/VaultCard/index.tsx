import { ChangeEvent, useState } from 'react';
import { useTWDFContract, useTWDFVaultContract, useWallet } from '../../models/wallet';

import './index.css';

interface VaultCardProperty {
	isActive: boolean;
	isNeedApprove: boolean;
	approve: () => Promise<void>;
	getTWDFAllowance: () => Promise<void>;
	getTWDFBalance: () => Promise<void>;
	totalAssets: bigint;
	deposit: (n: bigint) => Promise<void>;
	withdraw: (n: bigint) => Promise<void>;
}

const VaultCard: React.FC<VaultCardProperty> = ({
	isActive,
	isNeedApprove,
	approve,
	getTWDFAllowance,
	getTWDFBalance,
	totalAssets,
	deposit,
	withdraw,
}) => {
	const [actionAsset, setActionAsset] = useState<bigint>(0n);

	const onChangeAssets = (e: ChangeEvent<HTMLInputElement>) => {
		setActionAsset(BigInt(e.target.value));
	};

	const onDeposit = async () => {
		await deposit(actionAsset);
		await Promise.all([getTWDFAllowance(), getTWDFBalance()]);
	};
	const onWithdraw = async () => {
		await withdraw(actionAsset);
		await Promise.all([getTWDFAllowance(), getTWDFBalance()]);
	};

	return (
		<div className="vault-card">
			<h2>Vault</h2>
			<div className="action">
				<input type="text" placeholder="deposit/withdraw TWDF" onChange={onChangeAssets}></input>
				{isActive && isNeedApprove && <button onClick={approve}>Approve</button>}
				{isActive && !isNeedApprove && <button onClick={onDeposit}>Deposit</button>}
				{isActive && <button onClick={onWithdraw}>withdraw</button>}
			</div>
			<div>Current TWDF in Vault: {totalAssets.toString()}</div>
		</div>
	);
};

export default VaultCard;
