import svgPaths from "./svg-6j5qdsb0ie";

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

function Key() {
  return (
    <div className="absolute inset-[71.48%_26.04%_25.1%_71.53%]" data-name="key2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
        <g id="key2">
          <path d={svgPaths.p39fe9d00} fill="var(--fill-0, #2A343D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[944px] top-[731px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[29px] leading-[normal] left-[944px] not-italic text-[30px] text-black top-[731px] w-[130px]">Enter</p>
      <Key />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[926px] top-[704px]">
      <div className="absolute bg-white h-[90px] left-[926px] top-[704px] w-[152px]" />
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[357.05px] top-[388px]">
      <div className="absolute bg-white border border-black border-solid h-[96px] left-[357.05px] rounded-[30px] top-[388px] w-[720.95px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[415.1px] not-italic text-[30px] text-black top-[418px] w-[182.263px]">SampleID</p>
    </div>
  );
}

export default function Component1() {
  return (
    <div className="bg-white relative size-full" data-name="로그인화면">
      <Component />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[26px] leading-[normal] left-[356px] not-italic text-[30px] text-black top-[336px] w-[45px]">ID</p>
      <div className="absolute bg-white border border-black border-solid h-[97px] left-[calc(50%-4.5px)] rounded-[30px] top-[567px] translate-x-[-50%] w-[725px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[403px] not-italic text-[30px] text-black text-nowrap top-[601px]">*********</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[normal] left-[calc(50%-367px)] not-italic text-[30px] text-black top-[517px] w-[209px]">Password</p>
      <Group1 />
      <Group2 />
    </div>
  );
}