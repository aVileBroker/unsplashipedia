import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import { withGesture } from 'react-with-gesture';

import { CardContainer } from '../../containers';

const List = styled.div`
  background-color: #ddd;
  height: 8rem;

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
`;

export const ArticleList = withGesture(({
  photoData,
  activeIndex,
  openIndex,
  pausedOn,
  page,
  clientDimensions,
  articlesPerPage,
  xDelta,
  down,
  setScrollOffset,
}) => (
  <List onMouseUp={e => setScrollOffset(xDelta) }>
    {map(photoData, ({ id, description, links, location, wikipediaDescription, user }, index) => (
      <CardContainer
        index={index}

        isActive={activeIndex === index}
        isOpen={openIndex === index}
        isPaused={pausedOn === index}

        xDelta={xDelta}
        underUserControl={down}

        key={id}
        text={wikipediaDescription || description || 'Loading description from Wikipedia...'}
        title={location.title}
        linkUrl={links.html}
        wikiUrl={`https://en.wikipedia.org/wiki/${location.name}`}
        photogAvatar={user.profile_image.medium}
        photogName={user.name}
        photogLink={user.links.html}
      />
    ))}
  </List>
));
