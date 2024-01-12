export const runtime = "edge";
export const preferredRegion = "icn1";

export async function GET(
  request: Request,
  context: { params: { path: string[] } },
) {
  const path = context.params.path;
  const filename = path[path.length - 1];
  if (["desktop-media-viewer", "lcslog"].some((k) => filename.includes(k))) {
    return new Response("Not Found", { status: 404 });
  }
  let response = await fetch(`https://ssl.pstatic.net/${path.join("/")}`);
  if (filename.endsWith(".js")) {
    let body = await response.text();
    body = body.replaceAll(
      "comm-api.game.naver.com/",
      `remote.chz.app/game-api/`,
    );
    body = body.replaceAll("https://api.chzzk.naver.com", `/chzzk-api`);
    body = body.replaceAll("https://ssl.pstatic.net/tveta", `/tveta`);
    body = body.replaceAll("ssl.pstatic.net/spi", `remote.chz.app/spi`);
    body = body.replace(
      /setTimeout\(\(function\(\){_\(\),e\(\)}\),((?:[^()]+|\([^)]*\))+)\)/g,
      `window.__remoteTimer=setTimeout(window.__remoteCallback=(function(){window.__remoteTimer=0,window.__remoteSkip=!1,window.__remotePaused||(_(),e())}),window.__remoteSkip?0:(window.__remoteInterval||0)+($1))`,
    );
    response = new Response(body, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400",
      },
    });
  }
  return response;
}
