import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link
        className="mb-20 w-24 h-12 bg-sky-600 text-white text-center rounded-lg"
        href={"/blog"}
      >
        Blog
      </Link>

      <Link
        className="w-24 h-12 bg-sky-600 text-white text-center rounded-lg"
        href={"/about"}
      >
        about
      </Link>
    </main>
  );
}
