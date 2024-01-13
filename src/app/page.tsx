import {
  faArrowUpRightFromSquare,
  faCircleInfo,
  faCopy,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Generator from "@/components/generator";
import RemoteDemo from "@/components/remote-demo";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <main className="flex flex-col-reverse lg:grid max-w-screen-xl px-4 py-8 lg:py-16 mx-auto gap-12 xl:gap-0 lg:grid-cols-12">
      <div className="mt-4 mx-auto lg:ml-0 lg:col-span-7 xl:col-span-8">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold dark:text-white">
            치즈 리모컨
          </h1>
          <p className="mb-4 md:text-lg lg:text-xl text-gray-500 dark:text-gray-400">
            치즈 후원을 모아보고, 후원 알림을 다시 재생하거나, 잠시 멈추거나,
            건너뛸 수 있습니다.
          </p>
          <p className="mb-2 md:text-lg text-gray-700 dark:text-gray-300">
            <a
              className="text-emerald-500 hover:underline dark:text-emerald-400"
              href="https://studio.chzzk.naver.com/notification"
              target="_blank"
            >
              치지직 스튜디오 &gt; 알림 설정
            </a>
            의 <span className="font-bold">후원 안내 URL</span>을 입력해주세요.
          </p>
          <Generator
            linkIcon={<FontAwesomeIcon icon={faLink} />}
            windowIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            copyIcon={<FontAwesomeIcon icon={faCopy} />}
          >
            <div className="px-4 py-3 mb-4 rounded-lg text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
              <FontAwesomeIcon icon={faCircleInfo} /> 주소 방송 노출에 주의하여
              주세요! 리모컨을 OBS 스튜디오에서{" "}
              <span className="font-semibold">독 &gt; 사용자 브라우저 독</span>
              으로 추가하면 주소 노출 없이 방송 시마다 실행되도록 할 수
              있습니다.
            </div>
          </Generator>
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-300">
            본 서비스는 치지직과 관련이 없으며, 관련 상표는 각 소유자의
            자산입니다.{" "}
            <a
              className="text-emerald-500 hover:underline dark:text-emerald-400"
              href="https://www.chatlink.app/privacy"
              target="_blank"
            >
              개인정보처리방침
            </a>
          </div>
          <a
            className="text-2xl"
            href="https://discord.gg/9kq3UNKAkz"
            target="_blank"
          >
            <FontAwesomeIcon icon={faDiscord} />
          </a>
        </div>
      </div>
      <div className="lg:col-span-5 xl:col-span-4">
        <RemoteDemo />
      </div>
    </main>
  );
}
