import { connect } from "react-redux";
import { NameProfile } from "./NameProfile";

const mapStateToProps = (state) => {
	return {
		aoion: state.contractReducer.contracts.aoion,
		logos: state.contractReducer.contracts.logos,
		nameId: state.nameReducer.nameId,
		namePublicKey: state.contractReducer.contracts.namePublicKey,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		nameTAOVault: state.contractReducer.contracts.nameTAOVault,
		singlePageView: state.appReducer.singlePageView,
		namePositions: state.globalReducer.namePositions,
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		nameAccountRecovery: state.contractReducer.contracts.nameAccountRecovery,
		namesCompromised: state.globalReducer.namesCompromised
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const NameProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameProfile);
