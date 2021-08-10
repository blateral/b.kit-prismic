import {
    PrismicBoolean,
    PrismicHeading,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    getHeadlineTag,
    getHtmlText,
    getText,
    isPrismicLinkExternal,
    resolveUnknownLink,
    isValidAction,
    PrismicSelectField,
    mapPrismicSelect,
} from 'utils/prismic';

import React from 'react';
import { Table } from '@blateral/b.kit';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table';
import { AliasSelectMapperType } from 'utils/mapping';

interface TableItem {
    table_title?: PrismicKeyText;
    table?: PrismicRichText;
}

type BgMode = 'full' | 'inverted';

export interface TableSliceType extends PrismicSlice<'Table', TableItem> {
    primary: {
        is_active?: PrismicBoolean;

        bg_mode?: PrismicSelectField;
        super_title?: PrismicHeading;
        title?: PrismicHeading;
        text?: PrismicRichText;
        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const TableSlice: React.FC<TableSliceType> = ({
    primary: {
        super_title,
        title,
        text,
        bg_mode,
        primary_label,
        secondary_label,
        primary_link,
        secondary_link,
    },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
    primaryAction,
    secondaryAction,
}) => {
    const tableData = createTableItems(items);
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <Table
            bgMode={bgMode === 'inverted' ? 'inverted' : 'full'}
            title={getText(title) || ''}
            titleAs={getHeadlineTag(title) || 'div'}
            superTitle={getText(super_title) || ''}
            superTitleAs={getHeadlineTag(super_title) || 'div'}
            text={getHtmlText(text) || ''}
            tableItems={tableData}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction({
                              isInverted,
                              label: getText(primary_label),
                              href: resolveUnknownLink(primary_link) || '',
                              isExternal: isPrismicLinkExternal(primary_link),
                          })
                    : undefined
            }
            secondaryAction={
                secondaryAction &&
                isValidAction(secondary_label, secondary_link)
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: getText(secondary_label),
                              href: resolveUnknownLink(secondary_link) || '',
                              isExternal: isPrismicLinkExternal(secondary_link),
                          })
                    : undefined
            }
        />
    );
};

function createTableItems(tableItems: TableItem[]): TableProps[] {
    return tableItems
        .filter((item) => item.table && item.table.length > 0)
        .map((item) => {
            const { tableHeaders, sliceRows } = convertCsvToTable(
                getText(item.table!)
            );

            return {
                tableTitle: item.table_title || '',
                rowTitle: tableHeaders || [],
                row: sliceRows || [],
            };
        });
}

function convertCsvToTable(tableCsv: string) {
    const rows = tableCsv.split('\n');
    const tableHeaders = rows[0].split(',');

    const sliceRows = rows.map((row) => {
        const columns = row.split(',');
        return {
            cols: columns,
        };
    });

    sliceRows.shift();

    return { tableHeaders, sliceRows };
}
