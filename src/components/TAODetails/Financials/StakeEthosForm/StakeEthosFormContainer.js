import { connect } from "react-redux";
import { StakeEthosForm } from "./StakeEthosForm";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		taoCurrencyBalances: state.nameReducer.taoCurrencyBalances,
		taoPool: state.contractReducer.contracts.taoPool
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const StakeEthosFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(StakeEthosForm);
