import { connect } from "react-redux";
import { NameProfile } from "./NameProfile";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameTAOLookup: state.contractReducer.nameTAOLookup,
		nameTAOPosition: state.contractReducer.nameTAOPosition,
		namePublicKey: state.contractReducer.namePublicKey,
		aoion: state.contractReducer.aoion
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const NameProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameProfile);
