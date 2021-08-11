import {
    PrismicBoolean,
    PrismicKeyText,
    PrismicLink,
    PrismicRichText,
    PrismicSlice,
    getText,
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

        primary_label?: PrismicKeyText;
        secondary_label?: PrismicKeyText;
        primary_link?: PrismicLink;
        secondary_link?: PrismicLink;
    };
    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
}

export const TableSlice: React.FC<TableSliceType> = ({
    primary: { bg_mode },
    items,
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
}) => {
    const tableData = createTableItems(items);
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <Table
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tableItems={tableData}
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
