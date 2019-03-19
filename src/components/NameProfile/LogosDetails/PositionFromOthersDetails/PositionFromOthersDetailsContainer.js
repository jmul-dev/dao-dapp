import { connect } from "react-redux";
import { PositionFromOthersDetails } from "./PositionFromOthersDetails";

const mapStateToProps = (state) => {
	return {
		positionLogosFrom: state.nameReducer.positionLogosFrom
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PositionFromOthersDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PositionFromOthersDetails);
