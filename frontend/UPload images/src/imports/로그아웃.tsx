import svgPaths from "./svg-7t98tpnhtp";

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

export default function Component() {
  return (
    <div className="bg-white border border-black border-solid relative rounded-[30px] size-full" data-name="로그아웃">
      <div className="absolute bg-white border border-black border-solid inset-[-1px] rounded-[30px]" data-name="Rectangle" />
      <Group />
    </div>
  );
}