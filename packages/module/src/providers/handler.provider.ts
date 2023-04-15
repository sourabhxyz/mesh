import axios, { AxiosInstance } from 'axios';
import { parseHttpError } from '@mesh/common/utils';

export class HandlerProvider {
  private _axiosInstance: AxiosInstance;

  constructor(options?: Partial<CreateHandleProviderOptions>) {
    if (options === undefined) options = {};

    const host = options.server ?? 'api.handle.me';

    this._axiosInstance = axios.create({
      baseURL: `https://${host}/`,
    });
  }

  async getHandler(handler: string): Promise<string> {
    try {
      const { data, status } = await this._axiosInstance.get(`${handler}`);

      if (status === 200) {
        return data;
      }

      throw parseHttpError(data);
    } catch (error) {
      throw parseHttpError(error);
    }
  }
}

type CreateHandleProviderOptions = {
  server: string;
};
