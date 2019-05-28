const _graphql = (query, variables) => {
	return new Promise((resolve, reject) => {
		fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
			method: "POST",
			body: JSON.stringify({
				query,
				variables
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			}
		})
			.then((response) => {
				return response.json();
			})
			.then((resp) => {
				resolve(resp);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const _graphqlWithTimeout = (query, variables, timeout) => {
	return Promise.race([
		_graphql(query, variables),
		new Promise((resolve, reject) => {
			setTimeout(() => reject(new Error("timeout")), timeout);
		})
	]);
};

const graphql = (query, variables, timeout = 5000) => {
	return new Promise((resolve, reject) => {
		_graphqlWithTimeout(query, variables, timeout)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const getWriterKey = () => {
	const query = `
		query {
			writerKey
		}
	`;
	const variables = {};
	return graphql(query, variables);
};

export const getTAODescriptions = (taoId) => {
	const query = `
		query($taoId: ID!) {
			taoDescriptions(taoId: $taoId) {
				key
				schemaKey
				splitKey
				writerAddress
				writerSignature
				description: value
			}
		}
	`;
	const variables = { taoId };
	return graphql(query, variables);
};

export const getTAOThoughtsCount = (taoId) => {
	const query = `
		query($taoId: ID!) {
			taoThoughtsCount(taoId: $taoId)
		}
	`;
	const variables = { taoId };
	return graphql(query, variables);
};

export const getTAOThoughts = (taoId) => {
	const query = `
		query($taoId: ID!) {
			taoThoughts(taoId: $taoId) {
				key
				schemaKey
				splitKey
				writerAddress
				writerSignature
				thought: value {
					nameId
					parentThoughtId
					thought
					timestamp
				}
			}
		}
	`;
	const variables = { taoId };
	return graphql(query, variables);
};

export const insertTAOThought = (nameId, taoId, parentThoughtId, thought) => {
	const query = `
        mutation($nameId: ID!, $taoId: ID!, $parentThoughtId: ID, $thought: String!) {
            submitTaoThought(inputs: {nameId: $nameId, taoId: $taoId, parentThoughtId: $parentThoughtId, thought: $thought}) {
				thought
				timestamp
				nameId
				parentThoughtId
            }
        }
	`;
	const variables = { nameId, taoId, parentThoughtId, thought };
	return graphql(query, variables);
};

export const getWriterKeySignature = (nameId, nonce) => {
	const query = `
		query($nameId: ID!, $nonce: String!) {
			writerKeySignature(nameId: $nameId, nonce: $nonce) {
				v
				r
				s
			}
		}
	`;
	const variables = { nameId, nonce };
	return graphql(query, variables);
};

export const setNameProfileImage = (nameId, imageString) => {
	const query = `
		mutation($nameId: ID!, $imageString: String!) {
		submitNameProfile(inputs: {nameId: $nameId, imageString: $imageString}) {
			nameId
			imageString
		}
	}
	`;
	const variables = { nameId, imageString };
	return graphql(query, variables);
};

export const getNameProfileImage = (nameId) => {
	const query = `
		query($nameId: ID!) {
			nameProfile(nameId: $nameId) {
				nameId
				imageString
			}
		}
	`;
	const variables = { nameId };
	return graphql(query, variables);
};

export const insertTAODescription = (taoId, description) => {
	const query = `
        mutation($taoId: ID!, $description: String!) {
            submitTaoDescription(inputs: {taoId: $taoId, description: $description}) {
                taoId
                description
            }
        }
    `;
	const variables = { taoId, description };
	return graphql(query, variables);
};
