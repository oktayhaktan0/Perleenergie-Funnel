export const RABOT_API_BASE_URL = 'https://test-api.rabot-charge.de/partner/v1';

export interface RabotTariff {
    tariffName: string;
    tariffKey: string;
    providerName: string;
}

export interface RabotPriceQuote {
    name: string;
    priceComponents: {
        pricePerMonth: { value: number; unitText: string };
        unitPrice: { value: number; unitText: string };
        basePricePerMonth: { value: number; unitText: string };
        estimatedConsumption: { value: number; unitText: string };
    };
    durationPeriod: { value: number; unitText: string };
    noticePeriod: { value: number; unitText: string };
}

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

let RABOT_ACTIVE_API_URL = 'https://test-api.rabot-charge.de/partner/v1';

export async function getAccessToken(): Promise<string> {
    // NUCLEAR CLEANING: Hostinger often injects backslash escapes (\) for special characters in .env
    // We detected a length shift from 42 to 43 and a character change from % to \ in debug logs.
    const clientId = (process.env.RABOT_CLIENT_ID || "").replace(/\\/g, '').replace(/"/g, '').trim();
    const clientSecret = (process.env.RABOT_CLIENT_SECRET || "").replace(/\\/g, '').replace(/"/g, '').trim();

    if (!clientId || !clientSecret) {
        throw new Error("Missing RABOT_CLIENT_ID or RABOT_CLIENT_SECRET in environment variables.");
    }

    const bufferMs = 5 * 60 * 1000;
    if (cachedToken && tokenExpiresAt !== null && Date.now() < (tokenExpiresAt - bufferMs)) {
        return cachedToken;
    }

    const hosts = [
        { auth: "test-auth.rabot-charge.de", api: "https://test-api.rabot-charge.de/partner/v1" }
    ];

    let lastError = null;

    for (const host of hosts) {
        // We'll try 3 strategies: 
        // 1. Header + Scope
        // 2. Body + Scope
        // 3. Header + NO Scope (sometimes scope causes invalid_client if not perfectly matched)
        
        const strategies: { name: string, headers: Record<string, string>, body: string }[] = [
            {
                name: "Header+Scope",
                headers: { 
                    "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded" 
                },
                body: new URLSearchParams({ grant_type: "client_credentials", scope: "api:partner" }).toString()
            },
            {
                name: "Body+Scope",
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded" 
                },
                body: new URLSearchParams({ 
                    grant_type: "client_credentials", 
                    client_id: clientId, 
                    client_secret: clientSecret, 
                    scope: "api:partner" 
                }).toString()
            },
            {
                name: "Header-NoScope",
                headers: { 
                    "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded" 
                },
                body: new URLSearchParams({ grant_type: "client_credentials" }).toString()
            }
        ];

        for (const strat of strategies) {
            try {
                const res = await fetch(`https://${host.auth}/connect/token`, {
                    method: "POST",
                    cache: 'no-store',
                    headers: strat.headers,
                    body: strat.body
                });

                if (res.ok) {
                    const data = await res.json();
                    cachedToken = data.access_token;
                    tokenExpiresAt = Date.now() + (data.expires_in * 1000);
                    RABOT_ACTIVE_API_URL = host.api;
                    return cachedToken as string;
                } else {
                    lastError = `${strat.name} failed: ${await res.text()}`;
                }
            } catch (e) {
                lastError = `${strat.name} error: ${e instanceof Error ? e.message : String(e)}`;
            }
        }
    }

    // Obfuscated debug info to help verify environment variables without leaking secrets
    const debug = `[Debug: ID=${clientId.substring(0,3)}...${clientId.slice(-2)}, SecretLen=${clientSecret.length}, SecretStart=${clientSecret.substring(0,2)}]`;
    throw new Error(`Failed to authenticate with Rabot API: ${lastError} ${debug}`);
}

export async function getRabotTariffs(token: string) {
    const res = await fetch(`${RABOT_ACTIVE_API_URL}/tariffs`, {
        cache: 'no-store', // Disable caching!
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch tariffs: ${res.statusText}`);
    }

    return res.json();
}

export async function calculateRabotPrice(data: any, token: string) {
    const { tariffKey } = data;
    const res = await fetch(`${RABOT_ACTIVE_API_URL}/tariffs/${tariffKey}/calculation`, {
        method: 'POST',
        cache: 'no-store', // Disable caching!
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ZipCode: data.zipCode || data.postCode,
            yearlyConsumptionKwh: data.yearlyConsumptionKwh || data.yearlyConsumption,
            hasSmartMeter: data.hasSmartMeter || false,
            hasElectricVehicle: data.hasElectricVehicle || false
        })
    });

    console.log(`[Rabot Request] URL: ${RABOT_ACTIVE_API_URL}/tariffs/${tariffKey}/calculation`);
    console.log(`[Rabot Request] Body:`, JSON.stringify({
        ZipCode: data.postCode,
        yearlyConsumptionKwh: data.yearlyConsumption,
        hasSmartMeter: data.hasSmartMeter || false,
        hasElectricVehicle: data.hasElectricVehicle || false
    }));

    if (!res.ok) {
        let errorDetail = "";
        try {
            const errorBody = await res.json();
            errorDetail = JSON.stringify(errorBody);
        } catch (e) {
            try {
                errorDetail = await res.text();
            } catch (tError) {
                errorDetail = res.statusText;
            }
        }
        console.error(`[Rabot API Error] ${res.status} ${res.statusText}: ${errorDetail}`);
        throw new Error(`Failed to calculate price: ${res.statusText} - ${errorDetail}`);
    }

    return res.json();
}


export async function createRabotOrder(orderData: any, token: string) {
    const res = await fetch(`${RABOT_ACTIVE_API_URL}/orders`, {
        method: 'POST',
        cache: 'no-store', // Disable caching!
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to create order: ${res.statusText}`);
    }

    return res.json();
}
