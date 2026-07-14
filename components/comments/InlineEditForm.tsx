interface InlineEditFormProps {
  form: any;
  onSubmit: (data: { content: string }) => void;
  onCancel: () => void;
}

export const InlineEditForm = ({
  form,
  onSubmit,
  onCancel,
}: InlineEditFormProps) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-3">
    <input
      {...form.register("content")}
      className="flex-1 bg-surface-2 border border-border text-text-primary text-xs px-3 py-1.5 focus:outline-none rounded"
      autoFocus
    />
    <div className="flex items-center gap-2">
      <button
        type="submit"
        className="text-accent text-xs uppercase font-bold"
      >
        შენახვა
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-text-secondary text-xs uppercase"
      >
        გაუქმება
      </button>
    </div>
  </form>
);
