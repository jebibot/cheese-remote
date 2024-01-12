export const preferredRegion = "icn1";
export const runtime = "edge";

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const response = await fetch(
    `https://chzzk.naver.com/donation/${context.params.id}`,
    { cache: "no-store" },
  );
  let body = await response.text();
  body = body.replaceAll(`src="https://ssl.pstatic.net/`, `src="/static/`);
  body = body.replace(
    "</body>",
    `<script src="/js/inject.js"></script></body>`,
  );
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
