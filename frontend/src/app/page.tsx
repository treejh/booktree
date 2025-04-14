export default function Home() {
  console.log("FRONT_BASE_URL", process.env.NEXT_PUBLIC_FRONT_BASE_URL);
   console.log("API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);
 
   const socialLoginForKakaoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao`;
   const redirectUrlAfterSocialLogin = process.env.NEXT_PUBLIC_FRONT_BASE_URL;
   return (
     <div className="flex-1 flex justify-center items-center">
       <a
         href={`${socialLoginForKakaoUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`}
       >
         <span className="font-bold">카카오 로그인</span>
       </a>
     </div>
   );
 }