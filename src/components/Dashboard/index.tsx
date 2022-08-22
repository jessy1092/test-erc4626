import { useTWDFContract, useTWDFVaultContract, useWallet } from '../../models/wallet';
import BalanceCard from '../BalanceCard';
import VaultCard from '../VaultCard';

interface DashboardProperty {
	address: string;
}

const Dashboard: React.FC<DashboardProperty> = ({ address }) => {
	const { isActive } = useWallet();
	const {
		mint,
		balance: TWDFBalance,
		isNeedApprove,
		approve,
		getAllowance: getTWDFAllowance,
		getBalance: getTWDFBalance,
	} = useTWDFContract(address);
	const { balance: vTWDFBalance, totalAssets, deposit, withdraw } = useTWDFVaultContract(address);

	return (
		<>
			<BalanceCard
				isActive={isActive}
				TWDFBalance={TWDFBalance}
				vTWDFBalance={vTWDFBalance}
				mint={mint}
			></BalanceCard>
			<VaultCard
				isActive={isActive}
				isNeedApprove={isNeedApprove}
				approve={approve}
				getTWDFAllowance={getTWDFAllowance}
				totalAssets={totalAssets}
				deposit={deposit}
				withdraw={withdraw}
				getTWDFBalance={getTWDFBalance}
			></VaultCard>
		</>
	);
};

export default Dashboard;
