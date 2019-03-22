import { connect } from "react-redux";
import { UnpositionLogosForm } from "./UnpositionLogosForm";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		logos: state.contractReducer.contracts.logos,
		positionLogosOn: state.nameReducer.positionLogosOn
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const UnpositionLogosFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UnpositionLogosForm);
