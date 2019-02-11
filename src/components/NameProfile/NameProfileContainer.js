import { connect } from "react-redux";
import { NameProfile } from "./NameProfile";

const mapStateToProps = (state) => {
	return {
		nameId: state.taoReducer.nameId,
		nameTAOLookup: state.contractReducer.nameTAOLookup,
		nameTAOPosition: state.contractReducer.nameTAOPosition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const NameProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NameProfile);
