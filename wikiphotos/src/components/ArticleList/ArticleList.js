import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import { connect } from 'react-redux';

import { ArticleCard } from '../ArticleCard';

const List = styled.div`
  background-color: #ddd;
  height: 8rem;

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const ArticleList = ({ photoData, page }) => (
  <List page={page}>
    {map(photoData, ({ id, description, links, location }, index) => (
      <ArticleCard
        key={id}
        index={index}
        text={description}
        linkUrl={links.html}
        wikiUrl={`https://en.wikipedia.org/wiki/${location.name}`}
      />
    ))}
  </List>
);

export default connect()(ArticleList);