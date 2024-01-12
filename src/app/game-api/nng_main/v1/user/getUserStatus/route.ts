export const runtime = "edge";
export const preferredRegion = "icn1";

export async function GET(request: Request) {
  return Response.json(
    {
      code: 200,
      message: null,
      content: {
        hasProfile: false,
        userIdHash: null,
        nickname: null,
        profileImageUrl: null,
        penalties: null,
        officialNotiAgree: false,
        officialNotiAgreeUpdatedDate: null,
        verifiedMark: false,
        loggedIn: false,
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400",
      },
    },
  );
}
