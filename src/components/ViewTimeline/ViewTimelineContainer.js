import { connect } from "react-redux";
import { ViewTimeline } from "./ViewTimeline";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		taos: state.globalReducer.taos,
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ViewTimelineContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewTimeline);
