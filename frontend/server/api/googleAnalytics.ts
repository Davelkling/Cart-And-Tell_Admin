import { BetaAnalyticsDataClient } from '@google-analytics/data';
export default defineEventHandler(async (event) => {
    const { GA_PropertyID, GA_Service_Email, GA_Service_Private_Key } = useRuntimeConfig().public
    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials: { client_email: GA_Service_Email, private_key: GA_Service_Private_Key } });
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${GA_PropertyID}`,
        dateRanges: [
            {
                startDate: '7daysAgo',
                endDate: 'today',
            },
        ],
        metrics: [
            { name: 'activeUsers', },
            { name: 'newUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' }
        ],
    });

    // return { PropertyID: GA_PropertyID };
    return { data: response }
})