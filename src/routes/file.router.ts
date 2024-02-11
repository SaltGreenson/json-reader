import { Router } from 'express';
import validator from '../validation';
import { FileController } from '../controllers/file.controller';

const router = Router();

/**
 * @api {post} /api/file Create new file
 * @apiName SaveFile
 * @apiGroup File
 * @apiDescription Create new file
 *
 * @apiParam {String} name Filename
 * @apiParam {Object} payload File data
 * */
router.post('', validator.file.write, FileController.save);

/**
 * @api {get} /api/file Read file
 * @apiName ReadFile
 * @apiGroup File
 * @apiDescription Read file
 *
 * @apiParam {String} name Filename
 * */
router.get('', validator.file.get, FileController.read);

/**
 * @api {delete} /api/file Read file
 * @apiName DeleteFile
 * @apiGroup File
 * @apiDescription Delete file
 *
 * @apiParam {String} name Filename
 * */
router.delete('', validator.file.get, FileController.delete);

/**
 * @api {get} /api/file/names Get filenames
 * @apiName GetFilenames
 * @apiGroup File
 * @apiDescription Get filenames
 * */
router.get('/names', FileController.getFilenames);

export default router;
