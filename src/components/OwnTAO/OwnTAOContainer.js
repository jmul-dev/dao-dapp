import { connect } from "react-redux";
import { OwnTAO } from "./OwnTAO";

const mapStateToProps = (state) => {
	return {
		taos: state.nameReducer.taos,
		taosNeedApproval: state.nameReducer.taosNeedApproval
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const OwnTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnTAO);
