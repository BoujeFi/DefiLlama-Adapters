const { GraphQLClient, gql } = require("graphql-request");
const retry = require("async-retry");

async function treasury() {
  var endpoint =
    "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao";
  var graphQLClient = new GraphQLClient(endpoint);

  var query = gql`
    query {
      protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        treasuryMarketValue
      }
    }
  `;
  const results = await retry(
    async (bail) => await graphQLClient.request(query)
  );
  return +results.protocolMetrics[0].treasuryMarketValue;
}
async function bankLiquidity() {
  var endpoint =
    "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao";
  var graphQLClient = new GraphQLClient(endpoint);

  var query = gql`
    query {
      protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        bankSupplied
      }
    }
  `;
  const results = await retry(
    async (bail) => await graphQLClient.request(query)
  );

  return +results.protocolMetrics[0].bankSupplied - (await borrowed());
}
async function borrowed() {
  var endpoint =
    "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao";
  var graphQLClient = new GraphQLClient(endpoint);

  var query = gql`
    query {
      protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        bankBorrowed
      }
    }
  `;
  const results = await retry(
    async (bail) => await graphQLClient.request(query)
  );

  return +results.protocolMetrics[0].bankBorrowed;
}
async function torCurveLP() {
  var endpoint =
    "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao";
  var graphQLClient = new GraphQLClient(endpoint);

  var query = gql`
    query {
      tors(first: 1, orderBy: timestamp, orderDirection: desc) {
        torTVL
      }
    }
  `;
  const results = await retry(
    async (bail) => await graphQLClient.request(query)
  );

  return +results.tors[0].torTVL;
}
async function eth() {
  var endpoint =
    "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-eth";
  var graphQLClient = new GraphQLClient(endpoint);

  var query = gql`
    query {
      ethMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        treasuryBaseRewardPool
      }
    }
  `;
  const results = await retry(
    async (bail) => await graphQLClient.request(query)
  );

  return +results.ethMetrics[0].treasuryBaseRewardPool;
}

const staking = async () => {
  var endpoint =
    "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao";
  var graphQLClient = new GraphQLClient(endpoint);

  var query = gql`
    query {
      protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        totalValueLocked
      }
    }
  `;
  const results = await retry(
    async (bail) => await graphQLClient.request(query)
  );
  return +results.protocolMetrics[0].totalValueLocked;
};

module.exports = {
  staking: {
    fetch: staking,
  },
  borrowed: {
    fetch: borrowed,
  },
  ethereum: {
    tvl: eth
  },
  treasury: {
    fetch: async () => ((await eth()) + (await torCurveLP()) + (await treasury()) + (await bankLiquidity())),
  },
};
