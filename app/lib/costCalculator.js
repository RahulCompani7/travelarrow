const apiCosts = {
  SerpAPI: 0.01,
  ScrapinIO: 0.025,
  AnymailFinder: 0.05,
};

export function calculateCost(apiName) {
  return apiCosts[apiName] || 0;
}

export function decideApisToCall(rowData) {
  const apis = [];

  if (!rowData.linkedInUrl || !rowData.company) {
    apis.push("SerpAPI");
  }

  if (!rowData.companyDescription) {
    apis.push("ScrapeOwl");
  }

  if (!rowData.linkedInProfile) {
    apis.push("ScrapinIO");
  }

  if (!rowData.email) {
    apis.push("AnymailFinder");
  }

  return apis;
}
