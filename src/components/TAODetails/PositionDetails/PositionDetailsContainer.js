import { connect } from "react-redux";
import { PositionDetails } from "./PositionDetails";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PositionDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PositionDetails);
