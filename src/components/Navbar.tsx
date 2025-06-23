import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Nav = styled.nav`
  width: 100%;
  height: 64px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const NavLinks = styled.div`
  margin-left: auto;
  display: flex;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #555;
  font-weight: 500;

  &:hover {
    color: #000;
  }
`;

export const Navbar: React.FC = () => {
    return (
        <Nav>
            <Logo>Mood Tracker</Logo>
            <NavLinks>
                <StyledLink to="/">홈</StyledLink>
                <StyledLink to="/calendar">캘린더</StyledLink>
                <StyledLink to="/stats">통계</StyledLink>
            </NavLinks>
        </Nav>
    );
};