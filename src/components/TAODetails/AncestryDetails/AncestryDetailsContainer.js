import { connect } from "react-redux";
import { AncestryDetails } from "./AncestryDetails";

const mapStateToProps = (state) => {
	return {
		taos: state.globalReducer.taos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const AncestryDetailsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AncestryDetails);
