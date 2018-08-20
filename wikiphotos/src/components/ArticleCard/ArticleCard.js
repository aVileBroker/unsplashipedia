import React from 'react';
import styled from 'styled-components';
import { animated, Spring, Transition, } from 'react-spring';

import { closeDetails, expandDetails, pauseOn } from '../../actions'

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

const CardTitle = styled.div`
  font-size: 1.2rem;
  color: black;
  margin-bottom: .5rem;
  margin-right: 1rem;
`;

const ExpandCloseButton = styled(animated.a)`
  position:absolute;
  top: .5rem;
  right: .75rem;
  padding: .5rem;
  width: 1rem;
  height: 1rem;
  font-size: 1.2rem;
  font-family: Roboto;

  background-color: white;
  border-radius: 50%;
  &:hover{
    background-color: #ddd;
  }

  line-height: 1;
  text-align: center;
`;

const LinkContainer = styled(animated.div)`
  width: 100%;
  height: 8rem;
  position: absolute;
  bottom: .75rem;
  left: 0;
  z-index: 2;

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
    background-color: #ddd;
  }
`;

export const ArticleCard = ({
  text,
  title,
  linkUrl,
  wikiUrl,
  activeIndex,
  page,
  articlesPerPage,
  index,
  isActive,
  isOpen,
  dispatch,
}) => (
  <Spring
    config={{
      duration: 1200,
    }}
    from={{
      height: '3rem',
      transform: 'translateX(0px)',
      expandRotation: 'rotate(45deg)',
    }}
    to={{
      height: isOpen
        ? '25rem'
        : isActive
          ? '16rem'
          : '3rem',
      transform: `translateX(${(-1 * ((page * articlesPerPage * 336)) + 48)}px)`,
      expandRotation: `rotate(${isOpen ? '0' : '45' }deg)`,
    }}
    native
  >
    {styles => (
      <Card
        onClick={() => { dispatch(pauseOn(index)) }}
        style={{
          height: styles.height,
          transform: styles.transform,
        }}
      >
        {isActive &&
          <ExpandCloseButton
            style={{ transform: styles.expandRotation }}
            onClick={(e) => {e.stopPropagation(); dispatch(isOpen ? closeDetails() : expandDetails(index))}}
          >
            &times;
          </ExpandCloseButton>
        }
        <CardContent><CardTitle>{title}</CardTitle>{text}</CardContent>
        <Transition
          from={{ transform: 'translateY(12rem)' }}
          enter={{ transform: 'translateY(0rem)' }}
          leave={{ transform: 'translateY(12rem)' }}
          native
        >
          {isActive && ( styles => (
            <LinkContainer style={styles}>
              <Link side="left" href={linkUrl}>VIEW PHOTO</Link>
              <Link side="right" href={wikiUrl}>READ MORE</Link>
            </LinkContainer>
          ))}
        </Transition>
      </Card>
    )}
  </Spring>
);
