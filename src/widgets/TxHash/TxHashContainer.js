import { connect } from "react-redux";
import { TxHash } from "./TxHash";

const mapStateToProps = (state) => {
	return {
		etherscan: state.web3Reducer.etherscan
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const TxHashContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TxHash);
