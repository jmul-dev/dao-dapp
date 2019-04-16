import { connect } from "react-redux";
import { CreateNameForm } from "./CreateNameForm";
import { setNameId } from "./actions";

const mapStateToProps = (state) => {
	return {
		localWriterKey: state.nameReducer.localWriterKey,
		accounts: state.web3Reducer.accounts,
		nameFactory: state.contractReducer.contracts.nameFactory,
		nameTAOLookup: state.contractReducer.contracts.nameTAOLookup
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setNameId: (nameId) => dispatch(setNameId(nameId))
	};
};

export const CreateNameFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateNameForm);
