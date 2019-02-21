import { connect } from "react-redux";
import { Profile } from "./Profile";
import { setError } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setError: (headline, message, persisted) => dispatch(setError(headline, message, persisted))
	};
};

export const ProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
