import axios, { Axios } from 'axios';
import moment from 'moment-timezone';
import { SessionRecordingManager } from '../services/recording';

export class Http {
  private static _axiosInstance: Axios | undefined = undefined;

  static get axios(): Axios {
    if (this._axiosInstance == null) {
      this._axiosInstance = axios.create({
        baseURL: `http://${import.meta.env.VITE_BACKEND_HOSTNAME}:${
          import.meta.env.VITE_BACKEND_PORT
        }/api/v1`,
      });
    }
    return this._axiosInstance!;
  }

  static makeSignedInHeader(token: string): { [key: string]: string } {
    return {
      Authorization: `Bearer ${token}`,
      "X-timezone": moment.tz.guess(true),
      "X-browser-session-id": SessionRecordingManager.instance.currentSessionId || ""
    };
  }
}
