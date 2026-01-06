import svgPaths from "./svg-ug4oh4olbj";

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

export default function Component() {
  return (
    <div className="relative size-full" data-name="헤더">
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