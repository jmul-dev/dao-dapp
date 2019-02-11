import { connect } from "react-redux";
import { EnsureCreateName } from "./EnsureCreateName";
import { setNameId } from "./actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameFactory: state.contractReducer.nameFactory,
		nameId: state.taoReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setNameId: (nameId) => dispatch(setNameId(nameId))
	};
};

export const EnsureCreateNameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EnsureCreateName);
