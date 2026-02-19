// import express from 'express'
// import asyncHandler from 'express-async-handler'
// import protect from '../middleware/authMiddleware.js'
// import Manager from '../models/managerModel.js'
// import capitalize from '../config/capitalize.js'
// import Dashboard from '../models/dashboardModel.js'
// import SaleFees from '../models/saleFeesModel.js'
// import ManagerSalary from '../models/managerSalaryModel.js'
// import ManagerAttendance from '../models/managerAttendanceModel.js'
// import NonTeachingStaffSalary from '../models/nonTeachingStaffSalary.js'
// const router = express.Router()

// //following router is for registering the manager

// router.post(
//   '/register',
//   //the protect used here is used for getting the id of the admin who registered the manager

//   protect,
//   asyncHandler(async (req, res) => {
//     const {
//       manager_name,

//       qualification,

//       address,

//       contact_no,
//       gender,
//       previous_school,

//       age,
//       email,
//       estimated_salary,
//       image,
//       subjectToTeach,
//     } = req.body
//     // const manager_info =
//     const manager_info =
//       (await Manager.find()) &&
//       (await Manager.findOne().sort({ managerId: -1 }).limit(1))
//     console.log('manager info', manager_info)
//     if (manager_info) {
//       var managerId = manager_info.managerId + 1
//     } else {
//       var managerId = 1
//     }

//     console.log(req.body)
//     const registered_by = req.user.name

//     console.log(registered_by)

//     console.log('manager id is-', managerId)
//     const managername = capitalize(manager_name)
//     const new_manager = await Manager.create({
//       registered_by,
//       manager_name: managername,
//       managerId,

//       qualification,

//       address,

//       contact_no,
//       gender,
//       previous_school,

//       age,
//       email,
//       estimated_salary,
//       image,
//       subjectToTeach,
//     })
//     console.log(new_manager)
//     if (new_manager) {
//       const total_managers = (await Manager.find()).length
//       await Dashboard.findOneAndUpdate(
//         { title: 'Managers' },
//         { number: total_managers }
//       )
//       console.log('done')
//       console.log('total number of sales', total_managers)
//       res.status(201).json({
//         message: 'Manager registered successfully',
//       })
//       console.log('registered successfully')
//     } else {
//       res.status(400)
//       console.log(error)
//       throw new Error('Unable to register the manager')
//     }
//   })
// )
// //router for getting all the managers
// router.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const managers = await Manager.find({})
//     if (managers.length > 0) {
//       res.json(managers)
//     } else {
//       res.status(500)
//       throw new Error('No Managers found')
//     }
//   })
// )

// //following route is for deleting the manager

// router.delete(
//   '/delete/:id',
//   asyncHandler(async (req, res) => {
//     const manager = await Manager.findOne({ managerId: req.params.id })
//     if (manager) {
//       await manager.remove()
//       const total_managers = (await Manager.find()).length
//       await Dashboard.findOneAndUpdate(
//         { title: 'Managers' },
//         { number: total_managers }
//       )
//       res.json({ message: 'Manager Deleted successfully' })
//     } else {
//       res.status(404)
//       throw new Error('Manager not found with the given ID')
//     }
//   })
// )

// //following route is for paying the fees of managers

// router.post(
//   '/fees/:name/:id',
//   //the protect used here is used for getting the id of the admin who registered the manager

//   protect,
//   asyncHandler(async (req, res) => {
//     const { salaryForTheYear, salaryForTheMonth, salaryAmount } = req.body
//     console.log(req.body)
//     // const manager_info =
//     const manager_info = await Manager.findOne({
//       manager_name: capitalize(req.params.name),
//       managerId: req.params.id,
//     })
//     console.log(capitalize(req.params.name + ' ' + req.params.id))

//     console.log('manager info', manager_info)
//     if (manager_info) {
//       const admin = req.user.name

//       // console.log(admin)

//       // console.log('manager id is-', managerId)
//       const managername = capitalize(req.params.name)
//       const monthname = capitalize(salaryForTheMonth)
//       const new_manager = await ManagerSalary.create({
//         admin,
//         manager_name: managername,
//         managerId: req.params.id,

//         salaryForTheYear,
//         salaryForTheMonth: monthname,
//         salaryAmount,
//       })
//       console.log(new_manager)
//       if (new_manager) {
//         const Fees = await ManagerSalary.find()
//           .select('salaryAmount')
//           .select('-_id')
//         console.log('Fees', Fees)
//         var total_Fees = 0

//         var total_Fees = 0
//         Fees.map((fee) => (total_Fees = total_Fees + fee.salaryAmount))
//         const Fees1 = await NonTeachingStaffSalary.find()
//           .select('salaryAmount')
//           .select('-_id')

//         var total_Fees1 = 0
//         Fees1.map(
//           (fee) => (total_Fees1 = total_Fees1 + fee.salaryAmount)
//           // return total_Fees
//         )
//         await Dashboard.findOneAndUpdate(
//           { title: 'Salary Expenses' },
//           { number: total_Fees + total_Fees1 }
//         )
//         res.status(201).json({
//           message: 'Manager salary paid successfully',
//         })
//         console.log('paid successfully')
//       } else {
//         res.status(400)
//         console.log(error)
//         throw new Error('Unable to pay the salary')
//       }
//     } else {
//       res.status(400)
//       throw new Error('Manager not found')
//     }
//   })
// )

// //for getting information regarding income

// //all income generated till now
// router.get(
//   '/allincome',
//   asyncHandler(async (req, res) => {
//     const income = await SaleFees.find({})
//     if (income.length > 0) {
//       res.json(income)
//     } else {
//       res.status(500)
//       throw new Error('No Income made till date')
//     }
//   })
// )

// //particular year

// router.get(
//   '/allincome/:year',
//   asyncHandler(async (req, res) => {
//     const income = await SaleFees.find({ year: req.params.year })
//     if (income.length > 0) {
//       res.json(income)
//     } else {
//       res.status(500)
//       throw new Error(`No Income made for year ${req.params.year}`)
//     }
//   })
// )

// //paritcular month of particular year
// router.get(
//   '/allincome/:year/:month',
//   asyncHandler(async (req, res) => {
//     const income = await SaleFees.find({
//       year: req.params.year,
//       month_name: capitalize(req.params.month),
//     })
//     console.log('hello')
//     console.log(req.params.year + req.params.month)
//     if (income.length > 0) {
//       // res.status(201)
//       res.json(income)
//     } else {
//       res.status(500)
//       throw new Error(
//         `No Income made for month ${req.params.month} of year ${req.params.year}`
//       )
//     }
//   })
// )

// //the following is for the salary given to the staffs and the  managers

// router.get(
//   '/allsalaries',
//   asyncHandler(async (req, res) => {
//     const salary = await ManagerSalary.find({})
//     const staff_salary = await NonTeachingStaffSalary.find({})
//     if (salary.length > 0 || staff_salary.length > 0) {
//       var new_salary = salary.concat(staff_salary)
//       res.json(new_salary)
//     } else {
//       res.status(500)
//       throw new Error('No salary given till date')
//     }
//   })
// )

// //particular year

// router.get(
//   '/allsalary/:year',
//   asyncHandler(async (req, res) => {
//     const salary = await ManagerSalary.find({
//       salaryForTheYear: req.params.year,
//     })
//     const staff_salary = await NonTeachingStaffSalary.find({
//       salaryForTheYear: req.params.year,
//     })
//     console.log(salary)
//     console.log('staffsalary', staff_salary)
//     if (salary.length > 0 || staff_salary.length > 0) {
//       var new_salary = salary.concat(staff_salary)
//       res.json(new_salary)
//     } else {
//       res.status(500)
//       throw new Error(`No salary made for year ${req.params.year}`)
//     }
//   })
// )

// //paritcular month of particular year
// router.get(
//   '/allsalary/:year/:month',
//   asyncHandler(async (req, res) => {
//     const salary = await ManagerSalary.find({
//       salaryForTheYear: req.params.year,
//       salaryForTheMonth: capitalize(req.params.month),
//     })
//     console.log('hello')
//     const staff_salary = await NonTeachingStaffSalary.find({
//       salaryForTheYear: req.params.year,
//       salaryForTheMonth: capitalize(req.params.month),
//     })
//     if (salary.length > 0 || staff_salary.length > 0) {
//       var new_salary = salary.concat(staff_salary)
//       res.json(new_salary)
//     } else {
//       res.status(500)
//       throw new Error(
//         `No salary made for month ${req.params.month} of year ${req.params.year}`
//       )
//     }
//   })
// )

// export default router
