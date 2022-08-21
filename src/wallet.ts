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
	}
};
