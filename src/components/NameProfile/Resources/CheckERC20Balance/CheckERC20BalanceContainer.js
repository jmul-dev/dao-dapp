import { connect } from "react-redux";
import { CheckERC20Balance } from "./CheckERC20Balance";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		nameTAOVault: state.contractReducer.contracts.nameTAOVault
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const CheckERC20BalanceContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CheckERC20Balance);
