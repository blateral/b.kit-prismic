// const getApi = await Prismic.getApi(apiEndpoint, { req });

import { PrismicSettingsPage } from './prismic';
import { RichText } from 'prismic-dom';
import { ServerResponse } from 'http';
import { initPrismicApi } from './prismicApi';

export async function generateRobotsTxt({
    req,
    res,
}: {
    req: any;
    res?: ServerResponse;
}) {
    const getApi = await initPrismicApi(req);

    const settings = await getApi.getByUID('settings', 'settings');
    if (res && !settings) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.write({
            error: `Settingspage of Repository '${process.env.NEXT_PUBLIC_API_ENDPOINT}' was not found. Not creating robots.txtx`,
            code: 500,
        });
        return res.end();
    }

    if (res && settings) {
        const robotsText = createRobotsText(settings);
        res.setHeader('Content-Type', 'text/plain');
        res.write(robotsText);
        res.end();
    }
}

function createRobotsText(settings: PrismicSettingsPage) {
    const settingsRobots = (settings as any).data.robots || '';

    if (settingsRobots) return RichText.asText(settingsRobots);

    return settingsRobots;
}
