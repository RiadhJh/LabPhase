import express from "express";
const router = express.Router();

import { 
    createOrder, 
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calculateTotalSalesByDate,
    findOrderById,
    markAsPaid,
    markOrderAsDelivered
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
.route('/')
.post(authenticate, createOrder)
// problem here
.get(authenticate, authorizeAdmin, getAllOrders);

router.route('/mine').get(authenticate, getUserOrders);
router.route('/total-orders').get(countTotalOrders);
router.route('/total-sales').get(calculateTotalSales);
router.route('/total-sales-by-date').get(calculateTotalSalesByDate);
router.route('/:id').get(authenticate, findOrderById);
router.route('/:id/pay').put(authenticate, markAsPaid);
router.route('/:id/deliver').put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;