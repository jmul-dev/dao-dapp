import { connect } from "react-redux";
import { Profile } from "./Profile";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
