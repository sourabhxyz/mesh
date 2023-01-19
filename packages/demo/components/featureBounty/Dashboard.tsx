export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-8 mx-auto max-w-screen-xl text-gray-900 sm:grid-cols-1 xl:grid-cols-2 dark:text-white place-content-center">
      <div className="flex flex-col justify-center items-center">
        <dt className="mb-2 text-3xl font-extrabold md:text-4xl">26,000</dt>
        <dd className="font-light text-gray-500 dark:text-gray-400">
          ADA Committed
        </dd>
      </div>
      <div className="flex flex-col justify-center items-center">
        <dt className="mb-2 text-3xl font-extrabold md:text-4xl">37</dt>
        <dd className="font-light text-gray-500 dark:text-gray-400">
          Active Developers
        </dd>
      </div>
      <div className="flex flex-col justify-center items-center">
        <dt className="mb-2 text-3xl font-extrabold md:text-4xl">55</dt>
        <dd className="font-light text-gray-500 dark:text-gray-400">
          Open Features
        </dd>
      </div>
      <div className="flex flex-col justify-center items-center">
        <dt className="mb-2 text-3xl font-extrabold md:text-4xl">15</dt>
        <dd className="font-light text-gray-500 dark:text-gray-400">
          Completed Features
        </dd>
      </div>
    </div>
  );
}
