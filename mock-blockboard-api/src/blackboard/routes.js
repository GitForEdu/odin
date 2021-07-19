import * as courses from "./data/courses.json"
import * as users from "./data/users.json"


const baseUrl = "/learn/api/public/"

function blackboardroutes(app) {
  app.get(baseUrl + "v3/courses", (req, res) => {
    res.send(courses.courses)
  })

  app.get(baseUrl + "v1/users", (req, res) => {
    res.send(users.users)
  })

  app.get(baseUrl + "v1/users/userName:underviser1", (req, res) => {
    res.send({
      "id": 101,
    })
  })

  app.get(baseUrl + "v1/users/:userId", (req, res) => {
    const userId = parseInt(req.params.userId)
    const user = users.users.find(user => user.id === userId)
    res.send(user)
  })

  app.get(baseUrl + "v3/courses/:courseId", (req, res) => {
    const course = courses.courses.find(e => e.courseId === req.params.courseId)
    res.send(course || {})
  })

  app.get(baseUrl + "v1/courses/:id/users", (req, res) => {
    const course = courses.courses.find(e => e.id === req.params.id)
    const user_list = course.users
    res.send(user_list || [])
  })

  app.get(baseUrl + "v1/courses/:id/users?expand=user", (req, res) => {
    const course = courses.courses.find(e => e.id === req.params.id)
    const user_list = course.users
    res.send(user_list || [])
  })

  app.get(baseUrl + "v2/courses/:courseId/groups", (req, res) => {
    const course = courses.courses.find(e => e.id === req.params.courseId)
    res.send(course.groups)
  })

  app.get(baseUrl + "v2/courses/:courseId/groups/:groupId", (req, res) => {
    const course = courses.courses.find(e => e.id === req.params.courseId)
    const group = course.groups.find(e => e.id === req.params.groupId)
    res.send(group || {})
  })

  app.get(baseUrl + "v1/courses/:courseId/groups/:groupId/users", (req, res) => {
    const course = courses.courses.find(e => e.id === req.params.courseId)
    const group = course.groups.find(e => e.id === parseInt(req.params.groupId))
    const users = group ? group.users : []
    res.send(users)
  })

  app.get(baseUrl + "v2/courses/:courseId/groups/:groupId/users/:userId", (req, res) => {
    const course = courses.courses.find(e => e.id === req.params.courseId)
    const group = course.groups.find(e => e.id === parseInt(req.params.groupId))
    const user = group.find(e => e.id === parseInt(req.params.userId))
    res.send(user || {})
  })
}

export default blackboardroutes