import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Breadcrumb({
  category,
  featureName,
}: {
  category?: string;
  featureName?: string;
}) {
  return (
    <nav className="flex">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 mb-4">
        <li className="inline-flex items-center">
          <Link href="/feature-bounty">
            <span className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer">
              Mesh Features Bounty
            </span>
          </Link>
        </li>
        {category && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              <Link href={`/feature-bounty/list/${category}`}>
                <span className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white capitalize cursor-pointer">
                  {category}
                </span>
              </Link>
            </div>
          </li>
        )}
        {featureName && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                {featureName}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
}
