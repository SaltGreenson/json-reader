import { ISaveFile } from './ISaveFile';

export interface IReadFile extends Pick<ISaveFile, 'name'> {}
