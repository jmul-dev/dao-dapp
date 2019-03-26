import { connect } from "react-redux";
import { TAODetails } from "./TAODetails";
import { toggleView } from "./actions";

const mapStateToProps = (state) => {
	return {
		aoLibrary: state.contractReducer.contracts.aoLibrary,
		ethos: state.contractReducer.contracts.ethos,
		nameId: state.nameReducer.nameId,
		names: state.globalReducer.names,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		pathos: state.contractReducer.contracts.pathos,
		singlePageView: state.appReducer.singlePageView,
		stakedTAOs: state.globalReducer.stakedTAOs,
		taoAncestry: state.contractReducer.contracts.taoAncestry,
		taoFactory: state.contractReducer.contracts.taoFactory,
		taosNeedApproval: state.nameReducer.taosNeedApproval,
		taoPool: state.contractReducer.contracts.taoPool,
		taoPositions: state.globalReducer.taoPositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleView: () => dispatch(toggleView())
	};
};

export const TAODetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TAODetails);
