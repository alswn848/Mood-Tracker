import styled from 'styled-components';

// 홈 화면 전체 레이아웃 래퍼
// 화면 세로 꽉 채우고 배경은 부드러운 아이보리(#fffef9)
// 기본 폰트와 글씨색 설정
export const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #fffef9;
    font-family: 'Pretendard', sans-serif;
    color: #333;
`;

// 헤더 영역 스타일
// 글씨 중앙 정렬, 크고 굵은 폰트, 고급스러운 보라색(#4b3f72)
export const Header = styled.header`
  text-align: center;
  font-size: 2.5rem;
  padding: 2rem 0 1rem;
  font-weight: 700;
  color: #4b3f72;
`;

// 본문 컨텐츠 영역 스타일
// 화면 공간을 꽉 채우고, 최대 너비 700px로 가독성 유지
// 내부 요소들은 세로로 쌓이고, 각 항목 간 2rem 간격 유지
export const Content = styled.main`
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// 푸터 스타일
// 중앙 정렬, 연한 회색 배경과 글씨, 작고 눈에 부담 없는 크기
export const Footer = styled.footer`
    text-align: center;
    padding: 1rem 0;
    background-color: #f8f8f8;
    font-size: 0.875rem;
    color: #999;
`;