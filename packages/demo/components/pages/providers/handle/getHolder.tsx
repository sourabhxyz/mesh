import { useState } from 'react';
import SectionTwoCol from '../../../common/sectionTwoCol';
import Card from '../../../ui/card';
import RunDemoButton from '../../../common/runDemoButton';
import RunDemoResult from '../../../common/runDemoResult';
import Codeblock from '../../../ui/codeblock';
import Input from '../../../ui/input';

export default function GetHolder({ provider, address, setAddress }) {
  return (
    <>
      <SectionTwoCol
        sidebarTo="getHolder"
        header="getHolder"
        leftFn={LeftContent({ address })}
        rightFn={RightContent({ provider, address, setAddress })}
        isH3={true}
      />
    </>
  );
}

function LeftContent({ address }) {
  let codeResponse = ``;
  codeResponse += `{\n`;
  codeResponse += `  "total_handles": 2,\n`;
  codeResponse += `  "default_handle": "meshjs",\n`;
  codeResponse += `  "manually_set": false,\n`;
  codeResponse += `  "address": "stake1u8qg7q55at26k7hqee28rh2gwqrery5hh22jxzhj9uj72agv45wv8",\n`;
  codeResponse += `  "known_owner_name": "",\n`;
  codeResponse += `  "type": "wallet"\n`;
  codeResponse += `}\n`;

  let code = `import { HandlerProvider } from '@meshsdk/core';\n\n`;
  code += `const handlerProvider = new HandlerProvider();\n`;
  code += `const holder = await handlerProvider.getHolder('${address}');`;

  return (
    <>
      <p>Get the handle given the stake address.</p>
      <Codeblock data={code} isJson={false} />
      <p>Expected output:</p>
      <Codeblock data={codeResponse} isJson={false} />
    </>
  );
}

function RightContent({ provider, address, setAddress }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<null | any>(null);
  const [responseError, setResponseError] = useState<null | any>(null);

  async function runDemo() {
    setLoading(true);
    setResponse(null);
    setResponseError(null);
    try {
      const res = await provider.getHolder(address);
      setResponse(res);
    } catch (error) {
      setResponseError(`${error}`);
    }
    setLoading(false);
  }

  return (
    <Card>
      <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Get Holder
        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
          Get the handle given the stake address.
        </p>
      </div>

      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        label="Address"
      />

      <Codeblock
        data={`const holder = await handlerProvider.getHolder('${address}');`}
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
