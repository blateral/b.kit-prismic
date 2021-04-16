import {
    getHtmlText,
    getText,
    PrismicSettingsPage,
    PrismicSlice,
} from '../utils/prismic';

import { CookieConsent } from '@blateral/b.kit';
import React from 'react';
import {
    CookieActions,
    CookieIcon,
    CookieText,
    CookieTitle,
} from '@blateral/b.kit/lib/components/blocks/CookieConsent';

export interface CookieConsentSliceType extends PrismicSlice<'CookieConsent'> {
    settingsPage?: PrismicSettingsPage;

    // helpers to define component elements outside of slice
    cookieName?: string;
    urlWhitelist?: string[];
    consentAcceptStatusMsg?: string;
    consentDeclineStatusMsg?: string;
    noCookieStatusMsg?: string;
    dateFormat?: string;
    timeFormat?: string;
    lifetime?: number;
    localeKey?: 'de' | 'eng';
    zIndex?: number;
    overlayOpacity?: number;
    acceptAction?: (props: {
        handleAccept: () => void;
        additionalAcceptProps: {
            ['data-gtm']: string;
        };
        label?: string;
    }) => React.ReactNode;
    declineAction?: (props: {
        handleDecline: () => void;
        label?: string;
        additionalDeclineProps: {
            ['data-gtm']: string;
        };
    }) => React.ReactNode;
}

export const IconListSlice: React.FC<CookieConsentSliceType> = ({
    settingsPage,

    acceptAction,
    declineAction,
}) => {
    const settingsData = settingsPage?.data;

    return (
        <CookieConsent>
            {({
                handleAccept,
                handleDecline,
                additionalAcceptProps,
                additionalDeclineProps,
            }) => (
                <>
                    {settingsData?.cookie_logo && (
                        <CookieIcon
                            src={settingsData?.cookie_logo?.url}
                            alt={settingsData?.cookie_logo?.alt}
                        />
                    )}
                    {settingsData?.cookie_title && (
                        <CookieTitle
                            innerHTML={getHtmlText(settingsData?.cookie_title)}
                        />
                    )}
                    {settingsData?.cookie_text && (
                        <CookieText
                            innerHTML={getHtmlText(settingsData?.cookie_text)}
                        />
                    )}
                    {(acceptAction || declineAction) && (
                        <CookieActions
                            primary={
                                acceptAction &&
                                settingsData &&
                                acceptAction({
                                    handleAccept,
                                    additionalAcceptProps,
                                    label: getText(
                                        settingsData.cookie_accept_label
                                    ),
                                })
                            }
                            secondary={
                                declineAction &&
                                settingsData &&
                                declineAction({
                                    handleDecline,
                                    additionalDeclineProps,
                                    label: getText(
                                        settingsData.cookie_decline_label
                                    ),
                                })
                            }
                        />
                    )}
                </>
            )}
        </CookieConsent>
    );
};
