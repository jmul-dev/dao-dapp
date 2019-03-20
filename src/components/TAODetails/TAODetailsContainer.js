import { connect } from "react-redux";
import { TAODetails } from "./TAODetails";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		taoFactory: state.contractReducer.contracts.taoFactory,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		aoLibrary: state.contractReducer.contracts.aoLibrary,
		taoAncestry: state.contractReducer.contracts.taoAncestry,
		taoPool: state.contractReducer.contracts.taoPool,
		ethos: state.contractReducer.contracts.ethos,
		pathos: state.contractReducer.contracts.pathos,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup,
		stakedTAOs: state.globalReducer.stakedTAOs
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const TAODetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TAODetails);
