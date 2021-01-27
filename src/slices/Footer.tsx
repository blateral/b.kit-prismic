import {
    PrismicBoolean,
    PrismicHeading,
    PrismicImage,
    PrismicKeyText,
    PrismicLink,
    PrismicNavigationSliceType,
    PrismicRichText,
    PrismicSlice,
    linkResolver,
    resolveUnknownLink,
} from '../utils/prismic';

import { Footer } from '@blateral/b.kit';
// import { FactList } from '@blateral/b.kit';
import React from 'react';
import { RichText } from 'prismic-dom';

interface BottomLink {
    label?: PrismicKeyText;
    href?: PrismicLink;
}

export interface FooterSliceType extends PrismicSlice<'Footer'> {
    primary: {
        domain?: PrismicLink;
        contact?: PrismicRichText;

        facebook?: PrismicLink;
        instagram?: PrismicLink;
        youtube?: PrismicLink;

        logo_image?: PrismicImage;
        logo_href?: PrismicLink;

        is_inverted?: PrismicBoolean;
        columntop_space?: PrismicBoolean;

        footer_newsletter_heading?: PrismicHeading;
        footer_newsletter_text?: PrismicRichText;

        footer_bottomlinks?: Array<BottomLink>;

        body?: Array<PrismicNavigationSliceType>;
    };
    // helpers to define component elements outside of slice
    primaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;
}

export const FooterSlice: React.FC<FooterSliceType> = ({
    primary: {
        // domain,
        contact,
        logo_image,
        logo_href,
        facebook,
        instagram,
        youtube,

        is_inverted,
        columntop_space,

        footer_newsletter_heading,
        footer_newsletter_text,

        footer_bottomlinks,

        // body,
    },
}) => {
    return (
        <Footer
            // siteLinks={body.map(entry=>{

            // })}
            newsForm={(is_inverted) => {
                return <span>Newsform WIP. Inverted? {is_inverted}</span>;
            }}
            isInverted={is_inverted}
            columnTopSpace={columntop_space ? '40px' : ''}
            logo={{
                img: logo_image.url,
                link: (logo_href && resolveUnknownLink(logo_href)) || '',
            }}
            socials={mapSocials({ facebook, instagram, youtube })}
            contactData={
                (contact && RichText.asHtml(contact, linkResolver)) || ''
            }
            newsTitle={
                (footer_newsletter_heading &&
                    RichText.asText(footer_newsletter_heading)) ||
                ''
            }
            newsText={
                footer_newsletter_text &&
                RichText.asHtml(footer_newsletter_text, linkResolver)
            }
            bottomLinks={
                footer_bottomlinks && footer_bottomlinks.length > 0
                    ? footer_bottomlinks.map((botLink) => {
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
                    : undefined
            }
        />
    );
};

const mapSocials = ({
    youtube,
    facebook,
    instagram,
}: {
    youtube?: PrismicLink;
    facebook?: PrismicLink;
    instagram?: PrismicLink;
}): { href: string; icon: any }[] => {
    const socials = [];

    youtube &&
        socials.push({
            href: resolveUnknownLink(youtube) || '',
            icon: <img src="https://via.placeholder.com/50" />,
        });
    facebook &&
        socials.push({
            href: resolveUnknownLink(facebook) || '',
            icon: <img src="https://via.placeholder.com/50" />,
        });

    instagram &&
        socials.push({
            href: resolveUnknownLink(instagram) || '',
            icon: <img src="https://via.placeholder.com/50" />,
        });

    return socials;
};
