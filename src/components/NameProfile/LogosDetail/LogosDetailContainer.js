import { connect } from "react-redux";
import { LogosDetail } from "./LogosDetail";

const mapStateToProps = (state) => {
	return {
		logos: state.contractReducer.logos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const LogosDetailContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LogosDetail);
