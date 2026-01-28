import { Router } from "express";

const router = Router();

router.get("/active", (req, res) => {
   const { offset, page } = req.body;

})

router.get("/finished", (req, res) => {
   const { offset, page } = req.body;

})

// return all the subchallenges and their start time
router.get("/:contestId", (req, res) => {
   const contestId = req.params.contestId;
})

router.get("/:contestId/:challengeId", (req, res) => {
   const contestId = req.params.contestId;
})

router.get("/leaderboard/:contestId", (req, res) => {

})

router.post("/submit/:challengeId", (req, res) => {

})

export default router
