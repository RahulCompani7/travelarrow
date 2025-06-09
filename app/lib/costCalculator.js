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
  let estimatedCost = 0;


  if (!rowData.linkedInUrl || !rowData.company) {
    apis.push('SerpAPI');
    estimatedCost += 0.01;
  }

  if (!rowData.companyDescription) {
    apis.push('ScrapeOwl');
    estimatedCost += 0.0003;
  }

  if (!rowData.linkedInProfile) {
    apis.push('ScrapinIO');
    estimatedCost += 0.025;
  }

  if (!rowData.email) {
    apis.push('AnymailFinder');
    estimatedCost += 0.05;
  }

  return apis;
}

