import { connect } from "react-redux";
import { TopNavBar } from "./TopNavBar";
import { setNameInfo } from "./actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.taoReducer.nameId,
		nameTAOLookup: state.contractReducer.nameTAOLookup,
		nameInfo: state.taoReducer.nameInfo
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setNameInfo: (nameInfo) => dispatch(setNameInfo(nameInfo))
	};
};

export const TopNavBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TopNavBar);
