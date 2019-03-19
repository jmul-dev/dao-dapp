import { connect } from "react-redux";
import { PositionOnOthersDetails } from "./PositionOnOthersDetails";

const mapStateToProps = (state) => {
	return {
		positionLogosOn: state.nameReducer.positionLogosOn
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PositionOnOthersDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PositionOnOthersDetails);
