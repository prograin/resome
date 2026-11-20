export function VideoFormFields({ labels, video }) {
  return (
    <>
      <label>
        {labels.videoTitle}
        <input name="title" required maxLength={160} dir="auto" defaultValue={video?.title ?? ""} />
      </label>
      <label>
        {labels.videoLink}
        <input
          name="url"
          type="url"
          required
          maxLength={2048}
          dir="ltr"
          defaultValue={video?.url ?? ""}
        />
      </label>
      <label className="student-course__wide-field">
        {labels.description}
        <textarea
          name="description"
          required
          maxLength={1000}
          rows={4}
          dir="auto"
          defaultValue={video?.description ?? ""}
        />
      </label>
    </>
  );
}
