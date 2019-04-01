import { connect } from "react-redux";
import { Thought } from "./Thought";

const mapStateToProps = (state) => {
	return {
		names: state.globalReducer.names
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ThoughtContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Thought);
