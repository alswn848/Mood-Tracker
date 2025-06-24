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
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    color: #000;
    background-color: #f8f9fa;
  }

  &.active {
    color: #ffd966;
    background-color: #fff3cd;
  }
`;

export const Navbar: React.FC = () => {
    return (
        <Nav>
            <Logo>Mood Tracker</Logo>
            <NavLinks>
                <StyledLink to="/">홈</StyledLink>
                <StyledLink to="/history">히스토리</StyledLink>
                <StyledLink to="/stats">통계</StyledLink>
            </NavLinks>
        </Nav>
    );
};