import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// 네비게이션 바 전체 컨테이너 스타일
const Nav = styled.nav`
    width: 100%;                  // 화면 가로 꽉 채우기
    height: 64px;                 // 고정 높이
    background-color: #ffffff;    // 하얀 배경
    display: flex;                // 플렉스박스로 가로 정렬
    align-items: center;          // 수직 중앙 정렬
    padding: 0 2rem;              // 좌우 패딩 2rem
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);  // 살짝 그림자
    position: sticky;             // 스크롤해도 위에 고정
    top: 0;                      // 최상단에 붙음
    z-index: 10;                 // 다른 요소 위에 표시되도록 우선순위
`;

// 로고 스타일 (텍스트로 된 큰 제목)
const Logo = styled.h1`
    font-size: 1.5rem;            // 글자 크기
    font-weight: bold;            // 굵게
    color: #333;                  // 짙은 회색 텍스트
`;

// 네비게이션 링크 그룹 컨테이너 (우측 정렬)
const NavLinks = styled.div`
    margin-left: auto;            // 좌측 공간 다 띄워서 우측 정렬
    display: flex;                // 가로로 링크들 나열
    gap: 1.5rem;                 // 링크 간격 띄우기
`;

// 링크 스타일 (react-router-dom의 Link 커스텀)
const StyledLink = styled(Link)`
    text-decoration: none;        // 밑줄 없애기
    color: #555;                  // 기본 글자색 연한 회색
    font-weight: 500;             // 중간 굵기
    padding: 0.5rem 1rem;         // 위아래 0.5rem, 좌우 1rem 패딩
    border-radius: 6px;           // 모서리 둥글게
    transition: all 0.3s ease;    // 마우스 오버 시 부드럽게 변하도록

    &:hover {
        color: #000;                // 마우스 올리면 글자 검정으로
        background-color: #f8f9fa; // 연한 회색 배경으로 변경
    }

    &.active {
        color: #ffd966;             // 활성화된 링크는 노란색 글자
        background-color: #fff3cd; // 노란 배경 강조
    }
`;

// 네비게이션 바 컴포넌트 본체
export const Navbar: React.FC = () => {
    return (
        <Nav>
            {/* 로고 텍스트 */}
            <Logo>Mood Tracker</Logo>

            {/* 우측 링크 그룹 */}
            <NavLinks>
                {/* 각 링크는 라우터 링크로 이동 */}
                <StyledLink to="/">홈</StyledLink>
                <StyledLink to="/history">히스토리</StyledLink>
                <StyledLink to="/stats">통계</StyledLink>
            </NavLinks>
        </Nav>
    );
};