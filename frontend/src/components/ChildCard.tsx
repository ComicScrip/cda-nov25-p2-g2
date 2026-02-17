export default function ChildCard({ name, age, group, photo, onClick }) {
  return (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-3xl p-2 text-left transition hover:scale-[1.02] active:scale-95"
    >
      <div className="h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-300 p-[6px] shadow-[0_14px_25px_rgba(255,200,60,0.25)]">
        {/** biome-ignore lint/performance/noImgElement: <explanation> */}
        <img
          src={photo}
          alt={name}
          className="h-full w-full rounded-full border-4 border-white/90 object-cover"
        />
      </div>

      <div className="flex-1 rounded-3xl bg-yellow-100/80 px-5 py-4 shadow-[0_10px_16px_rgba(20,40,90,0.06)]">
        <p className="text-lg font-extrabold text-blue-900">{name}</p>

        <p className="text-base font-medium text-blue-900/90">{age}</p>

        <p className="text-base font-medium text-blue-900/90">{group}</p>
      </div>
    </button>
  );
}
