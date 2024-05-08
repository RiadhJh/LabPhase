import express from "express";
const router = express.Router();
import { 
    createCategory,
    updateCategory,
    removeCategory,
    ListCategory,
    readCategory,
} from "../controllers/categoryController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js"

router.route('/').post(authenticate, authorizeAdmin, createCategory);
router.route('/:categoryId').put(authenticate, authorizeAdmin, updateCategory);
router.route('/:categoryId').delete(authenticate, authorizeAdmin, removeCategory);
router.route('/categories').get(ListCategory);
router.route('/:id').get(readCategory);

export default router;