import { connect } from "react-redux";
import { RequireActions } from "./RequireActions";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		names: state.globalReducer.names,
		taos: state.globalReducer.taos,
		challengeTAOAdvocates: state.globalReducer.challengeTAOAdvocates,
		nameId: state.nameReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const RequireActionsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RequireActions);
