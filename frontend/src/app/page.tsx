export default function Home() {
  console.log("FRONT_BASE_URL", process.env.NEXT_PUBLIC_FRONT_BASE_URL);
  console.log("API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);

  const socialLoginForKakaoUrl = `http://localhost:8090/oauth2/authorization/kakao`;
  const socialLoginForGithubUrl = `http://localhost:8090/oauth2/authorization/github`;

  const redirectUrlAfterSocialLogin = 'http://localhost:3000';

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-4">
      <a
        href={`${socialLoginForKakaoUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`}
        className="text-yellow-500 font-bold"
      >
        카카오 로그인
      </a>

      <a
        href={`${socialLoginForGithubUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`}
        className="text-black font-bold"
      >
        GitHub 로그인
      </a>
    </div>
  );
}
