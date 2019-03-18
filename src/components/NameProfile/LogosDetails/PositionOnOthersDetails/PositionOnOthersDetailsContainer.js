import { connect } from "react-redux";
import { PositionOnOthersDetails } from "./PositionOnOthersDetails";

const mapStateToProps = (state) => {
	return {
		positionLogos: state.nameReducer.positionLogos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PositionOnOthersDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PositionOnOthersDetails);
