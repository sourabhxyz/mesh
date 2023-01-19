import Link from 'next/link';

export default function Listing({
  title,
  description,
  vote,
  clickable = false,
}) {
  return (
    <article className="p-1 lg:p-2 mb-6 text-base bg-white border border-gray-100 dark:border-gray-700 rounded-lg dark:bg-gray-800">
      <div className="flex">
        <div className="mr-4">
          <div className="rounded-lg bg-gray-100 w-9 flex flex-col items-center justify-center font-medium dark:bg-gray-700">
            <button
              type="button"
              className="text-gray-500 dark:text-gray-400 py-1 rounded-t-lg hover:bg-gray-200 w-full focus:ring-2 focus:outline-none focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              +
            </button>
            <span className="text-gray-900 font-m py-1 px-2 lg:px-0 text-xs lg:text-sm dark:text-white">
              {vote}
            </span>
            <button
              type="button"
              className="text-gray-500  dark:text-gray-400 py-1 rounded-b-lg hover:bg-gray-200 w-full focus:ring-2 focus:outline-none focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              -
            </button>
          </div>
        </div>

        {clickable ? (
          <Link href={`/feature-bounty/info/somethingId`}>
            <div className="cursor-pointer">
              <Info title={title} description={description} menuItem={true} />
            </div>
          </Link>
        ) : (
          <Info title={title} description={description} menuItem={false} />
        )}
      </div>
    </article>
  );
}

function Info({ title, description, menuItem }) {
  return (
    <div className="w-full text-left">
      <h2 className="font-bold leading-tight text-gray-900 dark:text-white">
        {title}
      </h2>
      <span className="text-sm text-gray-500">Transaction</span>
      <p
        className={`text-gray-500 dark:text-gray-400 ${
          menuItem && 'text-ellipsis overflow-hidden h-12'
        }`}
      >
        {description}
      </p>
    </div>
  );
}
