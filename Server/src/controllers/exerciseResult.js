const ExerciseResultModel = require('../models/exerciseResult')

const getByUser = async (req, res, next) => {
  try {
    const results = await ExerciseResultModel.findByUser(req.params.user_id)
    res.json(results)
  } catch (error) {
    next(error)
  }
}

const getScoreByLesson = async (req, res, next) => {
  try {
    const result = await ExerciseResultModel.getScoreByLesson(
      req.params.user_id,
      req.params.lesson_id
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const submit = async (req, res, next) => {
  try {
    const { user_id, exercise_id, selected_answer } = req.body
    const result = await ExerciseResultModel.submit(user_id, exercise_id, selected_answer)
    res.json({
      message: result.is_correct ? 'ถูกต้อง! 🎉' : 'ผิด ลองใหม่นะครับ',
      is_correct: result.is_correct,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getByUser, getScoreByLesson, submit }