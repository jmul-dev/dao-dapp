import { connect } from "react-redux";
import { PositionDetails } from "./PositionDetails";

const mapStateToProps = (state) => {
	return {
		nameTAOPosition: state.contractReducer.nameTAOPosition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PositionDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PositionDetails);
