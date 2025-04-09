import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-2">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <span>
            Built by{" "}
            <Link
              href="https://github.com/bevanlewis"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              @bevanlewis
            </Link>
          </span>
          <Link
            href="https://github.com/bevanlewis/vibe-requirements-app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-gray-600 transition-colors"
          >
            <FaGithub className="mr-1" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
