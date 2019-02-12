import { connect } from "react-redux";
import { NameProfile } from "./NameProfile";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		nameId: state.taoReducer.nameId,
		nameTAOLookup: state.contractReducer.nameTAOLookup,
		nameTAOPosition: state.contractReducer.nameTAOPosition,
		namePublicKey: state.contractReducer.namePublicKey
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const NameProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameProfile);
