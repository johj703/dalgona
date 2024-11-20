## 🟡 달고나 🟡

#### 👉 [${\textsf{\color{#FFD700}달}}$별로 모아보는 ${\textsf{\color{#FFD700}고}}$즈넉한 ${\textsf{\color{#FFD700}나}}$의 일기, ${\textsf{\color{#FFD700}달고나}}$](https://dalgona.vercel.app/)

#### 👉 [원 페이지 노션 바로가기](https://teamsparta.notion.site/10-2e3a9fe37f104dfdbb6a1173cee9516a)

<br>

## 🔎 목차 <br>

🔗 - [1. 프로젝트 소개](#-프로젝트-소개) <br>
🔗 - [2. 팀소개](#-팀-소개) <br>
🔗 - [3. 아키텍쳐](#-아키텍쳐) <br>
🔗 - [4. 기술 및 도구](#-기술-및-도구) <br>
🔗 - [5. 주요 기능](#-주요-기능) <br>
🔗 - [6. 프로젝트 파일 구조](#-프로젝트-파일-구조) <br>
🔗 - [7. 트러블슈팅](#-트러블-슈팅) <br>

<br>

## 🍭 프로젝트 소개

달고나는 **나만의 일상 아카이브**, 감정과 추억을 함께 기록할 수 있는 라이프스타일 플랫폼입니다. <br>

- **기획이유** <br>
  현대인들은 자신의 삶을 기록하고 공유하는데 높은 관심을 보이고 있으며, 이러한 흐름은 SNS와 일기 앱의 지속적인 성장세로 확인할 수 있습니다. <br>하지만 대부분 기존 플렛폼은 텍스트 중심으로 설계되어 있어서 감정과 기록을 생생하게 표현하는데 한계가 있다고 생각했습니다.
  <br>이에 저희는 이런 시장 수요와 트렌드를 반영하여 글 뿐만 아니라 **직접 그림을 그리며** 감정과 기억을 생생하게 표현할 수 있는 특별한 공간을 만들고자 기획하게 되었습니다.<br><br>
  어릴 적 그림일기를 쓰던 추억을 되살려서 재미있게 소중한 추억을 정리해보세요!<br><br>

- **개발기간** : 2024.10.18(금) ~ 2024.11.21(목)

<br>

## 👨‍👩‍👧‍👦 팀 소개

| 이름       | 역할          | 담당                                                                             |                                                          |
| ---------- | ------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **박준호** | FE/Leader     | 그림일기(CRUD) 페이지, 마이페이지<br> 공통 컴포넌트(헤더, 버튼, 날짜 파싱 등)    | [@PJH-FE](https://github.com/PJH-FE)                     |
| **강지우** | FE/Sub-Leader | 기록의 방(대표 일기 설정, 월별 모아보기)<br> 갤러리(이번 달, 전체 그림 모아보기) | [@wldndnwl](https://github.com/wldndnwl)                 |
| **정희록** | FE/Member     | 메인페이지(피드형 타임라인, 캘린더), 검색페이지<br> 공통 컴포넌트(푸터)          | [@heerokj](https://github.com/heerokj)                   |
| **조현준** | FE/Member     | 로그인/회원가입, 회원정보 수정                                                   | [@johj703](https://github.com/johj703)                   |
| **김현정** | 디자이너      | 웹디자인 모바일디자인 메인로고 아이콘                                            | [@lucstrike](https://blog.naver.com/lucstrike)           |
| **정혜지** | 디자이너      | 웹디자인 모바일디자인 메인로고 아이콘                                            | [@gesundewurzeln](https://blog.naver.com/gesundewurzeln) |

<br>

## 🏗️ 아키텍쳐 <더 좋은 거 있음 변경할 예정... >

![Web App Reference Architecture](https://github.com/user-attachments/assets/75a4d256-1154-4e28-a4b8-a45cfbda38e7)

<br>

## 🛠️ 기술 및 도구

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/nodedotjs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <br><img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white"> <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white"/> <img src="https://img.shields.io/badge/zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white"/> <img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"/> <br>
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"/> <img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/> <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"/>

<br>

## 💡 주요 기능 <아직 작성안함!!! 더 추가하고 싶은 기능 말해주세욥 !!!>

### Canvas API 를 활용한 캔버스 기능 제공

- ㅇ

### 그림 일기 (CRUD)

- ㅇ

### 캘린더 기능 (달력 셀 클릭 및 조회범위 설정 시 해당 일기 조회)

- ㅇ

### 검색 기능 (특정 키워드 검색기능)

- ㅇ

### 그림을 모아볼 수 있는 갤러리 (이번 달, 전체 그림 모아보기)

- ㅇ

### 기록의 방 페이지 (대표일기 설정, 월별 모아보기)

- ㅇ

### 마이페이지 기능

- ㅇ

### 로그인/회원가입 기능

### 회원정보 수정 기능

### 무한스크롤

<br>

## 🗂️ 프로젝트 파일 구조 <괜찮나여 충분,,,??? >

📦src<br />
┣ 📂app<br />
┃ ┣ 📂(auth)<br />
┃ ┃ ┣ 📂sign-in<br />
┃ ┃ ┗ 📂sign-up<br />
┃ ┣ 📂artworkprev<br />
┃ ┣ 📂diary<br />
┃ ┣ 📂fonts<br />
┃ ┣ 📂gallery<br />
┃ ┣ 📂library<br />
┃ ┣ 📂main<br />
┃ ┣ 📂mypage<br />
┃ ┣ 📜favicon.ico<br />
┃ ┣ 📜globals.css<br />
┃ ┣ 📜layout.tsx<br />
┃ ┣ 📜not-found.tsx<br />
┃ ┗ 📜page.tsx<br />
┣ 📂components<br />
┣ 📂hooks<br />
┣ 📂lib<br />
┣ 📂queries<br />
┣ 📂style<br />
┣ 📂types<br />
┣ 📂utils<br />
┗ 📜middleware.ts<br />
<br>

## ❓ 트러블 슈팅

### 1. 이미지 CORS 문제로 인해 Canvas 오염 발생

**이슈**<br />

- 이전에 그렸던 그림을 이미지로 불러와 수정하려 할 때, Canvas에 새로 그림이 그려지지 않는 문제 발생<br />
- 보안 문제로 인해 CORS를 거치지 않고 로컬이 아닌 외부 소스에서 가져온 이미지를 Canvas에 적용하면 Canvas가 오염됨

**해결**<br />

- 이미지 객체의 crossOrigin 속성을 "anonymous"로 설정하여 해결<br />
- 이를 통해 외부 이미지의 CORS 정책을 우회하여 Canvas에 정상적으로 그림을 불러올 수 있게 됨

```typeScript
const pathPic = new Image();
pathPic.crossOrigin = "anonymous";
```

<br />

### 2. 초기 데이터 로딩 실패

**이슈**<br />

- useInfiniteQuery를 사용하여 무한 스크롤을 구현하는 과정에서 첫 페이지의 데이터를 로드하지 못하는 문제가 발생<br />
- TanStack Query v5 버전에서 첫 페이지의 매개변수를 설정하는 옵션이 추가되었으나, 해당 옵션 설정이 누락

**해결**<br />

- `initialPageParam` 옵션을 추가하여 첫 번째 페이지가 1로 시작하도록 설정하여 문제 해결

```typeScript
export const useInfiniteQuerySearchDiaries = (searchKeyword: string) => {
  const { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["searchDiaries", searchKeyword],
    enabled: !!searchKeyword,
    initialPageParam: 1, //👈 첫 번째 페이지를 1로 설정
    queryFn: ({ pageParam }) => getSearchPaginatedDiaries(pageParam, 10, searchKeyword),
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNext ? lastPage.nextPage : undefined;
    }
  });

  return { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
```

<br />

### 3. 일기 데이터 필터링 오류

**이슈**<br />

- 갤러리에서 메인 그림이 변경될 때마다 컨테이너 안 미리 보기 그림의 위치도 자동으로 중앙에 오게끔 해놨었는데 1024 이상 px일 때 중앙을 벗어남

**해결**<br />

- 이미지의 위치 (offsetLeft)와 컨테이너 크기 (containerWidth)를 기반으로 스크롤 위치 계산하던 로직을 이미지 인덱스 (imageIndex)와 너비 (imageWidth)로 계산하도록 변경 <br />
- (imageWidth + 8) \* imageIndex + imageWidth / 2 <br />선택된 이미지의 스크롤 위치를 이미지의 너비와 간격 (8px)을 더해 선택된 이미지의 인덱스를 곱한 값에 이미지 너비의 절반을 더하기<br />

```typeScript
  // 메인그림(mainEntry)이 변경될 때마다 스크롤 위치 조정
  useEffect(() => {
    if (mainEntry && imageListRef.current) {
      const container = imageListRef.current;
      const selectedImageElement = document.getElementById(`image-${mainEntry.id}`);

      if (selectedImageElement) {
        const imageWidth = selectedImageElement.offsetWidth;
        const imageIndex = Number(selectedImageElement.dataset.idx);

        const scrollPosition = (imageWidth + 8) * imageIndex + imageWidth / 2; //👈

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth"
        });
      }
    }
  }, [mainEntry]);

```

```typeScript
<img
    id={`image-${entry.id}`}
    src={entry.draw}
    alt={`Artwork ${entry.id}`}
    data-idx={idx} //👈
    className={`w-full h-full object-cover cursor-pointer bg-white border border-gray02 lg:rounded lg:border-gray04  ${
      entry.id === mainEntry?.id ? "border-2 border-[#D84E35]" : ""
    }`}
    onClick={() => handleSwipeSelect(entry)}
  />

```

<br />

### 4. ㅇㅇㅇ

**이슈**<br />

**해결**<br />
