import RemoteImpl from "@/components/remote-impl";

export default async function RemotePage({
  params,
}: {
  params: { id: string };
}) {
  let sessionUrl: string | undefined;
  if (/^[a-z0-9%@]+$/.test(params.id)) {
    const response = await fetch(
      `https://api.chzzk.naver.com/manage/v1/alerts/${params.id}/session-url`,
      { cache: "no-store" },
    );
    if (response.ok) {
      const result = await response.json();
      if (result.code === 200 && result.content?.sessionUrl) {
        sessionUrl = result.content.sessionUrl;
      }
    }
  }
  return sessionUrl ? (
    <RemoteImpl sessionUrl={sessionUrl} />
  ) : (
    <div>잘못된 경로입니다.</div>
  );
}
