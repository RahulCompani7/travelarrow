// app/api/enrich/route.ts

import { NextResponse } from "next/server";
import {
  callSerpAPI,
  callAnymailFinder,
  getCompanyDomain,
  callDescriptionFinder,
} from "../../lib/apiClients";
import { decideApisToCall, calculateCost } from "../../lib/costCalculator";

export async function POST(request) {
  try {
    const rowData = await request.json();


    const apisToCall = decideApisToCall(rowData);
    console.log("APIs to call:", apisToCall);

    let enrichedData = { ...rowData };
    let totalCost = 0;

    for (const apiName of apisToCall) {
      if (apiName === "SerpAPI") {
        const response = await callSerpAPI(rowData);

        enrichedData = { ...enrichedData, ...response };
        totalCost += calculateCost("SerpAPI");
        if (response.company_name && !enrichedData.company_domain) {
          const company_domain = await getCompanyDomain(
            rowData.company_name ? rowData.company_name : response.company_name
          );
          if (company_domain) {
            enrichedData = { ...enrichedData, company_domain };
            totalCost += calculateCost("SerpAPI");
          }
        }
      }
    }

    const hasName =
      rowData.full_name || (rowData.first_name && rowData.last_name);
    const hasCompany =
      enrichedData.company_name ||
      rowData.company_name ||
      enrichedData.company_domain;

    if (apisToCall.includes("AnymailFinder") && hasName && hasCompany) {
      const emailResponse = await callAnymailFinder({
        ...rowData,
        ...enrichedData, 
      });
      console.log("AnymailFinder response:", emailResponse);
      enrichedData = { ...enrichedData, ...emailResponse };
      totalCost += calculateCost("AnymailFinder");
    }

    if (apisToCall.includes("ScrapeOwl") && hasName && hasCompany) {
      const descriptionResponse = await callDescriptionFinder({
        company_domain: rowData.company_domain || enrichedData.company_domain,
      });

      console.log("ScrapeOwl response:", descriptionResponse);
      enrichedData = { ...enrichedData, ...descriptionResponse };
      totalCost += calculateCost("ScrapeOwl");
    }

    enrichedData.cost = totalCost;

    return NextResponse.json(enrichedData, {
      status: 200,
    });
  } catch (error) {
    console.error("Error in /api/enrich:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
