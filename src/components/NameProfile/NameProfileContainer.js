import { connect } from "react-redux";
import { NameProfile } from "./NameProfile";

const mapStateToProps = (state) => {
	return {
		nameInfo: state.taoReducer.nameInfo
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const NameProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameProfile);
