import { slideInRight } from 'react-animations';
import styled, { keyframes } from 'styled-components';

const divAnim = keyframes`${slideInRight}`;

const SlideInDiv = styled.div`
  animation: 250ms ${divAnim}
`;

export default SlideInDiv;