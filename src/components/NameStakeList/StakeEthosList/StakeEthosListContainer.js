import { connect } from "react-redux";
import { StakeEthosList } from "./StakeEthosList";
import { setError, setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		accounts: state.web3Reducer.accounts,
		stakeEthos: state.nameReducer.stakeEthos,
		taoPool: state.contractReducer.contracts.taoPool
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setError: (headline, message) => dispatch(setError(headline, message, false)),
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const StakeEthosListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(StakeEthosList);
