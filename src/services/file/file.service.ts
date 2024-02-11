import { ISaveFile } from './interfaces/ISaveFile';
import * as crypto from 'crypto';
import fs from 'fs';
import config from '../../../config/settings';
import { IReadFile } from './interfaces/IReadFile';
import ApiError from '../../../config/api-error';
import { IDeleteFile } from './interfaces/IDeleteFile';

export class FileService {
  /**
   * Save new file
   * */
  static async save({
    name,
    payload,
  }: ISaveFile): Promise<Pick<ISaveFile, 'name'>> {
    const filePath = `${config.file.rootDir}/${name}.json`;
    const encryptedPath = `${config.file.encryptedDir}/${name}`;
    const isFileExists = fs.existsSync(filePath);

    const { aesKey, encryptedData, tag, iv } = this.fileEncryption(
      JSON.stringify(payload)
    );

    const encryptedDataKeys = {
      aesKey,
      tag,
      iv,
    };

    !isFileExists && (await fs.promises.mkdir(encryptedPath));

    // Save encrypted keys
    await Promise.all(
      Object.entries(encryptedDataKeys).map(([title, data]) =>
        fs.promises.writeFile(`${encryptedPath}/${title}.bin`, data, {
          encoding: 'utf-8',
        })
      )
    );

    // Save encrypted data
    await fs.promises.writeFile(filePath, encryptedData);
    await this.getFilenames();
    return { name };
  }

  /**
   * Read file
   * @param {String} name
   * @returns {Object}
   * */
  static async read({ name }: IReadFile): Promise<JSON> {
    const filePath = `${config.file.rootDir}/${name}.json`;
    const encryptedPath = `${config.file.encryptedDir}/${name}`;

    if (!fs.existsSync(filePath)) {
      throw new ApiError(`File "${name}" not found`, 'BAD_REQUEST', 400);
    }

    const encryptedData = await fs.promises.readFile(filePath);

    const aesKey = await fs.promises.readFile(`${encryptedPath}/aesKey.bin`);
    const iv = await fs.promises.readFile(`${encryptedPath}/iv.bin`);
    const tag = await fs.promises.readFile(`${encryptedPath}/tag.bin`);

    const data = this.fileDecryption(encryptedData, aesKey, iv, tag);

    return JSON.parse(data);
  }

  /**
   * Delete file
   * @param {String} name
   * @returns {Object} {name: String}
   * */
  static async delete({ name }: IDeleteFile) {
    const filePath = `${config.file.rootDir}/${name}.json`;
    const encryptedPath = `${config.file.encryptedDir}/${name}`;

    await fs.promises.rm(filePath);
    await fs.promises.rmdir(encryptedPath, { recursive: true });

    return { name };
  }

  /**
   * Get file names
   * @return {Object} {count: number, filename: Array<string>}
   * */
  static async getFilenames() {
    const files = await fs.promises.readdir(config.file.rootDir);

    return {
      count: files.length,
      filenames: files.map((filename) => filename.split('.json')[0]),
    };
  }

  /**
   * Decrypt file
   * @param encryptedData
   * @param aesKey
   * @param iv
   * @param tag
   * @returns {String} data
   * */
  private static fileDecryption(
    encryptedData: Buffer,
    aesKey: Buffer,
    iv: Buffer,
    tag: Buffer
  ): string {
    const aesKeyHex = Buffer.from(aesKey.toString('hex'), 'hex');
    const ivHex = Buffer.from(iv.toString(), 'hex');
    const tagHex = Buffer.from(tag.toString(), 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKeyHex, ivHex);

    decipher.setAuthTag(tagHex);

    const decryptedChunks = [];
    const chunkSize = 190;

    for (let i = 0; i < encryptedData.length; i += chunkSize) {
      const chunk = encryptedData.subarray(i, i + chunkSize);
      const decryptedChunk = decipher.update(chunk);
      decryptedChunks.push(decryptedChunk);
    }

    const finalChunk = decipher.final();

    return Buffer.concat([...decryptedChunks, finalChunk]).toString('utf8');
  }

  /**
   * Symmetrical encryption
   * @param data
   * */
  private static fileEncryption(data: string) {
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const bufferData = Buffer.from(data);
    const chunkSize = 190;

    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);

    const encryptedChunks = [];
    for (let i = 0; i < bufferData.length; i += chunkSize) {
      const chunk = bufferData.subarray(i, i + chunkSize);
      const encryptedChunk = cipher.update(chunk);
      encryptedChunks.push(encryptedChunk);
    }

    const finalChunk = cipher.final();
    const tag = cipher.getAuthTag();

    return {
      aesKey,
      encryptedData: Buffer.concat([...encryptedChunks, finalChunk]),
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }
}
