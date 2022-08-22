import { useTWDFContract, useTWDFVaultContract, useWallet } from '../../models/wallet';

import './index.css';

interface BalanceCardProperty {
	isActive: boolean;
	TWDFBalance: bigint;
	vTWDFBalance: bigint;
	mint: () => Promise<void>;
}

const BalanceCard: React.FC<BalanceCardProperty> = ({
	isActive,
	TWDFBalance,
	vTWDFBalance,
	mint,
}) => {
	return (
		<div className="balance-card">
			<h2>My Balance</h2>
			<div className="action">
				<div>TWDF: {TWDFBalance.toString()}</div>
				{isActive && <button onClick={mint}>Mint</button>}
			</div>
			<div>vTWDF: {vTWDFBalance.toString()}</div>
		</div>
	);
};

export default BalanceCard;
