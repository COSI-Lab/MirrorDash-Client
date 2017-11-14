import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 2px solid rgba(0,0,0,0.45);
    font-size: 14px;
    text-decoration: none;
    color: white;
    position: relative;
`;

export default StyledLink;