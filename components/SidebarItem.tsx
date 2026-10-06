type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export default function SidebarItem({ label, active, onClick, onEdit, onDelete }: Props) {
  const actions = (onEdit ? 1 : 0) + (onDelete ? 1 : 0);
  const padding = actions === 2 ? "pr-[4.5rem]" : actions === 1 ? "pr-10" : "";

  return (
    <div className="side-row relative">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={`side-item w-full rounded-xl px-3 py-2.5 text-left text-[15px] font-bold ${padding} ${
          active ? "bg-[var(--hover-bg)] text-[var(--accent-text)]" : "text-[var(--text)]"
        }`}
      >
        {label}
      </button>
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${label} 폴더 이름 수정`}
            className="side-action flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-sub)]"
          >
            <svg {...iconProps}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${label} 폴더 삭제`}
            className="side-action side-action-danger flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-sub)]"
          >
            <svg {...iconProps}>
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
