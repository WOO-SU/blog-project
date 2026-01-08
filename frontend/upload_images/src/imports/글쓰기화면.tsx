import svgPaths from "./svg-w3szuu7ljd";

function Sliders() {
  return (
    <div className="absolute inset-[42.31%_77.19%_42.31%_21.15%]" data-name="sliders3">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="sliders3">
          <path d={svgPaths.pfb6b640} fill="var(--fill-0, #2A343D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Eyedropper() {
  return (
    <div className="absolute inset-[42.31%_67.36%_42.31%_30.97%]" data-name="eyedropper">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24.0001">
        <g id="eyedropper">
          <path d={svgPaths.p2d5624c0} fill="var(--fill-0, #2A343D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Window() {
  return (
    <div className="absolute inset-[42.31%_57.5%_42.31%_40.83%]" data-name="window">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="window">
          <path d={svgPaths.p2e51f400} fill="var(--fill-0, #2A343D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute h-[156px] left-0 top-0 w-[1440px]" data-name="헤더">
      <div className="absolute inset-[-1.28%_-0.14%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1444 160">
          <path d="M1443 1V159H1V1H1443Z" fill="var(--fill-0, #F6F6F6)" id="Rectangle 11" stroke="var(--stroke-0, black)" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute bg-white border border-black border-solid inset-[17.95%_74.44%_17.95%_18.61%] rounded-[15px]" />
      <div className="absolute bg-white border border-black border-solid inset-[17.95%_64.58%_17.95%_28.47%] rounded-[15px]" />
      <div className="absolute bg-white border border-black border-solid inset-[17.95%_54.72%_17.95%_38.33%] rounded-[15px]" />
      <Sliders />
      <Eyedropper />
      <Window />
      <p className="absolute bottom-1/4 font-['Holtwood_One_SC:Regular',sans-serif] leading-[normal] left-[2.5%] not-italic right-[80.21%] text-[64px] text-black top-[17.95%]">Tlog</p>
    </div>
  );
}

function Check() {
  return (
    <div className="absolute inset-[84.57%_20.21%_12.5%_77.71%]" data-name="check2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="check2">
          <path d={svgPaths.p3de07a80} fill="var(--fill-0, #2A343D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[1025px] top-[863px]">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] left-[1025px] not-italic text-[30px] text-black text-nowrap top-[863px]">업로드</p>
      <Check />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[959px] top-[832px]">
      <div className="absolute bg-[#f7f7f7] border border-black border-solid h-[97px] left-[959px] rounded-[30px] top-[832px] w-[243px]" />
      <Group1 />
    </div>
  );
}

function Plug() {
  return (
    <div className="absolute inset-[35.06%_21.18%_33.77%_64.71%]" data-name="plug">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="plug">
          <path d={svgPaths.p16a95700} fill="var(--fill-0, #2A343D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[calc(35.06%-1px)_calc(21.18%-1px)_calc(33.77%-1px)_calc(21.18%-1px)]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[35.06%_39.41%_33.77%_21.18%] leading-[normal] not-italic text-[20px] text-black text-nowrap">Logout</p>
      <Plug />
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute bg-white border border-black border-solid h-[77px] left-[1220px] rounded-[30px] top-[43px] w-[170px]" data-name="로그아웃">
      <div className="absolute bg-white border border-black border-solid inset-[-1px] rounded-[30px]" data-name="Rectangle" />
      <Group />
    </div>
  );
}

export default function Component2() {
  return (
    <div className="bg-white relative size-full" data-name="글쓰기화면">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal h-[55px] leading-[normal] left-[235px] not-italic text-[20px] text-black top-[82px] w-[178px]">글쓰기화면</p>
      <Component />
      <Group2 />
      <div className="absolute bg-[#fffdfd] border border-black border-solid h-[408px] left-[250px] top-[327px] w-[924px]" />
      <Component1 />
      <div className="absolute bg-[#ececec] border border-black border-solid h-[84px] left-[250px] top-[248px] w-[924px]" />
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal h-[47px] leading-[normal] left-[273px] not-italic text-[#b4b1b1] text-[30px] top-[273px] w-[279px]">제목을 입력하세요.</p>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal h-[35px] leading-[normal] left-[273px] not-italic text-[#b4b1b1] text-[30px] top-[363px] w-[279px]">내용</p>
    </div>
  );
}