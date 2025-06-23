
import styled from 'styled-components';

export const HomeWrapper = styled.div`
                           display: flex;
flex-direction: column;
min-height: 100vh;
background-color: #fffef9;
font-family: 'Pretendard', sans-serif;
color: #333;
`;

export const Header = styled.header`
                      text-align: center;
font-size: 2.5rem;
padding: 2rem 0 1rem;
font-weight: 700;
color: #4b3f72;
`;

export const Content = styled.main`
                       flex: 1;
padding: 2rem 1.5rem;
max-width: 700px;
margin: 0 auto;
display: flex;
flex-direction: column;
gap: 2rem;
`;

export const Footer = styled.footer`
                      text-align: center;
padding: 1rem 0;
background-color: #f8f8f8;
font-size: 0.875rem;
color: #999;
`;