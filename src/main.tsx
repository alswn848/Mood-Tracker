import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 메인 앱 컴포넌트
import { BrowserRouter } from 'react-router-dom'; // 라우팅 설정을 위한 BrowserRouter
import { createGlobalStyle } from 'styled-components'; // 전역 스타일 설정용

// 글로벌 스타일 정의: 기본 폰트, 마진 초기화 등
const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box; // 모든 요소에 박스 사이징 설정
        margin: 0;
        padding: 0;
        font-family: 'Pretendard', sans-serif; // 전체 폰트 Pretendard로 지정
    }
    body {
        background-color: #f6f6f6; // 기본 배경색 설정
    }
`;

// React 18 방식으로 앱 렌더링
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalStyle /> {/* 전역 스타일 적용 */}
            <App /> {/* 메인 앱 컴포넌트 */}
        </BrowserRouter>
    </React.StrictMode>
);