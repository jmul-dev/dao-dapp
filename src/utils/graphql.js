import { normalizeString } from "utils/";

const graphql = (query, variables) => {
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

const _race = (query, variables, timeout) => {
	return Promise.race([
		graphql(query, variables),
		new Promise((resolve, reject) => {
			setTimeout(() => reject(new Error("Error: network congestion. Try again later.")), timeout);
		})
	]);
};

const graphqlWithTimeout = (query, variables, timeout = 30000) => {
	return new Promise((resolve, reject) => {
		_race(query, variables, timeout)
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
	return graphqlWithTimeout(query, variables);
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
	return graphqlWithTimeout(query, variables);
};

export const getTAOThoughtsCount = (taoId) => {
	const query = `
		query($taoId: ID!) {
			taoThoughtsCount(taoId: $taoId)
		}
	`;
	const variables = { taoId };
	return graphqlWithTimeout(query, variables);
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
	return graphqlWithTimeout(query, variables);
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
	return graphqlWithTimeout(query, variables);
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
	return graphqlWithTimeout(query, variables);
};

export const getNameLookup = (name) => {
	const query = `
		query($name: String!) {
			nameLookup(name: $name) {
				name
				id
			}
		}
	`;
	const variables = { name: normalizeString(name.toLowerCase()) };
	return graphqlWithTimeout(query, variables);
};

// If mutation, we don't want to use timeout
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

export const insertNameLookup = (name, id) => {
	const query = `
		mutation($name: String!, $id: ID!) {
			submitNameLookup(inputs: {name: $name, id: $id}) {
				name
				id
			}
		}
	`;
	const variables = { name: normalizeString(name.toLowerCase()), id };
	return graphql(query, variables);
};
