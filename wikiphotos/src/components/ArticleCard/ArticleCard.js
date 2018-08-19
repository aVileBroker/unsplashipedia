import React from 'react';
import styled from 'styled-components';
import { animated, Spring, Transition, } from 'react-spring';

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

const Gradient = styled(animated.div)`
  width: 100%;
  height: 6rem;

  position: absolute;
  bottom: 1.5rem;
  left: 0;
  z-index: 1;

  background-image:linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,.75) 50%, rgba(255,255,255,0));
`;

const Link = styled(animated.a)`
  display: inline-block;
  padding: .75rem 1rem;
  color: #777;
  text-transform: capitalize;

  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 2;

  background-color: white;
  border-radius: .5rem;
  &:hover{
    background-color: #eee;
  }
`;

export const ArticleCard = ({
  text,
  title,
  isActive,
  linkUrl,
  onClick,
}) => (
  <Spring
    config={{
      duration: 300,
    }}
    from={{ height: '3rem' }}
    to={{ height: isActive ? '16rem' : '3rem' }}
    native
  >
    {styles => (
      <Card onClick={onClick} style={{...styles, boxShadow: styles.shadow}}>
        <CardContent>{text}</CardContent>
        <Transition
          from={{ transform: 'translateY(12rem)' }}
          enter={{ transform: 'translateY(0rem)' }}
          leave={{ transform: 'translateY(12rem)' }}
          native
        >
          {isActive && ( styles => (
            <div>
              <Gradient style={styles}/>
              <Link href={linkUrl} style={styles}>READ MORE</Link>
            </div>
          ))}
        </Transition>
      </Card>
    )}
  </Spring>
);