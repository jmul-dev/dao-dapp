import * as React from "react";
import { Wrapper } from "components/";
import { A } from "./styledComponents";

class TxHash extends React.Component {
	render() {
		const { etherscan, txHash } = this.props;
		if (!etherscan) {
			return null;
		}
		return (
			<Wrapper className={!this.props.small ? "tx-hash" : "tx-hash-small"}>
				tx:{" "}
				<A href={`${etherscan}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
					{txHash}
				</A>
			</Wrapper>
		);
	}
}

export { TxHash };
