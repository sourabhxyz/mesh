import Listing from './Listing';

export default function Roadmap() {
  return (
    <aside className="py-8 bg-white dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-screen-xl">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Features Roadmap
        </h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <article className="">
            <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
              Candidate
            </h2>
            <div>
              <Listing
                title={'Get something from tx'}
                description={'Allow something something'}
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={'Integrate this with that so that'}
                vote={'23'}
                clickable={true}
              />
            </div>
          </article>
          <article className="">
            <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
              Planned
            </h2>
            <div>
              <Listing
                title={'Get something from tx'}
                description={'Allow something something'}
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={'Integrate this with that so that'}
                vote={'23'}
                clickable={true}
              />
              <Listing
                title={'Get something from tx'}
                description={'Allow something something'}
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={'Integrate this with that so that'}
                vote={'23'}
                clickable={true}
              />
            </div>
          </article>
          <article className="">
            <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
              In Progress
            </h2>
            <div>
              <Listing
                title={'Get something from tx'}
                description={'Allow something something'}
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={'Integrate this with that so that'}
                vote={'23'}
                clickable={true}
              />
              <Listing
                title={'Get something from tx'}
                description={'Allow something something'}
                vote={'15'}
                clickable={true}
              />
              <Listing
                title={'Connect with special wallet'}
                description={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                vote={'23'}
                clickable={true}
              />
            </div>
          </article>
        </div>
      </div>
    </aside>
  );
}
