import { GroupPrivacy } from "@/types/groups.types";

export const GroupSettingsSection = ({ register }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2">
      <label className="block font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2">
        Access Protocol
      </label>
      <select
        {...register("privacy")}
        className="w-full bg-[#1c1917] border border-stone-800 p-3 text-stone-300 font-mono text-xs focus:outline-none focus:border-amber-900/50 transition-colors"
      >
        <option value={GroupPrivacy.PUBLIC}>
          PUBLIC_ACCESS (Visible to all)
        </option>
        <option value={GroupPrivacy.PRIVATE}>
          ENCRYPTED (Approval required)
        </option>
        <option value={GroupPrivacy.SECRET}>HIDDEN_NODE (Invite only)</option>
      </select>
    </div>
  </div>
);
