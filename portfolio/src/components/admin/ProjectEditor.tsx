"use client";

import { useState } from "react";
import type { AdminProject } from "@/app/admin/actions";
import { deleteProjectAction, saveProjectAction } from "@/app/admin/actions";
import { extractYoutubeId, yt } from "@/lib/youtube";
import type { WorkKind } from "@/types/project";

type VideoField = {
  youtubeId: string;
  label: string;
  thumbnail: string;
  localPreview?: string;
  fileKey: number;
};

type ImageField = {
  url: string;
  label: string;
  localPreview?: string;
  fileKey: number;
};

type ProjectEditorProps = {
  project?: AdminProject;
};

function emptyVideo(): VideoField {
  return { youtubeId: "", label: "", thumbnail: "", fileKey: 0 };
}

function emptyImage(): ImageField {
  return { url: "", label: "", fileKey: 0 };
}

function videoPreviewSrc(video: VideoField): string | null {
  if (video.localPreview) return video.localPreview;
  if (video.thumbnail.trim()) return video.thumbnail.trim();
  const id = extractYoutubeId(video.youtubeId);
  return id ? yt(id) : null;
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const [kind, setKind] = useState<WorkKind>(project?.kind ?? "film");
  const [videos, setVideos] = useState<VideoField[]>(
    project?.videos.length
      ? project.videos.map((video) => ({
          youtubeId: video.youtubeId,
          label: video.label,
          thumbnail: video.thumbnail ?? "",
          fileKey: 0,
        }))
      : [emptyVideo()],
  );
  const [images, setImages] = useState<ImageField[]>(
    project?.images.length
      ? project.images.map((image) => ({
          url: image.url,
          label: image.label,
          fileKey: 0,
        }))
      : [emptyImage()],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateVideo(index: number, field: "youtubeId" | "label" | "thumbnail", value: string) {
    setVideos((current) =>
      current.map((video, i) => (i === index ? { ...video, [field]: value } : video)),
    );
  }

  function updateImage(index: number, field: keyof ImageField, value: string) {
    setImages((current) =>
      current.map((image, i) => (i === index ? { ...image, [field]: value } : image)),
    );
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await saveProjectAction(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="admin-card">
      {project && <input type="hidden" name="projectId" value={project.id} />}
      <input type="hidden" name="kind" value={kind} />

      <div className="admin-kind-block">
        <p className="admin-label">Work type</p>
        <div className="admin-kind-toggle">
          <button
            type="button"
            className={`admin-kind-option${kind === "film" ? " is-active" : ""}`}
            onClick={() => setKind("film")}
          >
            Film
          </button>
          <button
            type="button"
            className={`admin-kind-option${kind === "print" ? " is-active" : ""}`}
            onClick={() => setKind("print")}
          >
            Print
          </button>
        </div>
        <p className="admin-note">
          {kind === "film"
            ? "Film projects use YouTube videos. Upload a thumbnail image for each video, or leave it empty to use YouTube's own thumbnail."
            : "Print projects use a gallery of uploaded images."}
        </p>
      </div>

      <div className="admin-grid admin-grid-2">
        <div>
          <label className="admin-label" htmlFor="client">
            Client
          </label>
          <input
            id="client"
            name="client"
            className="admin-input"
            defaultValue={project?.client ?? ""}
            required
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            className="admin-input"
            defaultValue={project?.category ?? ""}
            placeholder={kind === "film" ? "Content Production" : "Editorial"}
            required
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="year">
            Year
          </label>
          <input
            id="year"
            name="year"
            className="admin-input"
            defaultValue={project?.year ?? ""}
            required
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="sortOrder">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            className="admin-input"
            defaultValue={project?.sortOrder ?? 0}
          />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0" }}>
        <input type="checkbox" name="published" defaultChecked={project?.published ?? true} />
        <span className="admin-note">Published on website</span>
      </label>

      {kind === "film" ? (
        <div style={{ marginTop: "1.5rem" }}>
          <div className="admin-header" style={{ marginBottom: "1rem", paddingBottom: 0, border: "none" }}>
            <h2 className="admin-title" style={{ fontSize: "1rem" }}>
              Videos
            </h2>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setVideos((current) => [...current, emptyVideo()])}
            >
              Add video
            </button>
          </div>

          {videos.map((video, index) => {
            const preview = videoPreviewSrc(video);
            return (
              <div key={index} className="admin-media-row">
                <div className="admin-media-preview">
                  {preview ? (
                    <img src={preview} alt={video.label || "Video thumbnail"} />
                  ) : (
                    <span>Thumbnail</span>
                  )}
                </div>
                <div className="admin-media-fields">
                  <div>
                    <label className="admin-label">YouTube URL or ID</label>
                    <input
                      name="videoYoutubeId"
                      className="admin-input"
                      value={video.youtubeId}
                      onChange={(event) => updateVideo(index, "youtubeId", event.target.value)}
                      placeholder="RAdw_jCDAjs or full YouTube URL"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Label</label>
                    <input
                      name="videoLabel"
                      className="admin-input"
                      value={video.label}
                      onChange={(event) => updateVideo(index, "label", event.target.value)}
                      placeholder="Campaign Film"
                    />
                  </div>
                  <div className="admin-media-span">
                    <label className="admin-label">Thumbnail image (optional)</label>
                    <input type="hidden" name="videoThumbnail" value={video.thumbnail} />
                    <input
                      key={video.fileKey}
                      name={`videoThumbnailFile-${index}`}
                      className="admin-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setVideos((current) =>
                          current.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  localPreview: file ? URL.createObjectURL(file) : undefined,
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                    <p className="admin-file-hint">
                      JPEG, PNG, WebP, or GIF up to 3MB. Stored in the database. If you skip this,
                      the YouTube thumbnail is used.
                    </p>
                    {video.thumbnail || video.localPreview ? (
                      <button
                        type="button"
                        className="admin-text-btn"
                        onClick={() =>
                          setVideos((current) =>
                            current.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    thumbnail: "",
                                    localPreview: undefined,
                                    fileKey: item.fileKey + 1,
                                  }
                                : item,
                            ),
                          )
                        }
                      >
                        Remove thumbnail
                      </button>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setVideos((current) => current.filter((_, i) => i !== index))}
                  disabled={videos.length === 1}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ marginTop: "1.5rem" }}>
          <div className="admin-header" style={{ marginBottom: "1rem", paddingBottom: 0, border: "none" }}>
            <h2 className="admin-title" style={{ fontSize: "1rem" }}>
              Images
            </h2>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setImages((current) => [...current, emptyImage()])}
            >
              Add image
            </button>
          </div>

          {images.map((image, index) => {
            const preview = image.localPreview || image.url.trim();
            return (
              <div key={index} className="admin-media-row">
                <div className="admin-media-preview">
                  {preview ? (
                    <img src={preview} alt={image.label || "Print image"} />
                  ) : (
                    <span>Image</span>
                  )}
                </div>
                <div className="admin-media-fields">
                  <div className="admin-media-span">
                    <label className="admin-label">Label</label>
                    <input
                      name="imageLabel"
                      className="admin-input"
                      value={image.label}
                      onChange={(event) => updateImage(index, "label", event.target.value)}
                      placeholder="Cover, Spread 01..."
                    />
                  </div>
                  <div className="admin-media-span">
                    <label className="admin-label">Image</label>
                    <input type="hidden" name="imageUrl" value={image.url} />
                    <input
                      key={image.fileKey}
                      name={`imageFile-${index}`}
                      className="admin-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setImages((current) =>
                          current.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  localPreview: file ? URL.createObjectURL(file) : undefined,
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                    <p className="admin-file-hint">
                      JPEG, PNG, WebP, or GIF up to 3MB. Stored in the database.
                    </p>
                    {image.url || image.localPreview ? (
                      <button
                        type="button"
                        className="admin-text-btn"
                        onClick={() =>
                          setImages((current) =>
                            current.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    url: "",
                                    localPreview: undefined,
                                    fileKey: item.fileKey + 1,
                                  }
                                : item,
                            ),
                          )
                        }
                      >
                        Remove image
                      </button>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                  disabled={images.length === 1}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="admin-actions" style={{ marginTop: "1.5rem" }}>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
          {pending ? "Saving..." : project ? "Update project" : "Create project"}
        </button>
        <a href="/admin" className="admin-btn admin-btn-secondary">
          Cancel
        </a>
      </div>

      {error && <p className="admin-error">{error}</p>}
    </form>
  );
}

export function DeleteProjectButton({ projectId }: { projectId: number }) {
  const [pending, setPending] = useState(false);

  async function handleDelete(formData: FormData) {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setPending(true);
    await deleteProjectAction(formData);
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="projectId" value={projectId} />
      <button type="submit" className="admin-btn admin-btn-danger" disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}
