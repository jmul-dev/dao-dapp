import { connect } from "react-redux";
import { NameList } from "./NameList";

const mapStateToProps = (state) => {
	return {
		names: state.globalReducer.names
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const NameListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameList);
