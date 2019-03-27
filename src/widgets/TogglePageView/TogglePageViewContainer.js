import { connect } from "react-redux";
import { TogglePageView } from "./TogglePageView";
import { toggleView } from "./actions";

const mapStateToProps = (state) => {
	return {
		singlePageView: state.appReducer.singlePageView
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleView: () => dispatch(toggleView())
	};
};

export const TogglePageViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TogglePageView);
