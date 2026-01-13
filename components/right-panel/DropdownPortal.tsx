import { createPortal } from "react-dom";

interface DropdownPortalProps {
  children: React.ReactNode;
  pos: { top: number; right: number };
  onClose: () => void;
}

export const DropdownPortal = ({
  children,
  pos,
  onClose,
}: DropdownPortalProps) => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="portal-dropdown-content fixed z-[9999] animate-in fade-in zoom-in duration-200"
      style={{ top: pos.top, right: pos.right }}
    >
      <div className="w-80 bg-[#1c1917] border-2 border-stone-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        {children}
      </div>
    </div>,
    document.body
  );
};
