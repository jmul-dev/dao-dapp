import { connect } from "react-redux";
import { NameProfile } from "./NameProfile";
import { toggleView } from "./actions";

const mapStateToProps = (state) => {
	return {
		aoion: state.contractReducer.contracts.aoion,
		logos: state.contractReducer.contracts.logos,
		nameId: state.nameReducer.nameId,
		namePublicKey: state.contractReducer.contracts.namePublicKey,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		singlePageView: state.appReducer.singlePageView,
		namePositions: state.globalReducer.namePositions,
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleView: () => dispatch(toggleView())
	};
};

export const NameProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameProfile);
