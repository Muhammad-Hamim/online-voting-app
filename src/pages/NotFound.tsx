import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SVGProps } from "react";

const NotFound = () => {
  // Handler for going back to the previous page
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d8ff] to-[#00ff95] opacity-50 blur-[100px] animate-pulse" />
          <div className="relative z-10">
            <h1 className="mt-4 text-5xl font-bold tracking-tighter text-[#00ff95] sm:text-6xl">
              404 Error
            </h1>
            <p className="mt-4 text-2xl font-bold tracking-tighter text-[#00d8ff] sm:text-3xl">
              Oops! Circuit Shorted!
            </p>
          </div>
        </div>
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d8ff] to-[#00ff95] opacity-50 blur-[100px] animate-pulse" />
          <div className="relative z-10 grid gap-4">
            <Link
              to={"/"}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#00ff95] px-6 text-sm font-medium text-[#0a0a0a] shadow-lg transition-colors hover:bg-[#00d8ff] focus:outline-none focus:ring-2 focus:ring-[#00ff95] focus:ring-offset-2"
            >
              <PowerIcon className="mr-2 h-5 w-5" />
              Back to Homepage
            </Link>
            <Button
              variant="destructive"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff4d4d] px-6 text-sm font-medium text-[#0a0a0a] shadow-lg transition-colors hover:bg-[#ff6b6b] focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:ring-offset-2"
              onClick={handleGoBack} // Attach the click handler
            >
              <TriangleAlertIcon className="mr-2 h-5 w-5" />
              Go Back
            </Button>
            <Button
              variant="destructive"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff4d4d] px-6 text-sm font-medium text-[#0a0a0a] shadow-lg transition-colors hover:bg-[#ff6b6b] focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:ring-offset-2"
            >
              <TriangleAlertIcon className="mr-2 h-5 w-5" />
              Report Issue
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/circuit-bg.svg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00d8ff] to-[#00ff95] opacity-10 blur-[100px] animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[400px] w-[400px]">
            <div className="absolute inset-0 bg-[url('/robot.svg')] bg-contain bg-no-repeat bg-center animate-bounce" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d8ff] to-[#00ff95] opacity-50 blur-[100px] animate-pulse" />
          </div>
        </div>
      </div>
      <audio
        src="/circuit-beep.mp3"
        autoPlay
        loop
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
};

export default NotFound;

function PowerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>
  );
}

function TriangleAlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
