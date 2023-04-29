import { useState } from 'react';
import SectionTwoCol from '../../../common/sectionTwoCol';
import Card from '../../../ui/card';
import RunDemoButton from '../../../common/runDemoButton';
import RunDemoResult from '../../../common/runDemoResult';
import Codeblock from '../../../ui/codeblock';

export default function GetHolders({ provider }) {
  return (
    <>
      <SectionTwoCol
        sidebarTo="getHolders"
        header="getHolders"
        leftFn={LeftContent({})}
        rightFn={RightContent({ provider })}
        isH3={true}
      />
    </>
  );
}

function LeftContent({}) {
  let code = `import { HandlerProvider } from '@meshsdk/core';\n\n`;
  code += `const handlerProvider = new HandlerProvider();\n`;
  code += `const holders = await handlerProvider.getHolders(records_per_page = 100, page = 1);`;

  let codeResponse = ``;
  codeResponse += `[\n`;
  codeResponse += `  {\n`;
  codeResponse += `    "total_handles": 1421,\n`;
  codeResponse += `    "address": "stake1d4fg5dghrdxxxxxxxxxxxxxxxxxxx",\n`;
  codeResponse += `    "type": "wallet",\n`;
  codeResponse += `    "known_owner_name": "jpg.store",\n`;
  codeResponse += `    "default_handle": "my_default_hndl",\n`;
  codeResponse += `    "manually_set": true\n`;
  codeResponse += `  }\n`;
  codeResponse += `]\n`;

  return (
    <>
      <p>Lists the wallet/script/enterprise addresses that hold Handles.</p>
      <p>
        With the following parameters:
        <br />
        <code>records_per_page</code>: Number of Holders to return per page in
        paginated results. Maximum of 1000.
        <br />
        <code>page</code>: The page number to return in paginated results.
      </p>
      <Codeblock data={code} isJson={false} />
      <p>Expected output:</p>
      <Codeblock data={codeResponse} isJson={false} />
    </>
  );
}

function RightContent({ provider }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<null | any>(null);
  const [responseError, setResponseError] = useState<null | any>(null);

  async function runDemo() {
    setLoading(true);
    setResponse(null);
    setResponseError(null);
    try {
      const res = await provider.getHolders(5,1);
      setResponse(res);
    } catch (error) {
      setResponseError(`${error}`);
    }
    setLoading(false);
  }

  return (
    <Card>
      <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Get Holders
        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
          Lists the wallet/script/enterprise addresses that hold Handles.
        </p>
      </div>

      <Codeblock
        data={`const holders = await handlerProvider.getHolders(5,1);`}
        isJson={false}
      />

      <RunDemoButton
        runDemoFn={runDemo}
        loading={loading}
        response={response}
      />

      <RunDemoResult response={response} label="Response" />
      <RunDemoResult response={responseError} label="Error" />
    </Card>
  );
}
