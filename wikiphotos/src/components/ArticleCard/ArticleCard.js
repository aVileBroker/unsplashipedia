import React from 'react';
import styled from 'styled-components';
import { animated, Spring, Transition, } from 'react-spring';

import { goToPhoto } from '../../actions'

const Card = styled(animated.div)`
  background-color: white;
  border-radius: .5rem;
  box-shadow: 0rem .25rem 1rem -.5rem rgba(0,0,0,0.5);

  cursor: pointer;

  margin: 1rem;
  padding: 1.5rem;

  display: flex;
  flex: 0 0 16rem;
  flex-direction: column;
  align-items: flex-end;
  position:relative;
  overflow: hidden;
`;

const CardContent = styled.div`
  color: #777;
  width: 100%;
  overflow: hidden;
  line-height: 1.1;
`;

const LinkContainer = styled(animated.div)`
  width: 100%;
  position: absolute;
  bottom: .75rem;
  left: 0;
  z-index: 2;
`;

const Gradient = styled.div`
  width: 100%;
  height: 6rem;

  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;

  background-image:linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,.75) 50%, rgba(255,255,255,0));
`;

const Link = styled.a`
  display: inline-block;
  padding: .75rem 1rem;
  color: #77f;
  text-decoration: none;
  text-transform: capitalize;

  position: absolute;
  bottom: 0;
  ${props => props.side}: 1rem;
  z-index: 2;

  background-color: white;
  border-radius: .5rem;
  &:hover{
    background-color: #eee;
  }
`;

export const ArticleCard = ({
  text,
  linkUrl,
  wikiUrl,
  activeIndex,
  index,
  isActive,
  dispatch,
}) => (
  <Spring
    config={{
      duration: 1200,
    }}
    from={{
      height: '3rem',
      transform: 'translateX(0px)',
    }}
    to={{
      height: isActive ? '16rem' : '3rem',
      transform: `translateX(${(-1 * (activeIndex * 336)) + 48}px)`,
    }}
    native
  >
    {styles => (
      <Card onClick={() => { dispatch(goToPhoto(index)) }} style={styles}>
        <CardContent>{text}</CardContent>
        <Transition
          from={{ transform: 'translateY(12rem)' }}
          enter={{ transform: 'translateY(0rem)' }}
          leave={{ transform: 'translateY(12rem)' }}
          native
        >
          {isActive && ( styles => (
            <LinkContainer style={styles}>
              <Gradient />
              <Link side="left" href={linkUrl}>VIEW PHOTO</Link>
              <Link side="right" href={wikiUrl}>READ MORE</Link>
            </LinkContainer>
          ))}
        </Transition>
      </Card>
    )}
  </Spring>
);
