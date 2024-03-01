import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useRedirect({ path }: { path?: string }) {
  const router = useRouter();

  useEffect(() => {}, [router]);
  return router;
}
