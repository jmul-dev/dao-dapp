import { connect } from "react-redux";
import { OwnTAO } from "./OwnTAO";

const mapStateToProps = (state) => {
	return {
		ownTAOs: state.nameReducer.taos,
		taosNeedApproval: state.nameReducer.taosNeedApproval,
		stakeEthos: state.nameReducer.stakeEthos,
		stakePathos: state.nameReducer.stakePathos,
		taos: state.globalReducer.taos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const OwnTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnTAO);
