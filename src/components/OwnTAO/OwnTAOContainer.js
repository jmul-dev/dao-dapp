import { connect } from "react-redux";
import { OwnTAO } from "./OwnTAO";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		nameId: state.nameReducer.nameId,
		ownTAOs: state.nameReducer.taos,
		taosNeedApproval: state.nameReducer.taosNeedApproval,
		stakeEthos: state.nameReducer.stakeEthos,
		stakePathos: state.nameReducer.stakePathos,
		taos: state.globalReducer.taos,
		taoPositions: state.globalReducer.taoPositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const OwnTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnTAO);
