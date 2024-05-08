import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
    try {

        const { name, description, price, category, quantity, brand } = req.fields;

        //Validation 
        switch (true) {
            case !name:
                return res.json({ error: "Name is required" });
            case !description:
                return res.json({ error: "Description is required" });
            case !price:
                return res.json({ error: "Price is required" });
            case !category:
                return res.json({ error: "Category is required" });
            case !quantity:
                return res.json({ error: "Quantity is required" });
            case !brand:
                return res.json({ error: "Brand is required" });

        }

        const product = new Product({ ...req.fields })
        await product.save()
        res.json(product)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)

    }
});
const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.fields;

        //Validation 

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.fields },
            { new: true }
        );

        await product.save();

        res.json(product);


    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
});

const removeProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json(product);
    } catch {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: "i"
            }
        }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword });

        res.json({ products, page: 1, pages: Math.ceil(count / pageSize), hasMore: false })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Server Error" }).limit(pageSize);
    }
});

const fetchProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            return res.json(product)
        } else {
            res.json(404)
            throw new Error("product not found")
        }
    } catch (error) {
        console.error(error)
        res.status(404).json({ error: "product not found" })
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).populate('category').limit(12).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
});

const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (product) {
            const alreadyReviwed = product.reviews.find(
                (r) => r.user.tostring() === req.user._id.toString()
            );

            if (alreadyReviwed) {
                res.status(400)
                throw new Error("Product already reviewed")
            }
            const reviews = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id
            }

            product.reviews.push(reviews)
            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

            await product.save()
            res.status(201).json("Review added")
        }else{
            res.status(404)
            throw new Error("Product not found")
        }

    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)

    }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(4)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(5)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

export {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
};