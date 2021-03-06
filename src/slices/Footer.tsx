import {
    PrismicKeyText,
    PrismicLink,
    PrismicSettingsPage,
    getHtmlText,
    getText,
    resolveUnknownLink,
    isPrismicLinkExternal,
} from '../utils/prismic';

import { Footer } from '@blateral/b.kit';
// import { FactList } from '@blateral/b.kit';
import React from 'react';

export interface FooterSliceType {
    settingsPage?: PrismicSettingsPage;
    injectForm?: (props: {
        isInverted?: boolean;
        placeholder?: string;
        buttonLabel?: string;
    }) => React.ReactNode;
    mapSocials?: (
        socials: Array<{ platform?: PrismicKeyText; link?: PrismicLink }>
    ) => Array<{
        href: string;
        icon: JSX.Element;
    }>;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    settingsPage,
    injectForm,
    mapSocials,
}) => {
    const settingsData = settingsPage?.data;

    const mappedSocials =
        mapSocials &&
        settingsData &&
        settingsData.socials &&
        settingsData.socials.length > 0 &&
        mapSocials(settingsData.socials);

        const logoLinkParsed = resolveUnknownLink(settingsData?.logo_href);

        const logoLinkCleaned =
            logoLinkParsed && /index/.test(logoLinkParsed)
                ? logoLinkParsed.replace('index', '')
                : logoLinkParsed
                ? logoLinkParsed
                : '';

        return (
            <Footer
                isInverted={settingsData?.is_inverted}
                socials={mappedSocials || undefined}
                logo={{
                    img: settingsData?.logo_image_footer?.url,
                    link: logoLinkCleaned,
                }}
                contactData={getHtmlText(settingsData?.contact)}
                newsTitle={getText(settingsData?.footer_newsletter_heading)}
                newsText={getHtmlText(settingsData?.footer_newsletter_text)}
                newsForm={(isInverted?: boolean) =>
                    injectForm &&
                    injectForm({
                        isInverted,
                        buttonLabel: getText(
                            settingsData?.footer_newsletter_submit_label
                        ),
                        placeholder: getText(
                            settingsData?.footer_newsletter_placeholder
                        ),
                    })
                }
                siteLinks={settingsData?.body?.map((linkSlice) => {
                    return {
                        href:
                            resolveUnknownLink(
                                linkSlice.primary.footer_nav_link
                            ) || '',
                        label:
                            (linkSlice.primary.footer_nav_title as any) || '',
                        isExternal: isPrismicLinkExternal(
                            linkSlice?.primary?.footer_nav_link
                        ),
                    };
                })}
                bottomLinks={settingsData?.footer_bottomlinks?.map(
                    (bottomLink) => {
                        const result = {
                            href: resolveUnknownLink(bottomLink.href) || '',
                            label: bottomLink.label || '',
                            isExternal: isPrismicLinkExternal(bottomLink.href),
                        };
                        return result;
                    }
                )}
            />
        );
};
