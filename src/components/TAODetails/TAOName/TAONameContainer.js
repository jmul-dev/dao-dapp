import { connect } from "react-redux";
import { TAOName } from "./TAOName";
import { setError, setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		accounts: state.web3Reducer.accounts,
		taoAncestry: state.contractReducer.contracts.taoAncestry
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setError: (headline, message) => dispatch(setError(headline, message, false)),
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const TAONameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TAOName);
