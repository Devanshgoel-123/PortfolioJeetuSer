"use client";

import { useState } from "react";
import type { AdminProject } from "@/app/admin/actions";
import { deleteProjectAction, saveProjectAction } from "@/app/admin/actions";

type VideoField = {
  youtubeId: string;
  label: string;
};

type ProjectEditorProps = {
  project?: AdminProject;
};

function emptyVideo(): VideoField {
  return { youtubeId: "", label: "" };
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const [videos, setVideos] = useState<VideoField[]>(
    project?.videos.length
      ? project.videos.map((video) => ({
          youtubeId: video.youtubeId,
          label: video.label,
        }))
      : [emptyVideo(), emptyVideo()],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateVideo(index: number, field: keyof VideoField, value: string) {
    setVideos((current) =>
      current.map((video, i) => (i === index ? { ...video, [field]: value } : video)),
    );
  }

  function addVideo() {
    setVideos((current) => [...current, emptyVideo()]);
  }

  function removeVideo(index: number) {
    setVideos((current) => current.filter((_, i) => i !== index));
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

      <div style={{ marginTop: "1.5rem" }}>
        <div className="admin-header" style={{ marginBottom: "1rem", paddingBottom: 0, border: "none" }}>
          <h2 className="admin-title" style={{ fontSize: "1rem" }}>
            Videos
          </h2>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={addVideo}>
            Add video
          </button>
        </div>

        {videos.map((video, index) => (
          <div key={index} className="admin-video-row">
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
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => removeVideo(index)}
              disabled={videos.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

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
