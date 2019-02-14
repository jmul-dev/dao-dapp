import { connect } from "react-redux";
import { PositionDetail } from "./PositionDetail";

const mapStateToProps = (state) => {
	return {
		nameTAOPosition: state.contractReducer.nameTAOPosition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PositionDetailContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PositionDetail);
