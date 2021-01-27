import {
    PrismicKeyText,
    PrismicLink,
    PrismicSettingsPage,
    PrismicSlice,
} from '../utils/prismic';

import { Header } from '@blateral/b.kit';
// import { FactList } from '@blateral/b.kit';
import React from 'react';

export interface HeaderSliceType extends PrismicSlice<'header'> {
    primary: {
        primary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_label?: PrismicKeyText;
        secondary_link?: PrismicLink;
    };

    // helpers to define component elements outside of slice
    primaryAction?: (
        isInverted?: boolean,
        label?: string,
        href?: string,
        isExternal?: boolean
    ) => React.ReactNode;

    settingsPage?: PrismicSettingsPage;
}

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    // primary: { primary_label, primary_link, secondary_label, secondary_link },
    settingsPage,
}) => {
    settingsPage;
    return <Header title={'Test'} />;
};

// const mapSocials = ({
//     youtube,
//     facebook,
//     instagram,
// }: {
//     youtube?: PrismicLink;
//     facebook?: PrismicLink;
//     instagram?: PrismicLink;
// }): { href: string; icon: any }[] => {
//     const socials = [];

//     youtube &&
//         socials.push({
//             href: resolveUnknownLink(youtube) || '',
//             icon: <img src="https://via.placeholder.com/50" />,
//         });
//     facebook &&
//         socials.push({
//             href: resolveUnknownLink(facebook) || '',
//             icon: <img src="https://via.placeholder.com/50" />,
//         });

//     instagram &&
//         socials.push({
//             href: resolveUnknownLink(instagram) || '',
//             icon: <img src="https://via.placeholder.com/50" />,
//         });

//     return socials;
// };
