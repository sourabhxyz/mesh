import axios, { AxiosInstance } from 'axios';
import { parseHttpError } from '@mesh/common/utils';

export class HandleProvider {
  private _axiosInstance: AxiosInstance;

  constructor(options?: Partial<CreateHandleProviderOptions>) {
    if (options === undefined) options = {};

    const host = options.server ?? 'api.handle.me';

    this._axiosInstance = axios.create({
      baseURL: `https://${host}/`,
    });
  }

  async getHandle(handle: string): Promise<string> {
    try {
      const { data, status } = await this._axiosInstance.get(
        `handles/${handle}`
      );

      if (status === 200 || status === 202) {
        return data;
      }

      throw parseHttpError(data);
    } catch (error) {
      throw parseHttpError(error);
    }
  }

  async getHandles(params = {}): Promise<string> {
    try {
      const { data, status } = await this._axiosInstance.get(`handles`, {
        params: params,
      });

      if (status === 200 || status === 202) {
        return data;
      }

      throw parseHttpError(data);
    } catch (error) {
      throw parseHttpError(error);
    }
  }

  async getHandleDatum(handle: string): Promise<string> {
    try {
      const { data, status } = await this._axiosInstance.get(
        `handles/${handle}/datum`
      );

      if (status === 200 || status === 202) {
        return data;
      }

      throw parseHttpError(data);
    } catch (error) {
      throw parseHttpError(error);
    }
  }

  async getHandlePersonalized(handle: string): Promise<string> {
    try {
      const { data, status } = await this._axiosInstance.get(
        `handles/${handle}/personalized`
      );

      if (status === 200 || status === 202) {
        return data;
      }

      throw parseHttpError(data);
    } catch (error) {
      throw parseHttpError(error);
    }
  }

  async getHolders(records_per_page = 100, page = 1): Promise<string> {
    try {
      const { data, status } = await this._axiosInstance.get(`holders`, {
        params: { records_per_page: records_per_page, page: page },
      });

      if (status === 200 || status === 202) {
        return data;
      }

      throw parseHttpError(data);
    } catch (error) {
      throw parseHttpError(error);
    }
  }

  async getHolder(address: string): Promise<string> {
    try {
      const { data, status } = await this._axiosInstance.get(
        `holders/${address}`
      );

      if (status === 200 || status === 202) {
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
