const ExerciseModel = require('../models/exercise')

const getByLesson = async (req, res, next) => {
  try {
    const exercises = await ExerciseModel.findByLesson(req.params.lesson_id)
    res.json(exercises)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const exercise = await ExerciseModel.findById(req.params.id)
    if (!exercise) return res.status(404).json({ message: 'ไม่พบแบบฝึก' })
    res.json(exercise)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const result = await ExerciseModel.create(req.body)
    res.json({ message: 'create ok', data: result })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await ExerciseModel.update(req.params.id, req.body)
    res.json({ message: 'update ok', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await ExerciseModel.remove(req.params.id)
    res.json({ message: 'delete ok', data: result })
  } catch (error) {
    next(error)
  }
}

const removeByLesson = async (req, res, next) => {
  try {
    const result = await ExerciseModel.removeByLesson(req.params.lesson_id)
    res.json({ message: 'delete ok', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getByLesson, getById, create, update, remove,removeByLesson }