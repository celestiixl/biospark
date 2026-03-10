type ImportPrBody = {
  html?: string;
  requestedBy?: string;
  requestedByIsAdmin?: boolean;
  title?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function titleFromHtml(html: string) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  const value = (m?.[1] ?? "Imported Phenomenon").trim();
  return value || "Imported Phenomenon";
}

function json<T>(value: T, status = 200) {
  return Response.json(value, { status });
}

async function gh<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req: Request) {
  const token = process.env.GITHUB_TOKEN || "";
  const owner = process.env.GITHUB_REPO_OWNER || "celestiixl";
  const repo = process.env.GITHUB_REPO_NAME || "biospark";
  const baseBranch = process.env.GITHUB_BASE_BRANCH || "main";

  if (!token) {
    return json(
      {
        ok: false,
        error:
          "Missing GITHUB_TOKEN. Set GITHUB_TOKEN (+ optional GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_BASE_BRANCH).",
      },
      501,
    );
  }

  const body = (await req.json().catch(() => ({}))) as ImportPrBody;
  const html = (body.html ?? "").trim();
  const requestedBy = (body.requestedBy ?? "anonymous").trim();
  const requestedByIsAdmin = Boolean(body.requestedByIsAdmin);

  if (!html) {
    return json({ ok: false, error: "html is required" }, 400);
  }
  if (!/^\s*<!doctype html>|^\s*<html[\s>]/i.test(html)) {
    return json(
      {
        ok: false,
        error:
          "Only full HTML documents are supported (must start with <!doctype html> or <html>).",
      },
      400,
    );
  }

  const htmlTitle = body.title?.trim() || titleFromHtml(html);
  const slug = slugify(htmlTitle) || "imported-phenomenon";
  const filePath = `apps/web/public/phenomena/imported/${slug}.html`;
  const branch = `phenomena/import-${slug}-${Date.now()}`;

  const baseRef = await gh<{ object?: { sha?: string }; message?: string }>(
    token,
    `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(baseBranch)}`,
  );
  if (!baseRef.ok || !baseRef.data?.object?.sha) {
    return json(
      {
        ok: false,
        error: "Failed to read base branch reference from GitHub.",
        detail: baseRef.data?.message,
      },
      502,
    );
  }

  const createRef = await gh<{ message?: string }>(
    token,
    `/repos/${owner}/${repo}/git/refs`,
    {
      method: "POST",
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: baseRef.data.object.sha,
      }),
    },
  );
  if (!createRef.ok) {
    return json(
      {
        ok: false,
        error: "Failed to create branch on GitHub.",
        detail: createRef.data?.message,
      },
      502,
    );
  }

  const commitMessage = `feat(phenomena): import ${slug} HTML`;
  const putFile = await gh<{ content?: { path?: string }; message?: string }>(
    token,
    `/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(html, "utf8").toString("base64"),
        branch,
      }),
    },
  );
  if (!putFile.ok) {
    return json(
      {
        ok: false,
        error: "Failed to commit imported HTML file.",
        detail: putFile.data?.message,
      },
      502,
    );
  }

  const prTitle = `Import phenomenon: ${htmlTitle}`;
  const prBody = [
    `Imported by: ${requestedBy}`,
    `Source type: pasted HTML`,
    `Generated slug: ${slug}`,
    "",
    "## Review Notes",
    requestedByIsAdmin
      ? "Uploader marked as site admin; standard review still recommended before merge."
      : "Uploader is non-admin; approval required before merge.",
    "",
    "## Visual changes",
    "- [ ] Add screenshot or screen recording of the imported phenomenon",
  ].join("\n");

  const createPr = await gh<{
    html_url?: string;
    number?: number;
    message?: string;
  }>(token, `/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: prTitle,
      head: branch,
      base: baseBranch,
      body: prBody,
      draft: !requestedByIsAdmin,
    }),
  });

  if (!createPr.ok || !createPr.data?.number) {
    return json(
      {
        ok: false,
        error: "File committed, but PR creation failed.",
        detail: createPr.data?.message,
        branch,
      },
      502,
    );
  }

  const labels = requestedByIsAdmin
    ? ["content", "phenomena-import", "admin-upload"]
    : ["content", "phenomena-import", "needs-approval"];

  await gh(
    token,
    `/repos/${owner}/${repo}/issues/${createPr.data.number}/labels`,
    {
      method: "POST",
      body: JSON.stringify({ labels }),
    },
  );

  return json({
    ok: true,
    branch,
    filePath,
    prNumber: createPr.data.number,
    prUrl: createPr.data.html_url,
  });
}
