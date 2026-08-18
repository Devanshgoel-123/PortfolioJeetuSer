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
};

type ImageField = {
  url: string;
  label: string;
};

type ProjectEditorProps = {
  project?: AdminProject;
};

function emptyVideo(): VideoField {
  return { youtubeId: "", label: "", thumbnail: "" };
}

function emptyImage(): ImageField {
  return { url: "", label: "" };
}

function videoPreviewSrc(video: VideoField): string | null {
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
        }))
      : [emptyVideo()],
  );
  const [images, setImages] = useState<ImageField[]>(
    project?.images.length
      ? project.images.map((image) => ({
          url: image.url,
          label: image.label,
        }))
      : [emptyImage()],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateVideo(index: number, field: keyof VideoField, value: string) {
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
            ? "Film projects use YouTube videos, each with an optional custom thumbnail."
            : "Print projects use a gallery of images instead of videos."}
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
                    <label className="admin-label">Thumbnail URL (optional)</label>
                    <input
                      name="videoThumbnail"
                      className="admin-input"
                      value={video.thumbnail}
                      onChange={(event) => updateVideo(index, "thumbnail", event.target.value)}
                      placeholder="Leave blank to use the YouTube thumbnail"
                    />
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

          {images.map((image, index) => (
            <div key={index} className="admin-media-row">
              <div className="admin-media-preview">
                {image.url.trim() ? (
                  <img src={image.url} alt={image.label || "Print image"} />
                ) : (
                  <span>Image</span>
                )}
              </div>
              <div className="admin-media-fields">
                <div className="admin-media-span">
                  <label className="admin-label">Image URL</label>
                  <input
                    name="imageUrl"
                    className="admin-input"
                    value={image.url}
                    onChange={(event) => updateImage(index, "url", event.target.value)}
                    placeholder="https://..."
                  />
                </div>
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
          ))}
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
