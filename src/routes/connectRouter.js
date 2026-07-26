const express= require("express");
const connectRouter= express.Router();
const connectService= require("../services/connectService")

connectRouter.get("/", async (req, res) => {
    try {

        const workspace = await connectService.getWorkspace();

        res.status(200).json(workspace);

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});

module.exports= connectRouter;


