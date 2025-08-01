import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Viewer.css";
import { dummyEpisodes } from "/src/data/episodeData";
import ViewerControlBar from "./ViewerControlBar";

function Viewer({ bearOpen }) {
  const { id, number } = useParams();

  const episode = dummyEpisodes.find(
    (ep) => String(ep.id) === String(id) && String(ep.number) === String(number)
  );

  if (!episode) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", color: "#444" }}>
        에피소드를 찾을 수 없습니다.
      </div>
    );
  }

  const pages = splitTextIntoPages(episode.content, 500);
  const [pageIndex, setPageIndex] = useState(0);

  const leftPage = pages[pageIndex] || "";
  const rightPage = pages[pageIndex + 1] || "";

  const goToNextPage = () => {
    if (pageIndex + 2 < pages.length) {
      setPageIndex((prev) => prev + 2);
    }
  };

  const goToPreviousPage = () => {
    if (pageIndex - 2 >= 0) {
      setPageIndex((prev) => prev - 2);
    }
  };

  // 첫 페이지, 마지막 페이지 확인용 변수
  const isPrevDisabled = pageIndex === 0;
  const isNextDisabled = pageIndex + 2 >= pages.length;

  // 키보드 이벤트 추가
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        goToPreviousPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageIndex]); // pageIndex가 바뀔 때마다 최신 상태를 사용

  return (
    <div className="viewer-container">
      <ViewerControlBar
        title={`${episode.number}화 - ${episode.title}`}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
      />

      <div className={`viewer-main ${bearOpen ? "shrink" : ""}`}>
        <span
          onClick={goToPreviousPage}
          className={`arrow-button ${isPrevDisabled ? "disabled" : ""}`}
        >
          〈
        </span>

        <section className="page left-page">
          {textWithLineBreaks(leftPage)}
        </section>
        <section className="page right-page">
          {textWithLineBreaks(rightPage)}
        </section>

        <span
          onClick={goToNextPage}
          className={`arrow-button ${isNextDisabled ? "disabled" : ""}`}
        >
          〉
        </span>
      </div>
    </div>
  );
}

// 텍스트를 페이지 단위로 분할
function splitTextIntoPages(text, maxCharsPerPage = 800) {
  const paragraphs = text
    .trim()
    .split("\n")
    .filter((p) => p.trim() !== "");
  const pages = [];
  let currentPage = "";

  for (let para of paragraphs) {
    if ((currentPage + "\n" + para).length <= maxCharsPerPage) {
      currentPage += "\n" + para;
    } else {
      pages.push(currentPage.trim());
      currentPage = para;
    }
  }
  if (currentPage) pages.push(currentPage.trim());

  return pages;
}

// 줄바꿈 포함한 단락 표시
function textWithLineBreaks(text) {
  const paragraphs = text.split(/\n\s*\n?/);
  return paragraphs.map((para, index) => (
    <p key={index} style={{ marginBottom: "1.5em", whiteSpace: "pre-line" }}>
      {para.trim()}
    </p>
  ));
}

export default Viewer;
