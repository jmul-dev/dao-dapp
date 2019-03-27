import { connect } from "react-redux";
import { Profile } from "./Profile";
import { setError, setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		namePositions: state.globalReducer.namePositions,
		nameAccountRecovery: state.contractReducer.contracts.nameAccountRecovery
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setError: (headline, message, persisted) => dispatch(setError(headline, message, persisted)),
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const ProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
