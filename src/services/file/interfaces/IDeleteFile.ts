import { ISaveFile } from './ISaveFile';

export interface IDeleteFile extends Pick<ISaveFile, 'name'> {}
