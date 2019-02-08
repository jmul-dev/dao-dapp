import { connect } from "react-redux";
import { Signup } from "./Signup";
import { setNameId } from "./actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameFactory: state.contractReducer.nameFactory,
		nameTAOLookup: state.contractReducer.nameTAOLookup
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setNameId: (nameId) => dispatch(setNameId(nameId))
	};
};

export const SignupContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Signup);
