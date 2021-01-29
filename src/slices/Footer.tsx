import {
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicNavigationSliceType,
    PrismicRichText,
    PrismicSlice,
    resolveUnknownLink,
    getText,
    getHtmlText,
} from '../utils/prismic';

import { Footer } from '@blateral/b.kit';
// import { FactList } from '@blateral/b.kit';
import React from 'react';

interface BottomLink {
    label?: PrismicKeyText;
    href?: PrismicLink;
}

interface SocialsItem {
    platform?: PrismicKeyText;
    link?: PrismicLink;
}

export interface FooterSliceType extends PrismicSlice<'Footer'> {
    primary: {
        is_active?: PrismicBoolean;
        domain?: PrismicLink;
        contact?: PrismicRichText;

        socials?: Array<SocialsItem>;

        logo_image?: PrismicImage;
        logo_href?: PrismicLink;

        is_inverted?: PrismicBoolean;
        columntop_space?: PrismicBoolean;

        footer_newsletter_heading?: PrismicHeading;
        footer_newsletter_text?: PrismicRichText;
        footer_newsletter_placeholder?: PrismicKeyText;

        footer_bottomlinks?: Array<BottomLink>;

        body?: Array<PrismicNavigationSliceType>;
    };
    // helpers to define component elements outside of slice
    newsForm?: (props: {
        isInverted?: boolean;
        placeholder?: string;
    }) => React.ReactNode;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    primary: {
        // domain,
        contact,
        logo_image,
        logo_href,
        socials,

        is_inverted,
        columntop_space,

        footer_newsletter_heading,
        footer_newsletter_text,
        footer_newsletter_placeholder,

        footer_bottomlinks,

        body,
    },
    newsForm,
}) => {
    return (
        <Footer
            siteLinks={body?.map((navSlice) => {
                const item = navSlice.primary;
                const isExternal = Boolean(
                    item.footer_nav_link &&
                        item.footer_nav_link.link_type === 'Web' &&
                        item.footer_nav_link.target
                );
                return {
                    label: getText(item.footer_nav_title),
                    href:
                        (item.footer_nav_link &&
                            resolveUnknownLink(item.footer_nav_link)) ||
                        undefined,
                    isExternal: isExternal,
                    isActive: false,
                };
            })}
            newsForm={(isInverted) =>
                newsForm &&
                newsForm({
                    isInverted,
                    placeholder: getText(footer_newsletter_placeholder),
                })
            }
            isInverted={is_inverted}
            columnTopSpace={columntop_space ? '40px' : ''}
            logo={{
                img: logo_image && logo_image.url,
                link: (logo_href && resolveUnknownLink(logo_href)) || '',
            }}
            socials={socials && mapSocials(socials)}
            contactData={getHtmlText(contact)}
            newsTitle={getText(footer_newsletter_heading)}
            newsText={getHtmlText(footer_newsletter_text)}
            bottomLinks={
                footer_bottomlinks &&
                footer_bottomlinks.map((botLink) => {
                    const isExternal = Boolean(
                        botLink.href &&
                            botLink.href.link_type === 'Web' &&
                            botLink.href.target
                    );
                    return {
                        href:
                            (botLink.href &&
                                resolveUnknownLink(botLink.href)) ||
                            '',
                        label: botLink.label || '',
                        isExternal,
                    };
                })
            }
        />
    );
};

const mapSocials = (
    socials: Array<SocialsItem>
): Array<{ href: string; icon: any }> => {
    return socials.map((social) => {
        return {
            href: (social.link && resolveUnknownLink(social.link)) || '',
            icon: <span>ICON PLACEHOLDER</span>,
        };
    });
};
