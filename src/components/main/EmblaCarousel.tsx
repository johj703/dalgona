"use client";
import React, { useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import "../../style/embla.css";

type SlideType = { img: string; imgLg?: string };

type PropType = {
  slides: SlideType[];
  options?: EmblaOptionsType;
  isSelectCalendar: number;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, isSelectCalendar } = props;

  const emblaOptions = { ...options, loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, [Autoplay({ playOnInit: true, delay: 3000 })]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const [isLgScreen, setIsLgScreen] = useState(false);

  // 화면 크기 확인 및 반응형 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className={`embla ${isSelectCalendar === 1 ? "lg:absolute lg:w-[450px] lg:h-[360px] lg:right-[13px]" : ""}`}
    >
      {/* embla__viewport 여기에 마진 등 넣어야됨 ..?*/}
      <div
        className={`embla__viewport ${isSelectCalendar === 1 ? "lg:w-[450px] lg:h-[330px]" : "lg:w-[955px]"}`}
        ref={emblaRef}
      >
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <img
                  src={isLgScreen && slide.imgLg ? slide.imgLg : slide.img}
                  alt={`Slide ${index + 1}`}
                  width={isLgScreen ? 960 : 358}
                  height={isSelectCalendar === 1 ? 296 : 110}
                  className={`${isSelectCalendar === 1 ? "lg:mt-[220px]" : ""}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`embla__controls ${isSelectCalendar === 1 ? "embla__controls--select-calendar" : ""}`}>
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(index === selectedIndex ? " embla__dot--selected" : "")}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
