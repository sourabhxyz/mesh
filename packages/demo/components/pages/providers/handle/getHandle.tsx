import { useState } from 'react';
import SectionTwoCol from '../../../common/sectionTwoCol';
import Card from '../../../ui/card';
import RunDemoButton from '../../../common/runDemoButton';
import RunDemoResult from '../../../common/runDemoResult';
import Codeblock from '../../../ui/codeblock';
import Input from '../../../ui/input';

export default function GetHandle({ provider, handle, setHandle }) {
  return (
    <>
      <SectionTwoCol
        sidebarTo="getHandle"
        header="getHandle"
        leftFn={LeftContent({ handle })}
        rightFn={RightContent({ provider, handle, setHandle })}
        isH3={true}
      />
    </>
  );
}

function LeftContent({ handle }) {
  let codeResponse = `{"hex":"6d6573686a73","name":"meshjs","holder_address":"stake1u8qg7q55at26k7hqee28rh2gwqrery5hh22jxzhj9uj72agv45wv8","length":6,"utxo":"84a1d1a9f8fb3e7b4f3d1bb04ece750fe2697e74b7916804c2f179870eb34f17#0","rarity":"common","characters":"letters","numeric_modifiers":"","resolved_addresses":{"ada":"addr1qyjtjxjkhskglfefwe9kanvk7wczft0q6ngyhyh9es0km27q3upff6k44dawpnj5w8w5suq8jxff0w54yv90yte9u46st87vk3"},"og":0,"original_nft_image":"ipfs://QmRjYYHZLwwywK4Cn7Nmfv8dof3YB2mmJqAk62Z4ULV7x8","nft_image":"ipfs://QmRjYYHZLwwywK4Cn7Nmfv8dof3YB2mmJqAk62Z4ULV7x8","background":"","default_in_wallet":"meshjs","profile_pic":"","created_slot_number":80896458,"updated_slot_number":80896458,"hasDatum":false}`;
  codeResponse = JSON.parse(codeResponse);
  codeResponse = JSON.stringify(codeResponse, null, 2);

  let code = `import { HandleProvider } from '@meshsdk/core';\n\n`;
  code += `const handleProvider = new HandleProvider();\n`;
  code += `const handleMeta = await handleProvider.getHandle('${handle}');`;

  return (
    <>
      <p>
        Provide a Handle, return JSON Handle object, the metadata of Handle.
      </p>
      <Codeblock data={code} isJson={false} />
      <p>Expected output:</p>
      <Codeblock data={codeResponse} isJson={false} />
    </>
  );
}

function RightContent({ provider, handle, setHandle }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<null | any>(null);
  const [responseError, setResponseError] = useState<null | any>(null);

  async function runDemo() {
    setLoading(true);
    setResponse(null);
    setResponseError(null);
    try {
      const res = await provider.getHandle(handle);
      setResponse(res);
    } catch (error) {
      setResponseError(`${error}`);
    }
    setLoading(false);
  }

  return (
    <Card>
      <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Get Handle
        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
          Given the Handle, get Handle's meta
        </p>
      </div>

      <Input
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="Handle"
        label="Handle"
      />

      <Codeblock
        data={`const handleMeta = await handleProvider.getHandle('${handle}');`}
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
