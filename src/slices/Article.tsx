import {
  PrismicBoolean,
  PrismicHeading,
  PrismicRichText,
  PrismicSlice,
  linkResolver,
} from "../utils/prismic";

import React from "react";
import { RichText } from "prismic-dom";
import { Article } from "@blateral/b.kit";

export interface ArticleSliceType extends PrismicSlice<"artikel"> {
  primary: {
    suptitle?: PrismicHeading;
    title?: PrismicHeading;
    text?: PrismicRichText;
    asideText?: PrismicRichText;
    isInverted?: PrismicBoolean;
  };
}

const ArticleSlice: React.FC<ArticleSliceType> = ({
  primary: { suptitle, title, text, asideText, isInverted },
}) => {
  return (
    <Article
      title={RichText.asText(title)}
      superTitle={RichText.asText(suptitle)}
      text={RichText.asHtml(text, linkResolver)}
      asideText={RichText.asHtml(text, linkResolver)}
      isInverted={isInverted}
    />
  );
};

export default ArticleSlice;
