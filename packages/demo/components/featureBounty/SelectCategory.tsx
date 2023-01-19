import Link from 'next/link';

export default function SelectCategory() {
  return (
    <aside className="py-8 bg-white dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-screen-xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <Item title="Wallet" description="Wallet Integration and something" />
          <Item title="Transactions" description="Build transactions and bla" />
          <Item title="Playground" description="Docs and guides" />
          <Item title="Provider" description="Something else here" />
          <Item title="Integration" description="Docs and guides" />
          <Item title="Special catgegory" description="Something else here" />
        </div>
      </div>
    </aside>
  );
}

function Item({ title, description }) {
  return (
    <Link href={`/feature-bounty/list/transaction`}>
      <div className="flex justify-center items-center p-6 text-center bg-gray-100 rounded dark:bg-gray-800">
      <article className="max-w-xs cursor-pointer">
        <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-4 font-light text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </article>
      </div>
    </Link>
  );
}
