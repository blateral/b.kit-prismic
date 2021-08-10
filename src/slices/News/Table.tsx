import {
    PrismicBoolean,
    PrismicHeading,
    PrismicRichText,
    PrismicSlice,
    getText,
    PrismicSelectField,
    mapPrismicSelect,
} from 'utils/prismic';

import { NewsTable } from '@blateral/b.kit';
import React from 'react';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table';
import { AliasSelectMapperType } from 'utils/mapping';

type BgMode = 'full' | 'inverted';

export interface NewsTableSliceType extends PrismicSlice<'NewsTable'> {
    primary: {
        is_active?: PrismicBoolean;
        bg_mode?: PrismicSelectField;
        table_title?: PrismicHeading;
        table?: PrismicRichText;
        as_table_header?: PrismicBoolean;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
}

export const NewsTableSlice: React.FC<NewsTableSliceType> = ({
    primary: { bg_mode, table_title, table, as_table_header },
    bgModeSelectAlias = {
        full: 'soft',
        inverted: 'heavy',
    },
}) => {
    // get background mode
    const bgMode = mapPrismicSelect(bgModeSelectAlias, bg_mode);

    return (
        <NewsTable
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tableItems={[
                createTableItem(
                    getText(table),
                    getText(table_title),
                    as_table_header
                ),
            ]}
        />
    );
};

function createTableItem(
    tableItem: string,
    tableTitle?: string,
    firstRowAsHeadings?: boolean
): TableProps {
    if (!tableItem) return { row: [], rowTitle: [] };

    const { tableHeaders, sliceRows } = convertCsvToTable(
        getText(tableItem),
        firstRowAsHeadings
    );

    return {
        tableTitle: tableTitle,
        rowTitle: tableHeaders || [],
        row: sliceRows || [],
    };
}

function convertCsvToTable(tableCsv: string, firstRowAsHeading = false) {
    const rows = tableCsv.split('\n');

    const sliceRows = rows.map((row) => {
        const columns = row.split(',');
        return {
            cols: columns,
        };
    });

    if (firstRowAsHeading) {
        const tableHeaders = rows[0].split(',');
        sliceRows.shift();

        return { tableHeaders, sliceRows };
    }

    return { sliceRows };
}
