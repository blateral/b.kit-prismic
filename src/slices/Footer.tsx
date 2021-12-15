import React from 'react';
import {
    PrismicKeyText,
    PrismicLink,
    PrismicSettingsPage,
    getHtmlText,
    getText,
    resolveUnknownLink,
    isPrismicLinkExternal,
} from 'utils/prismic';
import { Footer } from '@blateral/b.kit';

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

    let socials: {
        href: string;
        icon: JSX.Element;
    }[] = [];

    if (settingsData?.socials) {
        if (mapSocials) {
            socials = mapSocials(settingsData.socials);
        } else {
            settingsData.socials.forEach((item) => {
                if (item.icon && item.link) {
                    socials.push({
                        href: resolveUnknownLink(item.link) || '',
                        icon: (
                            <img
                                src={item.icon.url}
                                alt={item.icon.alt || ''}
                            />
                        ),
                    });
                }
            });
        }
    }

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
            socials={socials || undefined}
            logo={{
                img: settingsData?.logo_image_footer?.url,
                link: logoLinkCleaned,
            }}
            contactData={getHtmlText(settingsData?.contact)}
            newsTitle={getText(settingsData?.footer_newsletter_heading)}
            newsText={getHtmlText(settingsData?.footer_newsletter_text)}
            newsForm={
                injectForm
                    ? (isInverted?: boolean) =>
                          injectForm({
                              isInverted,
                              buttonLabel: getText(
                                  settingsData?.footer_newsletter_submit_label
                              ),
                              placeholder: getText(
                                  settingsData?.footer_newsletter_placeholder
                              ),
                          })
                    : undefined
            }
            siteLinks={settingsData?.body?.map((linkSlice) => {
                return {
                    href:
                        resolveUnknownLink(linkSlice.primary.footer_nav_link) ||
                        '',
                    label: (linkSlice.primary.footer_nav_title as any) || '',
                    isExternal: isPrismicLinkExternal(
                        linkSlice?.primary?.footer_nav_link
                    ),
                };
            })}
            bottomLinks={settingsData?.footer_bottomlinks?.map((bottomLink) => {
                const result = {
                    href: resolveUnknownLink(bottomLink.href) || '',
                    label: bottomLink.label || '',
                    isExternal: isPrismicLinkExternal(bottomLink.href),
                };
                return result;
            })}
        />
    );
};
