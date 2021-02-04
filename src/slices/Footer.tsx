import {
    FacebookIcon,
    InstagramIcon,
    LinkedInIcon,
    YoutubeIcon,
} from '@blateral/b.kit';
import {
    PrismicKeyText,
    PrismicLink,
    PrismicSettingsPage,
    getHtmlText,
    getText,
    isPrismicLinkEmpty,
    resolveUnknownLink,
} from '../utils/prismic';

import { Footer } from '@blateral/b.kit';
// import { FactList } from '@blateral/b.kit';
import React from 'react';

export interface FooterSliceType {
    settingsPage?: PrismicSettingsPage;
    injectForm?: (isInverted?: boolean) => React.ReactNode;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    settingsPage,
    injectForm,
}) => {
    const settingsData = settingsPage?.data;

    const mappedSocials =
        settingsData &&
        settingsData.socials &&
        settingsData.socials.length > 0 &&
        mapSocials(settingsData.socials);

    console.log(mappedSocials);
    return (
        <Footer
            socials={mappedSocials || undefined}
            logo={{
                img: (settingsData as any)?.logo_image?.url,
                link:
                    ((settingsData as any).logo_href &&
                        resolveUnknownLink((settingsData as any).logo_href)) ||
                    '',
            }}
            contactData={
                (settingsData && getHtmlText(settingsData.contact)) || ''
            }
            newsTitle={
                settingsData && getText(settingsData.footer_newsletter_heading)
            }
            newsText={
                settingsData && getHtmlText(settingsData.footer_newsletter_text)
            }
            newsForm={injectForm}
            siteLinks={settingsData?.body?.map((linkSlice) => {
                return {
                    href:
                        resolveUnknownLink(linkSlice.primary.footer_nav_link) ||
                        '',
                    label: (linkSlice.primary.footer_nav_title as any) || '',
                    isExternal: Boolean(
                        linkSlice?.primary?.footer_nav_link?.link_type ===
                            'Web' && linkSlice?.primary?.footer_nav_link?.target
                    ),
                };
            })}
            bottomLinks={settingsData?.body?.map((bottomLink) => {
                const result = {
                    href:
                        resolveUnknownLink(
                            bottomLink.primary.footer_nav_link
                        ) || '',
                    label: (bottomLink.primary.footer_nav_title as any) || '',
                    isExternal: Boolean(
                        bottomLink?.primary?.footer_nav_link?.link_type ===
                            'Web' &&
                            bottomLink?.primary?.footer_nav_link?.target
                    ),
                };
                return result;
            })}
        />
    );
};

const mapSocials = (
    socials: Array<{ platform?: PrismicKeyText; link?: PrismicLink }>
) => {
    const mappedSocials = socials
        .filter((social) => {
            return (
                social.link &&
                !isPrismicLinkEmpty(social.link) &&
                social.platform
            );
        })
        .map((social) => {
            let iconNode = null;
            switch (social.platform && social.platform.toLocaleLowerCase()) {
                case 'facebook':
                    iconNode = <FacebookIcon />;
                    break;
                case 'youtube':
                    iconNode = <YoutubeIcon />;
                    break;
                case 'instagram':
                    iconNode = <InstagramIcon />;
                    break;
                case 'linkedin':
                    iconNode = <LinkedInIcon />;
                    break;

                default:
                    iconNode = <span>{social.platform}</span>;
                    break;
            }

            return {
                href: resolveUnknownLink(social.link) || '',
                icon: iconNode,
            };
        });

    return mappedSocials?.filter((social) => social !== null);
};
