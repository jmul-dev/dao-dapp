import { connect } from "react-redux";
import { ProgressLoader } from "./ProgressLoader";

const mapStateToProps = (state) => {
	return {
		pastEventsProgress: state.globalReducer.pastEventsProgress,
		latestBlockNumber: state.globalReducer.latestBlockNumber,
		blockNumberProcessed: state.globalReducer.blockNumberProcessed
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ProgressLoaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProgressLoader);
