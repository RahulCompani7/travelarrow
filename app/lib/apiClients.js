import fetch from "node-fetch";

export async function callSerpAPI(rowData) {
  const apiKey = process.env.SERPAPI_API_KEY;
  const query = `${rowData.full_name} ${
    rowData.company_name || ""
  } site:linkedin.com/in`.trim();

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
    query
  )}&hl=en&gl=us&google_domain=google.com&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let linkedin_url = null;
    let title = null;
    let company_name = null;

    const linkedInResult = data.organic_results?.find((result) =>
      result.link.includes("linkedin.com")
    );

    if (linkedInResult) {
      linkedin_url = linkedInResult.link;
      const companyName = linkedInResult.title.split(" - ").pop().trim();
      title = linkedInResult.title.split(" - ").slice(1).join(" - ");
      company_name = companyName;
    }

    return { linkedin_url, title, company_name };
  } catch (error) {
    console.error("SerpAPI error:", error);
    return {};
  }
}

export async function getCompanyDomain(companyName) {
  const apiKey = process.env.SERPAPI_API_KEY;
  const cleanedCompanyName = companyName.replace(/\s*\(.*?\)\s*/g, "").trim();
  const query = `${cleanedCompanyName} official website`;

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
    query
  )}&hl=en&gl=us&google_domain=google.com&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const website = data?.knowledge_graph?.website;
    if (website) {
      const hostname = new URL(website).hostname.replace(/^www\./, "");
      return hostname;
    }

    const firstResult = data?.organic_results?.[0]?.link;
    if (firstResult) {
      const hostname = new URL(firstResult).hostname.replace(/^www\./, "");
      return hostname;
    }

    return null;
  } catch (error) {
    console.error("Company domain fetch error:", error);
    return null;
  }
}

export async function callScrapinIO(data) {
  const apiKey = process.env.SCRAPINIO_API_KEY;

  if (!apiKey) {
    throw new Error("Missing SCRAPINIO_API_KEY in environment variables");
  }

  try {
    const response = await fetch("https://api.scrapin.io/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        full_name: data.full_name,
        company_name: data.company_name,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("ScrapinIO API error:", response.status, text);
      return {};
    }

    const result = await response.json();

    // Adjust the response property according to actual API response
    if (result && result.data && result.data.linkedInProfile) {
      return { linkedInProfile: result.data.linkedInProfile };
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error calling ScrapinIO:", error);
    return {};
  }
}

export async function callAnymailFinder(data) {
  const apiKey = process.env.ANYMAILFINDER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANYMAILFINDER_API_KEY in environment variables");
  }

  const domain = data.company_domain;

  if (!domain || !data.full_name) {
    console.warn("Missing domain or full name for AnymailFinder");
    return {};
  }

  try {
    const response = await fetch(
      "https://api.anymailfinder.com/v5.0/search/person.json",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: data.full_name,
          domain: domain,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "AnymailFinder error:",
        response.status,
        await response.text()
      );
      return {};
    }

    const result = await response.json();

    if (result.success && result.results?.email) {
      return {
        email: result.results.email,
      };
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error calling AnymailFinder:", error);
    return {};
  }
}

export async function callDescriptionFinder({ company_domain }) {
  const apiKey = process.env.SCRAPEOWL_API_KEY;

  try {
    const response = await fetch("https://api.scrapeowl.com/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        url: company_domain,
        elements: [
          { type: "css", selector: "h1" },
          { type: "css", selector: "p" },
        ],
      }),
    });
    const data = await response.json();

    if (!data || !data.data) return { company_description: "" };

    const seen = new Set();

    const isMeaningful = (text) => {
      const trimmed = text.trim();
      return (
        trimmed.length >= 30 &&
        /[a-zA-Z]/.test(trimmed) &&
        /[.?!]$/.test(trimmed) &&
        !seen.has(trimmed)
      );
    };

    const filteredTexts = data.data
      .flatMap((entry) => entry.results || [])
      .map((r) => r.text?.trim())
      .filter(Boolean)
      .filter((text) => {
        if (isMeaningful(text)) {
          seen.add(text);
          return true;
        }
        return false;
      });

    const description = filteredTexts.slice(0, 3).join(" ");

    return {
      company_description: description.trim(),
    };
  } catch (error) {
    console.error("Error calling ScrapeOwl:", error);
    return null;
  }
}
