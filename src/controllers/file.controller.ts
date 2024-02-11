import { FileService } from '../services/file/file.service';
import { tryCatch } from '../../decorators/tryCatch.decorator';
import { Response, Request } from 'express';
import { IReadFile } from '../services/file/interfaces/IReadFile';
import { IDeleteFile } from '../services/file/interfaces/IDeleteFile';

export class FileController {
  /**
   * Save file
   * */
  @tryCatch
  static async save(req: Request, res: Response) {
    const result = await FileService.save(req.body);

    return res.json(result);
  }
  /**
   * Read file
   * */
  @tryCatch
  static async read(req: Request & { query: IReadFile }, res: Response) {
    const result = await FileService.read(req.query);

    return res.json(result);
  }

  /**
   * Delete file
   * */
  @tryCatch
  static async delete(req: Request & { query: IDeleteFile }, res: Response) {
    const result = await FileService.delete(req.query);

    return res.json(result);
  }

  /**
   * Get filenames
   * */
  @tryCatch
  static async getFilenames(req: Request, res: Response) {
    const result = await FileService.getFilenames();

    return res.json(result);
  }
}
