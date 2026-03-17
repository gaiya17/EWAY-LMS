const classService = require("../services/class.service");

async function createCourse(req, res, next) {
  try {
    const course = await classService.createCourse(req.user.id,req.body, {
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    });
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
}

async function getCourses(req, res, next) {
  try {
    const courses = await classService.getAllCourses();
    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
}

async function createClass(req, res, next) {
  try {
    const newClass = await classService.createClass(req.user.id, req.body, {
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    });
    res.status(201).json({ class: newClass });
  } catch (error) {
    next(error);
  }
}

async function getPendingClasses(req, res, next) {
  try {
    const classes = await classService.getPendingClasses();
    res.status(200).json({ classes });
  } catch (error) {
    next(error);
  }
}

async function getApprovedClasses(req, res, next) {
  try {
    const classes = await classService.getApprovedClasses();
    res.status(200).json({ classes });
  } catch (error) {
    next(error);
  }
}

async function approveClass(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedClass = await classService.approveEntity(req.user.id, 'class', id, status, {
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    });
    res.status(200).json({ class: updatedClass });
  } catch (error) {
    next(error);
  }
}

async function getTeacherClasses(req, res, next) {
  try {
    const classes = await classService.getTeacherClasses(req.user.id);
    res.status(200).json({ classes });
  } catch (error) {
    next(error);
  }
}

async function addResource(req, res, next) {
  try {
    const { id: classId } = req.params;
    const { type, data } = req.body;
    const resource = await classService.addResourceToClass(req.user.id, classId, type, data, {
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    });
    res.status(201).json({ resource });
  } catch (error) {
    next(error);
  }
}

async function getMyClasses(req, res, next) {
  try {
    const classes = await classService.getStudentClasses(req.user.id);
    res.status(200).json({ classes });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCourse,
  getCourses,
  createClass,
  getPendingClasses,
  getApprovedClasses,
  approveClass,
  getTeacherClasses,
  addResource,
  getMyClasses
};
