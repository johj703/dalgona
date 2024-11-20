import useGetDevice from "@/hooks/useGetDevice";
import { useGetMyDrawing } from "@/queries/mypage/useGetMyDrawing";
import { useMyDrawingMutation } from "@/queries/mypage/useMyDrawingMutation";
import Link from "next/link";
import { useEffect } from "react";

const MyDrawing = ({ userId }: { userId: string }) => {
  const device = useGetDevice();
  const { data: myDrawingData, isLoading, isError } = useGetMyDrawing(userId, device);
  const { mutate: refetchDraw } = useMyDrawingMutation();

  useEffect(() => {
    refetchDraw({ userId, device });
  }, [device]);

  const myDrawing = myDrawingData?.data;
  const myDrawingCount = myDrawingData?.count;

  if (isError) return <div>유저 정보를 불러오는데 실패했습니다.</div>;
  if (isLoading) return;

  return (
    <div className="py-2 px-4 lg:p-4 lg: text-center">
      <div className="text-base leading-5 lg:text-xl lg:leading-normal">내 그림 모아보기</div>
      {myDrawing?.length === 0 ? (
        <div className="flex flex-col items-center text-center w-full lg:text-gray04 lg:gap-1">
          <div className="flex items-center justify-center gap-[10px] p-[10px] text-base leading-5 lg:text-normal leading-normal">
            아직 그림이 없네요! <img src="/icons/facial-expressions.svg" alt="우는 얼굴" className="lg:hidden" />
          </div>
          <span className="text-sm leading-normal text-gray04 lg:text-base">
            캔버스가 당신의 하루를 기다리고 있어요!
          </span>
          <Link
            href={"/diary/write"}
            className="flex items-center gap-[10px] mt-[34px] w-fit py-2 px-4 border-black border border-solid rounded-lg bg-white text-black lg:mt-4 lg:gap-2"
          >
            그림 그리러 가기 <img src="/icons/pencil.svg" alt="연필" />
          </Link>
        </div>
      ) : (
        <ul className="flex gap-4 mt-[11px] lg:mt-4 lg:justify-center">
          {myDrawing?.map((draw, idx) => {
            return (
              <li
                key={idx}
                className="relative flex items-center justify-center w-1/3 aspect-square border border-gray04 rounded-2xl bg-white overflow-hidden lg:w-1/6"
              >
                <img src={draw.draw} alt={`그림${idx}`} className="object-contain" />

                {idx === myDrawing.length - 1 && (
                  <Link
                    href="/mypage/artwork"
                    className="absolute top-0 left-0 flex items-end justify-end w-full h-full bg-gray01 bg-opacity-[0.63] px-[10px] py-[2px] text-sm leading-normal text-black lg:text-lg"
                  >
                    {myDrawingCount! > myDrawing.length && (
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base leading-normalt lg:text-xl">
                        +{myDrawingCount! - myDrawing.length}
                      </span>
                    )}
                    더보기
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default MyDrawing;
