import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import get from 'lodash/get';
import { Spring, animated } from 'react-spring';

const Image = styled(animated.div)`
  background-image: url('${props => props.background}');
  background-position: center;
  background-size: cover;

  width: 100%;
  height: calc(100% - 8rem);

  background-color: ${props => props.color || `hsl(${Math.random() * 360}, 50%, 50%)`};

  position: fixed;
  top: 0;
  left: 0;
`;

const Gradient = styled.div`
  width: 100%;
  height: 12rem;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  background-image:linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0));
`;

const Title = styled.div`
  color: white;
  font-size: 2.5rem;
  margin: 2rem 3rem;
  text-shadow: 0px .125rem .75rem rgba(0,0,0,0.25);
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ImageContainer = ({ photos, activeIndex }) => map(photos, (p, i) => (
  <Spring
    config={{
      duration: 1200,
      delay: 1200,
    }}
    from={{ opacity: 0, zIndex: -1 }}
    to={{
      opacity: activeIndex === i ? 1 : 0,
      zIndex: activeIndex === i ? 0 : -1,
    }}
    native
  >{ styles => (<Image key={get(photos[i], 'id')} style={styles} color={get(photos[i], 'color')} background={get(photos[i], 'urls.full', '')}>
      <Gradient />
      <Title>{get(photos[i], 'location.title')}</Title>
    </Image>)
  }</Spring>
));
